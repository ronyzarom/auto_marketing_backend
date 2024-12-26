// src/routes/content.routes.js

const express = require("express");
const router = express.Router();

// Import the Content Controller
const contentController = require("../controllers/content.controller");

// Optional authentication or role-based middlewares, e.g.:
// const authMiddleware = require("../middlewares/auth.middleware");
// const roleMiddleware = require("../middlewares/role.middleware");

/**
 * POST /companies/:companyId/campaigns/:campaignId/content
 * Create a new content item (text, image, video, etc.) under a campaign.
 */
router.post(
  "/companies/:companyId/campaigns/:campaignId/content",
  // authMiddleware,
  contentController.createContent
);

/**
 * GET /companies/:companyId/campaigns/:campaignId/content
 * Retrieve all content items for a specific campaign.
 */
router.get(
  "/companies/:companyId/campaigns/:campaignId/content",
  // authMiddleware,
  contentController.getContentList
);

/**
 * GET /companies/:companyId/campaigns/:campaignId/content/:contentId
 * Retrieve a single content item by ID.
 */
router.get(
  "/companies/:companyId/campaigns/:campaignId/content/:contentId",
  // authMiddleware,
  contentController.getContentById
);

/**
 * PATCH /companies/:companyId/campaigns/:campaignId/content/:contentId
 * Update a piece of content (e.g., text, status, scheduled time).
 */
router.patch(
  "/companies/:companyId/campaigns/:campaignId/content/:contentId",
  // authMiddleware,
  contentController.updateContent
);

/**
 * DELETE /companies/:companyId/campaigns/:campaignId/content/:contentId
 * Delete a content item by ID.
 */
router.delete(
  "/companies/:companyId/campaigns/:campaignId/content/:contentId",
  // authMiddleware,
  contentController.deleteContent
);

/**
 * POST /companies/:companyId/campaigns/:campaignId/content/:contentId/approve
 * Approve a piece of content, e.g. changing its status to 'approved'.
 */
router.post(
  "/companies/:companyId/campaigns/:campaignId/content/:contentId/approve",
  // authMiddleware,
  // roleMiddleware("approver"), // or whichever role is allowed
  contentController.approveContent
);

/**
 * POST /companies/:companyId/campaigns/:campaignId/content/:contentId/reject
 * Reject a piece of content, e.g. changing its status to 'rejected'.
 */
router.post(
  "/companies/:companyId/campaigns/:campaignId/content/:contentId/reject",
  // authMiddleware,
  // roleMiddleware("approver"),
  contentController.rejectContent
);

module.exports = router;
