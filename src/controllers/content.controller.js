// src/controllers/content.controller.js

/**
 * Content Controller
 *
 * Manages CRUD operations for marketing content items (text, images, videos, etc.).
 * Also supports optional approval/rejection workflows.
 * Delegates database and logic to contentService.
 */

const contentService = require("../services/content.service");

/**
 * POST /companies/:companyId/campaigns/:campaignId/content
 * Creates a new piece of content under the specified campaign.
 * Expects req.body with fields like { type, text, mediaUrl, platform, scheduledAt, etc. }.
 */
async function createContent(req, res) {
  try {
    const { companyId, campaignId } = req.params;
    const contentData = req.body;

    // Basic validation
    if (!contentData.type) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: 'type' (e.g., 'text', 'image', etc.).",
      });
    }

    // Create content via the service
    const newContent = await contentService.createContent(companyId, campaignId, contentData);

    return res.status(201).json({
      success: true,
      data: newContent,
      message: "Content created successfully.",
    });
  } catch (error) {
    console.error("[ContentController] Error in createContent:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create content.",
    });
  }
}

/**
 * GET /companies/:companyId/campaigns/:campaignId/content
 * Retrieves all content items for a given campaign.
 * Query params can include status, type, page, limit, etc.
 */
async function getContentList(req, res) {
  try {
    const { companyId, campaignId } = req.params;
    const queryParams = req.query; // e.g. { status, type, page, limit }

    const contentItems = await contentService.getContentList(companyId, campaignId, queryParams);

    return res.status(200).json({
      success: true,
      data: contentItems,
    });
  } catch (error) {
    console.error("[ContentController] Error in getContentList:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve content list.",
    });
  }
}

/**
 * GET /companies/:companyId/campaigns/:campaignId/content/:contentId
 * Retrieves a single content item by ID.
 */
async function getContentById(req, res) {
  try {
    const { companyId, campaignId, contentId } = req.params;

    const contentItem = await contentService.getContentById(companyId, campaignId, contentId);
    if (!contentItem) {
      return res.status(404).json({
        success: false,
        message: `No content found with ID: ${contentId}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: contentItem,
    });
  } catch (error) {
    console.error("[ContentController] Error in getContentById:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve content.",
    });
  }
}

/**
 * PATCH /companies/:companyId/campaigns/:campaignId/content/:contentId
 * Updates a piece of content (e.g., text, status, scheduledAt).
 */
async function updateContent(req, res) {
  try {
    const { companyId, campaignId, contentId } = req.params;
    const updates = req.body;

    const updatedContent = await contentService.updateContent(companyId, campaignId, contentId, updates);
    if (!updatedContent) {
      return res.status(404).json({
        success: false,
        message: `No content found with ID: ${contentId}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedContent,
      message: "Content updated successfully.",
    });
  } catch (error) {
    console.error("[ContentController] Error in updateContent:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update content.",
    });
  }
}

/**
 * DELETE /companies/:companyId/campaigns/:campaignId/content/:contentId
 * Deletes a piece of content by ID.
 */
async function deleteContent(req, res) {
  try {
    const { companyId, campaignId, contentId } = req.params;

    const deleted = await contentService.deleteContent(companyId, campaignId, contentId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `No content found with ID: ${contentId}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Content deleted successfully.",
    });
  } catch (error) {
    console.error("[ContentController] Error in deleteContent:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete content.",
    });
  }
}

/**
 * POST /companies/:companyId/campaigns/:campaignId/content/:contentId/approve
 * Approves a piece of content, changing its status to 'approved'.
 */
async function approveContent(req, res) {
  try {
    const { companyId, campaignId, contentId } = req.params;

    const approvedItem = await contentService.approveContent(companyId, campaignId, contentId);
    if (!approvedItem) {
      return res.status(404).json({
        success: false,
        message: `No content found with ID: ${contentId}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: approvedItem,
      message: "Content approved.",
    });
  } catch (error) {
    console.error("[ContentController] Error in approveContent:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to approve content.",
    });
  }
}

/**
 * POST /companies/:companyId/campaigns/:campaignId/content/:contentId/reject
 * Rejects a piece of content, changing its status to 'rejected'.
 */
async function rejectContent(req, res) {
  try {
    const { companyId, campaignId, contentId } = req.params;
    const { reason } = req.body; // optional reason for rejection

    const rejectedItem = await contentService.rejectContent(companyId, campaignId, contentId, reason);
    if (!rejectedItem) {
      return res.status(404).json({
        success: false,
        message: `No content found with ID: ${contentId}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: rejectedItem,
      message: "Content rejected.",
    });
  } catch (error) {
    console.error("[ContentController] Error in rejectContent:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reject content.",
    });
  }
}

// Export all controller functions
module.exports = {
  createContent,
  getContentList,
  getContentById,
  updateContent,
  deleteContent,
  approveContent,
  rejectContent
};
