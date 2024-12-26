// src/controllers/campaign.controller.js

/**
 * Campaign Controller
 *
 * Handles HTTP requests for creating, reading, updating,
 * deleting, and finalizing marketing campaigns. Calls methods
 * in the campaignService to do database operations.
 */

const campaignService = require("../services/campaign.service");

/**
 * POST /api/companies/:companyId/campaigns
 * Creates a new campaign under the specified company.
 * Expects req.body with campaign fields (e.g. name, objective, budget, etc.).
 */
async function createCampaign(req, res) {
  try {
    const { companyId } = req.params;
    const campaignData = req.body;

    // Basic validation
    if (!campaignData.name || !campaignData.objective) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: campaign name or objective.",
      });
    }

    // Create the campaign via the service
    const newCampaign = await campaignService.createCampaign(companyId, campaignData);

    return res.status(201).json({
      success: true,
      data: newCampaign,
      message: "Campaign created successfully.",
    });
  } catch (error) {
    console.error("[CampaignController] Error in createCampaign:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create campaign.",
    });
  }
}

/**
 * GET /api/companies/:companyId/campaigns
 * Retrieves all campaigns for a given company.
 * Query params can include status, page, limit, etc.
 */
async function getCampaigns(req, res) {
  try {
    const { companyId } = req.params;
    const { status, page, limit } = req.query;

    const campaigns = await campaignService.getCampaigns(companyId, {
      status,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      data: campaigns,
    });
  } catch (error) {
    console.error("[CampaignController] Error in getCampaigns:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch campaigns.",
    });
  }
}

/**
 * GET /api/companies/:companyId/campaigns/:campaignId
 * Retrieves a single campaign by ID under the specified company.
 */
async function getCampaignById(req, res) {
  try {
    const { companyId, campaignId } = req.params;

    const campaign = await campaignService.getCampaignById(companyId, campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: `No campaign found with ID: ${campaignId} under company: ${companyId}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    console.error("[CampaignController] Error in getCampaignById:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve campaign.",
    });
  }
}

/**
 * PATCH /api/companies/:companyId/campaigns/:campaignId
 * Updates a campaign (partial fields like budget, status).
 */
async function updateCampaign(req, res) {
  try {
    const { companyId, campaignId } = req.params;
    const updates = req.body;

    const updatedCampaign = await campaignService.updateCampaign(
      companyId,
      campaignId,
      updates
    );
    if (!updatedCampaign) {
      return res.status(404).json({
        success: false,
        message: `No campaign found with ID: ${campaignId} under company: ${companyId}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedCampaign,
      message: "Campaign updated successfully.",
    });
  } catch (error) {
    console.error("[CampaignController] Error in updateCampaign:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update campaign.",
    });
  }
}

/**
 * DELETE /api/companies/:companyId/campaigns/:campaignId
 * Deletes a campaign by ID.
 */
async function deleteCampaign(req, res) {
  try {
    const { companyId, campaignId } = req.params;

    const deleted = await campaignService.deleteCampaign(companyId, campaignId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `No campaign found with ID: ${campaignId} under company: ${companyId}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Campaign deleted successfully.",
    });
  } catch (error) {
    console.error("[CampaignController] Error in deleteCampaign:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete campaign.",
    });
  }
}

/**
 * POST /api/companies/:companyId/campaigns/:campaignId/finalize
 * Marks a campaign as finalized or ready to launch.
 * Could also trigger AI tasks or scheduling if relevant.
 */
async function finalizeCampaign(req, res) {
  try {
    const { companyId, campaignId } = req.params;

    const result = await campaignService.finalizeCampaign(companyId, campaignId);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `No campaign found with ID: ${campaignId} under company: ${companyId}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
      message: "Campaign finalized successfully.",
    });
  } catch (error) {
    console.error("[CampaignController] Error in finalizeCampaign:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to finalize campaign.",
    });
  }
}

// Export all functions
module.exports = {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  finalizeCampaign,
};
