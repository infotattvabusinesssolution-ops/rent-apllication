const express = require('express');
const router = express.Router();
const Advertisement = require('../../../../models/Advertisement');
const Lead = require('../../../../models/Lead');
const Report = require('../../../../models/Report');
const VisitorWin = require('../../../../models/VisitorWin');
const Subscription = require('../../../../models/Subscription');

// @route GET /api/v1/user/ads
router.get('/ads', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const query = { status: 'APPROVED' };

    if (category && category !== 'ALL') query.category = category;
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

    const formatted = ads.map((a) => ({ ...a.toObject(), id: a.adId }));
    return res.json({ success: true, data: formatted, total, page: Number(page) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/v1/user/ads/:id
router.get('/ads/:id', async (req, res) => {
  try {
    const ad = await Advertisement.findOne({ $or: [{ adId: req.params.id }, { _id: req.params.id }] });
    if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });
    return res.json({ success: true, ...ad.toObject(), id: ad.adId });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/v1/user/callback
router.post('/callback', async (req, res) => {
  try {
    const { adId, adTitle, posterName, posterPhone, buyerName, buyerPhone, location } = req.body;
    const leadId = `LEAD-${Math.floor(500 + Math.random() * 500)}`;

    const newLead = await Lead.create({
      leadId,
      adId: adId || 'AD1024',
      adTitle: adTitle || 'Property Inquiry',
      posterName: posterName || 'Seller',
      posterPhone: posterPhone || '+91 90000 00000',
      buyerName,
      buyerPhone,
      location: location || 'Bangalore',
      status: 'New',
    });

    return res.status(201).json({ success: true, message: 'Callback request received', lead: newLead });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/v1/user/report
router.post('/report', async (req, res) => {
  try {
    const { adId, adTitle, sellerName, sellerPhone, reporterName, reporterPhone, reportReason, comment } = req.body;
    const reportId = `REP-${Math.floor(300 + Math.random() * 500)}`;

    const newReport = await Report.create({
      reportId,
      adId,
      adTitle,
      sellerName,
      sellerPhone,
      reporterName,
      reporterPhone,
      reportReason,
      comment,
      status: 'Pending',
    });

    return res.status(201).json({ success: true, message: 'Report submitted for review', report: newReport });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/v1/user/visitor-win
router.post('/visitor-win', async (req, res) => {
  try {
    const { name, place, age, phone, subject } = req.body;
    const registrationId = `VW-${Math.floor(900 + Math.random() * 100)}`;

    const newReg = await VisitorWin.create({
      registrationId,
      name,
      place,
      age: Number(age),
      phone,
      subject,
    });

    return res.status(201).json({ success: true, message: 'Contest registration successful', registration: newReg });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/v1/user/subscription
router.post('/subscription', async (req, res) => {
  try {
    const { userId, userName, userPhone, userEmail, upiReference, screenshotUrl, notes } = req.body;
    const subId = `SUB-${Math.floor(9800 + Math.random() * 200)}`;

    const newSub = await Subscription.create({
      subId,
      userId: userId || 'USR-AUTO',
      userName,
      userPhone,
      userEmail,
      upiReference,
      screenshotUrl: screenshotUrl || 'https://images.unsplash.com/photo-1556742049-0a67e06a382e',
      notes: notes || '₹100 Subscription payment submitted',
      status: 'Pending',
    });

    return res.status(201).json({ success: true, message: 'Subscription payment proof submitted successfully', subscription: newSub });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
