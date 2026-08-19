const mongoose = require('mongoose');

const visitorWinSchema = new mongoose.Schema(
  {
    registrationId: { type: String, required: true, unique: true }, // e.g. VW-901
    name: { type: String, required: true },
    place: { type: String, required: true },
    age: { type: Number, required: true },
    phone: { type: String, required: true, index: true },
    subject: { type: String, required: true },
    registrationDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VisitorWin', visitorWinSchema);
