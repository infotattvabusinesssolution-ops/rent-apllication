const mongoose = require('mongoose');

const locationLogSchema = new mongoose.Schema(
  {
    userId: { type: String, default: null },
    userName: { type: String, default: null },
    userPhone: { type: String, default: null },
    location: { type: String, required: true },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    source: { type: String, enum: ['GPS', 'MANUAL_SEARCH', 'PRESET_SELECT'], default: 'GPS' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LocationLog', locationLogSchema);
