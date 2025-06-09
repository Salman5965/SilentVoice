export const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word characters except hyphens
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
};

export const generateBlogSlug = (title, id) => {
  const baseSlug = slugify(title);
  return id ? `${baseSlug}-${id.slice(-8)}` : baseSlug;
};

export const extractIdFromSlug = (slug) => {
  const parts = slug.split("-");
  return parts[parts.length - 1];
};

export const createUniqueSlug = (title, existingSlugs) => {
  let baseSlug = slugify(title);
  let counter = 1;
  let finalSlug = baseSlug;

  while (existingSlugs.includes(finalSlug)) {
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return finalSlug;
};

export const validateSlug = (slug) => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};
