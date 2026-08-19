export const CATEGORIES = {
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

export const CATEGORY_LIST = [
  CATEGORIES.LAYOUT_SITES,
  CATEGORIES.RENT_HOUSE_APARTMENTS,
  CATEGORIES.RENT_SHOP_OFFICES,
  CATEGORIES.SALE_HOUSE_APARTMENTS,
  CATEGORIES.SALE_SHOP_OFFICES,
  CATEGORIES.PG_GUEST_HOUSE,
  CATEGORIES.PROPERTIES,
  CATEGORIES.ELECTRIC_SCOOTERS,
  CATEGORIES.SERVICES,
  CATEGORIES.OTHERS,
];

export const PROPERTY_SUBCATEGORIES = {
  RENT_HOUSE_APARTMENTS: 'Rent: House & Apartments',
  RENT_SHOP_OFFICES: 'Rent: Shop & Offices',
  SALE_HOUSE_APARTMENTS: 'Sale: House & Apartments',
  SALE_SHOP_OFFICES: 'Sale: Shop & Offices',
  PG_GUEST_HOUSE: 'PG & Guest House',
};

export const PROPERTY_SUBTYPES = [
  CATEGORIES.RENT_HOUSE_APARTMENTS,
  CATEGORIES.RENT_SHOP_OFFICES,
  CATEGORIES.SALE_HOUSE_APARTMENTS,
  CATEGORIES.SALE_SHOP_OFFICES,
  CATEGORIES.PG_GUEST_HOUSE,
];




export const AD_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  UNPUBLISHED: 'UNPUBLISHED',
};

export const AD_STATUS_BADGES = {
  PENDING: { label: 'Pending', variant: 'warning' },
  APPROVED: { label: 'Approved', variant: 'success' },
  REJECTED: { label: 'Rejected', variant: 'danger' },
  UNPUBLISHED: { label: 'Unpublished', variant: 'neutral' },
};

export const BANNER_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  ACTIVE: 'Active',
  REJECTED: 'Rejected',
  EXPIRED: 'Expired',
};

export const BANNER_STATUS_BADGES = {
  Pending: { label: 'Pending Approval', variant: 'warning' },
  Approved: { label: 'Approved', variant: 'success' },
  Active: { label: 'Active', variant: 'success' },
  Rejected: { label: 'Rejected', variant: 'danger' },
  Expired: { label: 'Expired', variant: 'neutral' },
};

export const REJECTION_REASONS = [
  'Incomplete Specifications',
  'Misleading Price',
  'Low Quality Images',
  'Duplicate Listing',
  'Incorrect Category',
  'Prohibited Content',
  'Fraudulent Information',
  'Other',
];

export const REPORT_REASONS = [
  'Inaccurate Information',
  'Spam',
  'Already Sold',
  'Fraud',
  'Scam',
  'Prohibited Content',
  'Other',
];

export const BANNER_LOCATIONS = [
  'Home Top Carousel',
  'Property Feed Banner',
  'Scooter Section',
  'Services Section',
  'Others',
];

export const LEAD_STATUS = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  CONVERTED: 'Converted',
  CLOSED: 'Closed',
};

export const SUBSCRIPTION_STATUS = {
  PENDING: 'Pending',
  ACTIVATED: 'Activated',
  REJECTED: 'Rejected',
  EXPIRED: 'Expired',
};
