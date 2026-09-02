const mongoose = require('mongoose');
const { CATEGORIES, AD_STATUS } = require('../config/constants');

const advertisementSchema = new mongoose.Schema(
  {
    adId: { type: String, required: true, unique: true }, // e.g. AD1024
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: false, default: 0 },
    priceUnit: { type: String, default: '₹' },
    location: { type: String, required: true, index: true },
    city: { type: String, required: true, default: 'Bangalore' },
    distanceKm: { type: Number, default: 0 },
    category: {
      type: String,
      required: true,
      index: true,
    },
    propertySubType: { type: String, default: null },
    imageUrls: [{ type: String }],

    // Poster Details
    posterName: { type: String, required: true },
    posterPhone: { type: String, required: true },
    posterEmail: { type: String, default: '' },
    posterId: { type: String, required: true, index: true },

    postedAt: { type: Date, default: Date.now },
    viewsCount: { type: Number, default: 0 },

    // Moderation Status & Flags
    status: {
      type: String,
      default: 'PENDING_APPROVAL',
      index: true,
    },

    rejectionReason: { type: String, default: null },
    rejectionNotes: { type: String, default: null },

    // Badges & Demands
    isHighDemand: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    promoTag: { type: String, default: null },

    // Lucky Draw Admin Setting (APPLY / NOT_APPLY)
    luckyDrawStatus: {
      type: String,
      enum: ['APPLY', 'NOT_APPLY'],
      default: 'NOT_APPLY',
      index: true,
    },
    isLuckyDrawEligible: { type: Boolean, default: false },
    luckyDrawImage: { type: String, default: null },

    // Category Specific Metadata
    dimensions: { type: String, default: null },
    plotNumber: { type: String, default: null },
    facing: { type: String, default: null },
    bhk: { type: String, default: null },
    bathrooms: { type: String, default: null },
    furnishing: { type: String, default: null },
    projectStatus: { type: String, default: null },
    listedBy: { type: String, default: null },
    superBuiltupArea: { type: String, default: null },
    carpetArea: { type: String, default: null },
    maintenanceMonthly: { type: String, default: null },
    totalFloors: { type: String, default: null },
    carParking: { type: String, default: null },
    floorNo: { type: String, default: null },
    washrooms: { type: String, default: null },
    plotArea: { type: String, default: null },
    length: { type: String, default: null },
    breadth: { type: String, default: null },
    type: { type: String, default: null },

    // Bike / Vehicle Specific Metadata
    brand: { type: String, default: null },
    year: { type: String, default: null },
    fuel: { type: String, default: null },
    kmDriven: { type: String, default: null },
    brandModel: { type: String, default: null },
    batteryRangeKm: { type: String, default: null },
    maxSpeed: { type: String, default: null },

    // Job Specific Metadata
    positionType: { type: String, default: null },
    salaryFrom: { type: String, default: null },
    salaryTo: { type: String, default: null },
    salaryPeriod: { type: String, default: null },

    // Service Specific Metadata
    serviceType: { type: String, default: null },

    amenities: [{ type: String }],
    specifications: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Advertisement', advertisementSchema);
