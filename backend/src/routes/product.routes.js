const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct } = require('../controllers/product.controller');
const protect = require('../middlewares/auth.middleware');

router.get('/', getProducts);
router.get('/:id', getProductById);

// Optional — protect if you want only logged-in users to create
router.post('/', protect, createProduct);

module.exports = router;