// src/config/database.js

require("dotenv").config(); // Load environment variables from .env
const mongoose = require("mongoose");

// If you have a custom logger, require it here (e.g., Winston or Pino).
// For demonstration, we'll use console for logging.
const logger = console;

/**
 * Connect to MongoDB using environment variables.
 * Exits process on connection failure.
 */
async function connectDB() {
  try {
    const dbUri = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/auto_marketing_db";

    // Mongoose v6+ no longer needs useNewUrlParser, useUnifiedTopology, etc.
    // But if you're on v5 or older, you might include them:
    // { useNewUrlParser: true, useUnifiedTopology: true }
    await mongoose.connect(dbUri);

    logger.info(`[database.js] Successfully connected to MongoDB at: ${dbUri}`);
  } catch (error) {
    logger.error("[database.js] MongoDB connection error:", error);
    process.exit(1); // Exit if connection fails, to avoid running in a broken state
  }
}

module.exports = {
  connectDB
};
