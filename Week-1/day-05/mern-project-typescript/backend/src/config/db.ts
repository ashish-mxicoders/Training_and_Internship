// Database Connection Module (TypeScript)
// Connects to MongoDB Atlas using Mongoose with full type safety and error logging.

import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
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
    const message = error instanceof Error ? error.message : "Unknown database connection error";
    console.error(`MongoDB Connection Error: ${message}`);
    process.exit(1);
  }
};
