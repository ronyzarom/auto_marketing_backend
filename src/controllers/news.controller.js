// src/controllers/news.controller.js

/**
 * News Controller
 *
 * Manages fetching, creating, updating, and deleting news articles.
 * Optionally, can trigger AI or content creation from a specific news item.
 */

const newsService = require("../services/news.service");

/**
 * GET /api/news
 * Retrieves all news items, possibly filtered by status or topic.
 * Query params may include: status, topic, page, limit, etc.
 */
async function getAllNews(req, res) {
  try {
    const queryParams = req.query; // e.g. { status, topic, page, limit }

    const articles = await newsService.getAllNews(queryParams);
    return res.status(200).json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error("[NewsController] Error in getAllNews:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve news."
    });
  }
}

/**
 * GET /api/news/:newsId
 * Retrieve a single news item by its ID.
 */
async function getNewsById(req, res) {
  try {
    const { newsId } = req.params;

    const article = await newsService.getNewsById(newsId);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: `No news item found with ID: ${newsId}`
      });
    }

    return res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error("[NewsController] Error in getNewsById:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve news item."
    });
  }
}

/**
 * POST /api/news
 * Creates a new news article record.
 * Expects req.body with { title, url, summary, source, publishedAt, topics, etc. }
 */
async function createNews(req, res) {
  try {
    const newsData = req.body;

    // Basic validation
    if (!newsData.title || !newsData.url) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title or url."
      });
    }

    const newArticle = await newsService.createNews(newsData);
    return res.status(201).json({
      success: true,
      data: newArticle,
      message: "News item created successfully."
    });
  } catch (error) {
    console.error("[NewsController] Error in createNews:", error);

    // Example: handle duplicate URL error if error.code === 11000
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A news item with this URL already exists."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create news."
    });
  }
}

/**
 * PATCH /api/news/:newsId
 * Update partial fields of a news item (e.g., status, summary, sentiment).
 */
async function updateNews(req, res) {
  try {
    const { newsId } = req.params;
    const updates = req.body;

    const updatedArticle = await newsService.updateNews(newsId, updates);
    if (!updatedArticle) {
      return res.status(404).json({
        success: false,
        message: `No news item found with ID: ${newsId}`
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedArticle,
      message: "News item updated successfully."
    });
  } catch (error) {
    console.error("[NewsController] Error in updateNews:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update news item."
    });
  }
}

/**
 * DELETE /api/news/:newsId
 * Delete a news item by its ID.
 */
async function deleteNews(req, res) {
  try {
    const { newsId } = req.params;

    const deleted = await newsService.deleteNews(newsId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `No news item found with ID: ${newsId}`
      });
    }

    return res.status(200).json({
      success: true,
      message: "News item deleted successfully."
    });
  } catch (error) {
    console.error("[NewsController] Error in deleteNews:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete news item."
    });
  }
}

/**
 * POST /api/news/:newsId/create-content
 * (Optional) Creates a piece of content (or triggers AI generation)
 * based on an existing news article.
 */
async function createContentFromNews(req, res) {
  try {
    const { newsId } = req.params;
    const { channel, instructions } = req.body; // optional fields for channel or guidance

    const result = await newsService.createContentFromNews(newsId, channel, instructions);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `No news item found with ID: ${newsId}`
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
      message: "Content creation triggered from news item."
    });
  } catch (error) {
    console.error("[NewsController] Error in createContentFromNews:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create content from news."
    });
  }
}

// Export all news controller functions
module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  createContentFromNews
};
