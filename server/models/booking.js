import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    apartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Apartment',
      required: [true, 'Apartment reference is required'],
    },
    user: {
      type: String,
      default: null,
    },
    guestName: {
      type: String,
      required: [true, 'Guest name is required'],
      trim: true,
    },
    guestEmail: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    guestPhone: {
      type: String,
      default: '',
      trim: true,
    },
    checkIn: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Check-out date is required'],
    },
    guests: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'canceled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Support availability checks, user history, recent booking lists, and status metrics.
bookingSchema.index({ apartment: 1, status: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ guestEmail: 1, status: 1 });

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;
