import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    default: '',
  },
  photoURL: {
    type: String,
    default: '',
  },
  // GitHub Integration
  githubConnected: {
    type: Boolean,
    default: false,
  },
  githubUsername: {
    type: String,
    default: '',
  },
  githubAccessToken: {
    type: String,
    default: '',
  },
  githubRepos: [{
    type: String,
  }],
  selectedRepo: {
    type: String,
    default: '',
  },
  // Subscription
  subscription: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free',
  },
  // Token Usage Tracking
  tokenUsage: [{
    date: {
      type: Date,
      default: Date.now,
    },
    agent: {
      type: String,
      enum: [
        'phantom-code-guardian',
        'data-specter',
        'treasury-wraith',
        'equity-phantom',
        'pitch-poltergeist',
        'shadow-scout',
        'news-banshee',
        'investor-ghoul',
      ],
    },
    tokens: {
      type: Number,
      default: 0,
    },
    cost: {
      type: Number,
      default: 0,
    },
  }],
  // Blockchain
  blockchainWallet: {
    type: String,
    default: '',
  },
  equityTransfers: [{
    to: String,
    amount: Number,
    percentage: Number,
    txHash: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  // Notifications
  notificationPreferences: {
    email: {
      type: Boolean,
      default: true,
    },
    whatsapp: {
      type: Boolean,
      default: false,
    },
    whatsappNumber: {
      type: String,
      default: '',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Calculate total tokens used
UserSchema.methods.getTotalTokensUsed = function() {
  return this.tokenUsage.reduce((total, usage) => total + usage.tokens, 0);
};

// Calculate total cost
UserSchema.methods.getTotalCost = function() {
  return this.tokenUsage.reduce((total, usage) => total + usage.cost, 0);
};

// Add token usage
UserSchema.methods.addTokenUsage = async function(agent, tokens, cost) {
  this.tokenUsage.push({
    date: new Date(),
    agent,
    tokens,
    cost,
  });
  await this.save();
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
