const SystemSettings = require('../models/SystemSettings');

// Default fallback settings
const DEFAULT_SETTINGS = {
  autoApproveVerified: false,
  mandatoryImages: true,
  subscriptionPrice: 100,
  subscriptionDays: 10,
  whatsAppDispatchEnabled: true,
  emailNotificationsEnabled: true,
  dealerName: 'Hoskote Realties',
  dealerPhone: '+91 98765 43210',
  dealerWhatsapp: '+91 98765 43210',
  paymentQrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=rentapp@upi%26pn=Home%20And%20Scooter%26am=100',
  upiId: 'rentapp@upi',
};

// @desc    Get system settings (Admin)
// @route   GET /api/v1/admin/settings
// @access  Private (Admin)
const getSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = await SystemSettings.create(DEFAULT_SETTINGS);
    }
    return res.json({ success: true, settings });
  } catch (error) {
    return res.json({ success: true, settings: DEFAULT_SETTINGS });
  }
};

// @desc    Get public system settings for user side
// @route   GET /api/v1/user/settings
// @access  Public
const getPublicSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = DEFAULT_SETTINGS;
    }
    return res.json({
      success: true,
      dealerName: settings.dealerName || 'Hoskote Realties',
      dealerPhone: settings.dealerPhone || '+91 98765 43210',
      dealerWhatsapp: settings.dealerWhatsapp || '+91 98765 43210',
      paymentQrCodeUrl: settings.paymentQrCodeUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=rentapp@upi%26pn=Home%20And%20Scooter%26am=100',
      upiId: settings.upiId || 'rentapp@upi',
      subscriptionPrice: settings.subscriptionPrice || 100,
      settings,
    });
  } catch (error) {
    return res.json({
      success: true,
      dealerName: 'Hoskote Realties',
      dealerPhone: '+91 98765 43210',
      dealerWhatsapp: '+91 98765 43210',
      paymentQrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=rentapp@upi%26pn=Home%20And%20Scooter%26am=100',
      upiId: 'rentapp@upi',
      subscriptionPrice: 100,
    });
  }
};

// @desc    Update system settings
// @route   PUT /api/v1/admin/settings
// @access  Private (Admin)
const updateSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings(DEFAULT_SETTINGS);
    }

    const {
      autoApproveVerified,
      mandatoryImages,
      subscriptionPrice,
      subscriptionDays,
      whatsAppDispatchEnabled,
      emailNotificationsEnabled,
      dealerName,
      dealerPhone,
      dealerWhatsapp,
      paymentQrCodeUrl,
      upiId,
    } = req.body;

    if (autoApproveVerified !== undefined) settings.autoApproveVerified = autoApproveVerified;
    if (mandatoryImages !== undefined) settings.mandatoryImages = mandatoryImages;
    if (subscriptionPrice !== undefined) settings.subscriptionPrice = subscriptionPrice;
    if (subscriptionDays !== undefined) settings.subscriptionDays = subscriptionDays;
    if (whatsAppDispatchEnabled !== undefined) settings.whatsAppDispatchEnabled = whatsAppDispatchEnabled;
    if (emailNotificationsEnabled !== undefined) settings.emailNotificationsEnabled = emailNotificationsEnabled;
    if (dealerName !== undefined) settings.dealerName = dealerName;
    if (dealerPhone !== undefined) settings.dealerPhone = dealerPhone;
    if (dealerWhatsapp !== undefined) settings.dealerWhatsapp = dealerWhatsapp;
    if (paymentQrCodeUrl !== undefined) settings.paymentQrCodeUrl = paymentQrCodeUrl;
    if (upiId !== undefined) settings.upiId = upiId;

    await settings.save();

    await settings.save();

    return res.json({ success: true, settings, message: 'Admin Portal & Dealer settings saved successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload Payment QR Code image directly to Cloudinary CDN
// @route   POST /api/v1/admin/settings/upload-qr
// @access  Private (Admin)
const uploadQrCode = async (req, res) => {
  try {
    const { uploadToCloudinary } = require('../utils/cloudinary');
    let qrUrl = null;

    if (req.file) {
      qrUrl = await uploadToCloudinary(req.file, 'homescooter_qr_codes');
    } else if (req.body.image && typeof req.body.image === 'string') {
      qrUrl = await uploadToCloudinary(req.body.image, 'homescooter_qr_codes');
    }

    if (!qrUrl) {
      return res.status(400).json({ success: false, message: 'No valid image provided' });
    }

    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings(DEFAULT_SETTINGS);
    }
    settings.paymentQrCodeUrl = qrUrl;
    await settings.save();

    return res.json({
      success: true,
      message: 'Payment QR Code uploaded to Cloudinary CDN successfully!',
      paymentQrCodeUrl: qrUrl,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSettings,
  getPublicSettings,
  updateSettings,
  uploadQrCode,
};
