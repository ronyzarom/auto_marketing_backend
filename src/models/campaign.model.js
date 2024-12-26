// src/models/campaign.model.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Campaign Schema
 * 
 * Represents a marketing campaign under a specific company.
 * Each campaign can have a budget, objective, date range,
 * and is linked to one or more channels, etc.
 */
const campaignSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },
  // Basic Fields
  name: {
    type: String,
    required: true
  },
  objective: {
    type: String,
    required: true,
    // Example enum of possible objectives
    enum: [
      "Brand Awareness",
      "Lead Generation",
      "Sales",
      "Engagement",
      "Other"
    ]
  },
  // Budget object
  budget: {
    total: {
      type: Number,
      default: 0
    },
    dailyCap: {
      type: Number,
      default: 0
    }
  },
  // Date Range
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  // Reference an Audience if you store that in a separate collection
  targetAudienceId: {
    type: Schema.Types.ObjectId,
    ref: "Audience"
  },
  // Channels (e.g., "Facebook", "Google Ads", "LinkedIn")
  channels: {
    type: [String],
    default: []
  },
  // Status of the campaign
  status: {
    type: String,
    default: "draft",
    enum: ["draft", "active", "paused", "completed"]
  },
  // Track who created this campaign (optional)
  createdByUserId: {
    type: Schema.Types.ObjectId,
    ref: "User"
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
campaignSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

/**
 * Export the Mongoose Model
 */
module.exports = mongoose.model("Campaign", campaignSchema);
