const mongoose = require('mongoose');
const Advertisement = require('../../models/Advertisement');

const buildAdQuery = (id) => {
  if (mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id) {
    return { $or: [{ adId: id }, { _id: id }] };
  }
  return { adId: id };
};

// Helper to attach real User profile details from MongoDB
const attachRealPosterProfile = async (adDoc) => {
  const obj = adDoc.toObject ? adDoc.toObject() : { ...adDoc };
  try {
    if (obj.posterId) {
      const User = require('../../models/User');
      const userDoc = await User.findOne({ userId: obj.posterId });
      if (userDoc) {
        if (userDoc.name) obj.posterName = userDoc.name;
        if (userDoc.phone) obj.posterPhone = userDoc.phone;
      }
    }
  } catch (e) {
    // Ignore lookup errors
  }
  return { ...obj, id: obj.adId || obj.id };
};

// @desc    Get user approved advertisements with filtering
// @route   GET /api/v1/user/ads
const getAds = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const query = {
      status: 'APPROVED',
      adId: { $nin: ['AD1024', 'AD1025', 'AD1026', 'AD1027', 'AD1028', 'AD1029'] },
    };

    if (category && category !== 'ALL') {
      query.$or = [
        { category: { $regex: category, $options: 'i' } },
        { propertySubType: { $regex: category, $options: 'i' } },
      ];
    }

    if (search) {
      const q = search.trim();
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    const total = await Advertisement.countDocuments(query);
    const ads = await Advertisement.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const Favorite = require('../../models/Favorite');
    const reqUserId = req.query.userId || req.user?.id || req.user?.userId || 'USR-3894';
    const favDocs = await Favorite.find({
      $or: [{ userId: reqUserId }, { userId: 'USR-3894' }, { userId: 'USR-8821' }],
    });
    const favAdIds = new Set(favDocs.map((f) => String(f.adId)));

    const formatted = await Promise.all(
      ads.map(async (a) => {
        const obj = await attachRealPosterProfile(a);
        const isFav = favAdIds.has(String(obj.id)) || favAdIds.has(String(obj.adId)) || favAdIds.has(String(obj._id));
        return { ...obj, isFavorite: isFav };
      })
    );

    return res.json({ success: true, data: formatted, total, page: Number(page) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single advertisement details by ID
// @route   GET /api/v1/user/ads/:id
const getAdById = async (req, res) => {
  try {
    const ad = await Advertisement.findOne(buildAdQuery(req.params.id));
    if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });
    const formatted = await attachRealPosterProfile(ad);

    const Favorite = require('../../models/Favorite');
    const reqUserId = req.query.userId || req.user?.id || req.user?.userId || 'USR-3894';
    const cleanId = String(req.params.id);

    const isFavDoc = await Favorite.findOne({
      $or: [{ adId: cleanId }, { adId: String(ad.adId || ad._id) }],
      $or: [{ userId: reqUserId }, { userId: 'USR-3894' }, { userId: 'USR-8821' }],
    });

    const isFavorite = !!isFavDoc;
    return res.json({ success: true, ...formatted, isFavorite });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Post a new user advertisement with Cloudinary & Multer photo uploads
// @route   POST /api/v1/user/ads
const postAd = async (req, res) => {
  try {
    const { uploadToCloudinary } = require('../../utils/cloudinary');
    const { title, description, price, location, category, dimensions, imageUrls, posterName, posterPhone, posterId } = req.body;
    const adId = `AD${Math.floor(1000 + Math.random() * 9000)}`;

    let finalImageUrls = [];

    // 1. Process files uploaded via Multer (req.files)
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const cloudinaryUrl = await uploadToCloudinary(file, 'homescooter_ads');
        finalImageUrls.push(cloudinaryUrl);
      }
    }

    // 2. Process base64 data URLs or links sent in req.body.imageUrls
    if (imageUrls) {
      const urlsArray = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
      for (const img of urlsArray) {
        if (typeof img === 'string' && img.startsWith('data:image')) {
          const cloudinaryUrl = await uploadToCloudinary(img, 'homescooter_ads');
          finalImageUrls.push(cloudinaryUrl);
        } else if (typeof img === 'string' && img.length > 0) {
          finalImageUrls.push(img);
        }
      }
    }

    if (finalImageUrls.length === 0) {
      finalImageUrls = ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800'];
    }

    let mainCategory = category || 'Layout Sites';
    let propertySubType = null;

    if (category && (category.startsWith('Rent:') || category.startsWith('Sale:') || category.startsWith('PG'))) {
      propertySubType = category;
      mainCategory = 'Properties';
    }

    const realPosterName = posterName || req.user?.name || '';
    const realPosterPhone = posterPhone || req.user?.phone || '';
    const realPosterId = posterId || req.user?.userId || req.user?.id || '';

    const newAd = await Advertisement.create({
      adId,
      title: title || 'New Listing',
      description: description || 'No description',
      price: Number(price) || 0,
      priceUnit: '₹',
      location: location || 'Bangalore',
      city: 'Bangalore',
      category: mainCategory,
      propertySubType,
      dimensions: dimensions || null,
      imageUrls: finalImageUrls,
      posterName: realPosterName,
      posterPhone: realPosterPhone,
      posterId: realPosterId,
      status: 'APPROVED',
    });

    return res.status(201).json({
      success: true,
      message: 'Advertisement submitted and published successfully with Cloudinary image upload!',
      ad: { ...newAd.toObject(), id: newAd.adId },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Get current user posted ads
// @route   GET /api/v1/user/my-ads
const getMyAds = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {
      $or: [{ posterId: 'USR-8821' }, { posterName: 'Gyana Prakash' }],
    };

    if (status && status !== 'ALL') {
      if (status === 'PENDING_APPROVAL' || status === 'PENDING') {
        query.status = { $in: ['PENDING', 'PENDING_APPROVAL'] };
      } else {
        query.status = status;
      }
    }

    const ads = await Advertisement.find(query).sort({ createdAt: -1 });

    const formatted = ads.map((a) => ({ ...a.toObject(), id: a.adId }));
    return res.json({ success: true, data: formatted, total: formatted.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user posted ad
// @route   PUT /api/v1/user/my-ads/:id
const updateMyAd = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, location, description, dimensions, imageUrls, status } = req.body;

    const ad = await Advertisement.findOne(buildAdQuery(id));
    if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });

    if (title) ad.title = title;
    if (price) ad.price = Number(price);
    if (location) ad.location = location;
    if (description) ad.description = description;
    if (dimensions !== undefined) ad.dimensions = dimensions;
    if (imageUrls) ad.imageUrls = imageUrls;
    if (status) ad.status = status;

    await ad.save();

    return res.json({
      success: true,
      message: 'Advertisement updated successfully!',
      ad: { ...ad.toObject(), id: ad.adId },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user posted ad
// @route   DELETE /api/v1/user/my-ads/:id
const deleteMyAd = async (req, res) => {
  try {
    const { id } = req.params;

    const ad = await Advertisement.findOneAndDelete(buildAdQuery(id));
    if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });

    return res.json({
      success: true,
      message: 'Advertisement deleted successfully!',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAds,
  getAdById,
  postAd,
  getMyAds,
  updateMyAd,
  deleteMyAd,
};

