// src/controllers/integration.controller.js

/**
 * Integration Controller
 *
 * Manages creating, reading, updating, and deleting integrations
 * for external marketing platforms. Also can handle OAuth callbacks
 * if using OAuth flows (Google Ads, Facebook Ads, etc.).
 */

const integrationService = require("../services/integration.service");

/**
 * GET /companies/:companyId/integrations
 * Retrieve all integrations for a given company.
 */
async function getIntegrations(req, res) {
  try {
    const { companyId } = req.params;

    // Fetch from service
    const integrations = await integrationService.getIntegrations(companyId);

    return res.status(200).json({
      success: true,
      data: integrations
    });
  } catch (error) {
    console.error("[IntegrationController] Error in getIntegrations:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve integrations."
    });
  }
}

/**
 * POST /companies/:companyId/integrations
 * Create a new integration record for a specific platform.
 * Expects req.body with fields like { platform, accessToken, refreshToken, accountId, etc. }
 */
async function createIntegration(req, res) {
  try {
    const { companyId } = req.params;
    const integrationData = req.body;

    // Basic validation
    if (!integrationData.platform) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: 'platform'."
      });
    }

    // Create integration via service
    const newIntegration = await integrationService.createIntegration(companyId, integrationData);

    return res.status(201).json({
      success: true,
      data: newIntegration,
      message: "Integration created successfully."
    });
  } catch (error) {
    console.error("[IntegrationController] Error in createIntegration:", error);

    // Example: if the same platform for the company already exists
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An integration for this platform already exists."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create integration."
    });
  }
}

/**
 * GET /integrations/:integrationId
 * Retrieve a single integration by its ID.
 */
async function getIntegrationById(req, res) {
  try {
    const { integrationId } = req.params;

    const integration = await integrationService.getIntegrationById(integrationId);
    if (!integration) {
      return res.status(404).json({
        success: false,
        message: `No integration found with ID: ${integrationId}`
      });
    }

    return res.status(200).json({
      success: true,
      data: integration
    });
  } catch (error) {
    console.error("[IntegrationController] Error in getIntegrationById:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve integration."
    });
  }
}

/**
 * PATCH /integrations/:integrationId
 * Update partial fields of an existing integration (e.g., tokens, status).
 */
async function updateIntegration(req, res) {
  try {
    const { integrationId } = req.params;
    const updates = req.body;

    const updatedIntegration = await integrationService.updateIntegration(integrationId, updates);
    if (!updatedIntegration) {
      return res.status(404).json({
        success: false,
        message: `No integration found with ID: ${integrationId}`
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedIntegration,
      message: "Integration updated successfully."
    });
  } catch (error) {
    console.error("[IntegrationController] Error in updateIntegration:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update integration."
    });
  }
}

/**
 * DELETE /integrations/:integrationId
 * Delete an existing integration by ID.
 */
async function deleteIntegration(req, res) {
  try {
    const { integrationId } = req.params;

    const deleted = await integrationService.deleteIntegration(integrationId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `No integration found with ID: ${integrationId}`
      });
    }

    return res.status(200).json({
      success: true,
      message: "Integration deleted successfully."
    });
  } catch (error) {
    console.error("[IntegrationController] Error in deleteIntegration:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete integration."
    });
  }
}

/**
 * (Optional) GET /integrations/:integrationId/oauth/redirect
 * If your integration uses OAuth, handle the redirect callback here.
 * e.g., exchanging "code" for tokens and updating the integration record.
 */
async function handleOAuthRedirect(req, res) {
  try {
    const { integrationId } = req.params;
    const { code, state } = req.query; // typical OAuth callback query parameters

    // The service might exchange the code for tokens, update the integration, etc.
    const result = await integrationService.handleOAuthCallback(integrationId, code, state);
    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Failed to handle OAuth callback. Integration not found or code invalid."
      });
    }

    // Possibly redirect or just return success
    return res.status(200).json({
      success: true,
      data: result,
      message: "OAuth flow completed successfully."
    });
  } catch (error) {
    console.error("[IntegrationController] Error in handleOAuthRedirect:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to handle OAuth redirect."
    });
  }
}

// Export the controller functions
module.exports = {
  getIntegrations,
  createIntegration,
  getIntegrationById,
  updateIntegration,
  deleteIntegration,
  handleOAuthRedirect
};
