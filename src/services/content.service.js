// src/services/content.service.js

/**
 * Content Service
 *
 * Handles creation, retrieval, updating, deleting, and optional
 * approval or rejection of Content items (text, images, videos, ads, etc.).
 * Delegates database operations to the Content model.
 */

const Content = require("../models/content.model");

module.exports = {
  createContent,
  getContentList,
  getContentById,
  updateContent,
  deleteContent,
  approveContent,
  rejectContent
};

/**
 * createContent
 * Creates a new content item under a specific campaign (and optionally company).
 * @param {String} companyId - ID of the company (if you store references here)
 * @param {String} campaignId - ID of the campaign this content belongs to
 * @param {Object} contentData - e.g., { type, text, mediaUrl, platform, scheduledAt, etc. }
 * @returns {Promise<Object>} the newly created content document
 */
async function createContent(companyId, campaignId, contentData) {
  if (!companyId || !campaignId) {
    throw new Error("companyId and campaignId are required to create content.");
  }
  if (!contentData.type) {
    throw new Error("Content type is required (text, image, video, etc.).");
  }

  // Construct the new content document
  const newContent = new Content({
    campaignId,
    ...contentData
    // If you store companyId in Content as well, add it here:
    // companyId
  });

  const savedContent = await newContent.save();
  return savedContent;
}

/**
 * getContentList
 * Retrieves all content items for a given campaign, optionally filtered by status or type.
 * Supports optional pagination via page, limit.
 * @param {String} companyId
 * @param {String} campaignId
 * @param {Object} queryParams - e.g. { status, type, page, limit }
 * @returns {Promise<Array>} array of content documents
 */
async function getContentList(companyId, campaignId, queryParams = {}) {
  if (!companyId || !campaignId) {
    throw new Error("companyId and campaignId are required to get content list.");
  }

  const { status, type, page, limit } = queryParams;

  // Build a query
  const query = {
    campaignId
    // If you store companyId in the content model, you might add: companyId
  };

  if (status) {
    query.status = status; // e.g., "draft", "pending_approval", "approved", etc.
  }

  if (type) {
    query.type = type; // e.g. "text", "image", "video", ...
  }

  // Pagination
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  // Query the database
  const contentItems = await Content.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  return contentItems;
}

/**
 * getContentById
 * Retrieves a single content item by ID (and ensures it belongs to the correct campaign/company).
 * @param {String} companyId
 * @param {String} campaignId
 * @param {String} contentId
 * @returns {Promise<Object|null>} the content document or null if not found
 */
async function getContentById(companyId, campaignId, contentId) {
  if (!companyId || !campaignId || !contentId) {
    throw new Error("companyId, campaignId, and contentId are required.");
  }

  const contentItem = await Content.findOne({
    _id: contentId,
    campaignId
    // If storing companyId, add: companyId
  }).lean();

  return contentItem;
}

/**
 * updateContent
 * Partially updates a content item (e.g., changing text, scheduledAt, status).
 * @param {String} companyId
 * @param {String} campaignId
 * @param {String} contentId
 * @param {Object} updates
 * @returns {Promise<Object|null>} the updated content document or null if not found
 */
async function updateContent(companyId, campaignId, contentId, updates) {
  if (!companyId || !campaignId || !contentId) {
    throw new Error("companyId, campaignId, and contentId are required to update content.");
  }

  const updatedItem = await Content.findOneAndUpdate(
    {
      _id: contentId,
      campaignId
      // If storing companyId, add: companyId
    },
    { $set: updates },
    { new: true } // return the updated doc
  );

  return updatedItem;
}

/**
 * deleteContent
 * Removes a content item from the database by ID.
 * @param {String} companyId
 * @param {String} campaignId
 * @param {String} contentId
 * @returns {Promise<Boolean>} true if deleted, false otherwise
 */
async function deleteContent(companyId, campaignId, contentId) {
  if (!companyId || !campaignId || !contentId) {
    throw new Error("companyId, campaignId, and contentId are required to delete content.");
  }

  const result = await Content.findOneAndDelete({
    _id: contentId,
    campaignId
    // If storing companyId, add: companyId
  });
  return !!result;
}

/**
 * approveContent
 * Sets a content item’s status to "approved" (or a similar status flow).
 * @param {String} companyId
 * @param {String} campaignId
 * @param {String} contentId
 * @returns {Promise<Object|null>} updated content doc or null if not found
 */
async function approveContent(companyId, campaignId, contentId) {
  if (!companyId || !campaignId || !contentId) {
    throw new Error("companyId, campaignId, and contentId are required to approve content.");
  }

  const updated = await Content.findOneAndUpdate(
    {
      _id: contentId,
      campaignId
      // companyId if relevant
    },
    { $set: { status: "approved" } },
    { new: true }
  );

  return updated;
}

/**
 * rejectContent
 * Sets a content item’s status to "rejected".
 * Optionally, you might store a reason for rejection.
 * @param {String} companyId
 * @param {String} campaignId
 * @param {String} contentId
 * @param {String} [reason] - optional reason for rejection (store in meta if needed)
 * @returns {Promise<Object|null>} updated content doc or null if not found
 */
async function rejectContent(companyId, campaignId, contentId, reason) {
  if (!companyId || !campaignId || !contentId) {
    throw new Error("companyId, campaignId, and contentId are required to reject content.");
  }

  const updateFields = { status: "rejected" };
  // If you want to store the reason somewhere, e.g. in meta:
  // updateFields.meta = { ...existingMeta, rejectionReason: reason };

  const updated = await Content.findOneAndUpdate(
    {
      _id: contentId,
      campaignId
      // companyId if relevant
    },
    { $set: updateFields },
    { new: true }
  );

  return updated;
}
