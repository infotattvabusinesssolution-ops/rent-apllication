const Lead = require('../models/Lead');
const { convertToCSV } = require('../services/csvExportService');

// @desc    Get callback leads
// @route   GET /api/v1/admin/leads
// @access  Private (Admin)
const getLeads = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (search) {
      const q = search.trim();
      query.$or = [
        { adTitle: { $regex: q, $options: 'i' } },
        { buyerName: { $regex: q, $options: 'i' } },
        { buyerPhone: { $regex: q, $options: 'i' } },
        { posterName: { $regex: q, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    const formatted = leads.map((l) => {
      const obj = l.toObject();
      return { ...obj, id: obj.leadId };
    });

    return res.json({ success: true, data: formatted, total: formatted.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update lead status
// @route   PATCH /api/v1/admin/leads/:id
// @access  Private (Admin)
const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findOne({ $or: [{ leadId: req.params.id }, { _id: req.params.id }] });

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead record not found' });
    }

    lead.status = status;
    await lead.save();

    return res.json({ success: true, message: `Lead marked as ${status}` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export callback leads to CSV
// @route   GET /api/v1/admin/leads/export
// @access  Private (Admin)
const exportLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    const plainLeads = leads.map((l) => {
      const obj = l.toObject();
      return {
        ID: obj.leadId,
        AdTitle: obj.adTitle,
        PosterName: obj.posterName,
        PosterPhone: obj.posterPhone,
        BuyerName: obj.buyerName,
        BuyerPhone: obj.buyerPhone,
        Location: obj.location,
        Status: obj.status,
        Timestamp: obj.timestamp,
      };
    });

    const csvContent = convertToCSV(plainLeads);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=callback_leads.csv');
    return res.status(200).send(csvContent);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getLeads,
  updateLeadStatus,
  exportLeads,
};
