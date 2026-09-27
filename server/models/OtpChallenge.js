import mongoose from 'mongoose';

const otpChallengeSchema = new mongoose.Schema({
  phone: { type: String, required: true, index: true },
  purpose: { type: String, enum: ['register', 'login', 'reset'], required: true },
  otpHash: { type: String, required: true },
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  passwordHash: { type: String, default: '' },
  attempts: { type: Number, default: 0 },
  otpExpires: { type: Date, required: true, expires: 0 },
}, { timestamps: true });

export default mongoose.models.OtpChallenge || mongoose.model('OtpChallenge', otpChallengeSchema);
