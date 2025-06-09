import { body, param, query, validationResult } from "express-validator";
import mongoose from "mongoose";

// Validation rules for creating a blog
export const validateCreateBlog = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters")
    .escape(),

  body("content")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters long")
    .custom((value) => {
      // Remove HTML tags to check actual content length
      const textContent = value.replace(/<[^>]*>/g, "").trim();
      if (textContent.length < 10) {
        throw new Error(
          "Content must contain at least 10 characters of actual text",
        );
      }
      return true;
    }),

  body("excerpt")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Excerpt cannot exceed 300 characters")
    .escape(),

  body("category")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Category must be between 1 and 50 characters")
    .matches(/^[a-zA-Z0-9\s-]+$/)
    .withMessage(
      "Category can only contain letters, numbers, spaces, and hyphens",
    )
    .toLowerCase(),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array")
    .custom((tags) => {
      if (tags.length > 10) {
        throw new Error("Cannot have more than 10 tags");
      }

      for (const tag of tags) {
        if (typeof tag !== "string" || tag.trim().length === 0) {
          throw new Error("Each tag must be a non-empty string");
        }
        if (tag.length > 30) {
          throw new Error("Each tag cannot exceed 30 characters");
        }
        if (!/^[a-zA-Z0-9\s-]+$/.test(tag)) {
          throw new Error(
            "Tags can only contain letters, numbers, spaces, and hyphens",
          );
        }
      }

      // Check for duplicate tags
      const uniqueTags = [
        ...new Set(tags.map((tag) => tag.toLowerCase().trim())),
      ];
      if (uniqueTags.length !== tags.length) {
        throw new Error("Duplicate tags are not allowed");
      }

      return true;
    })
    .customSanitizer((tags) => {
      if (Array.isArray(tags)) {
        return tags.map((tag) => tag.trim().toLowerCase());
      }
      return tags;
    }),

  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be either draft, published, or archived"),

  body("featuredImage")
    .optional()
    .isURL()
    .withMessage("Featured image must be a valid URL"),

  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array")
    .custom((images) => {
      if (images.length > 10) {
        throw new Error("Cannot have more than 10 images");
      }

      for (const image of images) {
        if (typeof image !== "object" || !image.url) {
          throw new Error("Each image must be an object with a url property");
        }

        // Validate URL
        try {
          new URL(image.url);
        } catch (error) {
          throw new Error("Each image URL must be valid");
        }

        if (image.alt && image.alt.length > 100) {
          throw new Error("Image alt text cannot exceed 100 characters");
        }

        if (image.caption && image.caption.length > 200) {
          throw new Error("Image caption cannot exceed 200 characters");
        }
      }

      return true;
    }),

  body("allowComments")
    .optional()
    .isBoolean()
    .withMessage("Allow comments must be a boolean"),

  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("Is featured must be a boolean"),

  body("seo.metaTitle")
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage("Meta title cannot exceed 60 characters")
    .escape(),

  body("seo.metaDescription")
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage("Meta description cannot exceed 160 characters")
    .escape(),

  body("seo.keywords")
    .optional()
    .isArray()
    .withMessage("SEO keywords must be an array")
    .custom((keywords) => {
      if (keywords.length > 10) {
        throw new Error("Cannot have more than 10 SEO keywords");
      }

      for (const keyword of keywords) {
        if (typeof keyword !== "string" || keyword.trim().length === 0) {
          throw new Error("Each SEO keyword must be a non-empty string");
        }
        if (keyword.length > 50) {
          throw new Error("Each SEO keyword cannot exceed 50 characters");
        }
      }

      return true;
    }),
];

