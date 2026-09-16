import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Apartment from './models/Apartment.js';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const sampleApartments = [
  {
    title: "Royal Sea View Suite",
    tower: "San Stefano",
    guests: 6,
    sizeSqM: 180,
    floor: 22,
    pricePerNight: 450,
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Panoramic Mediterranean horizon suite featuring private balconies and 24/7 concierge access.",
    amenities: ["Sea View", "Private Beach", "Smart Home", "Valet Parking"],
    isAvailable: true
  },
  {
    title: "Panoramic Mediterranean Penthouse",
    tower: "Four Seasons",
    guests: 8,
    sizeSqM: 240,
    floor: 28,
    pricePerNight: 750,
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Top-floor penthouse with direct internal elevator access to dining and luxury shopping.",
    amenities: ["Penthouse View", "Indoor Pool", "24/7 Security", "Private Elevator"],
    isAvailable: true
  },
  {
    title: "Executive Coastal Residence",
    tower: "San Stefano",
    guests: 4,
    sizeSqM: 130,
    floor: 15,
    pricePerNight: 320,
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Modern coastal residence tailored for business trips and short luxury stays.",
    amenities: ["Sea View", "High-Speed WiFi", "Room Service", "Gym Access"],
    isAvailable: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    await Apartment.deleteMany({});
    console.log("Cleared existing apartments.");

    await Apartment.insertMany(sampleApartments);
    console.log("Sample apartments seeded successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();