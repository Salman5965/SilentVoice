import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";
import { validationResult } from "express-validator";

// @desc    Get comments for a blog
// @route   GET /api/comments/blog/:blogId
// @access  Public
export const getBlogComments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Check if blog exists
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({
        status: "error",
        message: "Blog not found",
      });
    }

    // Check if comments are allowed on this blog
    if (!blog.allowComments) {
      return res.status(403).json({
        status: "error",
        message: "Comments are disabled for this blog",
      });
    }

    const comments = await Comment.getBlogCommentsWithReplies(
      req.params.blogId,
      page,
      limit,
    );

    // Get total count for pagination
    const total = await Comment.countDocuments({
      blog: req.params.blogId,
      parentComment: null,
      status: "active",
    });

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: "success",
      data: {
        comments,
        pagination: {
          currentPage: page,
          totalPages,
          totalComments: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get replies for a comment
// @route   GET /api/comments/:commentId/replies
// @access  Public
export const getCommentReplies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Check if parent comment exists
    const parentComment = await Comment.findById(req.params.commentId);
    if (!parentComment) {
      return res.status(404).json({
        status: "error",
        message: "Parent comment not found",
      });
    }

    const replies = await Comment.getCommentReplies(
      req.params.commentId,
      page,
      limit,
    );

    // Get total count for pagination
    const total = await Comment.countDocuments({
      parentComment: req.params.commentId,
      status: "active",
    });

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: "success",
      data: {
        replies,
        pagination: {
          currentPage: page,
          totalPages,
          totalReplies: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new comment
// @route   POST /api/comments
// @access  Private
export const createComment = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { content, blog, parentComment } = req.body;

    // Check if blog exists and allows comments
    const blogDoc = await Blog.findById(blog);
    if (!blogDoc) {
      return res.status(404).json({
        status: "error",
        message: "Blog not found",
      });
    }

    if (!blogDoc.allowComments) {
      return res.status(403).json({
        status: "error",
        message: "Comments are disabled for this blog",
      });
    }

    // If it's a reply, check if parent comment exists
    if (parentComment) {
      const parentCommentDoc = await Comment.findById(parentComment);
      if (!parentCommentDoc) {
        return res.status(404).json({
          status: "error",
          message: "Parent comment not found",
        });
      }

      // Ensure parent comment belongs to the same blog
      if (parentCommentDoc.blog.toString() !== blog) {
        return res.status(400).json({
          status: "error",
          message: "Parent comment does not belong to this blog",
        });
      }
    }

    // Create comment
    const comment = new Comment({
      content,
      author: req.user.id,
      blog,
      parentComment: parentComment || null,
    });

    await comment.save();

    // Populate author info
    await comment.populate("author", "username firstName lastName avatar");

    res.status(201).json({
      status: "success",
      message: "Comment created successfully",
      data: {
        comment,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        status: "error",
        message: "Comment not found",
      });
    }

    // Check if user owns the comment or is admin
    if (
      comment.author.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update this comment",
      });
    }

    // Update only content (other fields should not be updated)
    comment.content = req.body.content;
    await comment.save();

    // Populate author info
    await comment.populate("author", "username firstName lastName avatar");

    res.status(200).json({
      status: "success",
      message: "Comment updated successfully",
      data: {
        comment,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        status: "error",
        message: "Comment not found",
      });
    }

    // Check if user owns the comment, owns the blog, or is admin
    const blog = await Blog.findById(comment.blog);
    const isCommentOwner = comment.author.toString() === req.user.id;
    const isBlogOwner = blog && blog.author.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isCommentOwner && !isBlogOwner && !isAdmin) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to delete this comment",
      });
    }

    // Delete comment and all its replies
    await Comment.deleteCommentAndReplies(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Comment and replies deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like/Unlike comment
// @route   POST /api/comments/:id/like
// @access  Private
export const toggleLikeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        status: "error",
        message: "Comment not found",
      });
    }

    if (comment.status !== "active") {
      return res.status(403).json({
        status: "error",
        message: "Cannot like this comment",
      });
    }

    const isLiked = comment.toggleLike(req.user.id);
    await comment.save();

    res.status(200).json({
      status: "success",
      message: isLiked
        ? "Comment liked successfully"
        : "Comment unliked successfully",
      data: {
        isLiked,
        likeCount: comment.likeCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Flag comment
// @route   POST /api/comments/:id/flag
// @access  Private
export const flagComment = async (req, res, next) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        status: "error",
        message: "Reason for flagging is required",
      });
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        status: "error",
        message: "Comment not found",
      });
    }

    // Check if already flagged by this user
    if (
      comment.flagged.isFlag &&
      comment.flagged.flaggedBy?.toString() === req.user.id
    ) {
      return res.status(400).json({
        status: "error",
        message: "You have already flagged this comment",
      });
    }

    // Flag the comment
    comment.flagged = {
      isFlag: true,
      reason,
      flaggedBy: req.user.id,
      flaggedAt: new Date(),
    };

    await comment.save();

    res.status(200).json({
      status: "success",
      message: "Comment flagged successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's comments
// @route   GET /api/comments/my-comments
// @access  Private
export const getMyComments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({
      author: req.user.id,
      status: "active",
    })
      .populate("blog", "title slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({
      author: req.user.id,
      status: "active",
    });

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: "success",
      data: {
        comments,
        pagination: {
          currentPage: page,
          totalPages,
          totalComments: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};