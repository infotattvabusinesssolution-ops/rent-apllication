const Category = require('../models/Category');

// Default Seed Categories
const DEFAULT_CATEGORIES = [
  { 
    name: 'Properties', 
    parent: 'None (Main Category)', 
    subCategories: ['Rent: House & Apartments', 'Rent: Shop & Offices', 'Sale: House & Apartments', 'Sale: Shop & Offices', 'Lands & Plots', 'PG & Guest House'],
    description: 'Rent & Sale Houses, Shops, Lands & PGs', 
    icon: '🏢', 
    schemaType: 'PROPERTIES' 
  },
  { name: 'Rent: House & Apartments', parent: 'Properties', description: 'Rental houses, flats & apartments', icon: '🏠', schemaType: 'PROPERTIES_HOUSES' },
  { name: 'Rent: Shop & Offices', parent: 'Properties', description: 'Commercial shops & offices for rent', icon: '🏬', schemaType: 'PROPERTIES_SHOPS' },
  { name: 'Sale: House & Apartments', parent: 'Properties', description: 'Houses, flats & villas for purchase', icon: '🏡', schemaType: 'PROPERTIES_HOUSES' },
  { name: 'Sale: Shop & Offices', parent: 'Properties', description: 'Commercial shops & offices for sale', icon: '🏢', schemaType: 'PROPERTIES_SHOPS' },
  { name: 'Lands & Plots', parent: 'Properties', description: 'Plots, agricultural & commercial land', icon: '🗺️', schemaType: 'PROPERTIES_LANDS' },
  { name: 'PG & Guest House', parent: 'Properties', description: 'Paying guest accommodations & hostels', icon: '🛏️', schemaType: 'PROPERTIES_HOUSES' },
  
  { 
    name: 'Bikes', 
    parent: 'None (Main Category)', 
    subCategories: ['Motorcycles', 'Scooters', 'Spare Parts', 'Bicycles'],
    description: 'Motorcycles, Scooters, Bicycles & Parts', 
    icon: '🏍️', 
    schemaType: 'BIKES' 
  },
  { name: 'Motorcycles', parent: 'Bikes', description: 'Bikes, gear & heavy motorcycles', icon: '🏍️', schemaType: 'BIKES_VEHICLE' },
  { name: 'Scooters', parent: 'Bikes', description: 'Scoooters & gearless two-wheelers', icon: '🛵', schemaType: 'BIKES_VEHICLE' },
  { name: 'Spare Parts', parent: 'Bikes', description: 'Bike spare parts & accessories', icon: '⚙️', schemaType: 'BIKES_PARTS' },
  { name: 'Bicycles', parent: 'Bikes', description: 'Bicycles, cycles & sports bikes', icon: '🚲', schemaType: 'BIKES_PARTS' },

  { 
    name: 'Jobs', 
    parent: 'None (Main Category)', 
    subCategories: ['BPO & Telecaller', 'Data Entry & Back Office', 'Sales & Marketing', 'Driver', 'Delivery & Collection', 'IT & Software'],
    description: 'Full-time, Part-time, Telecaller & Back Office Jobs', 
    icon: '💼', 
    schemaType: 'JOBS' 
  },
  { name: 'BPO & Telecaller', parent: 'Jobs', description: 'Customer support, telecalling & inbound/outbound', icon: '🎧', schemaType: 'JOBS' },
  { name: 'Data Entry & Back Office', parent: 'Jobs', description: 'Data entry operator, computer operator & back office', icon: '💻', schemaType: 'JOBS' },
  { name: 'Sales & Marketing', parent: 'Jobs', description: 'Field sales, executive & digital marketing', icon: '📈', schemaType: 'JOBS' },
  { name: 'Driver', parent: 'Jobs', description: 'Car drivers, commercial & cab drivers', icon: '🚗', schemaType: 'JOBS' },
  { name: 'Delivery & Collection', parent: 'Jobs', description: 'Delivery boys, logistics & field operations', icon: '🛵', schemaType: 'JOBS' },
  { name: 'IT & Software', parent: 'Jobs', description: 'Developers, IT support & web designers', icon: '💻', schemaType: 'JOBS' },

  { 
    name: 'Services', 
    parent: 'None (Main Category)', 
    subCategories: ['Electronics Repair & Services', 'Home Renovation & Repair', 'Cleaning & Pest Control', 'Packers & Movers', 'Legal & Documentation'],
    description: 'Electronics, Maintenance, Repair & Home Services', 
    icon: '🛠️', 
    schemaType: 'SERVICES' 
  },
  { name: 'Electronics Repair & Services', parent: 'Services', description: 'AC, TV, Laptops, Appliances & Water Purifier Repair', icon: '💻', schemaType: 'SERVICES' },
  { name: 'Home Renovation & Repair', parent: 'Services', description: 'Electricians, Plumbers, Painters & Carpenters', icon: '🛠️', schemaType: 'SERVICES' },
  { name: 'Cleaning & Pest Control', parent: 'Services', description: 'Deep house cleaning, sofa, carpet & pest control', icon: '🧹', schemaType: 'SERVICES' },
  { name: 'Packers & Movers', parent: 'Services', description: 'Household shifting, vehicle transport & logistics', icon: '📦', schemaType: 'SERVICES' },
  { name: 'Legal & Documentation', parent: 'Services', description: 'Property verification, contracts & legal assistance', icon: '📄', schemaType: 'SERVICES' },

  { name: 'Layout Sites', parent: 'None (Main Category)', subCategories: [], description: 'Plots, Land & Gated Sites', icon: '🗺️', schemaType: 'PROPERTIES_LANDS' },
  { name: 'Electric Scooters', parent: 'None (Main Category)', subCategories: [], description: 'Daily & Monthly EV Rentals', icon: '🛵', schemaType: 'BIKES_VEHICLE' },
  { name: 'Others', parent: 'None (Main Category)', description: 'Miscellaneous & Partner Ads', icon: '📦', schemaType: 'DEFAULT' },
];

