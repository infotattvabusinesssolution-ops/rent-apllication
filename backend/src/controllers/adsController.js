const mongoose = require('mongoose');
const Advertisement = require('../models/Advertisement');
const { AD_STATUS } = require('../config/constants');

const buildAdQuery = (id) => {
  if (mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id) {
    return { $or: [{ adId: id }, { _id: id }] };
  }
  return { adId: id };
};

// @desc    Get all advertisements with filtering & pagination
// @route   GET /api/v1/admin/ads
// @access  Private (Admin)
const getAds = async (req, res) => {
  try {
    const { status, category, isFeatured, isHighDemand, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (category && category !== 'ALL') {
      query.$or = [
        { category: { $regex: category, $options: 'i' } },
        { propertySubType: { $regex: category, $options: 'i' } },
      ];
    }

    if (isFeatured === 'true') {
      query.isFeatured = true;
    }
    if (isHighDemand === 'true') {
      query.isHighDemand = true;
    }
    if (search) {
      const q = search.trim();
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { adId: { $regex: q, $options: 'i' } },
        { posterName: { $regex: q, $options: 'i' } },
        { posterPhone: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
      ];
    }

    const total = await Advertisement.countDocuments(query);
    const ads = await Advertisement.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Remap adId to id for frontend compatibility
    const formattedAds = ads.map((ad) => {
      const obj = ad.toObject();
      return { ...obj, id: obj.adId };
    });

    return res.json({
      success: true,
      data: formattedAds,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get pending advertisements
// @route   GET /api/v1/admin/ads/pending
// @access  Private (Admin)
const getPendingAds = async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = { status: AD_STATUS.PENDING };

    if (category && category !== 'ALL') {
      query.category = category;
    }
    if (search) {
      const q = search.trim();
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { adId: { $regex: q, $options: 'i' } },
        { posterName: { $regex: q, $options: 'i' } },
      ];
    }

    const ads = await Advertisement.find(query).sort({ createdAt: -1 });
    const formattedAds = ads.map((ad) => {
      const obj = ad.toObject();
      return { ...obj, id: obj.adId };
    });

    return res.json({
      success: true,
      data: formattedAds,
      total: formattedAds.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get ad by ID
// @route   GET /api/v1/admin/ads/:id
// @access  Private (Admin)
const getAdById = async (req, res) => {
  try {
    const ad = await Advertisement.findOne(buildAdQuery(req.params.id));
    if (!ad) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }
    const obj = ad.toObject();
    return res.json({ success: true, ...obj, id: obj.adId });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve ad
// @route   PATCH /api/v1/admin/ads/:id/approve
// @access  Private (Admin)
const approveAd = async (req, res) => {
  try {
    const ad = await Advertisement.findOne(buildAdQuery(req.params.id));
    if (!ad) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }

    ad.status = AD_STATUS.APPROVED;
    ad.rejectionReason = null;
    ad.rejectionNotes = null;
    await ad.save();

    return res.json({ success: true, message: 'Advertisement approved successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject ad
// @route   PATCH /api/v1/admin/ads/:id/reject
// @access  Private (Admin)
const rejectAd = async (req, res) => {
  try {
    const { reason, notes } = req.body;
    const ad = await Advertisement.findOne(buildAdQuery(req.params.id));

    if (!ad) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }

    ad.status = AD_STATUS.REJECTED;
    ad.rejectionReason = reason || 'Does not meet guidelines';
    ad.rejectionNotes = notes || '';
    await ad.save();

    return res.json({ success: true, message: 'Advertisement rejected successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update ad badges (isFeatured, isHighDemand)
// @route   PATCH /api/v1/admin/ads/:id/badges
// @access  Private (Admin)
const updateBadges = async (req, res) => {
  try {
    const { isFeatured, isHighDemand } = req.body;
    const ad = await Advertisement.findOne(buildAdQuery(req.params.id));

    if (!ad) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }

    if (isFeatured !== undefined) ad.isFeatured = Boolean(isFeatured);
    if (isHighDemand !== undefined) ad.isHighDemand = Boolean(isHighDemand);
    await ad.save();

    return res.json({ success: true, message: 'Badges updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unpublish ad
// @route   PATCH /api/v1/admin/ads/:id/unpublish
// @access  Private (Admin)
const unpublishAd = async (req, res) => {
  try {
    const ad = await Advertisement.findOne(buildAdQuery(req.params.id));
    if (!ad) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }

    ad.status = AD_STATUS.UNPUBLISHED;
    await ad.save();

    return res.json({ success: true, message: 'Advertisement unpublished' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete ad
// @route   DELETE /api/v1/admin/ads/:id
// @access  Private (Admin)
const deleteAd = async (req, res) => {
  try {
    const ad = await Advertisement.findOneAndDelete(buildAdQuery(req.params.id));
    if (!ad) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }

    return res.json({ success: true, message: 'Advertisement deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAds,
  getPendingAds,
  getAdById,
  approveAd,
  rejectAd,
  updateBadges,
  unpublishAd,
  deleteAd,
};
