// src/services/integration.service.js

/**
 * Integration Service
 *
 * Handles creation, retrieval, updating, and deletion of integrations
 * for external platforms (Google Ads, Facebook Ads, etc.). If you're
 * implementing OAuth flows, you can also manage token exchange and storage here.
 */

const Integration = require("../models/integration.model");

module.exports = {
  getIntegrations,
  createIntegration,
  getIntegrationById,
  updateIntegration,
  deleteIntegration,
  handleOAuthCallback
  // Add more methods as needed for your flows (e.g., refresh tokens, revoke, etc.)
};

/**
 * getIntegrations
 * Retrieves all integrations for a specific company (if that's your multi-tenant logic).
 * @param {String} companyId
 * @returns {Promise<Array>} array of integration docs
 */
async function getIntegrations(companyId) {
  if (!companyId) {
    throw new Error("companyId is required to retrieve integrations.");
  }
  const integrations = await Integration.find({ companyId }).lean();
  return integrations;
}

/**
 * createIntegration
 * Creates a new integration record for a specific platform (e.g., GoogleAds, Facebook).
 * @param {String} companyId
 * @param {Object} integrationData - { platform, accessToken, refreshToken, accountId, etc. }
 * @returns {Promise<Object>} the newly created integration doc
 */
async function createIntegration(companyId, integrationData) {
  if (!companyId) {
    throw new Error("companyId is required to create an integration.");
  }
  if (!integrationData.platform) {
    throw new Error("Platform is required to create an integration.");
  }

  const newIntegration = new Integration({
    companyId,
    ...integrationData
  });

  // If you want to ensure only one integration per platform, you could check:
  // const existing = await Integration.findOne({ companyId, platform: integrationData.platform });
  // if (existing) { throw new Error("Integration for this platform already exists."); }

  const savedIntegration = await newIntegration.save();
  return savedIntegration;
}

/**
 * getIntegrationById
 * Retrieves a single integration by its unique ID.
 * @param {String} integrationId
 * @returns {Promise<Object|null>} the integration doc or null
 */
async function getIntegrationById(integrationId) {
  if (!integrationId) {
    throw new Error("integrationId is required.");
  }

  const integration = await Integration.findById(integrationId).lean();
  return integration;
}

/**
 * updateIntegration
 * Updates partial fields of an existing integration (tokens, accountId, status, etc.).
 * @param {String} integrationId
 * @param {Object} updates
 * @returns {Promise<Object|null>} updated integration doc or null if not found
 */
async function updateIntegration(integrationId, updates) {
  if (!integrationId) {
    throw new Error("integrationId is required to update an integration.");
  }

  const updatedIntegration = await Integration.findByIdAndUpdate(
    integrationId,
    { $set: updates },
    { new: true }
  );

  return updatedIntegration;
}

/**
 * deleteIntegration
 * Deletes an existing integration by its ID.
 * @param {String} integrationId
 * @returns {Promise<Boolean>} true if deleted, false otherwise
 */
async function deleteIntegration(integrationId) {
  if (!integrationId) {
    throw new Error("integrationId is required to delete an integration.");
  }

  const result = await Integration.findByIdAndDelete(integrationId);
  return !!result; // true if a doc was deleted, false if not found
}

/**
 * handleOAuthCallback
 * (Optional) Example if you're handling an OAuth flow callback.
 * e.g., exchanging "code" for access/refresh tokens and storing them.
 * @param {String} integrationId - The existing integration record's ID
 * @param {String} code - The OAuth authorization code from the external provider
 * @param {String} state - The state param for verifying or additional context
 * @returns {Promise<Object|null>} updated integration doc or null
 */
async function handleOAuthCallback(integrationId, code, state) {
  if (!integrationId || !code) {
    throw new Error("integrationId and code are required for OAuth callback.");
  }

  // 1. Fetch the existing integration doc
  const integration = await Integration.findById(integrationId);
  if (!integration) {
    return null;
  }

  // 2. Exchange the code for tokens (depends on the external provider's OAuth)
  // Example (pseudocode):
  // const tokenResponse = await someOAuthAPI.exchangeCodeForTokens(code);
  // if (tokenResponse.error) { throw new Error("Failed to exchange OAuth code."); }

  // 3. Update your integration doc with new tokens
  // integration.accessToken = tokenResponse.access_token;
  // integration.refreshToken = tokenResponse.refresh_token;
  // integration.status = "active";
  // integration.meta = { ...integration.meta, lastOAuthUpdate: new Date() };
  // await integration.save();

  // For demonstration, we just set some mock tokens
  integration.accessToken = "mock_access_token";
  integration.refreshToken = "mock_refresh_token";
  integration.status = "active";
  integration.meta = {
    ...(integration.meta || {}),
    lastOAuthUpdate: new Date(),
    codeUsed: code,
    stateUsed: state
  };
  await integration.save();

  return integration;
}
