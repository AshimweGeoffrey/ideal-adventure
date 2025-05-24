const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['web-development', 'mobile-app', 'design', 'data-science', 'other'],
    default: 'other'
  },
  technologies: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String,
    trim: true
  },
  projectUrl: {
    type: String,
    trim: true
  },
  githubUrl: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'planned'],
    default: 'completed'
  },
  featured: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  studentId: {
    type: String,
    default: '26466',
    immutable: true
  }
}, {
  timestamps: true
});

// Index for better query performance
portfolioSchema.index({ owner: 1, featured: -1 });
portfolioSchema.index({ category: 1, status: 1 });
portfolioSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Portfolio', portfolioSchema);
