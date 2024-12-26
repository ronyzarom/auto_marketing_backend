// src/controllers/company.controller.js

/**
 * Company Controller
 *
 * Manages CRUD operations for "Company" records:
 *  - Create a new company
 *  - Get all companies
 *  - Get one company by ID
 *  - Update a company
 *  - Delete a company
 */

const companyService = require("../services/company.service");

/**
 * POST /api/companies
 * Creates a new company record.
 * Expects req.body with relevant fields (e.g. name, industry, websiteUrl, brandGuidelines).
 */
async function createCompany(req, res) {
  try {
    const companyData = req.body;

    // Basic validation
    if (!companyData.name) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: company name.",
      });
    }

    // Create via service
    const newCompany = await companyService.createCompany(companyData);

    return res.status(201).json({
      success: true,
      data: newCompany,
      message: "Company created successfully.",
    });
  } catch (error) {
    console.error("[CompanyController] Error in createCompany:", error);

    // Example: check if it's a duplicate name or other DB error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A company with this name already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create company.",
    });
  }
}

/**
 * GET /api/companies
 * Fetches all companies (if your app allows listing them).
 * Might require admin role or special permissions in some setups.
 */
async function getAllCompanies(req, res) {
  try {
    const companies = await companyService.getAllCompanies();
    return res.status(200).json({
      success: true,
      data: companies,
    });
  } catch (error) {
    console.error("[CompanyController] Error in getAllCompanies:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch companies.",
    });
  }
}

/**
 * GET /api/companies/:companyId
 * Retrieves a single company by its ID.
 */
async function getCompanyById(req, res) {
  try {
    const { companyId } = req.params;
    const company = await companyService.getCompanyById(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: `No company found with ID: ${companyId}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error("[CompanyController] Error in getCompanyById:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve company.",
    });
  }
}

/**
 * PATCH /api/companies/:companyId
 * Updates partial fields of a company (e.g., brandGuidelines, industry, websiteUrl).
 */
async function updateCompany(req, res) {
  try {
    const { companyId } = req.params;
    const updates = req.body;

    const updatedCompany = await companyService.updateCompany(companyId, updates);
    if (!updatedCompany) {
      return res.status(404).json({
        success: false,
        message: `No company found with ID: ${companyId}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedCompany,
      message: "Company updated successfully.",
    });
  } catch (error) {
    console.error("[CompanyController] Error in updateCompany:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update company.",
    });
  }
}

/**
 * DELETE /api/companies/:companyId
 * Deletes a company by its ID.
 */
async function deleteCompany(req, res) {
  try {
    const { companyId } = req.params;
    const deleted = await companyService.deleteCompany(companyId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `No company found with ID: ${companyId}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company deleted successfully.",
    });
  } catch (error) {
    console.error("[CompanyController] Error in deleteCompany:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete company.",
    });
  }
}

// Export controller methods
module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
