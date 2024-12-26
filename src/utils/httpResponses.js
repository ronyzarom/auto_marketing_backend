// Placeholder for httpResponses.js
a// src/utils/httpResponses.js

/**
 * Utility functions for standardized HTTP responses in your auto_marketing_backend.
 * You can import these methods in your controllers to ensure consistent JSON output.
 */

/**
 * successResponse
 * Sends a success (2xx) JSON response with optional data and message.
 * @param {Object} res - Express response object
 * @param {any} data - The data payload to return (object, array, or primitive)
 * @param {String} [message="Success"] - Optional success message
 * @param {Number} [statusCode=200] - HTTP status code (2xx range)
 */
function successResponse(res, data, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }
  
  /**
   * errorResponse
   * Sends an error (4xx or 5xx) JSON response with a message and optional error details.
   * @param {Object} res - Express response object
   * @param {String} message - Error message to return
   * @param {Number} [statusCode=500] - HTTP status code for the error
   * @param {Error|String} [error=null] - Optional Error object or string for debugging
   */
  function errorResponse(res, message, statusCode = 500, error = null) {
    const response = {
      success: false,
      message
    };
  
    // Attach stack or error detail only if you want to expose it for debugging
    if (error) {
      // For security, you might limit or mask actual error details in production
      response.error = typeof error === "string" ? error : error.stack || error;
    }
  
    return res.status(statusCode).json(response);
  }
  
  /**
   * notFoundResponse
   * Sends a 404 not found response with a resource-specific message.
   * @param {Object} res - Express response object
   * @param {String} [resource="Resource"] - Name of the resource not found
   */
  function notFoundResponse(res, resource = "Resource") {
    return res.status(404).json({
      success: false,
      message: `${resource} not found.`
    });
  }
  
  /**
   * validationErrorResponse
   * Sends a 400 Bad Request response for validation errors, e.g. from a library
   * like express-validator, Joi, or custom logic. Expects an array or object of errors.
   * @param {Object} res - Express response object
   * @param {any} errors - Validation errors details
   */
  function validationErrorResponse(res, errors) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors
    });
  }
  
  module.exports = {
    successResponse,
    errorResponse,
    notFoundResponse,
    validationErrorResponse
  };
  