import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment', required: true, index: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  user: { type: String, required: true, index: true },
  guestName: { type: String, required: true, trim: true, maxlength: 100 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true, minlength: 5, maxlength: 1000 },
  approved: { type: Boolean, default: false, index: true },
}, { timestamps: true });

reviewSchema.index({ apartment: 1, approved: 1, createdAt: -1 });

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);
