import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, maxlength: 100 },
  // Kept as a compatibility alias for existing booking and admin UI consumers.
  name: { type: String, trim: true, default: '' },
  email: { type: String, lowercase: true, trim: true, sparse: true, unique: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address'] },
  phone: { type: String, trim: true, required: true, unique: true, match: [/^\+[1-9]\d{7,14}$/, 'Phone must be in E.164 format'] },
  password: { type: String, required: true, select: false },
  // Legacy hash is read only to migrate existing accounts at their next successful login.
  passwordHash: { type: String, select: false },
  resetOtp: { type: String, select: false },
  resetOtpExpires: { type: Date, select: false },
  role: { type: String, enum: ['admin', 'user', 'client'], default: 'user' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
