const mongoose = require('mongoose');

const disciplineSchema = new mongoose.Schema({
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
  color: {
    type: String,
    trim: true,
    default: '#FFFFFF',
  },
  displayOrder: {
    type: Number,
    min: 0,
    default: 0,
  },
}, {
  timestamps: true,
});

const Discipline = mongoose.model('Discipline', disciplineSchema);

module.exports = Discipline;
