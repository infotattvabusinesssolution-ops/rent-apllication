const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    favoriteId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    adId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Favorite', favoriteSchema);
