const mongoose = require('mongoose');
const Banner = require('../models/Banner');
const { BANNER_STATUS } = require('../config/constants');
const { uploadToCloudinary } = require('../utils/cloudinary');

const getBannerQuery = (id) => {
  if (!id) return {};
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ bannerId: id }, { _id: id }] };
  }
  return { bannerId: id };
};

// @desc    Get all banners
// @route   GET /api/v1/admin/banners
// @access  Private (Admin)
const getBanners = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (search) {
      const q = search.trim();
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { bannerId: { $regex: q, $options: 'i' } },
        { sponsorName: { $regex: q, $options: 'i' } },
      ];
    }

    const banners = await Banner.find(query).sort({ createdAt: -1 });
    const formattedBanners = banners.map((b) => {
      const obj = b.toObject();
      let imageUrl = obj.imageUrl;
      if (!imageUrl || imageUrl.includes('undefined')) {
        imageUrl = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200';
      }
      return { ...obj, id: obj.bannerId || obj._id, imageUrl };
    });

    return res.json({ success: true, data: formattedBanners, total: formattedBanners.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve banner
// @route   PATCH /api/v1/admin/banners/:id/approve
// @access  Private (Admin)
const approveBanner = async (req, res) => {
  try {
    const query = getBannerQuery(req.params.id);
    const banner = await Banner.findOne(query);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    banner.status = BANNER_STATUS.ACTIVE;
    banner.rejectionReason = null;
    await banner.save();

    return res.json({ success: true, message: 'Banner campaign approved and activated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject banner
// @route   PATCH /api/v1/admin/banners/:id/reject
// @access  Private (Admin)
const rejectBanner = async (req, res) => {
  try {
    const { reason = 'Violates campaign guidelines' } = req.body;
    const query = getBannerQuery(req.params.id);
    const banner = await Banner.findOne(query);

    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    banner.status = BANNER_STATUS.REJECTED;
    banner.rejectionReason = reason;
    await banner.save();

    return res.json({ success: true, message: 'Banner campaign rejected' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new banner
// @route   POST /api/v1/admin/banners
// @access  Private (Admin)
const createBanner = async (req, res) => {
  try {
    const {
      title,
      targetScreen,
      imageUrl,
      destinationUrl,
      phoneNumber,
      sponsorName,
      startDate,
      expiryDate,
    } = req.body;

    let finalImageUrl = imageUrl;

    if (req.file) {
      try {
        finalImageUrl = await uploadToCloudinary(req.file, 'homescooter_banners');
      } catch (err) {
        console.error('Cloudinary upload error:', err);
      }
    } else if (imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('data:image')) {
      try {
        finalImageUrl = await uploadToCloudinary(imageUrl, 'homescooter_banners');
      } catch (err) {
        console.error('Cloudinary base64 upload error:', err);
      }
    }

    if (!finalImageUrl || finalImageUrl.includes('undefined')) {
      finalImageUrl = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200';
    }

    const bannerId = `BAN-${Date.now().toString().slice(-6)}${Math.floor(10 + Math.random() * 90)}`;

    const newBanner = new Banner({
      bannerId,
      title: title || 'New Promotional Campaign',
      targetScreen: targetScreen || 'Home Top Carousel',
      imageUrl: finalImageUrl,
      destinationUrl: destinationUrl || 'https://homescooter.com',
      phoneNumber: phoneNumber || '+91 98000 00000',
      sponsorName: sponsorName || 'Admin Sponsor',
      startDate: startDate || new Date().toISOString().slice(0, 10),
      expiryDate: expiryDate || new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
      status: BANNER_STATUS.ACTIVE,
    });

    await newBanner.save();

    const obj = newBanner.toObject();
    return res.status(201).json({
      success: true,
      banner: { ...obj, id: obj.bannerId },
      message: 'Banner created successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete banner
// @route   DELETE /api/v1/admin/banners/:id
// @access  Private (Admin)
const deleteBanner = async (req, res) => {
  try {
    const query = getBannerQuery(req.params.id);
    const banner = await Banner.findOneAndDelete(query);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    return res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBanners,
  approveBanner,
  rejectBanner,
  createBanner,
  deleteBanner,
};
