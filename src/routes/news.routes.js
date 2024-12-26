// src/routes/news.routes.js

const express = require("express");
const router = express.Router();

// Import the News Controller
const newsController = require("../controllers/news.controller");

// Optional authentication or role-based middlewares:
// const authMiddleware = require("../middlewares/auth.middleware");
// const roleMiddleware = require("../middlewares/role.middleware");

/**
 * GET /api/news
 * Retrieve all news items, possibly filtered by status, topic, etc.
 */
router.get(
  "/news",
  // authMiddleware,
  newsController.getAllNews
);

/**
 * GET /api/news/:newsId
 * Retrieve a single news item by ID.
 */
router.get(
  "/news/:newsId",
  // authMiddleware,
  newsController.getNewsById
);

/**
 * POST /api/news
 * Create a new news article (either manually or from aggregator data).
 */
router.post(
  "/news",
  // authMiddleware,
  newsController.createNews
);

/**
 * PATCH /api/news/:newsId
 * Update a news item (e.g., status, summary, sentiment).
 */
router.patch(
  "/news/:newsId",
  // authMiddleware,
  newsController.updateNews
);

/**
 * DELETE /api/news/:newsId
 * Delete a news item by ID.
 */
router.delete(
  "/news/:newsId",
  // authMiddleware,
  newsController.deleteNews
);

/**
 * POST /api/news/:newsId/create-content
 * (Optional) Create a piece of marketing content (AI-based or manual)
 * from a given news item.
 */
router.post(
  "/news/:newsId/create-content",
  // authMiddleware,
  newsController.createContentFromNews
);

// Export the router
module.exports = router;
