import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: '' },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address'],
  },
  phone: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    match: [/^\+[1-9]\d{7,14}$/, 'Phone must be in E.164 format'],
  },
  emailVerified: { type: Boolean, default: false },
  passwordHash: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ['admin', 'user', 'client'],
    default: 'user'
  }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
