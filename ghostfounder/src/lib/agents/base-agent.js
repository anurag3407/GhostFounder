import dbConnect from '@/lib/mongodb/connect';
import { User } from '@/models';
import { calculateCost } from '@/lib/gemini/config';
import { sendEmail, sendWhatsApp } from '@/lib/notifications';

/**
 * Base Agent class that all agents extend
 * Provides common functionality for AI agents
 */
export class BaseAgent {
  constructor(agentName, modelName) {
    this.agentName = agentName;
    this.modelName = modelName;
    this.startTime = null;
  }

  /**
   * Log token usage for a user
   * @param {string} firebaseUid - User's Firebase UID
   * @param {number} tokens - Number of tokens used
   * @param {number} cost - Cost in USD
   */
  async logUsage(firebaseUid, tokens, cost) {
    try {
      await dbConnect();
      const user = await User.findOne({ firebaseUid });
      
      if (user) {
        await user.addTokenUsage(this.agentName, tokens, cost);
      }
    } catch (error) {
      console.error(`Error logging usage for ${this.agentName}:`, error);
    }
  }

  /**
   * Send notification to user
   * @param {string} firebaseUid - User's Firebase UID
   * @param {object} notification - Notification content
   */
  async notify(firebaseUid, notification) {
    try {
      await dbConnect();
      const user = await User.findOne({ firebaseUid });
      
      if (!user) {
        console.warn('User not found for notification');
        return;
      }

      const results = {};

      // Send email if enabled
      if (user.notificationPreferences?.email && notification.email) {
        results.email = await sendEmail(
          user.email,
          notification.email.subject,
          notification.email.html
        );
      }

      // Send WhatsApp if enabled and critical
      if (
        user.notificationPreferences?.whatsapp &&
        user.notificationPreferences?.whatsappNumber &&
        notification.whatsapp
      ) {
        results.whatsapp = await sendWhatsApp(
          user.notificationPreferences.whatsappNumber,
          notification.whatsapp.message
        );
      }

      return results;
    } catch (error) {
      console.error(`Error sending notification for ${this.agentName}:`, error);
      throw error;
    }
  }

  /**
   * Get or create user in MongoDB
   * @param {string} firebaseUid - User's Firebase UID
   * @param {string} email - User's email
   * @param {string} displayName - User's display name
   */
  async getOrCreateUser(firebaseUid, email, displayName = '') {
    await dbConnect();
    
    let user = await User.findOne({ firebaseUid });
    
    if (!user) {
      user = await User.create({
        firebaseUid,
        email,
        displayName,
      });
    }
    
    return user;
  }

  /**
   * Start timing the agent execution
   */
  startTimer() {
    this.startTime = Date.now();
  }

  /**
   * Get execution time in milliseconds
   */
  getExecutionTime() {
    if (!this.startTime) return 0;
    return Date.now() - this.startTime;
  }

  /**
   * Abstract execute method - must be implemented by child classes
   */
  async execute(input) {
    throw new Error('Execute method must be implemented by child class');
  }
}

export default BaseAgent;
