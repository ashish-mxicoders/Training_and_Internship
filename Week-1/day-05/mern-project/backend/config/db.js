// Database connection configuration file
const mongoose = require("mongoose");

// Function to connect MongoDB using Mongoose
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error("Error: MONGO_URI is not defined in .env file!");
      process.exit(1);
    }

    // Connect to MongoDB Atlas
    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
