const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  defaultDurationDays: {
    type: Number,
    min: 0,
  },
  defaultRevision: {
    type: String, // Assuming string for flexibility (e.g., 'A', '1.0', 'Final')
    trim: true,
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

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
