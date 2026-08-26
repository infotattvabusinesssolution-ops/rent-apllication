export const CATEGORIES = {
  LAYOUT_SITES: 'Layout Sites',
  RENT_HOUSE_APARTMENTS: 'Rent: House & Apartments',
  RENT_SHOP_OFFICES: 'Rent: Shop & Offices',
  SALE_HOUSE_APARTMENTS: 'Sale: House & Apartments',
  SALE_SHOP_OFFICES: 'Sale: Shop & Offices',
  LANDS_PLOTS: 'Lands & Plots',
  PG_GUEST_HOUSE: 'PG & Guest House',
  PROPERTIES: 'Properties',
  BIKES: 'Bikes',
  MOTORCYCLES: 'Motorcycles',
  SCOOTERS: 'Scooters',
  SPARE_PARTS: 'Spare Parts',
  BICYCLES: 'Bicycles',
  JOBS: 'Jobs',
  BPO_TELECALLER: 'BPO & Telecaller',
  DATA_ENTRY: 'Data Entry & Back Office',
  SALES_MARKETING: 'Sales & Marketing',
  DRIVER: 'Driver',
  DELIVERY: 'Delivery & Collection',
  IT_SOFTWARE: 'IT & Software',
  ELECTRIC_SCOOTERS: 'Electric Scooters',
  SERVICES: 'Services',
  ELECTRONICS_REPAIR: 'Electronics Repair & Services',
  HOME_RENOVATION: 'Home Renovation & Repair',
  CLEANING_PEST: 'Cleaning & Pest Control',
  PACKERS_MOVERS: 'Packers & Movers',
  LEGAL_SERVICES: 'Legal & Documentation',
  OTHERS: 'Others',
};

export const CATEGORY_LIST = [
  CATEGORIES.PROPERTIES,
  CATEGORIES.RENT_HOUSE_APARTMENTS,
  CATEGORIES.RENT_SHOP_OFFICES,
  CATEGORIES.SALE_HOUSE_APARTMENTS,
  CATEGORIES.SALE_SHOP_OFFICES,
  CATEGORIES.LANDS_PLOTS,
  CATEGORIES.PG_GUEST_HOUSE,
  CATEGORIES.BIKES,
  CATEGORIES.MOTORCYCLES,
  CATEGORIES.SCOOTERS,
  CATEGORIES.SPARE_PARTS,
  CATEGORIES.BICYCLES,
  CATEGORIES.JOBS,
  CATEGORIES.BPO_TELECALLER,
  CATEGORIES.DATA_ENTRY,
  CATEGORIES.SALES_MARKETING,
  CATEGORIES.DRIVER,
  CATEGORIES.DELIVERY,
  CATEGORIES.IT_SOFTWARE,
  CATEGORIES.LAYOUT_SITES,
  CATEGORIES.ELECTRIC_SCOOTERS,
  CATEGORIES.SERVICES,
  CATEGORIES.OTHERS,
];

export const PROPERTY_SUBCATEGORIES = {
  RENT_HOUSE_APARTMENTS: 'Rent: House & Apartments',
  RENT_SHOP_OFFICES: 'Rent: Shop & Offices',
  SALE_HOUSE_APARTMENTS: 'Sale: House & Apartments',
  SALE_SHOP_OFFICES: 'Sale: Shop & Offices',
  LANDS_PLOTS: 'Lands & Plots',
  PG_GUEST_HOUSE: 'PG & Guest House',
};

export const PROPERTY_SUBTYPES = [
  CATEGORIES.RENT_HOUSE_APARTMENTS,
  CATEGORIES.RENT_SHOP_OFFICES,
  CATEGORIES.SALE_HOUSE_APARTMENTS,
  CATEGORIES.SALE_SHOP_OFFICES,
  CATEGORIES.LANDS_PLOTS,
  CATEGORIES.PG_GUEST_HOUSE,
];

export const BIKE_SUBCATEGORIES = {
  MOTORCYCLES: 'Motorcycles',
  SCOOTERS: 'Scooters',
  SPARE_PARTS: 'Spare Parts',
  BICYCLES: 'Bicycles',
};

export const BIKE_SUBTYPES = [
  CATEGORIES.MOTORCYCLES,
  CATEGORIES.SCOOTERS,
  CATEGORIES.SPARE_PARTS,
  CATEGORIES.BICYCLES,
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
