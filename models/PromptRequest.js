const mongoose = require('mongoose');

const PromptRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  toolId: {
    type: String,
    required: true,
    enum: ['explain-code', 'fix-bug', 'generate-regex'],
  },
  prompt: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries by user and date
PromptRequestSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('PromptRequest', PromptRequestSchema);