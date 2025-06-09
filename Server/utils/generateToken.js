import jwt from "jsonwebtoken";

/**
 * Generate JWT token for user authentication
 * @param {string} userId - User ID to encode in token
 * @param {string} expiresIn - Token expiration time (optional)
 * @returns {string} JWT token
 */
const generateToken = (userId, expiresIn = null) => {
  const payload = {
    id: userId,
    iat: Math.floor(Date.now() / 1000), // Issued at time
  };

  const options = {
    expiresIn: expiresIn || process.env.JWT_EXPIRE || "7d",
  };

  // Add issuer and audience for extra security (optional)
  if (process.env.JWT_ISSUER) {
    options.issuer = process.env.JWT_ISSUER;
  }

  if (process.env.JWT_AUDIENCE) {
    options.audience = process.env.JWT_AUDIENCE;
  }

  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, options);
    return token;
  } catch (error) {
    console.error("Token generation error:", error);
    throw new Error("Failed to generate authentication token");
  }
};

/**
 * Generate refresh token (for implementing refresh token strategy)
 * @param {string} userId - User ID to encode in token
 * @returns {string} Refresh token
 */
export const generateRefreshToken = (userId) => {
  const payload = {
    id: userId,
    type: "refresh",
    iat: Math.floor(Date.now() / 1000),
  };

  const options = {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
  };

  try {
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      options,
    );
    return refreshToken;
  } catch (error) {
    console.error("Refresh token generation error:", error);
    throw new Error("Failed to generate refresh token");
  }
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @param {string} secret - Secret key (optional, defaults to JWT_SECRET)
 * @returns {object} Decoded token payload
 */
export const verifyToken = (token, secret = null) => {
  try {
    const decoded = jwt.verify(token, secret || process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    } else {
      throw new Error("Token verification failed");
    }
  }
};

/**
 * Decode JWT token without verification (useful for debugging)
 * @param {string} token - JWT token to decode
 * @returns {object} Decoded token
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token, { complete: true });
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token to check
 * @returns {boolean} True if token is expired
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Get token expiration date
 * @param {string} token - JWT token
 * @returns {Date|null} Expiration date or null if invalid
 */
export const getTokenExpiration = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return null;
    }

    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};

/**
 * Generate password reset token
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @returns {string} Password reset token
 */
export const generatePasswordResetToken = (userId, email) => {
  const payload = {
    id: userId,
    email,
    type: "password_reset",
    iat: Math.floor(Date.now() / 1000),
  };

  const options = {
    expiresIn: "1h", // Password reset tokens should expire quickly
  };

  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, options);
    return token;
  } catch (error) {
    console.error("Password reset token generation error:", error);
    throw new Error("Failed to generate password reset token");
  }
};

/**
 * Generate email verification token
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @returns {string} Email verification token
 */
export const generateEmailVerificationToken = (userId, email) => {
  const payload = {
    id: userId,
    email,
    type: "email_verification",
    iat: Math.floor(Date.now() / 1000),
  };

  const options = {
    expiresIn: "24h", // Email verification tokens valid for 24 hours
  };

  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, options);
    return token;
  } catch (error) {
    console.error("Email verification token generation error:", error);
    throw new Error("Failed to generate email verification token");
  }
};

export default generateToken;
