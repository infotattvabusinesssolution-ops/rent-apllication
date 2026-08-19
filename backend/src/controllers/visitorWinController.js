const VisitorWin = require('../models/VisitorWin');
const { convertToCSV } = require('../services/csvExportService');

// @desc    Get visitor win registrations
// @route   GET /api/v1/admin/visitor-win
// @access  Private (Admin)
const getRegistrations = async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};

    if (search) {
      const q = search.trim();
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { place: { $regex: q, $options: 'i' } },
        { subject: { $regex: q, $options: 'i' } },
      ];
    }

    const list = await VisitorWin.find(query).sort({ createdAt: -1 });
    const formatted = list.map((v) => {
      const obj = v.toObject();
      return { ...obj, id: obj.registrationId };
    });

    return res.json({ success: true, data: formatted, total: formatted.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete registration entry
// @route   DELETE /api/v1/admin/visitor-win/:id
// @access  Private (Admin)
const deleteRegistration = async (req, res) => {
  try {
    const item = await VisitorWin.findOneAndDelete({
      $or: [{ registrationId: req.params.id }, { _id: req.params.id }],
    });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Registration entry not found' });
    }

    return res.json({ success: true, message: 'Registration deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export visitor win contest registrations
// @route   GET /api/v1/admin/visitor-win/export
// @access  Private (Admin)
const exportVisitorWin = async (req, res) => {
  try {
    const list = await VisitorWin.find().sort({ createdAt: -1 });
    const plainList = list.map((v) => {
      const obj = v.toObject();
      return {
        ID: obj.registrationId,
        Name: obj.name,
        Age: obj.age,
        Place: obj.place,
        Phone: obj.phone,
        Subject: obj.subject,
        RegistrationDate: obj.registrationDate,
      };
    });

    const csvContent = convertToCSV(plainList);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=visitor_win_registrations.csv');
    return res.status(200).send(csvContent);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRegistrations,
  deleteRegistration,
  exportVisitorWin,
};
