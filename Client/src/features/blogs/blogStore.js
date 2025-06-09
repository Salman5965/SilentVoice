import  create  from "zustand";
import { devtools } from "zustand/middleware";
import { blogService } from "@/services/blogService";
import { PAGINATION } from "@/utils/constant";

const initialFilters = {
  search: "",
  tags: [],
  author: undefined,
};

const initialPagination = {
  page: PAGINATION.DEFAULT_PAGE,
  limit: PAGINATION.BLOG_LIMIT,
  total: 0,
  totalPages: 0,
};

export const useBlogStore = create(
  devtools(
    (set, get) => ({
      blogs: [],
      currentBlog: null,
      isLoading: false,
      error: null,
      filters: initialFilters,
      pagination: initialPagination,

      getBlogs: async (query) => {
        try {
          set({ isLoading: true, error: null });
          const { filters, pagination } = get();

          const mergedQuery = {
            ...query,
            page: query?.page || pagination.page,
            limit: query?.limit || pagination.limit,
            search: query?.search || filters.search,
            tags: query?.tags || filters.tags,
            author: query?.author || filters.author,
          };

          const response = await blogService.getBlogs(mergedQuery);

          set({
            blogs: response.data,
            pagination: response.pagination,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch blogs",
            isLoading: false,
          });
        }
      },

      getBlogBySlug: async (slug) => {
        try {
          set({ isLoading: true, error: null });
          const blog = await blogService.getBlogBySlug(slug);
          blogService.incrementViewCount(blog.id);
          set({
            currentBlog: blog,
            isLoading: false,
          });
          return blog;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Blog not found",
            isLoading: false,
            currentBlog: null,
          });
          throw error;
        }
      },

      getBlogById: async (id) => {
        try {
          set({ isLoading: true, error: null });
          const blog = await blogService.getBlogById(id);
          set({
            currentBlog: blog,
            isLoading: false,
          });
          return blog;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Blog not found",
            isLoading: false,
            currentBlog: null,
          });
          throw error;
        }
      },

      createBlog: async (blogData) => {
        try {
          set({ isLoading: true, error: null });
          const blog = await blogService.createBlog(blogData);
          const { blogs } = get();
          set({
            blogs: [blog, ...blogs],
            currentBlog: blog,
            isLoading: false,
          });
          return blog;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to create blog",
            isLoading: false,
          });
          throw error;
        }
      },

      updateBlog: async (blogData) => {
        try {
          set({ isLoading: true, error: null });
          const updatedBlog = await blogService.updateBlog(blogData);
          const { blogs, currentBlog } = get();
          const updatedBlogs = blogs.map((blog) =>
            blog.id === updatedBlog.id ? updatedBlog : blog
          );
          set({
            blogs: updatedBlogs,
            currentBlog: currentBlog?.id === updatedBlog.id ? updatedBlog : currentBlog,
            isLoading: false,
          });
          return updatedBlog;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to update blog",
            isLoading: false,
          });
          throw error;
        }
      },

      deleteBlog: async (id) => {
        try {
          set({ isLoading: true, error: null });
          await blogService.deleteBlog(id);
          const { blogs, currentBlog } = get();
          const filteredBlogs = blogs.filter((blog) => blog.id !== id);
          set({
            blogs: filteredBlogs,
            currentBlog: currentBlog?.id === id ? null : currentBlog,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to delete blog",
            isLoading: false,
          });
          throw error;
        }
      },

      likeBlog: async (id) => {
        try {
          const result = await blogService.likeBlog(id);
          const { blogs, currentBlog } = get();
          const updatedBlogs = blogs.map((blog) =>
            blog.id === id ? { ...blog, likeCount: result.likeCount } : blog
          );
          set({
            blogs: updatedBlogs,
            currentBlog: currentBlog?.id === id ? { ...currentBlog, likeCount: result.likeCount } : currentBlog,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to like blog",
          });
        }
      },

      unlikeBlog: async (id) => {
        try {
          const result = await blogService.unlikeBlog(id);
          const { blogs, currentBlog } = get();
          const updatedBlogs = blogs.map((blog) =>
            blog.id === id ? { ...blog, likeCount: result.likeCount } : blog
          );
          set({
            blogs: updatedBlogs,
            currentBlog: currentBlog?.id === id ? { ...currentBlog, likeCount: result.likeCount } : currentBlog,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to unlike blog",
          });
        }
      },

      getUserBlogs: async (userId, query) => {
        try {
          set({ isLoading: true, error: null });
          const { pagination } = get();
          const mergedQuery = {
            ...query,
            page: query?.page || pagination.page,
            limit: query?.limit || pagination.limit,
          };
          const response = await blogService.getUserBlogs(userId, mergedQuery);
          set({
            blogs: response.data,
            pagination: response.pagination,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch user blogs",
            isLoading: false,
          });
        }
      },

      setCurrentBlog: (blog) => {
        set({ currentBlog: blog });
      },

      updateFilters: (newFilters) => {
        const { filters } = get();
        set({
          filters: { ...filters, ...newFilters },
          pagination: { ...get().pagination, page: 1 },
        });
      },

      resetFilters: () => {
        set({
          filters: initialFilters,
          pagination: { ...get().pagination, page: 1 },
        });
      },

      setPage: (page) => {
        set({
          pagination: { ...get().pagination, page },
        });
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "blog-store",
    }
  )
);
