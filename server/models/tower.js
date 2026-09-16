import mongoose from 'mongoose';
import Apartment from './Apartment.js';

const towerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String },
    location: { type: String },
    image_url: { type: String }
  },
  { timestamps: true }
);

// Static method to fetch all towers along with calculated apartment counts
towerSchema.statics.findAll = async function () {
  const towers = await this.find().sort({ name: 1 }).lean();

  // Aggregate apartment counts per tower
  const apartmentCounts = await Apartment.aggregate([
    {
      $group: {
        _id: '$tower_id',
        total_apartments: { $sum: 1 }
      }
    }
  ]);

  // Create a lookup map for quick total_apartments matching
  const countMap = {};
  apartmentCounts.forEach((item) => {
    countMap[item._id.toString()] = item.total_apartments;
  });

  // Attach total_apartments field to each tower object
  return towers.map((tower) => ({
    ...tower,
    total_apartments: countMap[tower._id.toString()] || 0
  }));
};

// Static method to find a single tower by ID
towerSchema.statics.findByIdWithDetails = async function (id) {
  const tower = await this.findById(id).lean();
  return tower || null;
};

const Tower = mongoose.model('Tower', towerSchema);

export default Tower;