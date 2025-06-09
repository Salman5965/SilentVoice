// import { PAGINATION } from "@/utils/constant";
// import apiService from "./api";

// class BlogService {
//   async getBlogs(query = {}) {
//     const params = new URLSearchParams();

//     params.append("page", String(query.page || PAGINATION.DEFAULT_PAGE));
//     params.append("limit", String(query.limit || PAGINATION.BLOG_LIMIT));

//     if (query.search) params.append("search", query.search);
//     if (query.author) params.append("author", query.author);
//     if (query.isPublished !== undefined)
//       params.append("isPublished", String(query.isPublished));
//     if (query.sortBy) params.append("sortBy", query.sortBy);
//     if (query.sortOrder) params.append("sortOrder", query.sortOrder);

//     if (query.tags?.length) {
//       query.tags.forEach((tag) => params.append("tags[]", tag));
//     }

//     const response = await apiService.get(`/blogs?${params}`);

//     if (response.success) {
//       return response.data;
//     }

//     throw new Error(response.message || "Failed to fetch blogs");
//   }

//   async getBlogBySlug(slug) {
//     const response = await apiService.get(`/blogs/slug/${slug}`);

//     if (response.success) {
//       return response.data;
//     }

//     throw new Error(response.message || "Blog not found");
//   }

//   async getBlogById(id) {
//     const response = await apiService.get(`/blogs/${id}`);

//     if (response.success) {
//       return response.data;
//     }

//     throw new Error(response.message || "Blog not found");
//   }

//   async createBlog(blogData) {
//     const response = await apiService.post("/blogs", blogData);

//     if (response.success) {
//       return response.data;
//     }

//     throw new Error(response.message || "Failed to create blog");
//   }

//   async updateBlog(blogData) {
//     const { id, ...updateData } = blogData;
//     const response = await apiService.put(`/blogs/${id}`, updateData);

//     if (response.success) {
//       return response.data;
//     }

//     throw new Error(response.message || "Failed to update blog");
//   }

//   async deleteBlog(id) {
//     const response = await apiService.delete(`/blogs/${id}`);

//     if (!response.success) {
//       throw new Error(response.message || "Failed to delete blog");
//     }
//   }

//   async likeBlog(id) {
//     const response = await apiService.post(`/blogs/${id}/like`);

//     if (response.success) {
//       return response.data;
//     }

//     throw new Error(response.message || "Failed to like blog");
//   }

//   async unlikeBlog(id) {
//     const response = await apiService.delete(`/blogs/${id}/like`);

//     if (response.success) {
//       return response.data;
//     }

//     throw new Error(response.message || "Failed to unlike blog");
//   }

//   async incrementViewCount(id) {
//     try {
//       await apiService.post(`/blogs/${id}/view`);
//     } catch (error) {
//       // View count increment is not critical
//       console.warn("Failed to increment view count:", error);
//     }
//   }

//   async getUserBlogs(userId, query = {}) {
//     const params = new URLSearchParams();

//     params.append("page", String(query.page || PAGINATION.DEFAULT_PAGE));
//     params.append("limit", String(query.limit || PAGINATION.BLOG_LIMIT));

//     if (query.search) params.append("search", query.search);
//     if (query.isPublished !== undefined)
//       params.append("isPublished", String(query.isPublished));
//     if (query.sortBy) params.append("sortBy", query.sortBy);
//     if (query.sortOrder) params.append("sortOrder", query.sortOrder);

//     if (query.tags?.length) {
//       query.tags.forEach((tag) => params.append("tags[]", tag));
//     }

//     const endpoint = userId ? `/blogs/user/${userId}` : "/blogs/my";
//     const response = await apiService.get(`${endpoint}?${params}`);

//     if (response.success) {
//       return response.data;
//     }

//     throw new Error(response.message || "Failed to fetch user blogs");
//   }

//   async getTags() {
//     const response = await apiService.get("/blogs/tags");

//     if (response.success) {
//       return response.data;
//     }

//     throw new Error(response.message || "Failed to fetch tags");
//   }

//   async uploadImage(file) {
//     const formData = new FormData();
//     formData.append("image", file);

//     const response = await apiService.post("/blogs/upload-image", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     if (response.success) {
//       return response.data.url;
//     }

//     throw new Error(response.message || "Failed to upload image");
//   }
// }

// export const blogService = new BlogService();
// export default blogService;





import { PAGINATION } from "@/utils/constant";
import apiService from "./api";

