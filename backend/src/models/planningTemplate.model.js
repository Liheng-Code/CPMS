const mongoose = require('mongoose');

const planningTemplateSchema = new mongoose.Schema({
  designFunctionTemplate: {
    type: String,
    required: true,
    trim: true,
  },
  tasks: {
    type: [String], // Array of strings for tasks
    default: [],
  },
  designPhase: {
    type: String,
    trim: true,
  },
  disciplines: {
    type: [String], // Array of strings for disciplines
    default: [],
  },
  groupFunction: {
    type: String,
    trim: true,
  },
  disciplineCostRates: {
    type: Number,
    min: 0,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const PlanningTemplate = mongoose.model('PlanningTemplate', planningTemplateSchema);

module.exports = PlanningTemplate;