// Validation rules for updating a blog
export const validateUpdateBlog = [
  param("id").isMongoId().withMessage("Invalid blog ID"),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters")
    .escape(),

  body("content")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters long")
    .custom((value) => {
      const textContent = value.replace(/<[^>]*>/g, "").trim();
      if (textContent.length < 10) {
        throw new Error(
          "Content must contain at least 10 characters of actual text",
        );
      }
      return true;
    }),

  body("excerpt")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Excerpt cannot exceed 300 characters")
    .escape(),

  body("category")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Category must be between 1 and 50 characters")
    .matches(/^[a-zA-Z0-9\s-]+$/)
    .withMessage(
      "Category can only contain letters, numbers, spaces, and hyphens",
    )
    .toLowerCase(),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array")
    .custom((tags) => {
      if (tags.length > 10) {
        throw new Error("Cannot have more than 10 tags");
      }

      for (const tag of tags) {
        if (typeof tag !== "string" || tag.trim().length === 0) {
          throw new Error("Each tag must be a non-empty string");
        }
        if (tag.length > 30) {
          throw new Error("Each tag cannot exceed 30 characters");
        }
        if (!/^[a-zA-Z0-9\s-]+$/.test(tag)) {
          throw new Error(
            "Tags can only contain letters, numbers, spaces, and hyphens",
          );
        }
      }

      const uniqueTags = [
        ...new Set(tags.map((tag) => tag.toLowerCase().trim())),
      ];
      if (uniqueTags.length !== tags.length) {
        throw new Error("Duplicate tags are not allowed");
      }

      return true;
    })
    .customSanitizer((tags) => {
      if (Array.isArray(tags)) {
        return tags.map((tag) => tag.trim().toLowerCase());
      }
      return tags;
    }),

  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be either draft, published, or archived"),

  body("featuredImage")
    .optional()
    .isURL()
    .withMessage("Featured image must be a valid URL"),

  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array")
    .custom((images) => {
      if (images.length > 10) {
        throw new Error("Cannot have more than 10 images");
      }

      for (const image of images) {
        if (typeof image !== "object" || !image.url) {
          throw new Error("Each image must be an object with a url property");
        }

        try {
          new URL(image.url);
        } catch (error) {
          throw new Error("Each image URL must be valid");
        }

        if (image.alt && image.alt.length > 100) {
          throw new Error("Image alt text cannot exceed 100 characters");
        }

        if (image.caption && image.caption.length > 200) {
          throw new Error("Image caption cannot exceed 200 characters");
        }
      }

      return true;
    }),

  body("allowComments")
    .optional()
    .isBoolean()
    .withMessage("Allow comments must be a boolean"),

  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("Is featured must be a boolean"),

  body("seo.metaTitle")
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage("Meta title cannot exceed 60 characters")
    .escape(),

  body("seo.metaDescription")
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage("Meta description cannot exceed 160 characters")
    .escape(),

  body("seo.keywords")
    .optional()
    .isArray()
    .withMessage("SEO keywords must be an array")
    .custom((keywords) => {
      if (keywords.length > 10) {
        throw new Error("Cannot have more than 10 SEO keywords");
      }

      for (const keyword of keywords) {
        if (typeof keyword !== "string" || keyword.trim().length === 0) {
          throw new Error("Each SEO keyword must be a non-empty string");
        }
        if (keyword.length > 50) {
          throw new Error("Each SEO keyword cannot exceed 50 characters");
        }
      }

      return true;
    }),
];

// Validation for blog query parameters
export const validateBlogQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),

  query("category")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Category must be between 1 and 50 characters")
    .matches(/^[a-zA-Z0-9\s-]+$/)
    .withMessage(
      "Category can only contain letters, numbers, spaces, and hyphens",
    ),

  query("tag")
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Tag must be between 1 and 30 characters")
    .matches(/^[a-zA-Z0-9\s-]+$/)
    .withMessage("Tag can only contain letters, numbers, spaces, and hyphens"),

  query("author")
    .optional()
    .isMongoId()
    .withMessage("Author must be a valid user ID"),

  query("search")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Search query must be between 2 and 100 characters")
    .escape(),

  query("sort")
    .optional()
    .isIn(["newest", "oldest", "popular", "title"])
    .withMessage("Sort must be one of: newest, oldest, popular, title"),

  query("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be one of: draft, published, archived"),
];

// Validation for blog slug parameter
export const validateBlogSlug = [
  param("slug")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Slug must be between 1 and 100 characters")
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      "Slug can only contain lowercase letters, numbers, and hyphens",
    )
    .custom((value) => {
      if (value.startsWith("-") || value.endsWith("-")) {
        throw new Error("Slug cannot start or end with a hyphen");
      }
      if (value.includes("--")) {
        throw new Error("Slug cannot contain consecutive hyphens");
      }
      return true;
    }),
];

// Validation for blog ID parameter
export const validateBlogId = [
  param("id").isMongoId().withMessage("Invalid blog ID format"),
];

// Custom middleware to handle validation errors
export const handleBlogValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: "Blog validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// Sanitize blog content
export const sanitizeBlogContent = [
  body("content").customSanitizer((value) => {
    // Allow specific HTML tags for rich text content
    // This is a basic example - in production, use a library like DOMPurify
    const allowedTags = [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "ol",
      "ul",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "code",
      "pre",
      "a",
      "img",
    ];

    // This is a simplified sanitization - use a proper HTML sanitizer in production
    return value;
  }),
];

// Validate featured blog operations (admin only)
export const validateFeaturedBlog = [
  body("isFeatured")
    .isBoolean()
    .withMessage("Featured status must be a boolean"),

  // Additional validation for featured blogs
  body("featuredImage")
    .if(body("isFeatured").equals(true))
    .notEmpty()
    .withMessage("Featured image is required for featured blogs")
    .isURL()
    .withMessage("Featured image must be a valid URL"),

  body("excerpt")
    .if(body("isFeatured").equals(true))
    .notEmpty()
    .withMessage("Excerpt is required for featured blogs")
    .isLength({ min: 50, max: 300 })
    .withMessage(
      "Excerpt for featured blogs must be between 50 and 300 characters",
    ),
];
