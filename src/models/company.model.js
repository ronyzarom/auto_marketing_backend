// src/models/company.model.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Company Schema
 *
 * Represents an organization or business in your system. Each Company
 * can have an owner (user), name, industry, website, brand guidelines, etc.
 * 
 * You may store multi-tenant data here if multiple users
 * can belong to a single company. In that case, you might
 * have a separate "memberships" structure instead of a single owner.
 */
const companySchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false
    // Set to true if you want a required owner. Some use-cases allow
    // a "company" to exist without a dedicated owner in the system.
  },
  // Basic fields
  name: {
    type: String,
    required: true,
    unique: true // Ensures no two companies share the same name
  },
  industry: {
    type: String
  },
  websiteUrl: {
    type: String
  },
  // Nested object for brand guidelines
  brandGuidelines: {
    toneOfVoice: {
      type: String,
      default: "friendly"
    },
    colorPalette: {
      type: [String], // array of color codes or hex values
      default: []
    },
    styleNotes: {
      type: String
    }
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
companySchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

/**
 * Export the Mongoose model.
 * 
 * Usage in other files:
 *   const Company = require("../models/company.model");
 *   const newCompany = new Company({...});
 *   await newCompany.save();
 */
module.exports = mongoose.model("Company", companySchema);
