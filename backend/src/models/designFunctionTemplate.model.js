const mongoose = require('mongoose');

const designFunctionTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  groupFunction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GroupFunction',
    required: true,
  },
  manpowerFactor: {
    type: Number,
    min: 0,
    default: 1,
  },
  displayOrder: {
    type: Number,
    min: 0,
    default: 0,
  },
  color: {
    type: String,
    default: '#FFFFFF',
  },
}, {
  timestamps: true,
});

const DesignFunctionTemplate = mongoose.model('DesignFunctionTemplate', designFunctionTemplateSchema);

module.exports = DesignFunctionTemplate;