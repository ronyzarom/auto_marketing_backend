// src/services/company.service.js

/**
 * Company Service
 *
 * Handles creation, retrieval, updating, and deletion of Company records.
 * Keeps data operations separate from controllers, improving maintainability.
 */

const Company = require("../models/company.model");

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany
};

/**
 * createCompany
 * Creates a new company record.
 * @param {Object} companyData - { name, industry, websiteUrl, brandGuidelines, etc. }
 * @returns {Promise<Object>} the newly created company document
 */
async function createCompany(companyData) {
  if (!companyData || !companyData.name) {
    throw new Error("Missing required field: company name.");
  }

  // If you want to ensure uniqueness by name, check if a Company with the same name exists:
  // const existing = await Company.findOne({ name: companyData.name });
  // if (existing) { throw new Error("Company with this name already exists."); }

  const newCompany = new Company({
    ...companyData
  });

  const savedCompany = await newCompany.save();
  return savedCompany;
}

/**
 * getAllCompanies
 * Retrieves all companies in the system (or you can limit by admin usage).
 * @returns {Promise<Array>} array of company documents
 */
async function getAllCompanies() {
  // Optionally implement pagination or filters
  // e.g., .find({}) with limit, skip, etc.
  const companies = await Company.find({}).sort({ createdAt: -1 }).lean();
  return companies;
}

/**
 * getCompanyById
 * Retrieves a single company by its ID.
 * @param {String} companyId
 * @returns {Promise<Object|null>} the company document or null if not found
 */
async function getCompanyById(companyId) {
  if (!companyId) {
    throw new Error("companyId is required to retrieve a company.");
  }

  const company = await Company.findById(companyId).lean();
  return company;
}

/**
 * updateCompany
 * Partially updates a company's fields (e.g., industry, websiteUrl, brandGuidelines).
 * @param {String} companyId
 * @param {Object} updates
 * @returns {Promise<Object|null>} updated company doc or null if not found
 */
async function updateCompany(companyId, updates) {
  if (!companyId) {
    throw new Error("companyId is required to update a company.");
  }

  // Exclude fields you don't want updated if needed
  // const { _id, ownerId, ...allowedUpdates } = updates;

  const updatedCompany = await Company.findByIdAndUpdate(
    companyId,
    { $set: updates },
    { new: true }
  );

  return updatedCompany;
}

/**
 * deleteCompany
 * Deletes a company by its ID.
 * @param {String} companyId
 * @returns {Promise<Boolean>} true if deleted, false otherwise
 */
async function deleteCompany(companyId) {
  if (!companyId) {
    throw new Error("companyId is required to delete a company.");
  }

  const result = await Company.findByIdAndDelete(companyId);
  return !!result; // returns true if a doc was found & deleted, false if not
}
