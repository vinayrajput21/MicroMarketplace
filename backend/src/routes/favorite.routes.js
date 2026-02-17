const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth.middleware');
const { addFavorite, removeFavorite, getFavorites } = require('../controllers/favorite.controller');

router.post('/:productId', protect, addFavorite);
router.delete('/:productId', protect, removeFavorite);
router.get('/', protect, getFavorites);

module.exports = router;