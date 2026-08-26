const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    parent: { type: String, default: 'None (Main Category)' },
    subCategories: [{ type: String }],
    description: { type: String, default: '' },
    icon: { type: String, default: '📦' },
    color: { type: String, default: 'bg-blue-100 text-blue-800 border-blue-200' },
    schemaType: { type: String, default: 'DEFAULT' }, // 'PROPERTIES_HOUSES', 'PROPERTIES_SHOPS', 'PROPERTIES_LANDS', 'BIKES_VEHICLE', 'BIKES_PARTS', 'DEFAULT'
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
