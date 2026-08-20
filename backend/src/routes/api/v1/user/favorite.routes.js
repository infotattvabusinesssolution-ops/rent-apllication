const express = require('express');
const router = express.Router();
const { toggleFavorite, getUserFavorites } = require('../../../../controllers/user/favoriteController');

router.get('/', getUserFavorites);
router.post('/toggle', toggleFavorite);

module.exports = router;
