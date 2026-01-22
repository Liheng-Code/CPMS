const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
    trim: true,
  },
  projectCode: { // New field
    type: String,
    trim: true,
    unique: true, // Project codes are often unique
  },
  projectLocation: { // New field
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
  },
  client: {
    type: String,
    trim: true,
  },
  // projectManager: { // Removed
  //   type: String,
  //   trim: true,
  // },
  budget: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['Draft', 'Planned', 'Pending Approval', 'Active', 'Completed', 'Cancelled'],
    default: 'Draft',
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
