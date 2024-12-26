// src/config/index.js

require("dotenv").config(); // Loads environment variables from .env

/**
 * This file aggregates configuration values for your app,
 * making them easy to import in other modules (controllers, services, etc.).
 *
 * For example:
 *  const config = require("../config");
 *  console.log(config.port); // 3000
 *
 * Adjust the variable names / defaults as needed.
 */

// The environment the app is running in (development, production, test, etc.)
const env = process.env.NODE_ENV || "development";

// The port your Express server (or other HTTP server) will listen on
const port = parseInt(process.env.PORT, 10) || 3000;

// Database connection string (e.g., MongoDB URI)
const dbUri = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/auto_marketing_db";

// OpenAI API key for AI-based features (ContentAgent, StrategyAgent)
const openAiKey = process.env.OPENAI_API_KEY || null;

// News API key for the NewsAgent (e.g., from NewsAPI.org)
const newsApiKey = process.env.NEWS_API_KEY || null;

// JWT secret key (for authentication tokens, if using JWT)
const jwtSecret = process.env.JWT_SECRET || "mySecretKey";

// Export all config in a single object
module.exports = {
  env,
  port,
  dbUri,
  openAiKey,
  newsApiKey,
  jwtSecret,
};
