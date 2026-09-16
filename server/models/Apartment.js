import mongoose from 'mongoose';

const apartmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tower: { type: String, required: true, enum: ['San Stefano', 'Four Seasons'] },
  guests: { type: Number, required: true },
  sizeSqM: { type: Number, required: true },
  floor: { type: Number, required: true },
  pricePerNight: { type: Number, required: true },
  rating: { type: Number, default: 4.9 },
  images: [{ type: String, required: true }],
  description: { type: String, required: true },
  amenities: [{ type: String }],
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

// Check if the model exists first before compiling
export default mongoose.models.Apartment || mongoose.model('Apartment', apartmentSchema);