import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  parseISO,
} from "date-fns";

export const formatDate = (date, formatStr = "MMM dd, yyyy") => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

export const formatRelativeTime = (date) => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;

  if (isToday(dateObj)) {
    return formatDistanceToNow(dateObj, { addSuffix: true });
  }

  if (isYesterday(dateObj)) {
    return "Yesterday";
  }

  return formatDate(dateObj);
};

export const formatReadableDate = (date) => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "MMMM dd, yyyy");
};

export const formatBlogDate = (date) => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;

  if (isToday(dateObj)) {
    return format(dateObj, "'Today at' h:mm a");
  }

  if (isYesterday(dateObj)) {
    return format(dateObj, "'Yesterday at' h:mm a");
  }

  return format(dateObj, "MMM dd, yyyy");
};

export const getTimeAgo = (date) => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};
