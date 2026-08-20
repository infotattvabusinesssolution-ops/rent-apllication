const Category = require('../models/Category');

// Default Seed Categories
const DEFAULT_CATEGORIES = [
  { name: 'Layout Sites', parent: 'None (Main Category)', description: 'Plots, Land & Gated Sites', icon: '🗺️' },
  { name: 'Rent: House & Apartments', parent: 'Properties', description: 'Rental houses, flats & apartments', icon: '🏠' },
  { name: 'Rent: Shop & Offices', parent: 'Properties', description: 'Commercial shops & offices for rent', icon: '🏬' },
  { name: 'Sale: House & Apartments', parent: 'Properties', description: 'Houses, flats & villas for purchase', icon: '🏡' },
  { name: 'Sale: Shop & Offices', parent: 'Properties', description: 'Commercial shops & offices for sale', icon: '🏢' },
  { name: 'PG & Guest House', parent: 'Properties', description: 'Paying guest accommodations', icon: '🛏️' },
  { name: 'Properties', parent: 'None (Main Category)', description: 'Rent & Sale Houses, Shops & PGs', icon: '🏢' },
  { name: 'Electric Scooters', parent: 'None (Main Category)', description: 'Daily & Monthly EV Rentals', icon: '🛵' },
  { name: 'Services', parent: 'None (Main Category)', description: 'Interiors, Maintenance & Repairs', icon: '🛠️' },
  { name: 'Others', parent: 'None (Main Category)', description: 'Miscellaneous & Partner Ads', icon: '📦' },
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
        description: c.description,
        icon: c.icon,
        color: c.color,
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
    const { name, parent, description, icon, color, isActive } = req.body;

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
      description: description || '',
      icon: icon || '📦',
      color: color || 'bg-blue-100 text-blue-800 border-blue-200',
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
        description: category.description,
        icon: category.icon,
        color: category.color,
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
    const { name, parent, description, icon, color, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (name) category.name = name;
    if (parent !== undefined) category.parent = parent;
    if (description !== undefined) category.description = description;
    if (icon !== undefined) category.icon = icon;
    if (color !== undefined) category.color = color;
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
