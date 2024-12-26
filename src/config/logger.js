// src/config/logger.js

require("dotenv").config();
const { createLogger, format, transports } = require("winston");

const {
  colorize,
  combine,
  timestamp,
  printf,
  align
} = format;

/**
 * Determine the environment (e.g. 'development', 'production', 'test').
 * Adjust log levels accordingly.
 */
const env = process.env.NODE_ENV || "development";
const isProduction = env === "production";

/**
 * Define a custom log format with:
 * - timestamp in YYYY-MM-DD HH:mm:ss
 * - colorized level
 * - message alignment
 */
const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

/**
 * Create and configure Winston logger.
 * By default, logs to console. 
 * Log level is 'debug' in non-production, 'info' in production.
 */
const logger = createLogger({
  level: isProduction ? "info" : "debug",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    colorize(),
    align(),
    customFormat
  ),
  transports: [
    // Output logs to the console
    new transports.Console()
    // If you want to log to a file as well, uncomment or add:
    // new transports.File({ filename: 'logs/auto_marketing_backend.log' })
  ]
});

/**
 * Export the configured logger.
 * Usage elsewhere in the app:
 *   const logger = require('../config/logger');
 *   logger.info('Hello from logger.js!');
 *   logger.debug('Debug details here...');
 */
module.exports = logger;
