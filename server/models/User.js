import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  firstName: String,
  lastName: String,
  role: { type: String, default: 'user' }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);