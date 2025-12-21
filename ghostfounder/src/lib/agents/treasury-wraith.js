import { BaseAgent } from './base-agent';
import { generateContent, GEMINI_MODELS } from '@/lib/gemini/config';
import { FinancialReport, User } from '@/models';
import dbConnect from '@/lib/mongodb/connect';
import { google } from 'googleapis';

const CFO_SYSTEM_PROMPT = `You are Treasury Wraith, an AI CFO agent that analyzes financial data and provides strategic insights.

When analyzing financial data, provide your response in JSON format:
{
  "summary": "Executive summary of financial health",
  "highlights": ["Key positive finding 1", "Key positive finding 2"],
  "concerns": ["Concern or risk 1", "Concern or risk 2"],
  "recommendations": ["Strategic recommendation 1", "Strategic recommendation 2"],
  "healthScore": 75,
  "metrics": {
    "revenueGrowth": "X%",
    "profitMargin": "X%",
    "burnRate": "$X/month",
    "runway": "X months"
  }
}

Rules:
1. Be data-driven and specific with numbers
2. Provide actionable recommendations
3. Health score 0-100 based on overall financial health
4. Consider burn rate and runway carefully for startups`;

/**
 * Treasury Wraith - AI CFO Agent
 * Generates financial reports and Google Sheets
 */
export class TreasuryWraith extends BaseAgent {
  constructor() {
    super('treasury-wraith', GEMINI_MODELS.CFO);
    this.sheets = null;
    this.drive = null;
  }

