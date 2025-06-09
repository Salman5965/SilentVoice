/**
 * Convert string to URL-friendly slug
 * @param {string} text - Text to convert to slug
 * @param {object} options - Configuration options
 * @returns {string} URL-friendly slug
 */
const slugify = (text, options = {}) => {
  const defaults = {
    replacement: "-", // Replace spaces with this character
    remove: undefined, // Remove characters matching this regex
    lower: true, // Convert to lowercase
    strict: false, // Strip special characters except replacement
    locale: "en", // Language locale for character replacement
    trim: true, // Trim leading/trailing replacement chars
  };

  const opts = { ...defaults, ...options };

  if (typeof text !== "string") {
    throw new Error("Input must be a string");
  }

  let result = text;

  // Convert to lowercase if specified
  if (opts.lower) {
    result = result.toLowerCase();
  }

  // Replace common characters with ASCII equivalents
  const charMap = {
    à: "a",
    á: "a",
    ä: "a",
    â: "a",
    ą: "a",
    ā: "a",
    ã: "a",
    å: "a",
    æ: "ae",
    ć: "c",
    č: "c",
    ç: "c",
    ď: "d",
    đ: "d",
    è: "e",
    é: "e",
    ë: "e",
    ê: "e",
    ę: "e",
    ē: "e",
    ì: "i",
    í: "i",
    ï: "i",
    î: "i",
    į: "i",
    ī: "i",
    ĺ: "l",
    ľ: "l",
    ł: "l",
    ñ: "n",
    ň: "n",
    ń: "n",
    ò: "o",
    ó: "o",
    ö: "o",
    ô: "o",
    ő: "o",
    ō: "o",
    ø: "o",
    õ: "o",
    œ: "oe",
    ŕ: "r",
    ř: "r",
    ś: "s",
    š: "s",
    ş: "s",
    ș: "s",
    ß: "ss",
    ť: "t",
    ţ: "t",
    ț: "t",
    ù: "u",
    ú: "u",
    ü: "u",
    û: "u",
    ű: "u",
    ū: "u",
    ų: "u",
    ý: "y",
    ÿ: "y",
    ź: "z",
    ž: "z",
    ż: "z",
  };

  // Replace accented characters
  result = result.replace(/[^\u0000-\u007E]/g, (char) => {
    return charMap[char] || char;
  });

  // Remove specified characters
  if (opts.remove) {
    result = result.replace(opts.remove, "");
  }

  // Replace whitespace and special characters
  if (opts.strict) {
    // In strict mode, remove everything except letters, numbers, and replacement character
    result = result.replace(/[^a-zA-Z0-9\s]/g, "");
  }

  // Replace spaces and multiple consecutive special chars with replacement
  result = result
    .replace(/[\s\W-]+/g, opts.replacement)
    .replace(new RegExp(`\\${opts.replacement}+`, "g"), opts.replacement);

  // Trim replacement characters from start and end
  if (opts.trim) {
    const trimRegex = new RegExp(
      `^\\${opts.replacement}+|\\${opts.replacement}+$`,
      "g",
    );
    result = result.replace(trimRegex, "");
  }

  return result;
};

/**
 * Create a unique slug by appending a number if the slug already exists
 * @param {string} baseSlug - Base slug to make unique
 * @param {Function} checkExists - Async function that checks if slug exists
 * @param {number} startIndex - Starting index for numbering (default: 1)
 * @returns {string} Unique slug
 */
export const makeUniqueSlug = async (baseSlug, checkExists, startIndex = 1) => {
  let slug = baseSlug;
  let counter = startIndex;

  while (await checkExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

/**
 * Generate slug from blog title with additional metadata
 * @param {string} title - Blog title
 * @param {object} options - Additional options
 * @returns {string} Blog slug
 */
export const createBlogSlug = (title, options = {}) => {
  const { maxLength = 50, datePrefix = false } = options;

  let slug = slugify(title, { strict: true });

  // Add date prefix if requested
  if (datePrefix) {
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0]; // YYYY-MM-DD format
    slug = `${dateStr}-${slug}`;
  }

  // Limit length
  if (slug.length > maxLength) {
    slug = slug.substring(0, maxLength);
    // Ensure we don't cut off in the middle of a word
    const lastDash = slug.lastIndexOf("-");
    if (lastDash > maxLength * 0.7) {
      slug = slug.substring(0, lastDash);
    }
  }

  return slug;
};

/**
 * Generate username slug from name
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @param {object} options - Additional options
 * @returns {string} Username slug
 */
export const createUsernameSlug = (firstName, lastName, options = {}) => {
  const { separator = "", includeNumbers = true } = options;

  const fullName = `${firstName}${separator}${lastName}`;
  let username = slugify(fullName, { replacement: separator, strict: true });

  // Add random numbers if requested (for uniqueness)
  if (includeNumbers) {
    const randomNum = Math.floor(Math.random() * 1000);
    username = `${username}${randomNum}`;
  }

  return username;
};

/**
 * Clean and validate slug
 * @param {string} slug - Slug to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result
 */
export const validateSlug = (slug, options = {}) => {
  const { minLength = 3, maxLength = 50, allowNumbers = true } = options;

  const errors = [];

  if (!slug || typeof slug !== "string") {
    errors.push("Slug must be a non-empty string");
    return { isValid: false, errors };
  }

  if (slug.length < minLength) {
    errors.push(`Slug must be at least ${minLength} characters long`);
  }

  if (slug.length > maxLength) {
    errors.push(`Slug cannot exceed ${maxLength} characters`);
  }

  // Check for valid characters
  const validPattern = allowNumbers ? /^[a-z0-9-]+$/ : /^[a-z-]+$/;
  if (!validPattern.test(slug)) {
    errors.push(
      "Slug can only contain lowercase letters, numbers, and hyphens",
    );
  }

  // Check for consecutive hyphens
  if (slug.includes("--")) {
    errors.push("Slug cannot contain consecutive hyphens");
  }

  // Check for leading/trailing hyphens
  if (slug.startsWith("-") || slug.endsWith("-")) {
    errors.push("Slug cannot start or end with a hyphen");
  }

  return {
    isValid: errors.length === 0,
    errors,
    cleanSlug: errors.length === 0 ? slug : slugify(slug),
  };
};

/**
 * Generate SEO-friendly slug with additional optimizations
 * @param {string} text - Text to convert
 * @param {object} seoOptions - SEO-specific options
 * @returns {string} SEO-optimized slug
 */
export const createSEOSlug = (text, seoOptions = {}) => {
  const {
    removeStopWords = true,
    maxWords = 6,
    focusKeyword = null,
  } = seoOptions;

  // Common English stop words to remove for better SEO
  const stopWords = [
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "has",
    "he",
    "in",
    "is",
    "it",
    "its",
    "of",
    "on",
    "that",
    "the",
    "to",
    "was",
    "will",
    "with",
    "but",
    "can",
    "had",
    "have",
    "this",
    "they",
    "we",
    "you",
    "all",
    "any",
    "may",
    "says",
  ];

  let words = text.toLowerCase().split(/\s+/);

  // Remove stop words if requested
  if (removeStopWords) {
    words = words.filter((word) => !stopWords.includes(word));
  }

  // Ensure focus keyword is included if provided
  if (
    focusKeyword &&
    !words.some((word) => word.includes(focusKeyword.toLowerCase()))
  ) {
    words.unshift(focusKeyword.toLowerCase());
  }

  // Limit number of words
  if (words.length > maxWords) {
    words = words.slice(0, maxWords);
  }

  const slug = words.join(" ");
  return slugify(slug, { strict: true });
};

export default slugify;
