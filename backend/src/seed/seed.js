require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const { hashPassword } = require('../utils/hashPassword');

const products = [
  { title: "Wireless Mouse", price: 799, description: "Ergonomic mouse", image: "https://picsum.photos/300/200?random=1" },
  // add 9 more similar...
  { title: "Mechanical Keyboard", price: 4599, description: "RGB backlit", image: "https://picsum.photos/300/200?random=10" },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteMany({});
  await Product.deleteMany({});

  const hashed = await hashPassword('123456');

  await User.create([
    { name: "Test User", email: "test@example.com", password: hashed },
    { name: "John Doe", email: "john@example.com", password: hashed }
  ]);

  await Product.insertMany(products);

  console.log('Database seeded!');
  mongoose.connection.close();
};

seed().catch(console.error);