  /**
   * Initialize Google APIs
   */
  async initGoogleAPIs() {
    if (this.sheets) return;

    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
      ],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
    this.drive = google.drive({ version: 'v3', auth });
  }

  /**
   * Generate a financial report
   * @param {object} input - Report parameters
   * @param {string} input.period - Q1, Q2, Q3, Q4, or yearly
   * @param {number} input.year - Year for the report
   * @param {object} input.financialData - Raw financial data
   * @param {string} input.firebaseUid - User's Firebase UID
   */
  async execute(input) {
    this.startTimer();
    await dbConnect();
    await this.initGoogleAPIs();

    const { period, year, financialData, firebaseUid } = input;

    // Get or create user
    const user = await this.getOrCreateUser(firebaseUid, input.email, input.displayName);

    // Create report record
    const report = await FinancialReport.create({
      userId: user._id,
      firebaseUid,
      period,
      year,
      data: financialData,
      status: 'processing',
    });

    try {
      // Analyze financial data with Gemini
      const prompt = `${CFO_SYSTEM_PROMPT}

Financial Data for ${period} ${year}:
${JSON.stringify(financialData, null, 2)}

Analyze this financial data and provide your assessment.`;

      const { text, usage } = await generateContent(this.modelName, prompt, {
        temperature: 0.4,
        maxOutputTokens: 2048,
      });

      // Parse analysis
      const analysis = this.parseAnalysis(text);

      // Create Google Sheet
      const sheetData = await this.createGoogleSheet(period, year, financialData, analysis, user);

      // Update report
      report.analysis = analysis;
      report.googleSheet = sheetData;
      report.tokenUsage = {
        totalTokens: usage.totalTokens,
        cost: usage.cost,
      };
      report.status = 'completed';
      await report.save();

      // Log usage
      await this.logUsage(firebaseUid, usage.totalTokens, usage.cost);

      // Send notification
      await this.notify(firebaseUid, {
        email: {
          subject: `📊 Financial Report: ${period} ${year} Ready`,
          html: this.generateEmailHtml(report, sheetData),
        },
      });

      return {
        success: true,
        reportId: report._id.toString(),
        analysis,
        googleSheetUrl: sheetData.spreadsheetUrl,
        executionTime: this.getExecutionTime(),
        tokenUsage: usage,
      };
    } catch (error) {
      report.status = 'failed';
      await report.save();
      throw error;
    }
  }

  /**
   * Parse Gemini analysis response
   */
  parseAnalysis(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return {
        summary: text,
        highlights: [],
        concerns: [],
        recommendations: [],
        healthScore: 50,
      };
    } catch {
      return {
        summary: text,
        highlights: [],
        concerns: [],
        recommendations: [],
        healthScore: 50,
      };
    }
  }

  /**
   * Create a Google Sheet with financial data
   */
  async createGoogleSheet(period, year, financialData, analysis, user) {
    if (!this.sheets || !this.drive) {
      return { spreadsheetId: null, spreadsheetUrl: null, isPublic: false };
    }

    try {
      // Create the spreadsheet
      const spreadsheet = await this.sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: `GhostFounder - ${period} ${year} Financial Report`,
          },
          sheets: [
            { properties: { title: 'Summary' } },
            { properties: { title: 'Revenue' } },
            { properties: { title: 'Expenses' } },
            { properties: { title: 'Analysis' } },
          ],
        },
      });

      const spreadsheetId = spreadsheet.data.spreadsheetId;

      // Populate Summary sheet
      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Summary!A1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            ['GhostFounder Financial Report'],
            [`Period: ${period} ${year}`],
            [`Generated: ${new Date().toLocaleDateString()}`],
            [],
            ['Metric', 'Value'],
            ['Total Revenue', `$${financialData.revenue?.total || 0}`],
            ['Total Expenses', `$${financialData.expenses?.total || 0}`],
            ['Net Profit', `$${(financialData.revenue?.total || 0) - (financialData.expenses?.total || 0)}`],
            ['Burn Rate', analysis.metrics?.burnRate || 'N/A'],
            ['Runway', analysis.metrics?.runway || 'N/A'],
            ['Health Score', `${analysis.healthScore}/100`],
          ],
        },
      });

      // Populate Analysis sheet
      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Analysis!A1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            ['AI Analysis Summary'],
            [analysis.summary],
            [],
            ['Key Highlights'],
            ...(analysis.highlights || []).map(h => [h]),
            [],
            ['Concerns'],
            ...(analysis.concerns || []).map(c => [c]),
            [],
            ['Recommendations'],
            ...(analysis.recommendations || []).map(r => [r]),
          ],
        },
      });

      // Make spreadsheet public (view only)
      await this.drive.permissions.create({
        fileId: spreadsheetId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      return {
        spreadsheetId,
        spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
        isPublic: true,
      };
    } catch (error) {
      console.error('Google Sheets error:', error);
      return { spreadsheetId: null, spreadsheetUrl: null, isPublic: false };
    }
  }

  /**
   * Generate email HTML for report notification
   */
  generateEmailHtml(report, sheetData) {
    const { analysis, period, year } = report;

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0a0a0f; color: #e8e8ed; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #12121a; border-radius: 12px; padding: 24px; }
        .header { text-align: center; margin-bottom: 24px; }
        .logo { color: #ffd700; font-size: 24px; font-weight: bold; }
        .score { display: inline-block; padding: 12px 24px; border-radius: 50px; font-size: 24px; font-weight: bold; background: ${analysis.healthScore >= 70 ? '#00ff8820' : analysis.healthScore >= 50 ? '#ffd70020' : '#ff336620'}; color: ${analysis.healthScore >= 70 ? '#00ff88' : analysis.healthScore >= 50 ? '#ffd700' : '#ff3366'}; }
        h2 { color: #ffd700; border-bottom: 1px solid #ffffff10; padding-bottom: 8px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #ffd700, #ff8c00); color: #0a0a0f; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">💰 Treasury Wraith</div>
          <p style="color: #9ca3af;">Financial Report Ready</p>
        </div>
        
        <h2>${period} ${year} Financial Report</h2>
        
        <div style="text-align: center; margin: 24px 0;">
          <div class="score">Health Score: ${analysis.healthScore}/100</div>
        </div>
        
        <h2>📋 Summary</h2>
        <p>${analysis.summary}</p>
        
        ${analysis.highlights?.length > 0 ? `
        <h2>✅ Highlights</h2>
        <ul>
          ${analysis.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>
        ` : ''}
        
        ${analysis.concerns?.length > 0 ? `
        <h2>⚠️ Concerns</h2>
        <ul>
          ${analysis.concerns.map(c => `<li>${c}</li>`).join('')}
        </ul>
        ` : ''}
        
        ${sheetData.spreadsheetUrl ? `
        <div style="text-align: center; margin: 24px 0;">
          <a href="${sheetData.spreadsheetUrl}" class="btn">View Full Report in Google Sheets →</a>
        </div>
        ` : ''}
        
        <div style="text-align: center; margin-top: 24px; color: #9ca3af; font-size: 12px;">
          Powered by GhostFounder • Gemini 2.5
        </div>
      </div>
    </body>
    </html>
    `;
  }

  /**
   * Get report history for a user
   */
  async getReportHistory(firebaseUid, limit = 10) {
    await dbConnect();
    return FinancialReport.find({ firebaseUid })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  /**
   * Generate sample financial data for demo
   */
  generateSampleData(period = 'Q1') {
    const months = {
      Q1: ['January', 'February', 'March'],
      Q2: ['April', 'May', 'June'],
      Q3: ['July', 'August', 'September'],
      Q4: ['October', 'November', 'December'],
    };

    const selectedMonths = months[period] || months.Q1;
    const baseRevenue = 10000 + Math.random() * 5000;
    const baseExpense = 8000 + Math.random() * 3000;

    return {
      revenue: {
        monthly: selectedMonths.map((month, i) => ({
          month,
          amount: Math.round(baseRevenue * (1 + i * 0.1 + Math.random() * 0.2)),
        })),
        total: 0, // Will be calculated
      },
      expenses: {
        monthly: selectedMonths.map((month, i) => ({
          month,
          amount: Math.round(baseExpense * (1 + Math.random() * 0.15)),
          categories: [
            { name: 'Salaries', amount: Math.round(baseExpense * 0.5) },
            { name: 'Infrastructure', amount: Math.round(baseExpense * 0.2) },
            { name: 'Marketing', amount: Math.round(baseExpense * 0.15) },
            { name: 'Other', amount: Math.round(baseExpense * 0.15) },
          ],
        })),
        total: 0,
      },
    };
  }
}

export default TreasuryWraith;
