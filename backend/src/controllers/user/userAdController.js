const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Advertisement = require('../../models/Advertisement');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_homescooter_2026';

const extractRequesterUserId = (req) => {
  // 1. Check req.user from auth middleware
  if (req.user?.userId) return String(req.user.userId).trim();
  if (req.user?.id) return String(req.user.id).trim();

  // 2. Check Authorization Bearer token header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded && decoded.id) return String(decoded.id).trim();
    } catch (e) {
      // ignore invalid token decoding
    }
  }

  // 3. Check query param or request body
  if (req.query && req.query.userId) return String(req.query.userId).trim();
  if (req.query && req.query.posterId) return String(req.query.posterId).trim();
  if (req.body && req.body.userId) return String(req.body.userId).trim();
  if (req.body && req.body.posterId) return String(req.body.posterId).trim();

  return null;
};

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
        if (userDoc.name && (!obj.posterName || obj.posterName === 'Seller')) {
          obj.posterName = userDoc.name;
        }
        if (userDoc.phone && userDoc.phone !== '+91 98765 43210' && (!obj.posterPhone || obj.posterPhone === '+91 98765 43210')) {
          obj.posterPhone = userDoc.phone;
        }
      }
    }
  } catch (e) {
    // Ignore lookup errors
  }

  // Schema hygiene: If this is a land / plot, ensure house attributes are never populated
  const isLand = (obj.propertySubType && /land|plot/i.test(obj.propertySubType)) || (obj.category && /layout|site|land|plot/i.test(obj.category));
  if (isLand) {
    obj.bhk = null;
    obj.furnishing = null;
    obj.bathrooms = null;
    obj.houseType = null;
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
    const ad = await Advertisement.findOneAndUpdate(
      buildAdQuery(req.params.id),
      { $inc: { viewsCount: 1 } },
      { new: true }
    );
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
      const uploadPromises = urlsArray.map(async (img) => {
        if (typeof img === 'string' && img.startsWith('data:image')) {
          return await uploadToCloudinary(img, 'homescooter_ads');
        } else if (typeof img === 'string' && img.length > 0) {
          return img;
        }
        return null;
      });
      const resolvedUrls = await Promise.all(uploadPromises);
      finalImageUrls = [...finalImageUrls, ...resolvedUrls.filter(Boolean)];
    }

    if (finalImageUrls.length === 0) {
      finalImageUrls = ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800'];
    }

    let mainCategory = category || 'Layout Sites';
    let propertySubType = req.body.propertySubType || null;

    if (category && (category.startsWith('Rent:') || category.startsWith('Sale:') || category.startsWith('PG') || category === 'Lands & Plots')) {
      propertySubType = category;
      mainCategory = 'Properties';
    } else if (category && (category === 'Motorcycles' || category === 'Scooters' || category === 'Spare Parts' || category === 'Bicycles' || category === 'Bikes')) {
      propertySubType = category === 'Bikes' ? null : category;
      mainCategory = 'Bikes';
    } else if (category && (category === 'Jobs' || category === 'BPO & Telecaller' || category === 'Data Entry & Back Office' || category === 'Sales & Marketing' || category === 'Driver' || category === 'Delivery & Collection' || category === 'IT & Software')) {
      propertySubType = category === 'Jobs' ? null : category;
      mainCategory = 'Jobs';
    } else if (category && (category === 'Services' || category.includes('Repair') || category.includes('Cleaning') || category.includes('Packers') || category.includes('Renovation') || category.includes('Legal'))) {
      propertySubType = category === 'Services' ? null : category;
      mainCategory = 'Services';
    }

    const realPosterName = (posterName || req.body.name || req.user?.name || 'Seller').trim() || 'Seller';
    const realPosterPhone = (posterPhone || req.body.phone || req.user?.phone || '').trim();
    const realPosterId = (posterId || req.user?.userId || req.user?.id || 'USR-8821').trim() || 'USR-8821';

    const isLand = (propertySubType && /land|plot/i.test(propertySubType)) || (mainCategory && /layout|site|land|plot/i.test(mainCategory));
    if (isLand) {
      req.body.bhk = null;
      req.body.furnishing = null;
      req.body.bathrooms = null;
      req.body.houseType = null;
    }

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
      dimensions: dimensions || req.body.superBuiltupArea || req.body.plotArea || null,
      facing: req.body.facing || null,
      plotNumber: req.body.plotNumber || null,
      bhk: req.body.bhk || null,
      bathrooms: req.body.bathrooms || null,
      furnishing: req.body.furnishing || null,
      projectStatus: req.body.projectStatus || null,
      listedBy: req.body.listedBy || null,
      superBuiltupArea: req.body.superBuiltupArea || null,
      carpetArea: req.body.carpetArea || null,
      maintenanceMonthly: req.body.maintenanceMonthly || null,
      totalFloors: req.body.totalFloors || null,
      carParking: req.body.carParking || null,
      floorNo: req.body.floorNo || null,
      washrooms: req.body.washrooms || null,
      plotArea: req.body.plotArea || null,
      length: req.body.length || null,
      breadth: req.body.breadth || null,
      type: req.body.type || req.body.serviceType || null,
      brand: req.body.brand || null,
      year: req.body.year || null,
      fuel: req.body.fuel || null,
      kmDriven: req.body.kmDriven || null,
      brandModel: req.body.brandModel || req.body.brand || null,
      positionType: req.body.positionType || null,
      salaryFrom: req.body.salaryFrom || null,
      salaryTo: req.body.salaryTo || null,
      salaryPeriod: req.body.salaryPeriod || null,
      serviceType: req.body.serviceType || req.body.type || null,
      specifications: req.body.specifications || {},
      imageUrls: finalImageUrls,
      posterName: realPosterName,
      posterPhone: realPosterPhone,
      posterId: realPosterId,
      status: 'PENDING_APPROVAL',
    });

    const { sendNotification } = require('../../utils/createNotification');
    await sendNotification({
      recipientType: 'ADMIN',
      title: 'New Ad Pending Review 📦',
      desc: `New listing '${newAd.title}' submitted by ${realPosterName}`,
      type: 'ad',
      path: '/ads/pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Your advertisement has been submitted successfully and is pending admin approval!',
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
    const requesterId = extractRequesterUserId(req);

    if (!requesterId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication or user ID is required to fetch your advertisements.',
        data: [],
        total: 0,
      });
    }

    const query = { posterId: requesterId };

    if (status && status !== 'ALL') {
      if (status === 'PENDING_APPROVAL' || status === 'PENDING') {
        query.status = { $in: ['PENDING', 'PENDING_APPROVAL'] };
      } else {
        query.status = status;
      }
    }

    const ads = await Advertisement.find(query).sort({ createdAt: -1 });

    const formatted = ads.map((a) => {
      const obj = a.toObject ? a.toObject() : { ...a };
      const isLand = (obj.propertySubType && /land|plot/i.test(obj.propertySubType)) || (obj.category && /layout|site|land|plot/i.test(obj.category));
      if (isLand) {
        obj.bhk = null;
        obj.furnishing = null;
        obj.bathrooms = null;
        obj.houseType = null;
      }
      return { ...obj, id: a.adId };
    });
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
    const requesterId = extractRequesterUserId(req);

    if (!requesterId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to edit listings.',
      });
    }

    const ad = await Advertisement.findOne(buildAdQuery(id));
    if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });

    // Strict Ownership Enforcement: Users can ONLY edit their own ads
    if (ad.posterId && String(ad.posterId).trim() !== requesterId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only edit your own advertisements.',
      });
    }

    const isLand = (ad.propertySubType && /land|plot/i.test(ad.propertySubType)) ||
      (ad.category && /layout|site|land|plot/i.test(ad.category)) ||
      (req.body.propertySubType && /land|plot/i.test(req.body.propertySubType));

    if (isLand) {
      ad.bhk = null;
      ad.furnishing = null;
      ad.bathrooms = null;
      ad.houseType = null;
      delete req.body.bhk;
      delete req.body.furnishing;
      delete req.body.bathrooms;
      delete req.body.houseType;
    }

    const { title, price, location, description, dimensions, imageUrls, status } = req.body;

    if (title) ad.title = title;
    if (price) ad.price = Number(price);
    if (location) ad.location = location;
    if (description) ad.description = description;
    if (dimensions !== undefined) ad.dimensions = dimensions;

    let finalImageUrls = [];
    if (imageUrls) {
      const urlsArray = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
      finalImageUrls = urlsArray.filter((u) => typeof u === 'string' && u.trim().length > 0);
    }
    if (req.files && req.files.length > 0) {
      const { uploadToCloudinary } = require('../../utils/cloudinary');
      for (const file of req.files) {
        const cloudinaryUrl = await uploadToCloudinary(file, 'homescooter_ads');
        finalImageUrls.push(cloudinaryUrl);
      }
    }
    if (finalImageUrls.length > 0) {
      ad.imageUrls = finalImageUrls;
    }

    if (status === 'UNPUBLISHED') {
      ad.status = 'UNPUBLISHED';
    } else {
      // Whenever an ad is edited by the user, reset to PENDING_APPROVAL for admin review
      ad.status = 'PENDING_APPROVAL';
      ad.rejectionReason = null;
      ad.rejectionNotes = null;
    }

    const updatedPhone = (req.body.posterPhone || req.body.phone || '').trim();
    if (updatedPhone) ad.posterPhone = updatedPhone;
    const updatedName = (req.body.posterName || req.body.name || '').trim();
    if (updatedName) ad.posterName = updatedName;

    const fieldsToUpdate = [
      'facing', 'plotNumber', 'bhk', 'bathrooms', 'furnishing', 'projectStatus',
      'listedBy', 'superBuiltupArea', 'carpetArea', 'maintenanceMonthly', 'totalFloors',
      'carParking', 'floorNo', 'washrooms', 'plotArea', 'length', 'breadth', 'type',
      'brand', 'year', 'fuel', 'kmDriven', 'brandModel',
      'positionType', 'salaryFrom', 'salaryTo', 'salaryPeriod', 'serviceType', 'specifications'
    ];
    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        ad[field] = req.body[field];
      }
    });

    await ad.save();

    if (ad.status === 'PENDING_APPROVAL') {
      const { sendNotification } = require('../../utils/createNotification');
      await sendNotification({
        recipientType: 'ADMIN',
        title: 'Listing Edited - Pending Review ✏️',
        desc: `Listing '${ad.title}' was updated by ${ad.posterName} and is awaiting re-approval.`,
        type: 'ad',
        path: '/ads/pending',
      });
    }

    return res.json({
      success: true,
      message: ad.status === 'PENDING_APPROVAL'
        ? 'Advertisement updated successfully and submitted for admin approval!'
        : 'Advertisement updated successfully!',
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
    const requesterId = extractRequesterUserId(req);

    if (!requesterId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to delete listings.',
      });
    }

    const ad = await Advertisement.findOne(buildAdQuery(id));
    if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });

    // Strict Ownership Enforcement: Users can ONLY delete their own ads
    if (ad.posterId && String(ad.posterId).trim() !== requesterId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own advertisements.',
      });
    }

    await Advertisement.deleteOne(buildAdQuery(id));

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

