import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      minlength: [1, "Comment cannot be empty"],
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Comment author is required"],
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: [true, "Blog reference is required"],
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        likedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
    editHistory: [
      {
        content: String,
        editedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["active", "hidden", "deleted"],
      default: "active",
    },
    flagged: {
      isFlag: {
        type: Boolean,
        default: false,
      },
      reason: String,
      flaggedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      flaggedAt: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for like count
commentSchema.virtual("likeCount").get(function () {
  return this.likes ? this.likes.length : 0;
});

// Virtual for reply count
commentSchema.virtual("replyCount", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentComment",
  count: true,
});

// Indexes for better query performance
commentSchema.index({ blog: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentComment: 1 });
commentSchema.index({ status: 1 });

// Pre-save middleware to handle edit history
commentSchema.pre("save", function (next) {
  if (this.isModified("content") && !this.isNew) {
    // Add to edit history if content was modified
    this.editHistory.push({
      content: this.content,
      editedAt: new Date(),
    });
    this.isEdited = true;
  }
  next();
});

// Instance method to check if user liked the comment
commentSchema.methods.isLikedBy = function (userId) {
  return this.likes.some((like) => like.user.toString() === userId.toString());
};

// Instance method to toggle like
commentSchema.methods.toggleLike = function (userId) {
  const existingLikeIndex = this.likes.findIndex(
    (like) => like.user.toString() === userId.toString(),
  );

  if (existingLikeIndex > -1) {
    // Remove like
    this.likes.splice(existingLikeIndex, 1);
    return false; // unliked
  } else {
    // Add like
    this.likes.push({ user: userId });
    return true; // liked
  }
};

// Static method to get comments with replies for a blog
commentSchema.statics.getBlogCommentsWithReplies = async function (
  blogId,
  page = 1,
  limit = 10,
) {
  const skip = (page - 1) * limit;

  // Get top-level comments (no parent)
  const topLevelComments = await this.find({
    blog: blogId,
    parentComment: null,
    status: "active",
  })
    .populate("author", "username firstName lastName avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Get replies for each top-level comment
  for (let comment of topLevelComments) {
    const replies = await this.find({
      parentComment: comment._id,
      status: "active",
    })
      .populate("author", "username firstName lastName avatar")
      .sort({ createdAt: 1 })
      .limit(5); // Limit replies shown initially

    comment.replies = replies;
  }

  return topLevelComments;
};

// Static method to get comment replies
commentSchema.statics.getCommentReplies = function (
  commentId,
  page = 1,
  limit = 10,
) {
  const skip = (page - 1) * limit;

  return this.find({
    parentComment: commentId,
    status: "active",
  })
    .populate("author", "username firstName lastName avatar")
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit);
};

// Static method to delete comment and all its replies
commentSchema.statics.deleteCommentAndReplies = async function (commentId) {
  // Mark the comment as deleted
  await this.findByIdAndUpdate(commentId, { status: "deleted" });

  // Mark all replies as deleted
  await this.updateMany({ parentComment: commentId }, { status: "deleted" });

  return true;
};

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
