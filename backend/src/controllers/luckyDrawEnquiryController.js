const LuckyDrawEnquiry = require('../models/LuckyDrawEnquiry');
const Advertisement = require('../models/Advertisement');
const SystemSettings = require('../models/SystemSettings');

// Helper to generate formatted Enquiry ID e.g. LDE-1024
const generateEnquiryId = () => {
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `LDE-${randNum}`;
};

// @desc    Submit a new visitor Lucky Draw enquiry
// @route   POST /api/v1/user/lucky-draws/enquiries
// @access  Public / User
const submitLuckyDrawEnquiry = async (req, res) => {
  try {
    const { adId, visitorName, visitorPhone, visitorEmail, visitorDetails } = req.body;

    if (!adId || !visitorName || !visitorPhone) {
      return res.status(400).json({
        success: false,
        message: 'Ad ID, Visitor Name, and Visitor Contact Phone are required',
      });
    }

    // Lookup ad details if available
    let adTitle = req.body.adTitle || 'Product/Service Listing';
    let adCategory = req.body.adCategory || 'General';
    let adImageUrl = req.body.adImageUrl || '';

    const adObj = await Advertisement.findOne({ $or: [{ adId: adId }, { _id: adId }] });
    if (adObj) {
      adTitle = adObj.title || adTitle;
      adCategory = adObj.category || adCategory;
      if (adObj.imageUrls && adObj.imageUrls.length > 0) {
        adImageUrl = adObj.imageUrls[0];
      }
    }

    const enquiryId = generateEnquiryId();

    const enquiry = await LuckyDrawEnquiry.create({
      enquiryId,
      adId: adObj?.adId || adId,
      adTitle,
      adCategory,
      adImageUrl,
      visitorName,
      visitorPhone,
      visitorEmail: visitorEmail || '',
      visitorDetails: visitorDetails || '',
      whatsAppSent: true,
      status: 'NEW',
    });

    // Retrieve Admin WhatsApp number from system settings
    const settings = await SystemSettings.findOne();
    const adminPhone = settings?.dealerWhatsapp || settings?.dealerPhone || '+91 98765 43210';

    return res.status(201).json({
      success: true,
      message: 'Lucky Draw enquiry submitted successfully!',
      data: enquiry,
      adminPhone,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all Lucky Draw enquiries for Admin
// @route   GET /api/v1/admin/lucky-draws/enquiries
// @access  Private (Admin)
const getLuckyDrawEnquiries = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (search) {
      const q = search.trim();
      query.$or = [
        { enquiryId: { $regex: q, $options: 'i' } },
        { visitorName: { $regex: q, $options: 'i' } },
        { visitorPhone: { $regex: q, $options: 'i' } },
        { adTitle: { $regex: q, $options: 'i' } },
      ];
    }

    const total = await LuckyDrawEnquiry.countDocuments(query);
    const enquiries = await LuckyDrawEnquiry.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.json({
      success: true,
      data: enquiries,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Lucky Draw enquiry status or log WhatsApp resend
// @route   PATCH /api/v1/admin/lucky-draws/enquiries/:id
// @access  Private (Admin)
const updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, whatsAppSent } = req.body;

    const enquiry = await LuckyDrawEnquiry.findOne({
      $or: [{ enquiryId: id }, { _id: id }],
    });

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    if (status) enquiry.status = status;
    if (whatsAppSent !== undefined) enquiry.whatsAppSent = Boolean(whatsAppSent);

    await enquiry.save();

    return res.json({
      success: true,
      message: 'Enquiry updated successfully',
      data: enquiry,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitLuckyDrawEnquiry,
  getLuckyDrawEnquiries,
  updateEnquiryStatus,
};
