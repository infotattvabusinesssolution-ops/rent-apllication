const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory,
} = require('../../../../controllers/categoryController');

router.get('/', getCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.patch('/:id/toggle', toggleCategoryStatus);
router.delete('/:id', deleteCategory);

module.exports = router;
