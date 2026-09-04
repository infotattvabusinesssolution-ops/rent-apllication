const CATEGORIES = {
  LAYOUT_SITES: 'Layout Sites',
  RENT_HOUSE_APARTMENTS: 'Rent: House & Apartments',
  RENT_SHOP_OFFICES: 'Rent: Shop & Offices',
  SALE_HOUSE_APARTMENTS: 'Sale: House & Apartments',
  SALE_SHOP_OFFICES: 'Sale: Shop & Offices',
  PG_GUEST_HOUSE: 'PG & Guest House',
  PROPERTIES: 'Properties',
  ELECTRIC_SCOOTERS: 'Electric Scooters',
  SERVICES: 'Services',
  OTHERS: 'Others',
};


const AD_STATUS = {
  PENDING: 'PENDING',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  UNPUBLISHED: 'UNPUBLISHED',
};


const BANNER_STATUS = {
  PENDING: 'Pending',
  ACTIVE: 'Active',
  REJECTED: 'Rejected',
  EXPIRED: 'Expired',
};

const SUBSCRIPTION_STATUS = {
  PENDING: 'Pending',
  ACTIVATED: 'Activated',
  REJECTED: 'Rejected',
};

const LEAD_STATUS = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  CONVERTED: 'Converted',
  CLOSED: 'Closed',
};

const REPORT_STATUS = {
  PENDING: 'Pending',
  UNDER_REVIEW: 'Under Review',
  DISMISSED: 'Dismissed',
  TAKEN_DOWN: 'Taken Down',
};

const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  MODERATOR: 'MODERATOR',
  SUPPORT: 'SUPPORT',
};

const BANNER_LOCATIONS = [
  'Home Top Carousel',
  'Property Feed Banner',
  'Scooter Section',
  'Services Section',
  'Others',
];

module.exports = {
  CATEGORIES,
  AD_STATUS,
  BANNER_STATUS,
  BANNER_LOCATIONS,
  SUBSCRIPTION_STATUS,
  LEAD_STATUS,
  REPORT_STATUS,
  USER_ROLES,
};
