// src/models/news.model.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * News Schema
 *
 * Represents a news article or press mention that your system
 * has collected (either manually created, aggregated from an API,
 * or scraped from a website). Can store title, summary, URL, source,
 * sentiment, topics, etc.
 */
const newsSchema = new Schema({
  // If you track news by company, link to a Company document
  // required: false if it's global news or not tied to a specific company
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: false
  },
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String
  },
  url: {
    type: String,
    required: true,
    unique: true // ensures no duplicate articles by URL
  },
  source: {
    type: String,
    default: "Unknown"
  },
  // Date the article was published (if known)
  publishedAt: {
    type: Date
  },
  // Topics or tags (e.g., "Product Launch", "Industry", "Competitor News")
  topics: {
    type: [String],
    default: []
  },
  // Sentiment or classification (optional)
  sentiment: {
    type: String,
    enum: ["positive", "negative", "neutral", "mixed", "unknown"],
    default: "unknown"
  },
  // Status of how we use or review this news (e.g., "new", "reviewed", "used_in_content", "ignored")
  status: {
    type: String,
    enum: ["new", "reviewed", "used_in_content", "ignored"],
    default: "new"
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
newsSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

/**
 * Export the Mongoose model.
 * Usage in other files:
 *   const News = require("../models/news.model");
 *   const newArticle = new News({...});
 *   await newArticle.save();
 */
module.exports = mongoose.model("News", newsSchema);
