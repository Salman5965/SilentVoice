import { body, validationResult } from "express-validator";

// Validation rules for user registration
export const validateRegister = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores")
    .custom((value) => {
      // Check for reserved usernames
      const reserved = [
        "admin",
        "api",
        "www",
        "mail",
        "support",
        "help",
        "blog",
        "test",
      ];
      if (reserved.includes(value.toLowerCase())) {
        throw new Error("This username is reserved");
      }
      return true;
    }),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage("Email is too long"),

  body("password")
    .isLength({ min: 6, max: 128 })
    .withMessage("Password must be between 6 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
    ),

  body("firstName")
  .optional()
  .trim()
  .isLength({ min: 1, max: 50 })
  .withMessage("First name must be between 1 and 50 characters")
  .matches(/^[a-zA-Z\s-']+$/)
  .withMessage("First name can only contain letters, spaces, hyphens, and apostrophes"),

body("lastName")
  .optional()
  .trim()
  .isLength({ min: 1, max: 50 })
  .withMessage("Last name must be between 1 and 50 characters")
  .matches(/^[a-zA-Z\s-']+$/)
  .withMessage("Last name can only contain letters, spaces, hyphens, and apostrophes"),


  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters")
    .escape(), // Escape HTML characters for security
];

// Validation rules for user login
export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email or username is required")
    .isLength({ min: 3, max: 254 })
    .withMessage("Email or username is invalid"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 128 })
    .withMessage("Password must be between 6 and 128 characters"),
];

// Validation rules for profile update
export const validateUpdateProfile = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name must be between 1 and 50 characters")
    .matches(/^[a-zA-Z\s-']+$/)
    .withMessage(
      "First name can only contain letters, spaces, hyphens, and apostrophes",
    ),

  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name must be between 1 and 50 characters")
    .matches(/^[a-zA-Z\s-']+$/)
    .withMessage(
      "Last name can only contain letters, spaces, hyphens, and apostrophes",
    ),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters")
    .escape(),

  body("avatar").optional().isURL().withMessage("Avatar must be a valid URL"),

  body("socialLinks.twitter")
    .optional()
    .custom((value) => {
      if (
        value &&
        !value.match(/^https:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+$/)
      ) {
        throw new Error("Invalid Twitter URL format");
      }
      return true;
    }),

  body("socialLinks.linkedin")
    .optional()
    .custom((value) => {
      if (
        value &&
        !value.match(/^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+$/)
      ) {
        throw new Error("Invalid LinkedIn URL format");
      }
      return true;
    }),

  body("socialLinks.github")
    .optional()
    .custom((value) => {
      if (
        value &&
        !value.match(/^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+$/)
      ) {
        throw new Error("Invalid GitHub URL format");
      }
      return true;
    }),

  body("socialLinks.website")
    .optional()
    .isURL({ require_protocol: true })
    .withMessage("Website must be a valid URL with protocol (http/https)"),

  body("preferences.emailNotifications")
    .optional()
    .isBoolean()
    .withMessage("Email notifications preference must be a boolean"),

  body("preferences.newsletter")
    .optional()
    .isBoolean()
    .withMessage("Newsletter preference must be a boolean"),
];

// Validation rules for password change
export const validateChangePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required")
    .isLength({ min: 6, max: 128 })
    .withMessage("Current password must be between 6 and 128 characters"),

  body("newPassword")
    .isLength({ min: 6, max: 128 })
    .withMessage("New password must be between 6 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "New password must contain at least one lowercase letter, one uppercase letter, and one number",
    )
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error("New password must be different from current password");
      }
      return true;
    }),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Password confirmation does not match new password");
    }
    return true;
  }),
];

// Validation rules for password reset request
export const validatePasswordResetRequest = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
];

// Validation rules for password reset
export const validatePasswordReset = [
  body("token").notEmpty().withMessage("Reset token is required"),

  body("newPassword")
    .isLength({ min: 6, max: 128 })
    .withMessage("Password must be between 6 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
    ),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Password confirmation does not match new password");
    }
    return true;
  }),
];

// Validation rules for email verification
export const validateEmailVerification = [
  body("token").notEmpty().withMessage("Verification token is required"),
];

// Validation rules for resend email verification
export const validateResendEmailVerification = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
];

// Custom middleware to handle validation errors
// export const handleValidationErrors = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({
//       status: "error",
//       message: "Validation failed",
//       errors: errors.array(),
//     });
//   }
//   next();
// };
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};


// Sanitize user input
export const sanitizeInput = [body("*").trim().escape()];

// Rate limiting validation for auth endpoints
export const validateAuthRateLimit = [
  body("email").custom((value, { req }) => {
    // Store attempt in req for rate limiting middleware
    req.authAttemptEmail = value;
    return true;
  }),
];
