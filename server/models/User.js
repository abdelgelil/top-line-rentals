import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'client'],
    default: 'user'
  }
}, { timestamps: true });

userSchema.index({ email: 1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
