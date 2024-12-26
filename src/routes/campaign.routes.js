// src/routes/campaign.routes.js

const express = require("express");
const router = express.Router();

// Import the Campaign Controller
const campaignController = require("../controllers/campaign.controller");

// Optional authentication or role-based middlewares:
// const authMiddleware = require("../middlewares/auth.middleware");
// const roleMiddleware = require("../middlewares/role.middleware");

/**
 * POST /companies/:companyId/campaigns
 * Create a new campaign under the specified company.
 */
router.post(
  "/companies/:companyId/campaigns",
  // authMiddleware,
  // roleMiddleware("marketer"), // Example role check
  campaignController.createCampaign
);

/**
 * GET /companies/:companyId/campaigns
 * Retrieve all campaigns for a given company.
 */
router.get(
  "/companies/:companyId/campaigns",
  // authMiddleware,
  campaignController.getCampaigns
);

/**
 * GET /companies/:companyId/campaigns/:campaignId
 * Retrieve a single campaign by ID.
 */
router.get(
  "/companies/:companyId/campaigns/:campaignId",
  // authMiddleware,
  campaignController.getCampaignById
);

/**
 * PATCH /companies/:companyId/campaigns/:campaignId
 * Update partial fields of a campaign.
 */
router.patch(
  "/companies/:companyId/campaigns/:campaignId",
  // authMiddleware,
  // roleMiddleware("marketer"),
  campaignController.updateCampaign
);

/**
 * DELETE /companies/:companyId/campaigns/:campaignId
 * Delete a campaign by ID.
 */
router.delete(
  "/companies/:companyId/campaigns/:campaignId",
  // authMiddleware,
  // roleMiddleware("admin"),
  campaignController.deleteCampaign
);

/**
 * POST /companies/:companyId/campaigns/:campaignId/finalize
 * (Optional) Mark a campaign as 'finalized' or 'ready to launch.'
 */
router.post(
  "/companies/:companyId/campaigns/:campaignId/finalize",
  // authMiddleware,
  // roleMiddleware("marketer"),
  campaignController.finalizeCampaign
);

// Export the router
module.exports = router;
