const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  longDescription: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Available', 'Completed', 'Under Construction', 'Coming Soon'],
    default: 'Available'
  },
  price: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  completionDate: {
    type: String,
    required: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    }
  }],
  features: [{
    type: String
  }],
  specifications: {
    bedrooms: {
      type: String,
      required: true
    },
    bathrooms: {
      type: String,
      required: true
    },
    parking: {
      type: String,
      required: true
    },
    floor: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search functionality
projectSchema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Project', projectSchema);

