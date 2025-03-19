const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true 
  },
  accessKey: {
    type: String,
    required: true,
    unique: true
  },
  accessUrl: {
    type: String,
    required: true,
    unique: true
  },
  name: { 
    type: String, 
    required: true 
  },
  linkedin: { 
    type: String,
    sparse: true,
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return v === '' || v === null || v.includes('linkedin.com/');
      },
      message: props => `${props.value} is not a valid LinkedIn URL!`
    }
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  phone: { 
    type: String,
    sparse: true,
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return v === '' || v === null || /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  summary: String,
  strengths: [String],
  weaknesses: [String],
  skills: [String]
}, {
  timestamps: true
});

// Create indexes for unique fields
candidateSchema.index({ linkedin: 1 }, { unique: true, sparse: true });
candidateSchema.index({ phone: 1 }, { unique: true, sparse: true });
candidateSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Candidate', candidateSchema);