const mongoose = require('mongoose');

const groupFunctionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    default: '#FFFFFF',
  },
}, {
  timestamps: true,
});

const GroupFunction = mongoose.model('GroupFunction', groupFunctionSchema);

module.exports = GroupFunction;
