// import mongoose from "mongoose";

// const commentSchema = new mongoose.Schema(
//   {
//     content: {
//       type: String,
//       required: [true, "Comment content is required"],
//       trim: true,
//       maxlength: [1000, "Comment cannot exceed 1000 characters"],
//       minlength: [1, "Comment must be at least 1 character"],
//     },
//     author: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: [true, "Comment author is required"],
//     },
//     story: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Story",
//       required: [true, "Story reference is required"],
//     },
//     parentComment: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Comment",
//       default: null, // For reply functionality
//     },
//     likes: [
//       {
//         user: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//         },
//         likedAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],
//     isEdited: {
//       type: Boolean,
//       default: false,
//     },
//     editedAt: {
//       type: Date,
//     },
//     isDeleted: {
//       type: Boolean,
//       default: false,
//     },
//     deletedAt: {
//       type: Date,
//     },
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   },
// );

// // Virtual for like count
// commentSchema.virtual("likeCount").get(function () {
//   return this.likes ? this.likes.length : 0;
// });

// // Virtual for reply count
// commentSchema.virtual("replyCount").get(function () {
//   // This will be populated by aggregation when needed
//   return this._replyCount || 0;
// });

// // Instance method to toggle like
// commentSchema.methods.toggleLike = function (userId) {
//   const userObjectId = new mongoose.Types.ObjectId(userId);
//   const existingLikeIndex = this.likes.findIndex((like) =>
//     like.user.equals(userObjectId),
//   );

//   if (existingLikeIndex > -1) {
//     // User has already liked, so remove the like
//     this.likes.splice(existingLikeIndex, 1);
//     return false; // unliked
//   } else {
//     // User hasn't liked, so add the like
//     this.likes.push({
//       user: userObjectId,
//       likedAt: new Date(),
//     });
//     return true; // liked
//   }
// };

// // Instance method to check if user has liked
// commentSchema.methods.isLikedBy = function (userId) {
//   if (!userId) return false;
//   const userObjectId = new mongoose.Types.ObjectId(userId);
//   return this.likes.some((like) => like.user.equals(userObjectId));
// };

// // Indexes for better query performance
// commentSchema.index({ story: 1, createdAt: -1 });
// commentSchema.index({ author: 1 });
// commentSchema.index({ parentComment: 1 });
// commentSchema.index({ createdAt: -1 });

// // Middleware to exclude deleted comments by default
// commentSchema.pre(/^find/, function () {
//   // Only apply this filter if isDeleted is not explicitly queried
//   if (!this.getQuery().hasOwnProperty("isDeleted")) {
//     this.find({ isDeleted: { $ne: true } });
//   }
// });

// // Static method to get comments with reply counts
// commentSchema.statics.getCommentsWithReplies = async function (
//   storyId,
//   options = {},
// ) {
//   const {
//     page = 1,
//     limit = 20,
//     sortBy = "createdAt",
//     sortOrder = -1,
//   } = options;
//   const skip = (page - 1) * limit;

//   const comments = await this.aggregate([
//     {
//       $match: {
//         story: new mongoose.Types.ObjectId(storyId),
//         parentComment: null, // Only top-level comments
//         isDeleted: { $ne: true },
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "author",
//         foreignField: "_id",
//         as: "author",
//         pipeline: [
//           {
//             $project: {
//               firstName: 1,
//               lastName: 1,
//               username: 1,
//               avatar: 1,
//             },
//           },
//         ],
//       },
//     },
//     {
//       $unwind: "$author",
//     },
//     {
//       $lookup: {
//         from: "comments",
//         localField: "_id",
//         foreignField: "parentComment",
//         as: "replies",
//         pipeline: [
//           {
//             $match: { isDeleted: { $ne: true } },
//           },
//           {
//             $lookup: {
//               from: "users",
//               localField: "author",
//               foreignField: "_id",
//               as: "author",
//               pipeline: [
//                 {
//                   $project: {
//                     firstName: 1,
//                     lastName: 1,
//                     username: 1,
//                     avatar: 1,
//                   },
//                 },
//               ],
//             },
//           },
//           {
//             $unwind: "$author",
//           },
//           {
//             $sort: { createdAt: 1 },
//           },
//         ],
//       },
//     },
//     {
//       $addFields: {
//         replyCount: { $size: "$replies" },
//         likeCount: { $size: "$likes" },
//       },
//     },
//     {
//       $sort: { [sortBy]: sortOrder },
//     },
//     {
//       $skip: skip,
//     },
//     {
//       $limit: limit,
//     },
//   ]);

//   return comments;
// };

// const Comment = mongoose.model("Comment", commentSchema);

// export default Comment;




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
