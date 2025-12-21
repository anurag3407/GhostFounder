import mongoose from 'mongoose';

const FinancialReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  firebaseUid: {
    type: String,
    required: true,
    index: true,
  },
  period: {
    type: String,
    enum: ['Q1', 'Q2', 'Q3', 'Q4', 'yearly'],
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  // Financial Data
  data: {
    revenue: {
      monthly: [{
        month: String,
        amount: Number,
      }],
      total: Number,
    },
    expenses: {
      monthly: [{
        month: String,
        amount: Number,
        categories: [{
          name: String,
          amount: Number,
        }],
      }],
      total: Number,
    },
    netProfit: {
      monthly: [{
        month: String,
        amount: Number,
      }],
      total: Number,
    },
    burnRate: {
      monthly: [{
        month: String,
        amount: Number,
      }],
      average: Number,
    },
    runway: {
      months: Number,
      date: Date,
    },
  },
  // AI Analysis
  analysis: {
    summary: String,
    highlights: [String],
    concerns: [String],
    recommendations: [String],
    healthScore: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  // Google Sheet
  googleSheet: {
    spreadsheetId: String,
    spreadsheetUrl: String,
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  // Token usage
  tokenUsage: {
    totalTokens: Number,
    cost: Number,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.FinancialReport || mongoose.model('FinancialReport', FinancialReportSchema);
