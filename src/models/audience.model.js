// src/models/audience.model.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Audience Schema
 *
 * Represents a target audience segment used for marketing campaigns or ads.
 * May store demographics like ageRange, location, interests, etc.
 * Optionally references a Company to scope audiences by organization.
 */
const audienceSchema = new Schema({
  // Reference to a company if needed for multi-tenant usage
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: false
  },
  // A descriptive name for this audience
  name: {
    type: String,
    required: true
  },
  // Demographic fields
  demographics: {
    // e.g., [18, 35] meaning 18-35 age range
    ageRange: {
      type: [Number],
      default: []  // [minAge, maxAge]
    },
    location: {
      type: String, // e.g. "United States" or "California"
      default: ""
    },
    interests: {
      type: [String],
      default: []  // e.g. ["Tech", "Startups", "Gaming"]
    }
    // Add other demographic or psychographic fields as needed
  },
  // Additional custom fields for audience definition (optional)
  // e.g., "gender", "language", "incomeRange" etc.

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
 * Pre-save hook to update 'updatedAt' automatically before each save.
 */
audienceSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

/**
 * Export the Mongoose model.
 * Usage in other files:
 *   const Audience = require("../models/audience.model");
 *   const newAudience = new Audience({ name: "Tech Enthusiasts 18-35", demographics: {...} });
 *   await newAudience.save();
 */
module.exports = mongoose.model("Audience", audienceSchema);
