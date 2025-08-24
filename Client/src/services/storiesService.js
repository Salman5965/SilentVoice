import { apiService } from "./api";

// Helper to build query string from filters
function buildQueryParams(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value);
    }
  });
  return params.toString();
}

class StoriesService {
  // Get all stories with optional filters
  async getStories(filters = {}) {
    try {
      const query = buildQueryParams(filters);
      const response = await apiService.get(`/stories?${query}`);

      if (response.status === "success") return response.data;

      throw new Error(response.message || "Failed to fetch stories");
    } catch (error) {
      console.error("Failed to fetch stories:", error);
      return {
        stories: [],
        pagination: {
          currentPage: filters.page || 1,
          totalPages: 0,
          totalStories: 0,
          hasNextPage: false,
          hasPrevPage: false,
          limit: filters.limit || 10,
        },
      };
    }
  }

  // Get my stories
  async getMyStories(filters = {}) {
    try {
      const query = buildQueryParams(filters);
      const response = await apiService.get(`/stories/my-stories?${query}`);

      if (response.status === "success") return response.data;

      throw new Error(response.message || "Failed to fetch my stories");
    } catch (error) {
      console.error("Failed to fetch my stories:", error);
      return {
        stories: [],
        pagination: {
          currentPage: filters.page || 1,
          totalPages: 0,
          totalStories: 0,
          hasNextPage: false,
          hasPrevPage: false,
          limit: filters.limit || 10,
        },
      };
    }
  }

  // Get single story by ID
  async getStoryById(storyId) {
    try {
      const response = await apiService.get(`/stories/${storyId}`);

      if (response.status === "success") return response.data;

      throw new Error(response.message || "Failed to fetch story");
    } catch (error) {
      console.error("Failed to fetch story:", error);
      throw error;
    }
  }

  // Create a new story
  async createStory(storyData) {
    try {
      const isFormData = storyData instanceof FormData;
      const config = isFormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};

      const response = await apiService.post("/stories", storyData, config);

      if (response.status === "success") return response.data;

      throw new Error(response.message || "Failed to create story");
    } catch (error) {
      console.error("Failed to create story:", error);
      throw error;
    }
  }

  // Update a story
  async updateStory(storyId, storyData) {
    try {
      const response = await apiService.put(`/stories/${storyId}`, storyData);

      if (response.status === "success") return response.data;

      throw new Error(response.message || "Failed to update story");
    } catch (error) {
      console.error("Failed to update story:", error);
      throw error;
    }
  }

  // Delete a story
  async deleteStory(storyId) {
    try {
      const response = await apiService.delete(`/stories/${storyId}`);

      if (response.status === "success") return response.data;

      throw new Error(response.message || "Failed to delete story");
    } catch (error) {
      console.error("Failed to delete story:", error);
      throw error;
    }
  }

  // Like/Unlike a story
  async toggleLikeStory(storyId) {
    try {
      const response = await apiService.post(`/stories/${storyId}/like`);

      if (response.status === "success") return response.data;

      throw new Error(response.message || "Failed to toggle like");
    } catch (error) {
      console.error("Failed to toggle like:", error);
      throw error;
    }
  }

  // Alias for toggleLikeStory
  async likeStory(storyId) {
    return this.toggleLikeStory(storyId);
  }

  // Search stories
  async searchStories(query, filters = {}) {
    try {
      const searchFilters = { ...filters, search: query };
      return await this.getStories(searchFilters);
    } catch (error) {
      console.error("Failed to search stories:", error);
      return {
        stories: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalStories: 0,
          hasNextPage: false,
          hasPrevPage: false,
          limit: filters.limit || 10,
        },
      };
    }
  }

  // Get story categories
  async getCategories() {
    try {
      const response = await apiService.get("/stories/categories");

      if (response.status === "success") return response.data;

      throw new Error(response.message || "Failed to fetch categories");
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [
        "Personal Growth",
        "Life Lessons",
        "Travel",
        "Career",
        "Relationships",
        "Health",
        "Inspiration",
        "Adventure",
        "Family",
        "Creativity",
      ];
    }
  }

  // Get story tags
  async getTags() {
    try {
      const response = await apiService.get("/stories/tags");

      if (response.status === "success") return response.data;

      throw new Error(response.message || "Failed to fetch tags");
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      return [];
    }
  }

  // Increment story view count
  async incrementViews(storyId) {
    try {
      const response = await apiService.post(`/stories/${storyId}/view`);

      if (response.status === "success") return response.data;

      throw new Error(response.message || "Failed to increment views");
    } catch (error) {
      console.error("Failed to increment views:", error);
      return null;
    }
  }

  // Get story comments
  async getComments(storyId) {
    try {
      const response = await apiService.get(`/stories/${storyId}/comments`);

      if (response.status === "success") return response.data;

      throw new Error(response.message || "Failed to fetch comments");
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      return {
        comments: [],
        pagination: { currentPage: 1, totalPages: 0, totalComments: 0 },
      };
    }
  }

  // Add comment to story
  async addComment(storyId, content) {
    try {
      const response = await apiService.post(`/stories/${storyId}/comments`, {
        content,
      });

      if (response.status === "success") return response.data;

      throw new Error(response.message || "Failed to add comment");
    } catch (error) {
      console.error("Failed to add comment:", error);
      throw error;
    }
  }

  // Toggle bookmark status
  async toggleBookmark(storyId) {
    try {
      const response = await apiService.post(`/stories/${storyId}/bookmark`);

      if (response.status === "success") return response.data;

      throw new Error(response.message || "Failed to toggle bookmark");
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
      throw error;
    }
  }

  // Get user's liked stories
  async getLikedStories(page = 1, limit = 20) {
    try {
      const response = await apiService.get(
        `/stories/liked?page=${page}&limit=${limit}`
      );
      if (response.status === "success") return response.data;
      throw new Error(response.message || "Failed to fetch liked stories");
    } catch (error) {
      console.error("Failed to fetch liked stories:", error);
      return { stories: [], pagination: {} };
    }
  }

  // Get story stats
  async getStoryStats(storyId) {
    try {
      const response = await apiService.get(`/stories/${storyId}/stats`);
      if (response.status === "success") return response.data;
      throw new Error(response.message || "Failed to fetch story stats");
    } catch (error) {
      console.error("Failed to fetch story stats:", error);
      return { views: 0, likes: 0, comments: 0, bookmarks: 0 };
    }
  }
}

export const storiesService = new StoriesService();
export default storiesService;