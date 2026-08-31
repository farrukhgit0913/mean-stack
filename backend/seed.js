const mongoose = require('mongoose');
const User = require('./models/user.model');

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mean_test';

const users = [
  {
    name: 'Farrukh Shahzad',
    email: 'farrukh@example.com',
    age: 35,
    role: 'admin'
  },
  {
    name: 'Ali Khan',
    email: 'ali@example.com',
    age: 30,
    role: 'user'
  },
  {
    name: 'Ahmed Raza',
    email: 'ahmed@example.com',
    age: 28,
    role: 'user'
  },
  {
    name: 'Usman Malik',
    email: 'usman@example.com',
    age: 32,
    role: 'user'
  },
  {
    name: 'Hassan Ali',
    email: 'hassan@example.com',
    age: 26,
    role: 'user'
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log('MongoDB Connected');

    await User.deleteMany({});

    const result = await User.insertMany(users);

    console.log(`✅ ${result.length} users inserted successfully`);

    await mongoose.disconnect();

    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();