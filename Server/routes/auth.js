import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  logoutUser,
} from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";
import {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
} from "../validators/authValidator.js";
import { handleValidationErrors } from "../validators/authValidator.js";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  "/register",
  validateRegister,
  handleValidationErrors,
  registerUser
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
router.post("/login", validateLogin, handleValidationErrors, loginUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post("/logout", protect, logoutUser);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/profile", protect, getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  "/profile",
  protect,
  validateUpdateProfile,
  handleValidationErrors,
  updateProfile
);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put(
  "/change-password",
  protect,
  validateChangePassword,
  handleValidationErrors,
  changePassword
);

/**
 * @route   DELETE /api/auth/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete("/account", protect, deleteAccount);

export default router;
