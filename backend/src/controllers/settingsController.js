const SystemSettings = require('../models/SystemSettings');

// Default fallback settings
const DEFAULT_SETTINGS = {
  autoApproveVerified: false,
  mandatoryImages: true,
  subscriptionPrice: 100,
  subscriptionDays: 10,
  whatsAppDispatchEnabled: true,
  emailNotificationsEnabled: true,
};

// @desc    Get system settings
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
    } = req.body;

    if (autoApproveVerified !== undefined) settings.autoApproveVerified = autoApproveVerified;
    if (mandatoryImages !== undefined) settings.mandatoryImages = mandatoryImages;
    if (subscriptionPrice !== undefined) settings.subscriptionPrice = subscriptionPrice;
    if (subscriptionDays !== undefined) settings.subscriptionDays = subscriptionDays;
    if (whatsAppDispatchEnabled !== undefined) settings.whatsAppDispatchEnabled = whatsAppDispatchEnabled;
    if (emailNotificationsEnabled !== undefined) settings.emailNotificationsEnabled = emailNotificationsEnabled;

    await settings.save();

    return res.json({ success: true, settings, message: 'Admin Portal settings saved successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
