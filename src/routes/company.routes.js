// src/routes/company.routes.js

const express = require("express");
const router = express.Router();

// Import the Company Controller
const companyController = require("../controllers/company.controller");

// Optional authentication or role-based middlewares, e.g.:
// const authMiddleware = require("../middlewares/auth.middleware");
// const roleMiddleware = require("../middlewares/role.middleware");

/**
 * POST /api/companies
 * Create a new company.
 */
router.post(
  "/companies",
  // authMiddleware,
  // roleMiddleware("admin"), // or whichever role can create companies
  companyController.createCompany
);

/**
 * GET /api/companies
 * Get a list of all companies.
 */
router.get(
  "/companies",
  // authMiddleware,
  // roleMiddleware("admin"), // maybe only admins can view all companies
  companyController.getAllCompanies
);

/**
 * GET /api/companies/:companyId
 * Get a specific company by ID.
 */
router.get(
  "/companies/:companyId",
  // authMiddleware,
  companyController.getCompanyById
);

/**
 * PATCH /api/companies/:companyId
 * Update a company by ID.
 */
router.patch(
  "/companies/:companyId",
  // authMiddleware,
  // roleMiddleware("admin" or "owner"),
  companyController.updateCompany
);

/**
 * DELETE /api/companies/:companyId
 * Delete a company by ID.
 */
router.delete(
  "/companies/:companyId",
  // authMiddleware,
  // roleMiddleware("admin" or "owner"),
  companyController.deleteCompany
);

module.exports = router;