// @desc    Get all categories
// @route   GET /api/v1/admin/categories or GET /api/v1/user/categories
const getCategories = async (req, res) => {
  try {
    let categories = await Category.find().sort({ order: 1, createdAt: 1 });

    // Seed default categories if empty
    if (categories.length === 0) {
      categories = await Category.insertMany(DEFAULT_CATEGORIES);
    }

    return res.json({
      success: true,
      data: categories.map((c) => ({
        id: c._id,
        name: c.name,
        parent: c.parent,
        subCategories: c.subCategories || [],
        description: c.description,
        icon: c.icon,
        color: c.color,
        schemaType: c.schemaType || 'DEFAULT',
        isActive: c.isActive,
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new category
// @route   POST /api/v1/admin/categories
const createCategory = async (req, res) => {
  try {
    const { name, parent, subCategories, description, icon, color, schemaType, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category name already exists' });
    }

    const category = await Category.create({
      name,
      parent: parent || 'None (Main Category)',
      subCategories: Array.isArray(subCategories) ? subCategories : [],
      description: description || '',
      icon: icon || '📦',
      color: color || 'bg-blue-100 text-blue-800 border-blue-200',
      schemaType: schemaType || 'DEFAULT',
      isActive: isActive !== undefined ? isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        id: category._id,
        _id: category._id,
        name: category.name,
        parent: category.parent,
        subCategories: category.subCategories,
        description: category.description,
        icon: category.icon,
        color: category.color,
        schemaType: category.schemaType,
        isActive: category.isActive,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/v1/admin/categories/:id
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parent, subCategories, description, icon, color, schemaType, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (name) category.name = name;
    if (parent !== undefined) category.parent = parent;
    if (subCategories !== undefined && Array.isArray(subCategories)) category.subCategories = subCategories;
    if (description !== undefined) category.description = description;
    if (icon !== undefined) category.icon = icon;
    if (color !== undefined) category.color = color;
    if (schemaType !== undefined) category.schemaType = schemaType;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    return res.json({
      success: true,
      message: 'Category updated successfully',
      data: {
        id: category._id,
        _id: category._id,
        name: category.name,
        parent: category.parent,
        description: category.description,
        icon: category.icon,
        color: category.color,
        schemaType: category.schemaType,
        isActive: category.isActive,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle category active status
// @route   PATCH /api/v1/admin/categories/:id/toggle
const toggleCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    category.isActive = !category.isActive;
    await category.save();

    return res.json({
      success: true,
      message: `Category ${category.isActive ? 'activated' : 'disabled'}`,
      data: {
        id: category._id,
        _id: category._id,
        name: category.name,
        parent: category.parent,
        description: category.description,
        icon: category.icon,
        color: category.color,
        schemaType: category.schemaType,
        isActive: category.isActive,
      },
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/v1/admin/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    return res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory,
};
