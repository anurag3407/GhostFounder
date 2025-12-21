import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Email transporter configuration
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Alternative: Use a more professional service like SendGrid
const sendGridTransporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY,
  },
});

// Twilio client for WhatsApp/SMS
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

/**
 * Send email notification
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {object} options - Additional options
 */
export async function sendEmail(to, subject, html, options = {}) {
  const transporter = process.env.SENDGRID_API_KEY 
    ? sendGridTransporter 
    : emailTransporter;

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'GhostFounder <noreply@ghostfounder.com>',
    to,
    subject,
    html,
    ...options,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send WhatsApp message via Twilio
 * @param {string} to - WhatsApp number (with country code)
 * @param {string} message - Message content
 */
export async function sendWhatsApp(to, message) {
  if (!twilioClient) {
    console.warn('Twilio not configured');
    return { success: false, error: 'Twilio not configured' };
  }

  try {
    const result = await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',
      to: to.startsWith('whatsapp:') ? to : `whatsapp:${to}`,
      body: message,
    });
    console.log('WhatsApp sent:', result.sid);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send SMS via Twilio
 * @param {string} to - Phone number
 * @param {string} message - Message content
 */
export async function sendSMS(to, message) {
  if (!twilioClient) {
    console.warn('Twilio not configured');
    return { success: false, error: 'Twilio not configured' };
  }

  try {
    const result = await twilioClient.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
      body: message,
    });
    console.log('SMS sent:', result.sid);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('SMS send error:', error);
    return { success: false, error: error.message };
  }
}
