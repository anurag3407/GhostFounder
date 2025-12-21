import mongoose from 'mongoose';

const CodeReviewSchema = new mongoose.Schema({
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
  repoName: {
    type: String,
    required: true,
  },
  prNumber: {
    type: Number,
    required: true,
  },
  prTitle: {
    type: String,
    default: '',
  },
  prAuthor: {
    type: String,
    default: '',
  },
  prUrl: {
    type: String,
    default: '',
  },
  // Analysis Results
  analysis: {
    summary: {
      type: String,
      default: '',
    },
    functions: [{
      name: String,
      lines: String,
      description: String,
    }],
    bugs: [{
      line: Number,
      file: String,
      severity: {
        type: String,
        enum: ['critical', 'warning', 'info'],
      },
      description: String,
      suggestion: String,
    }],
    securityIssues: [{
      line: Number,
      file: String,
      severity: {
        type: String,
        enum: ['critical', 'high', 'medium', 'low'],
      },
      type: String,
      description: String,
      recommendation: String,
    }],
    codeSmells: [{
      line: Number,
      file: String,
      type: String,
      description: String,
    }],
    suggestions: [{
      category: String,
      description: String,
      priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
      },
    }],
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  // Files reviewed
  filesReviewed: [{
    path: String,
    additions: Number,
    deletions: Number,
    patch: String,
  }],
  // Token usage
  tokenUsage: {
    promptTokens: {
      type: Number,
      default: 0,
    },
    completionTokens: {
      type: Number,
      default: 0,
    },
    totalTokens: {
      type: Number,
      default: 0,
    },
    cost: {
      type: Number,
      default: 0,
    },
  },
  // Notification status
  notifications: {
    emailSent: {
      type: Boolean,
      default: false,
    },
    whatsappSent: {
      type: Boolean,
      default: false,
    },
    sentAt: Date,
  },
  // Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  },
  errorMessage: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: Date,
});

// Compound index for user's reviews
CodeReviewSchema.index({ userId: 1, createdAt: -1 });
CodeReviewSchema.index({ repoName: 1, prNumber: 1 }, { unique: true });

export default mongoose.models.CodeReview || mongoose.model('CodeReview', CodeReviewSchema);
