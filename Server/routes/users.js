
import express from "express";
import {
  getAllUsers,
  getUserById,
  getUserByUsername,
  updateUserRole,
  toggleUserStatus,
  getUserStats,
  searchUsers,
  deleteUser,
  getTopAuthors,
} from "../controllers/userController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users (admin only)
 * @access  Private (Admin)
 * @query   page, limit, role, isActive, search
 */
router.get("/", protect, authorize("admin"), getAllUsers);

/**
 * @route   GET /api/users/search
 * @desc    Search users by username or name
 * @access  Public
 * @query   q (search query), limit
 */
router.get("/search", searchUsers);

/**
 * @route   GET /api/users/top-authors
 * @desc    Get top authors based on blog stats
 * @access  Public
 * @query   limit
 */
router.get("/top-authors", getTopAuthors);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Public
 */
router.get("/:id", getUserById);

/**
 * @route   GET /api/users/username/:username
 * @desc    Get user by username
 * @access  Public
 */
router.get("/username/:username", getUserByUsername);

/**
 * @route   GET /api/users/:id/stats
 * @desc    Get user statistics (blogs, views, likes, etc.)
 * @access  Public
 */
router.get("/:id/stats", getUserStats);

/**
 * @route   PUT /api/users/:id/role
 * @desc    Update user role (admin only)
 * @access  Private (Admin)
 * @body    { role }
 */
router.put("/:id/role", protect, authorize("admin"), updateUserRole);

/**
 * @route   PUT /api/users/:id/status
 * @desc    Toggle user active status (admin only)
 * @access  Private (Admin)
 */
router.put("/:id/status", protect, authorize("admin"), toggleUserStatus);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user and all associated data (admin only)
 * @access  Private (Admin)
 */
router.delete("/:id", protect, authorize("admin"), deleteUser);

export default router;
