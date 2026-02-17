const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth.middleware');

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes (only logged-in users — in real app you'd add admin check)
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;