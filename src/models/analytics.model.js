// src/models/analytics.model.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Analytics Schema
 *
 * Represents performance data for a campaign on a specific channel (e.g., "GoogleAds", "Facebook").
 * Each document can store daily (or hourly) metrics such as impressions, clicks, cost, conversions.
 */
const analyticsSchema = new Schema({
  // Reference to a campaign
  campaignId: {
    type: Schema.Types.ObjectId,
    ref: "Campaign",
    required: true
  },
  // Optionally reference a company, if needed for multi-tenant or organizational scope
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: false
  },
  // The date for which these metrics apply
  date: {
    type: Date,
    required: true
  },
  // The channel or platform (e.g., "Facebook", "GoogleAds")
  channel: {
    type: String,
    required: true
  },
  // Performance metrics
  impressions: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  conversions: {
    type: Number,
    default: 0
  },
  cost: {
    type: Number,
    default: 0
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
 * Pre-save hook to automatically update 'updatedAt' before each save.
 */
analyticsSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

/**
 * Export the Mongoose model.
 * Usage:
 *   const Analytics = require("../models/analytics.model");
 *   const record = new Analytics({ campaignId, channel, date, impressions, clicks, cost });
 *   await record.save();
 */
module.exports = mongoose.model("Analytics", analyticsSchema);
