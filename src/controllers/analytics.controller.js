// src/controllers/analytics.controller.js

/**
 * Analytics Controller
 *
 * Provides endpoints to fetch performance data for campaigns,
 * an overall overview, channel breakdowns, etc.
 *
 * Typical usage with Express routes might be:
 *
 *   const router = require("express").Router();
 *   const analyticsController = require("../controllers/analytics.controller");
 *
 *   router.get("/overview", analyticsController.getOverview);
 *   router.get("/campaign/:campaignId", analyticsController.getCampaignAnalytics);
 *   router.get("/channels", analyticsController.getChannelAnalytics);
 *
 *   module.exports = router;
 */

const analyticsService = require("../services/analytics.service");

/**
 * GET /api/analytics/overview
 * Retrieves aggregated performance metrics (e.g. total impressions, clicks, conversions)
 * across all campaigns (or for a specific company) in a given date range.
 * 
 * Query parameters could include:
 *  - companyId (if multi-company)
 *  - start (date string)
 *  - end (date string)
 */
async function getOverview(req, res) {
  try {
    const { companyId, start, end } = req.query;

    // Example: fetch overview from the analytics service
    const overviewData = await analyticsService.getOverview({
      companyId,
      start,
      end
    });

    return res.status(200).json({
      success: true,
      data: overviewData
    });
  } catch (error) {
    console.error("[AnalyticsController] Error in getOverview:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve analytics overview."
    });
  }
}

/**
 * GET /api/analytics/campaign/:campaignId
 * Retrieves detailed performance data for a single campaign.
 * 
 * URL parameter: :campaignId
 * Query parameters (optional):
 *  - start (date string)
 *  - end (date string)
 */
async function getCampaignAnalytics(req, res) {
  try {
    const { campaignId } = req.params;
    const { start, end } = req.query;

    // Fetch campaign-specific analytics
    const campaignMetrics = await analyticsService.getCampaignAnalytics({
      campaignId,
      start,
      end
    });

    if (!campaignMetrics) {
      return res.status(404).json({
        success: false,
        message: `No analytics found for campaign ID: ${campaignId}`
      });
    }

    return res.status(200).json({
      success: true,
      data: campaignMetrics
    });
  } catch (error) {
    console.error("[AnalyticsController] Error in getCampaignAnalytics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve campaign analytics."
    });
  }
}

/**
 * GET /api/analytics/channels
 * Retrieves a breakdown of metrics by channel (e.g. Facebook, Google Ads),
 * potentially for a company or a specific campaign in a date range.
 * 
 * Query parameters:
 *  - companyId (string) or campaignId (string)
 *  - start (date string)
 *  - end (date string)
 */
async function getChannelAnalytics(req, res) {
  try {
    const { companyId, campaignId, start, end } = req.query;

    const channelData = await analyticsService.getChannelAnalytics({
      companyId,
      campaignId,
      start,
      end
    });

    return res.status(200).json({
      success: true,
      data: channelData
    });
  } catch (error) {
    console.error("[AnalyticsController] Error in getChannelAnalytics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve channel analytics."
    });
  }
}

/**
 * GET /api/analytics/recommendations (Optional)
 * If you have an AI-based system or an advanced logic that generates
 * suggestions for campaign optimization, you might expose it here.
 */
async function getRecommendations(req, res) {
  try {
    const { campaignId } = req.query;

    // Example: use a service method to generate recommendations
    const recommendations = await analyticsService.getRecommendations(campaignId);

    return res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error("[AnalyticsController] Error in getRecommendations:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve analytics recommendations."
    });
  }
}

// Export controller methods
module.exports = {
  getOverview,
  getCampaignAnalytics,
  getChannelAnalytics,
  getRecommendations
};