class BlogService {
  async getBlogs(query = {}) {
    const params = new URLSearchParams();

    params.append("page", String(query.page || PAGINATION.DEFAULT_PAGE));
    params.append("limit", String(query.limit || PAGINATION.BLOG_LIMIT));

    if (query.search) params.append("search", query.search);
    if (query.author) params.append("author", query.author);
    if (query.category) params.append("category", query.category);
    if (query.isPublished !== undefined)
      params.append("isPublished", String(query.isPublished));
    if (query.sortBy) params.append("sortBy", query.sortBy);
    if (query.sortOrder) params.append("sortOrder", query.sortOrder);

    // if (query.tags?.length) {
    //   query.tags.forEach((tag) => params.append("tags[]", tag));
    // }

    // const response = await apiService.get(`/blogs?${params}`);
    const response = await apiService.get('/blogs');

    if (response.status === "success") {
      return response.data;
    }

    throw new Error(response.message || "Failed to fetch blogs");
  }

  // Get blogs without any tag filtering
  async getBlogsWithoutTags(query = {}) {
    const params = new URLSearchParams();

    params.append("page", String(query.page || PAGINATION.DEFAULT_PAGE));
    params.append("limit", String(query.limit || PAGINATION.BLOG_LIMIT));

    if (query.search) params.append("search", query.search);
    if (query.author) params.append("author", query.author);
    if (query.category) params.append("category", query.category);
    if (query.isPublished !== undefined)
      params.append("isPublished", String(query.isPublished));
    if (query.sortBy) params.append("sortBy", query.sortBy);
    if (query.sortOrder) params.append("sortOrder", query.sortOrder);

    // Explicitly exclude tags from the query
    params.append("excludeTags", "true");

    const response = await apiService.get(`/blogs?${params}`);

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to fetch blogs without tags");
  }

  // Get blogs by category
  async getBlogsByCategory(category, query = {}) {
    const params = new URLSearchParams();

    params.append("page", String(query.page || PAGINATION.DEFAULT_PAGE));
    params.append("limit", String(query.limit || PAGINATION.BLOG_LIMIT));
    params.append("category", category);

    if (query.search) params.append("search", query.search);
    if (query.author) params.append("author", query.author);
    if (query.isPublished !== undefined)
      params.append("isPublished", String(query.isPublished));
    if (query.sortBy) params.append("sortBy", query.sortBy);
    if (query.sortOrder) params.append("sortOrder", query.sortOrder);

    if (query.tags?.length) {
      query.tags.forEach((tag) => params.append("tags[]", tag));
    }

    const response = await apiService.get(`/blogs/category/${category}?${params}`);

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to fetch blogs by category");
  }

  async getBlogBySlug(slug) {
    const response = await apiService.get(`/blogs/slug/${slug}`);

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Blog not found");
  }

  async getBlogById(id) {
    const response = await apiService.get(`/blogs/${id}`);

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Blog not found");
  }

  async createBlog(blogData) {
    const response = await apiService.post("/blogs", blogData);

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to create blog");
  }

  async updateBlog(blogData) {
    const { id, ...updateData } = blogData;
    const response = await apiService.put(`/blogs/${id}`, updateData);

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to update blog");
  }

  async deleteBlog(id) {
    const response = await apiService.delete(`/blogs/${id}`);

    if (!response.success) {
      throw new Error(response.message || "Failed to delete blog");
    }
  }

  async likeBlog(id) {
    const response = await apiService.post(`/blogs/${id}/like`);

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to like blog");
  }

  async unlikeBlog(id) {
    const response = await apiService.delete(`/blogs/${id}/like`);

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to unlike blog");
  }

  async incrementViewCount(id) {
    try {
      await apiService.post(`/blogs/${id}/view`);
    } catch (error) {
      // View count increment is not critical
      console.warn("Failed to increment view count:", error);
    }
  }

  async getUserBlogs(userId, query = {}) {
    const params = new URLSearchParams();

    params.append("page", String(query.page || PAGINATION.DEFAULT_PAGE));
    params.append("limit", String(query.limit || PAGINATION.BLOG_LIMIT));

    if (query.search) params.append("search", query.search);
    if (query.category) params.append("category", query.category);
    if (query.isPublished !== undefined)
      params.append("isPublished", String(query.isPublished));
    if (query.sortBy) params.append("sortBy", query.sortBy);
    if (query.sortOrder) params.append("sortOrder", query.sortOrder);

    if (query.tags?.length) {
      query.tags.forEach((tag) => params.append("tags[]", tag));
    }

    const endpoint = userId ? `/blogs/user/${userId}` : "/blogs/my";
    const response = await apiService.get(`${endpoint}?${params}`);

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to fetch user blogs");
  }

  async getTags() {
    const response = await apiService.get("/blogs/tags");

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to fetch tags");
  }

  async getCategories() {
    const response = await apiService.get("/blogs/categories");

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to fetch categories");
  }

  async uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiService.post("/blogs/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === "success") {
      return response.data.url;
    }

    throw new Error(response.message || "Failed to upload image");
  }
}

export const blogService = new BlogService();
export default blogService;