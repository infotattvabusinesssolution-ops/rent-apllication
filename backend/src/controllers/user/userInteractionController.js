const Lead = require('../../models/Lead');
const Report = require('../../models/Report');
const VisitorWin = require('../../models/VisitorWin');
const Subscription = require('../../models/Subscription');

// @desc    Submit callback inquiry lead (Customer Verified Slip CVS)
// @route   POST /api/v1/user/callback
const requestCallback = async (req, res) => {
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
};

// @desc    Submit ad report complaint
// @route   POST /api/v1/user/report
const submitReport = async (req, res) => {
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
};

// @desc    Register for Visitor Win contest
// @route   POST /api/v1/user/visitor-win
const registerVisitorWin = async (req, res) => {
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
};

// @desc    Submit ₹100 subscription payment proof
// @route   POST /api/v1/user/subscription
const submitSubscription = async (req, res) => {
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
};

module.exports = {
  requestCallback,
  submitReport,
  registerVisitorWin,
  submitSubscription,
};
