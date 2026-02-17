require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const { hashPassword } = require('../utils/hashPassword');

const products = [
  {
    title: "Wireless Mouse",
    price: 799,
    description: "Ergonomic wireless mouse with 2.4GHz connection, 16000 DPI sensor, and long battery life",
    image: "https://picsum.photos/seed/mouse/300/200"
  },
  {
    title: "Mechanical Keyboard",
    price: 4599,
    description: "RGB backlit mechanical keyboard with blue switches, hot-swappable, and aluminum frame",
    image: "https://picsum.photos/seed/keyboard/300/200"
  },
  {
    title: "Bluetooth Earbuds",
    price: 2499,
    description: "True wireless earbuds with active noise cancellation, 30-hour playtime, and IPX5 water resistance",
    image: "https://picsum.photos/seed/earbuds/300/200"
  },
  {
    title: "Smart Watch Series 5",
    price: 12499,
    description: "AMOLED display, heart rate & SpO2 monitoring, GPS, 5ATM water resistant fitness tracker",
    image: "https://picsum.photos/seed/watch/300/200"
  },
  {
    title: "USB-C Fast Charger 65W",
    price: 1899,
    description: "GaN charger with PD 3.0, supports MacBook, iPhone, Samsung, and multiple devices simultaneously",
    image: "https://picsum.photos/seed/charger/300/200"
  },
  {
    title: "4K Webcam",
    price: 3499,
    description: "Ultra HD webcam with autofocus, dual noise-canceling mics, privacy shutter, for streaming & meetings",
    image: "https://picsum.photos/seed/webcam/300/200"
  },
  {
    title: "Portable SSD 1TB",
    price: 7999,
    description: "USB 3.2 Gen 2 external SSD, up to 1050MB/s read/write, shockproof and compact design",
    image: "https://picsum.photos/seed/ssd/300/200"
  },
  {
    title: "Gaming Mouse Pad XXL",
    price: 999,
    description: "Extended large cloth mouse pad with stitched edges, non-slip rubber base, waterproof surface",
    image: "https://picsum.photos/seed/mousepad/300/200"
  },
  {
    title: "Noise Cancelling Headphones",
    price: 6999,
    description: "Over-ear wireless headphones with 40-hour battery, deep bass, foldable design, and built-in mic",
    image: "https://picsum.photos/seed/headphones/300/200"
  },
  {
    title: "USB Hub 7-in-1",
    price: 1599,
    description: "Multiport adapter with 4K HDMI, 3 USB 3.0, SD/TF card reader, PD charging port, aluminum body",
    image: "https://picsum.photos/seed/hub/300/200"
  }
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