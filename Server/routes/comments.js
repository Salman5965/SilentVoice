import express from "express";
import {
  getBlogComments,
  getCommentReplies,
  createComment,
  updateComment,
  deleteComment,
  toggleLikeComment,
  flagComment,
  getMyComments,
} from "../controllers/commentController.js";
import { protect, optionalAuth } from "../middlewares/auth.js";
import {
  validateCreateComment,
  validateUpdateComment,
  validateFlagComment,
} from "../validators/commentValidator.js";

const router = express.Router();

/**
 * @route   GET /api/comments/blog/:blogId
 * @desc    Get comments for a specific blog with replies
 * @access  Public
 * @query   page, limit
 */
router.get("/blog/:blogId", optionalAuth, getBlogComments);

/**
 * @route   GET /api/comments/:commentId/replies
 * @desc    Get replies for a specific comment
 * @access  Public
 * @query   page, limit
 */
router.get("/:commentId/replies", optionalAuth, getCommentReplies);

/**
 * @route   GET /api/comments/my-comments
 * @desc    Get current user's comments
 * @access  Private
 * @query   page, limit
 */
router.get("/my-comments", protect, getMyComments);

/**
 * @route   POST /api/comments
 * @desc    Create a new comment or reply
 * @access  Private
 * @body    { content, blog, parentComment? }
 */
router.post("/", protect, validateCreateComment, createComment);

/**
 * @route   PUT /api/comments/:id
 * @desc    Update a comment
 * @access  Private (Owner or Admin)
 * @body    { content }
 */
router.put("/:id", protect, validateUpdateComment, updateComment);

/**
 * @route   DELETE /api/comments/:id
 * @desc    Delete a comment and its replies
 * @access  Private (Owner, Blog Owner, or Admin)
 */
router.delete("/:id", protect, deleteComment);

/**
 * @route   POST /api/comments/:id/like
 * @desc    Like or unlike a comment
 * @access  Private
 */
router.post("/:id/like", protect, toggleLikeComment);

/**
 * @route   POST /api/comments/:id/flag
 * @desc    Flag a comment as inappropriate
 * @access  Private
 * @body    { reason }
 */
router.post("/:id/flag", protect, validateFlagComment, flagComment);

export default router;
