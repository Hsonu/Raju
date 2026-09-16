const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/riddhi-computer';
  
  try {
    const conn = await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Warning: ${error.message}`);
    console.warn(`👉 Tip: Set MONGODB_URI in Render Environment Variables with your MongoDB Atlas connection string.`);
    // Do NOT exit process so Render web server stays alive and serves health/API checks
  }
};

module.exports = connectDB;
