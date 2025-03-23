const mongoose = require('mongoose');
const crypto = require('crypto');

const CandidateSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true,
  },
  linkedin: {
    type: String,
    trim: true
  },
  summary: {
    type: String
  },
  recommendations: {
    type: String
  },
  // Additional assessment fields
  timing: {
    type: String
  },
  facial: {
    type: String
  },
  video: {
    type: String
  },
  communication: {
    type: String
  },
  // Access control
  accessKey: {
    type: String,
    default: () => crypto.randomBytes(8).toString('hex')
  },
  isUnlocked: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
CandidateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Candidate', CandidateSchema);
