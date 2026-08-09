const mongoose = require("mongoose");

const MONGODB_URI = process.env.DB_URL;

if (!MONGODB_URI) {
  throw new Error("DB_URL environment variable is missing");
}

async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  mongoose.connection.on("connected", () => {
    console.log("Connected to the database");
  });

  mongoose.connection.on("error", (error) => {
    console.error("Database connection error:", error);
  });

  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    bufferCommands: false,
  });

  return mongoose.connection;
}

module.exports = connectDB;
