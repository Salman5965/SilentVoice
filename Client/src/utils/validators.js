
import { VALIDATION_MESSAGES } from "./constant";

export const validateEmail = (email) => {
  if (!email.trim()) {
    return VALIDATION_MESSAGES.REQUIRED;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return VALIDATION_MESSAGES.INVALID_EMAIL;
  }

  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return VALIDATION_MESSAGES.REQUIRED;
  }

  if (password.length < 6) {
    return VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH;
  }

  return null;
};

export const validateUsername = (username) => {
  if (!username.trim()) {
    return VALIDATION_MESSAGES.REQUIRED;
  }

  if (username.trim().length < 3) {
    return VALIDATION_MESSAGES.USERNAME_MIN_LENGTH;
  }

  return null;
};

export const validateBlogTitle = (title) => {
  if (!title.trim()) {
    return VALIDATION_MESSAGES.REQUIRED;
  }

  if (title.trim().length < 3) {
    return VALIDATION_MESSAGES.TITLE_MIN_LENGTH;
  }

  return null;
};

export const validateBlogContent = (content) => {
  if (!content.trim()) {
    return VALIDATION_MESSAGES.REQUIRED;
  }

  if (content.trim().length < 10) {
    return VALIDATION_MESSAGES.CONTENT_MIN_LENGTH;
  }

  return null;
};

export const validateRequired = (value, fieldName) => {
  if (!value.trim()) {
    return fieldName
      ? `${fieldName} is required`
      : VALIDATION_MESSAGES.REQUIRED;
  }

  return null;
};

export const validateFileSize = (file, maxSizeInBytes) => {
  if (file.size > maxSizeInBytes) {
    const maxSizeInMB = maxSizeInBytes / (1024 * 1024);
    return `File size must be less than ${maxSizeInMB}MB`;
  }

  return null;
};

export const validateFileType = (file, allowedTypes) => {
  if (!allowedTypes.includes(file.type)) {
    return `File type must be one of: ${allowedTypes.join(", ")}`;
  }

  return null;
};

export const validateUrl = (url) => {
  if (!url.trim()) {
    return null; // URL is optional
  }

  try {
    new URL(url);
    return null;
  } catch {
    return "Please enter a valid URL";
  }
};
