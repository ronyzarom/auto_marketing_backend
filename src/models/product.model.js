// src/models/product.model.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Product Schema
 *
 * Represents a product or service that a company markets.
 * May include fields like name, description, priceRange, and uniqueSellingPoints.
 * Optionally references a Company if needed for multi-tenant usage.
 */
const productSchema = new Schema({
  // Reference to a company if your system is multi-tenant
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: false
  },
  // Basic product fields
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  // Could store exact price, or a range if it varies
  priceRange: {
    type: String
  },
  // Array of bullet points about what makes the product unique
  uniqueSellingPoints: {
    type: [String],
    default: []
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
 * Pre-save hook to update 'updatedAt' automatically before each save.
 */
productSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

/**
 * Export the Mongoose model.
 * Usage in other files:
 *   const Product = require("../models/product.model");
 *   const newProduct = new Product({ name: "Awesome Gadget", ... });
 *   await newProduct.save();
 */
module.exports = mongoose.model("Product", productSchema);
