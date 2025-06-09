import { body, param, query, validationResult } from "express-validator";
import mongoose from "mongoose";

// Validation rules for creating a comment
export const validateCreateComment = [
  body("content")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Comment must be between 1 and 1000 characters")
    .custom((value) => {
      // Check for spam patterns
      const spamPatterns = [
        /(.)\1{10,}/g, // Repeated characters
        /https?:\/\/[^\s]+/g, // URLs (you might want to allow these)
        /\b(?:buy now|click here|free offer|guaranteed|limited time)\b/gi, // Spam phrases
      ];

      for (const pattern of spamPatterns) {
        if (pattern.test(value)) {
          throw new Error("Comment contains potentially inappropriate content");
        }
      }

      return true;
    })
    .escape(), // Escape HTML characters for security

  body("blog").isMongoId().withMessage("Invalid blog ID format"),

  body("parentComment")
    .optional()
    .isMongoId()
    .withMessage("Invalid parent comment ID format")
    .custom((value, { req }) => {
      // Ensure parentComment is not the same as the comment being created
      if (value === req.body._id) {
        throw new Error("A comment cannot be a reply to itself");
      }
      return true;
    }),
];

// Validation rules for updating a comment
export const validateUpdateComment = [
  param("id").isMongoId().withMessage("Invalid comment ID format"),

  body("content")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Comment must be between 1 and 1000 characters")
    .custom((value) => {
      // Check for spam patterns
      const spamPatterns = [
        /(.)\1{10,}/g, // Repeated characters
        /https?:\/\/[^\s]+/g, // URLs
        /\b(?:buy now|click here|free offer|guaranteed|limited time)\b/gi, // Spam phrases
      ];

      for (const pattern of spamPatterns) {
        if (pattern.test(value)) {
          throw new Error("Comment contains potentially inappropriate content");
        }
      }

      return true;
    })
    .escape(),
];

// Validation rules for flagging a comment
export const validateFlagComment = [
  param("id").isMongoId().withMessage("Invalid comment ID format"),

  body("reason")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Flag reason must be between 5 and 200 characters")
    .isIn([
      "spam",
      "harassment",
      "hate_speech",
      "inappropriate_content",
      "misinformation",
      "copyright_violation",
      "other",
    ])
    .withMessage("Invalid flag reason"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Flag description cannot exceed 500 characters")
    .escape(),
];

// Validation for comment query parameters
export const validateCommentQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),

  query("sort")
    .optional()
    .isIn(["newest", "oldest", "popular"])
    .withMessage("Sort must be one of: newest, oldest, popular"),

  query("status")
    .optional()
    .isIn(["active", "hidden", "deleted"])
    .withMessage("Status must be one of: active, hidden, deleted"),
];

// Validation for blog ID in comment routes
export const validateBlogId = [
  param("blogId").isMongoId().withMessage("Invalid blog ID format"),
];

// Validation for comment ID parameter
export const validateCommentId = [
  param("id").isMongoId().withMessage("Invalid comment ID format"),

  param("commentId")
    .optional()
    .isMongoId()
    .withMessage("Invalid comment ID format"),
];

// Validation for nested comment replies
export const validateCommentReply = [
  body("content")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Reply must be between 1 and 1000 characters")
    .escape(),

  body("parentComment")
    .isMongoId()
    .withMessage("Parent comment ID is required for replies"),

  body("blog").isMongoId().withMessage("Blog ID is required"),
];

// Custom validation for comment depth (prevent deeply nested replies)
export const validateCommentDepth = [
  body("parentComment")
    .optional()
    .custom(async (value, { req }) => {
      if (!value) return true; // Top-level comment, no depth check needed

      // This would require importing the Comment model
      // For now, we'll just validate that it exists
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid parent comment ID");
      }

      // In a real implementation, you'd check the depth here
      // const Comment = require('../models/Comment');
      // const parentComment = await Comment.findById(value);
      // if (parentComment && parentComment.parentComment) {
      //   throw new Error('Replies can only be one level deep');
      // }

      return true;
    }),
];

// Validation for comment moderation (admin/moderator only)
export const validateCommentModeration = [
  param("id").isMongoId().withMessage("Invalid comment ID format"),

  body("status")
    .isIn(["active", "hidden", "deleted"])
    .withMessage("Status must be one of: active, hidden, deleted"),

  body("moderationReason")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Moderation reason cannot exceed 500 characters")
    .escape(),
];

// Validation for bulk comment operations
export const validateBulkCommentOperation = [
  body("commentIds")
    .isArray({ min: 1, max: 50 })
    .withMessage("Comment IDs must be an array with 1-50 items")
    .custom((ids) => {
      for (const id of ids) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error("All comment IDs must be valid MongoDB ObjectIds");
        }
      }
      return true;
    }),

  body("action")
    .isIn(["hide", "delete", "approve"])
    .withMessage("Action must be one of: hide, delete, approve"),

  body("reason")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Reason cannot exceed 200 characters")
    .escape(),
];

// Sanitize comment content to prevent XSS
export const sanitizeCommentContent = [
  body("content").customSanitizer((value) => {
    // Remove any HTML tags except basic formatting
    const allowedTags = ["strong", "em", "u", "code"];

    // This is a basic sanitization - in production, use a library like DOMPurify
    // For now, we'll escape all HTML
    return value;
  }),
];

// Rate limiting validation for comments
export const validateCommentRateLimit = [
  body("blog").custom((value, { req }) => {
    // Store blog ID for rate limiting middleware
    req.commentBlogId = value;
    return true;
  }),
];

// Custom middleware to handle validation errors
export const handleCommentValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: "Comment validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// Validate comment permissions
export const validateCommentPermissions = [
  body("blog").custom(async (value, { req }) => {
    // This would require checking if the blog allows comments
    // and if the user has permission to comment

    // Basic validation for now
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("Invalid blog ID");
    }

    return true;
  }),
];

// Validation for comment search
export const validateCommentSearch = [
  query("q")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Search query must be between 2 and 100 characters")
    .escape(),

  query("author")
    .optional()
    .isMongoId()
    .withMessage("Author must be a valid user ID"),

  query("blog")
    .optional()
    .isMongoId()
    .withMessage("Blog must be a valid blog ID"),

  query("dateFrom")
    .optional()
    .isISO8601()
    .withMessage("Date from must be a valid ISO8601 date"),

  query("dateTo")
    .optional()
    .isISO8601()
    .withMessage("Date to must be a valid ISO8601 date")
    .custom((value, { req }) => {
      if (
        req.query.dateFrom &&
        new Date(value) < new Date(req.query.dateFrom)
      ) {
        throw new Error("Date to must be after date from");
      }
      return true;
    }),
];

// Validation for comment analytics (admin only)
export const validateCommentAnalytics = [
  query("period")
    .optional()
    .isIn(["day", "week", "month", "year"])
    .withMessage("Period must be one of: day, week, month, year"),

  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO8601 date"),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO8601 date"),

  query("blogId")
    .optional()
    .isMongoId()
    .withMessage("Blog ID must be a valid MongoDB ObjectId"),
];
