// import express from "express";
// import {
//   getStories,
//   getStoryById,
//   createStory,
//   updateStory,
//   deleteStory,
//   toggleLikeStory,
//   // incrementStoryViews,
//   // getStoryComments,
//   // addStoryComment,
//   getMyStories,
//   getPopularStories,
// } from "../controllers/storyController.js";
// import { protect } from "../middlewares/auth.js";
// // import { uploadStoryMedia } from "../controllers/uploadController.js";
// import {
//   validateCreateStory,
//   validateUpdateStory,
//   validateStoryQuery,
//   validateStoryId,
// } from "../validators/storyValidator.js";

// const router = express.Router();

// /**
//  * @route   GET /api/stories
//  * @desc    Get all published stories with pagination and filters
//  * @access  Public
//  */
// router.get("/", validateStoryQuery, getStories);

// /**
//  * @route   GET /api/stories/popular
//  * @desc    Get popular stories
//  * @access  Public
//  */
// router.get("/popular", getPopularStories);

// /**
//  * @route   GET /api/stories/my-stories
//  * @desc    Get user's own stories (including drafts)
//  * @access  Private
//  */
// router.get("/my-stories", protect, validateStoryQuery, getMyStories);

// /**
//  * @route   POST /api/stories
//  * @desc    Create a new story
//  * @access  Private
//  */
// // router.post("/", protect, uploadStoryMedia, validateCreateStory, createStory);

// /**
//  * @route   GET /api/stories/:id
//  * @desc    Get single story by ID
//  * @access  Public
//  */
// router.get("/:id", validateStoryId, getStoryById);

// /**
//  * @route   PUT /api/stories/:id
//  * @desc    Update a story
//  * @access  Private
//  */
// router.put("/:id", protect, validateUpdateStory, updateStory);

// /**
//  * @route   DELETE /api/stories/:id
//  * @desc    Delete a story
//  * @access  Private
//  */
// router.delete("/:id", protect, validateStoryId, deleteStory);

// /**
//  * @route   POST /api/stories/:id/like
//  * @desc    Like/Unlike a story
//  * @access  Private
//  */
// router.post("/:id/like", protect, validateStoryId, toggleLikeStory);

// /**
//  * @route   POST /api/stories/:id/view
//  * @desc    Increment story view count
//  * @access  Public
//  */
// // router.post("/:id/view", validateStoryId, incrementStoryViews);

// /**
//  * @route   GET /api/stories/:id/comments
//  * @desc    Get story comments
//  * @access  Public
//  */
// // router.get("/:id/comments", validateStoryId, getStoryComments);

// /**
//  * @route   POST /api/stories/:id/comments
//  * @desc    Add comment to story
//  * @access  Private
//  */
// // router.post("/:id/comments", protect, validateStoryId, addStoryComment);

// export default router;






import express from "express";
import {
  getStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
  toggleLikeStory,
  getMyStories,
  getPopularStories,
} from "../controllers/storyController.js";
import { protect } from "../middlewares/auth.js";
import {
  validateCreateStory,
  validateUpdateStory,
  validateStoryQuery,
  validateStoryId,
} from "../validators/storyValidator.js";

const router = express.Router();

/**
 * @route   GET /api/stories
 * @desc    Get all published stories with pagination and filters
 * @access  Public
 */
router.get("/", validateStoryQuery, getStories);

/**
 * @route   GET /api/stories/popular
 * @desc    Get popular stories
 * @access  Public
 */
router.get("/popular", getPopularStories);

/**
 * @route   GET /api/stories/my-stories
 * @desc    Get user's own stories (including drafts)
 * @access  Private
 */
router.get("/my-stories", protect, validateStoryQuery, getMyStories);

/**
 * @route   POST /api/stories
 * @desc    Create a new story
 * @access  Private
 */
router.post("/", protect, validateCreateStory, createStory);

/**
 * @route   GET /api/stories/:id
 * @desc    Get single story by ID
 * @access  Public
 */
router.get("/:id", validateStoryId, getStoryById);

/**
 * @route   PUT /api/stories/:id
 * @desc    Update a story
 * @access  Private
 */
router.put("/:id", protect, validateUpdateStory, updateStory);

/**
 * @route   DELETE /api/stories/:id
 * @desc    Delete a story
 * @access  Private
 */
router.delete("/:id", protect, validateStoryId, deleteStory);

/**
 * @route   POST /api/stories/:id/like
 * @desc    Like/Unlike a story
 * @access  Private
 */
router.post("/:id/like", protect, validateStoryId, toggleLikeStory);

export default router;
