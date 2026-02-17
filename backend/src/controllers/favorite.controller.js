const User = require('../models/user.model');

exports.addFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.favorites.includes(req.params.productId)) {
      user.favorites.push(req.params.productId);
      await user.save();
    }

    res.json({ message: 'Added to favorites' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.favorites = user.favorites.filter(id => id.toString() !== req.params.productId);
    await user.save();

    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('favorites');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};