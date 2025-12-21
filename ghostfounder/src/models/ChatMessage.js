import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema({
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
  agent: {
    type: String,
    enum: [
      'data-specter',
      'investor-ghoul',
    ],
    required: true,
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    // For data specter - store query results
    queryResult: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    // Token usage for this message
    tokens: {
      type: Number,
      default: 0,
    },
  }],
  // Session metadata
  sessionStarted: {
    type: Date,
    default: Date.now,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
  totalTokens: {
    type: Number,
    default: 0,
  },
  totalCost: {
    type: Number,
    default: 0,
  },
});

// Update last activity on message add
ChatMessageSchema.methods.addMessage = async function(role, content, tokens = 0, queryResult = null) {
  this.messages.push({
    role,
    content,
    timestamp: new Date(),
    tokens,
    queryResult,
  });
  this.lastActivity = new Date();
  this.totalTokens += tokens;
  await this.save();
};

export default mongoose.models.ChatMessage || mongoose.model('ChatMessage', ChatMessageSchema);
