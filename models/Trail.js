const mongoose = require('mongoose');

const trailSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  juntion1: {
    type: String,
    trim: true,
  },
  juntion2: {
    type: String,
    trim: true,
  },
  lastWorked: {
    type: Date,
    default: Date.now,
    max: Date.now
  },
  comments: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model('Trail', trailSchema);
