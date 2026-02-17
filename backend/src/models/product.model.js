const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String } // URL or path — for simplicity we store string
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);