import mongoose from "mongoose";
import slugify from "../utils/slugify.js";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
      minlength: [10, "Content must be at least 10 characters"],
    },
    excerpt: {
      type: String,
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Blog author is required"],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: [30, "Tag cannot exceed 30 characters"],
      },
    ],
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      lowercase: true,
      maxlength: [50, "Category cannot exceed 50 characters"],
    },
    featuredImage: {
      type: String,
      default: "",
    },
    images: [
      {
        url: String,
        alt: String,
        caption: String,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
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
    views: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: Number, // in minutes
      default: 1,
    },
    seo: {
      metaTitle: {
        type: String,
        maxlength: [60, "Meta title cannot exceed 60 characters"],
      },
      metaDescription: {
        type: String,
        maxlength: [160, "Meta description cannot exceed 160 characters"],
      },
      keywords: [String],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    allowComments: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for comment count
blogSchema.virtual("commentCount", {
  ref: "Comment",
  localField: "_id",
  foreignField: "blog",
  count: true,
});

// Virtual for like count
blogSchema.virtual("likeCount").get(function () {
  return this.likes ? this.likes.length : 0;
});

// Indexes for better query performance
// Note: slug index is created automatically by unique: true
blogSchema.index({ author: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ publishedAt: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ title: "text", content: "text" });

// Pre-save middleware to generate slug and calculate read time
blogSchema.pre("save", function (next) {
  // Generate slug from title if not provided
  if (this.isModified("title") && !this.slug) {
    this.slug = slugify(this.title);
  }

  // Set published date when status changes to published
  if (
    this.isModified("status") &&
    this.status === "published" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }

  // Generate excerpt if not provided
  if (this.isModified("content") && !this.excerpt) {
    // Remove HTML tags and get first 150 characters
    const plainText = this.content.replace(/<[^>]*>/g, "");
    this.excerpt =
      plainText.substring(0, 150) + (plainText.length > 150 ? "..." : "");
  }

  // Calculate read time (average reading speed: 200 words per minute)
  if (this.isModified("content")) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200) || 1;
  }

  next();
});

// Ensure slug uniqueness
blogSchema.pre("save", async function (next) {
  if (this.isModified("title") || this.isNew) {
    let baseSlug = slugify(this.title);
    let finalSlug = baseSlug;
    let counter = 1;

    // Check if slug already exists
    while (
      await this.constructor.findOne({
        slug: finalSlug,
        _id: { $ne: this._id },
      })
    ) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = finalSlug;
  }
  next();
});

// Instance method to check if user liked the blog
blogSchema.methods.isLikedBy = function (userId) {
  return this.likes.some((like) => like.user.toString() === userId.toString());
};

// Instance method to toggle like
blogSchema.methods.toggleLike = function (userId) {
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

// Static method to get popular blogs
blogSchema.statics.getPopularBlogs = function (limit = 10) {
  return this.aggregate([
    { $match: { status: "published" } },
    {
      $addFields: {
        popularityScore: {
          $add: [{ $size: "$likes" }, { $multiply: ["$views", 0.1] }],
        },
      },
    },
    { $sort: { popularityScore: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
        pipeline: [
          {
            $project: {
              username: 1,
              firstName: 1,
              lastName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    { $unwind: "$author" },
  ]);
};

// Static method to get blogs by tag
blogSchema.statics.getByTag = function (tag, limit = 10, page = 1) {
  const skip = (page - 1) * limit;

  return this.find({
    tags: { $in: [tag.toLowerCase()] },
    status: "published",
  })
    .populate("author", "username firstName lastName avatar")
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(limit);
};

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;