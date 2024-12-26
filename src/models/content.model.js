// src/models/content.model.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Content Schema
 *
 * Represents a piece of marketing content associated with a campaign.
 * This could be AI-generated text, images, video URLs, or ad copy,
 * along with status fields (draft, approved, etc.) and scheduling info.
 */
const contentSchema = new Schema({
  campaignId: {
    type: Schema.Types.ObjectId,
    ref: "Campaign",
    required: true
  },
  type: {
    type: String,
    enum: ["text", "image", "video", "adCopy", "other"],
    required: true
  },
  // Possible statuses for a content workflow:
  // e.g., "draft", "pending_approval", "approved", "rejected", "scheduled", "posted"
  status: {
    type: String,
    enum: ["draft", "pending_approval", "approved", "rejected", "scheduled", "posted"],
    default: "draft"
  },
  // Text content if it's a social post, ad copy, or script
  text: {
    type: String
  },
  // If it's an image or video, store the media URL here
  mediaUrl: {
    type: String
  },
  // The platform or channel (if relevant)
  platform: {
    type: String,
    enum: ["Facebook", "Instagram", "Twitter", "LinkedIn", "GoogleAds", "Other"]
  },
  // Scheduling info for when to auto-post or auto-run
  scheduledAt: {
    type: Date
  },
  // When it was actually posted (if applicable)
  postedAt: {
    type: Date
  },
  // A flexible field for storing extra metadata (e.g., ad group IDs, AI prompt data, etc.)
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
 * Pre-save hook to automatically update 'updatedAt' before each save.
 */
contentSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

/**
 * Export the Mongoose model.
 * Usage elsewhere:
 *   const Content = require("../models/content.model");
 *   const newItem = new Content({...});
 *   await newItem.save();
 */
module.exports = mongoose.model("Content", contentSchema);
