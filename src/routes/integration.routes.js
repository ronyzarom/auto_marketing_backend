// src/routes/integration.routes.js

const express = require("express");
const router = express.Router();

// Import the Integration Controller
const integrationController = require("../controllers/integration.controller");

// (Optional) Authentication or role-based middlewares:
// const authMiddleware = require("../middlewares/auth.middleware");
// const roleMiddleware = require("../middlewares/role.middleware");

/**
 * GET /companies/:companyId/integrations
 * Retrieve all integrations for a given company.
 */
router.get(
  "/companies/:companyId/integrations",
  // authMiddleware,
  // roleMiddleware("admin" or "marketer"),
  integrationController.getIntegrations
);

/**
 * POST /companies/:companyId/integrations
 * Create a new integration record (e.g., connect Google Ads).
 */
router.post(
  "/companies/:companyId/integrations",
  // authMiddleware,
  // roleMiddleware("admin" or "marketer"),
  integrationController.createIntegration
);

/**
 * GET /integrations/:integrationId
 * Retrieve a single integration by its ID.
 */
router.get(
  "/integrations/:integrationId",
  // authMiddleware,
  integrationController.getIntegrationById
);

/**
 * PATCH /integrations/:integrationId
 * Update partial fields of an existing integration (e.g., tokens, status).
 */
router.patch(
  "/integrations/:integrationId",
  // authMiddleware,
  integrationController.updateIntegration
);

/**
 * DELETE /integrations/:integrationId
 * Delete an existing integration by its ID.
 */
router.delete(
  "/integrations/:integrationId",
  // authMiddleware,
  integrationController.deleteIntegration
);

/**
 * (Optional) GET /integrations/:integrationId/oauth/redirect
 * If you're handling an OAuth callback or redirect flow.
 */
router.get(
  "/integrations/:integrationId/oauth/redirect",
  // authMiddleware,
  integrationController.handleOAuthRedirect
);

module.exports = router;
