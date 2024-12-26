// src/models/integration.model.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Integration Schema
 *
 * Represents a connection to an external marketing platform (Google Ads, Facebook Ads, etc.)
 * under a specific company. Stores OAuth tokens, API keys, account IDs, statuses, etc.
 */
const integrationSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },
  // The platform name, e.g., "GoogleAds", "Facebook", "LinkedIn", "Mailchimp"
  platform: {
    type: String,
    required: true,
    // You could also use an enum if you want to strictly limit platforms:
    // enum: ["GoogleAds", "Facebook", "LinkedIn", "Mailchimp", "Other"]
  },
  // Access token or API key for this platform (encrypted or stored securely if needed)
  accessToken: {
    type: String
    // If you want to hide this field in queries, you can do:
    // select: false
  },
  // Optional refresh token if using OAuth flows
  refreshToken: {
    type: String
    // select: false
  },
  // An account ID or equivalent for the external platform
  accountId: {
    type: String
  },
  // Current status of this integration, e.g. "active", "error", "revoked"
  status: {
    type: String,
    default: "active",
    enum: ["active", "error", "revoked"]
  },
  // (Optional) Additional metadata or config specific to the platform
  meta: {
    type: Object
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

/**
 * Pre-save hook to automatically update 'updatedAt' on each save.
 */
integrationSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

/**
 * Export the Mongoose model.
 * Usage in other files:
 *   const Integration = require("../models/integration.model");
 *   const newIntegration = new Integration({...});
 *   await newIntegration.save();
 */
module.exports = mongoose.model("Integration", integrationSchema);
