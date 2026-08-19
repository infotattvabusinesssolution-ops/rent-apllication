const Advertisement = require('../models/Advertisement');
const Subscription = require('../models/Subscription');
const Lead = require('../models/Lead');
const Report = require('../models/Report');

// @desc    Get dashboard metrics & statistics
// @route   GET /api/v1/admin/analytics/dashboard
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
  try {
    // Basic Counts
    const totalPublishedAds = await Advertisement.countDocuments({ status: 'APPROVED' });
    const pendingApprovals = await Advertisement.countDocuments({ status: 'PENDING' });
    const rejectedAds = await Advertisement.countDocuments({ status: 'REJECTED' });
    const unpublishedAds = await Advertisement.countDocuments({ status: 'UNPUBLISHED' });

    // Active Subscribers & Revenue
    const activeSubscribers = await Subscription.countDocuments({ status: 'Activated' });
    const subscriptionRevenueResult = await Subscription.aggregate([
      { $match: { status: 'Activated' } },
      { $group: { _id: null, total: { $sum: '$amountPaid' } } },
    ]);
    const subscriptionRevenue = subscriptionRevenueResult.length > 0
      ? subscriptionRevenueResult[0].total
      : activeSubscribers * 100;

    // Leads & Reports
    const callbackLeads = await Lead.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'Pending' });

    // Category Counts
    const layoutSites = await Advertisement.countDocuments({ category: 'Layout Sites', status: 'APPROVED' });
    const properties = await Advertisement.countDocuments({ category: 'Properties', status: 'APPROVED' });
    const electricScooters = await Advertisement.countDocuments({ category: 'Electric Scooters', status: 'APPROVED' });
    const services = await Advertisement.countDocuments({ category: 'Services', status: 'APPROVED' });
    const others = await Advertisement.countDocuments({ category: 'Others', status: 'APPROVED' });

    // Category Distribution for Charts
    const categoryDistribution = [
      { name: 'Layout Sites', value: layoutSites, color: '#2563EB' },
      { name: 'Properties', value: properties, color: '#0F766E' },
      { name: 'Electric Scooters', value: electricScooters, color: '#16A34A' },
      { name: 'Services', value: services, color: '#EAB308' },
      { name: 'Others', value: others, color: '#64748B' },
    ];

    // Status Distribution for Charts
    const adStatusDistribution = [
      { name: 'Approved', value: totalPublishedAds, color: '#16A34A' },
      { name: 'Pending', value: pendingApprovals, color: '#EAB308' },
      { name: 'Rejected', value: rejectedAds, color: '#EF4444' },
      { name: 'Unpublished', value: unpublishedAds, color: '#94A3B8' },
    ];

    // Location Aggregation
    const locationAgg = await Advertisement.aggregate([
      { $match: { location: { $exists: true, $ne: '' } } },
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    const topLocations = locationAgg.map((item) => ({
      location: item._id,
      count: item.count,
    }));

    return res.json({
      success: true,
      totalPublishedAds,
      publishedAdsTrend: '+0%',
      adsByCategory: {
        layoutSites,
        properties,
        electricScooters,
        services,
        others,
      },
      pendingApprovals,
      pendingApprovalsToday: `${pendingApprovals} pending`,
      activeSubscribers,
      subscriptionRevenue,
      callbackLeads,
      callbackLeadsTrend: '+0%',
      pendingReports,
      monthlyPostings: [],
      categoryDistribution,
      adStatusDistribution,
      viewsAnalytics: [],
      topLocations,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get detailed analytics
// @route   GET /api/v1/admin/analytics
// @access  Private (Admin)
const getAnalytics = async (req, res) => {
  try {
    const range = req.query.range || '30d';

    const topAdsDocs = await Advertisement.find({ status: 'APPROVED' })
      .sort({ viewsCount: -1 })
      .limit(5);

    const topAds = topAdsDocs.map((ad) => ({
      title: ad.title,
      views: String(ad.viewsCount || 0),
      inquiries: ad.inquiriesCount || 0,
      category: ad.category,
    }));

    return res.json({
      success: true,
      range,
      topAds,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAnalytics,
};
