const connectDB = require('../config/db');
const Room = require('../models/Room');
require('dotenv').config();

const roomsData = [
  {
    name: 'Ocean Suite',
    description: 'Luxurious suite with panoramic ocean views and private balcony.',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800',
    features: ['Ocean view', 'King bed', 'Smart TV', 'Free Wi-Fi'],
    price: 450,
    availability: true
  },
  {
    name: 'Beach Villa',
    description: 'Private villa steps from the sand with outdoor shower.',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800',
    features: ['Beach access', 'Queen bed', 'Mini kitchen', 'Terrace'],
    price: 680,
    availability: true
  },
  {
    name: 'Horizon Penthouse',
    description: 'Our signature penthouse with wraparound terrace and jacuzzi.',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800',
    features: ['360° views', 'King bed', 'Jacuzzi', 'Butler service'],
    price: 1200,
    availability: true
  },
  {
    name: 'Garden Retreat',
    description: 'Peaceful retreat surrounded by tropical gardens.',
    image: '/room-garden-retreat.jpg',
    features: ['Garden view', 'Queen bed', 'Rainfall shower', 'Yoga deck'],
    price: 350,
    availability: true
  }
];

const seedRooms = async () => {
  try {
    await connectDB();
    
    // Clear existing rooms
    await Room.deleteMany({});
    
    // Insert seed data
    await Room.insertMany(roomsData);
    
    console.log('Rooms seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding rooms:', error);
    process.exit(1);
  }
};

seedRooms();