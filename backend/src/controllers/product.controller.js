const Product = require('../models/product.model');
const mongoose = require('mongoose');

// CREATE - only authenticated users (admin-like for this assignment)
exports.createProduct = async (req, res) => {
  try {
    const { title, price, description, image } = req.body;

    if (!title || !price || !description) {
      return res.status(400).json({ message: 'Title, price, and description are required' });
    }

    const product = await Product.create({
      title,
      price: Number(price),
      description,
      image: image || 'https://picsum.photos/300/200?random=999', // fallback
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to create product' });
  }
};

// READ ALL - with search + pagination (already good, small cleanup)
exports.getProducts = async (req, res) => {
  try {
    const { search, page = 1, limit = 12 } = req.query;
    const query = search ? { title: { $regex: search.trim(), $options: 'i' } } : {};

    const products = await Product.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const count = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalProducts: count,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE
exports.getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // only update fields that are sent
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to update product' });
  }
};

// DELETE
exports.deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};  