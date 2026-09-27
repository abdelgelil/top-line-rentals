import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Apartment from '../models/Apartment.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('favorites').select('favorites');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    return res.json({ success: true, data: user.favorites || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/toggle', async (req, res) => {
  try {
    const { propertyId } = req.body || {};
    if (typeof propertyId !== 'string' || !mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ success: false, message: 'A valid propertyId is required.' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    const id = new mongoose.Types.ObjectId(propertyId);
    const apartmentExists = await Apartment.exists({ _id: id });
    if (!apartmentExists) return res.status(404).json({ success: false, message: 'Apartment not found.' });
    const isFavorite = user.favorites.some((favoriteId) => favoriteId.equals(id));
    if (isFavorite) user.favorites.pull(id);
    else user.favorites.addToSet(id);
    await user.save();

    return res.json({ success: true, data: { favorites: user.favorites.map(String), isFavorite: !isFavorite } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
