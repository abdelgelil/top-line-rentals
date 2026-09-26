import express from 'express';
import mongoose from 'mongoose';
import Apartment from '../models/Apartment.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import multer from 'multer';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Configure Multer with In-Memory Storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

/* ==========================================================================
   GET /api/apartments - Fetch all apartments
   ========================================================================== */
router.get('/', async (req, res) => {
  try {
    const { tower } = req.query;
    const filter = tower && tower !== 'All' ? { tower } : {};
    const apartments = await Apartment.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, data: apartments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ==========================================================================
   GET /api/apartments/:id - Fetch single apartment
   ========================================================================== */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid apartment ID format' });
    }

    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return res.status(404).json({ success: false, message: 'Apartment not found' });
    }

    res.json({ success: true, data: apartment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ==========================================================================
   POST /api/apartments - Create new apartment
   ========================================================================== */
router.post('/', requireAuth, requireAdmin, upload.array('images', 10), async (req, res) => {
  try {
    console.log('Incoming apartment payload:', req.body);
    console.log('Incoming images count:', req.files?.length);

    const {
      title,
      description,
      price,
      pricePerNight,
      tower,
      floor,
      bedrooms,
      bathrooms,
      guests,
      sizeSqM,
      amenities,
      existingImages,
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Apartment title is required' });
    }

    // Process file streams to Cloudinary
    let uploadedImageUrls = [];
    if (req.files && req.files.length > 0) {
      try {
        const uploadPromises = req.files.map((file) => uploadToCloudinary(file.buffer));
        uploadedImageUrls = await Promise.all(uploadPromises);
      } catch (cloudinaryError) {
        console.error('CLOUDINARY UPLOAD ERROR:', cloudinaryError);
        return res.status(500).json({
          success: false,
          message: `Cloudinary Upload Error: ${cloudinaryError.message || 'Check Cloudinary environment variables'}`,
        });
      }
    }

    // Safely parse retained images
    let parsedExisting = [];
    if (existingImages) {
      try {
        parsedExisting = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
        if (!Array.isArray(parsedExisting)) parsedExisting = [parsedExisting];
      } catch (e) {
        parsedExisting = typeof existingImages === 'string' ? [existingImages] : [];
      }
    }

    // Safely parse amenities list
    let parsedAmenities = [];
    if (amenities) {
      try {
        parsedAmenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
        if (!Array.isArray(parsedAmenities)) parsedAmenities = [];
      } catch (e) {
        parsedAmenities = typeof amenities === 'string' ? amenities.split(',').map((s) => s.trim()) : [];
      }
    }

    const newApartment = await Apartment.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      pricePerNight: Number(pricePerNight || price || 0),
      tower: tower || 'Tower 1',
      floor: floor ? Number(floor) : 1,
      bedrooms: bedrooms ? Number(bedrooms) : 1,
      bathrooms: bathrooms ? Number(bathrooms) : 1,
      guests: guests ? Number(guests) : 1,
      sizeSqM: sizeSqM ? Number(sizeSqM) : 0,
      amenities: parsedAmenities,
      images: [...parsedExisting, ...uploadedImageUrls],
    });

    return res.status(201).json({ success: true, data: newApartment });
  } catch (error) {
    console.error('SERVER ERROR IN POST /api/apartments:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/* ==========================================================================
   PUT /api/apartments/:id - Update existing apartment
   ========================================================================== */
router.put('/:id', requireAuth, requireAdmin, upload.array('images', 10), async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid apartment ID format' });
    }

    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return res.status(404).json({ success: false, message: 'Apartment not found' });
    }

    const {
      title,
      description,
      price,
      pricePerNight,
      tower,
      floor,
      bedrooms,
      bathrooms,
      guests,
      sizeSqM,
      amenities,
      existingImages,
    } = req.body;

    let newUploadedUrls = [];
    if (req.files && req.files.length > 0) {
      try {
        const uploadPromises = req.files.map((file) => uploadToCloudinary(file.buffer));
        newUploadedUrls = await Promise.all(uploadPromises);
      } catch (cloudinaryError) {
        console.error('CLOUDINARY UPLOAD ERROR:', cloudinaryError);
        return res.status(500).json({
          success: false,
          message: `Cloudinary Upload Error: ${cloudinaryError.message || 'Check Cloudinary environment variables'}`,
        });
      }
    }

    let updatedImages = [];
    if (existingImages !== undefined) {
      try {
        updatedImages = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
        if (!Array.isArray(updatedImages)) updatedImages = [updatedImages];
      } catch (e) {
        updatedImages = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
        if (!Array.isArray(updatedImages)) updatedImages = [updatedImages];
      }
    } else {
      updatedImages = apartment.images || [];
    }

    let parsedAmenities = apartment.amenities;
    if (amenities) {
      try {
        parsedAmenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
        if (!Array.isArray(parsedAmenities)) parsedAmenities = [];
      } catch (e) {
        parsedAmenities = typeof amenities === 'string' ? amenities.split(',').map((s) => s.trim()) : [];
      }
    }

    const updateFields = {
      ...(title && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...((pricePerNight || price) && { pricePerNight: Number(pricePerNight || price) }),
      ...(tower && { tower }),
      ...(floor !== undefined && { floor: Number(floor) }),
      ...(bedrooms !== undefined && { bedrooms: Number(bedrooms) }),
      ...(bathrooms !== undefined && { bathrooms: Number(bathrooms) }),
      ...(guests !== undefined && { guests: Number(guests) }),
      ...(sizeSqM !== undefined && { sizeSqM: Number(sizeSqM) }),
      amenities: parsedAmenities,
      images: [...updatedImages, ...newUploadedUrls],
    };

    const updatedApartment = await Apartment.findByIdAndUpdate(id, updateFields, { new: true });

    return res.json({ success: true, data: updatedApartment });
  } catch (error) {
    console.error('SERVER ERROR IN PUT /api/apartments:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/* ==========================================================================
   DELETE /api/apartments/:id - Delete apartment & purge Cloudinary images
   ========================================================================== */
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid apartment ID format' });
    }

    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return res.status(404).json({ success: false, message: 'Apartment not found' });
    }

    if (apartment.images && apartment.images.length > 0) {
      for (const imgUrl of apartment.images) {
        await deleteFromCloudinary(imgUrl);
      }
    }

    await Apartment.findByIdAndDelete(id);

    return res.json({ success: true, message: 'Apartment and associated images deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;