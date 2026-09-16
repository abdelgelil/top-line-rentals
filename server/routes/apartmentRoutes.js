import express from 'express';
import Apartment from '../models/Apartment.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/apartments (Public)
router.get('/', async (req, res) => {
  try {
    const { tower } = req.query;
    const filter = tower && tower !== 'All' ? { tower } : {};
    const apartments = await Apartment.find(filter);
    res.status(200).json({ success: true, data: apartments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/apartments/:id (Public)
router.get('/:id', async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) return res.status(404).json({ success: false, message: 'Apartment not found' });
    res.status(200).json({ success: true, data: apartment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/apartments (Admin Only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const newApartment = await Apartment.create(req.body);
    res.status(201).json({ success: true, data: newApartment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;