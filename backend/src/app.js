const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const favoriteRoutes = require('./routes/favorite.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/favorites', favoriteRoutes);

app.get('/', (req, res) => res.send('Reputation Roots API'));

module.exports = app;