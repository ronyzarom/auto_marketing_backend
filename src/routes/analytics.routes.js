// src/routes/analytics.routes.js

const express = require("express");
const router = express.Router();

// Import the Analytics Controller
const analyticsController = require("../controllers/analytics.controller");

/**
 * GET /api/analytics/overview
 * Retrieves aggregated performance metrics (e.g., total impressions, clicks, conversions)
 * across all campaigns (or optionally filtered by company/date range).
 * Query params might include: companyId, start, end
 */
router.get("/analytics/overview", analyticsController.getOverview);

/**
 * GET /api/analytics/campaign/:campaignId
 * Retrieves detailed performance data for a single campaign (e.g., daily breakdown).
 * Query params might include: start, end
 */
router.get("/analytics/campaign/:campaignId", analyticsController.getCampaignAnalytics);

/**
 * GET /api/analytics/channels
 * Retrieves a breakdown of metrics by channel (e.g., Facebook, GoogleAds).
 * Query params might include: companyId, campaignId, start, end
 */
router.get("/analytics/channels", analyticsController.getChannelAnalytics);

/**
 * GET /api/analytics/recommendations
 * Retrieves AI-based or logic-based suggestions for improving campaign performance.
 * Query params might include: campaignId
 */
router.get("/analytics/recommendations", analyticsController.getRecommendations);

module.exports = router;
