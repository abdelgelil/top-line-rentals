import mongoose from 'mongoose';

const apartmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Apartment title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required'],
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    tower: {
      type: String,
      default: 'Tower 1',
      trim: true,
    },
    floor: {
      type: Number,
      default: 1,
    },
    bedrooms: {
      type: Number,
      default: 1,
      min: [0, 'Bedrooms cannot be negative'],
    },
    bathrooms: {
      type: Number,
      default: 1,
      min: [0, 'Bathrooms cannot be negative'],
    },
    guests: {
      type: Number,
      default: 1,
      min: [1, 'Must accommodate at least 1 guest'],
    },
    sizeSqM: {
      type: Number,
      default: 0,
      min: [0, 'Size cannot be negative'],
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Apartment || mongoose.model('Apartment', apartmentSchema);