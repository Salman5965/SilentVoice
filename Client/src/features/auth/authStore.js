import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { authService } from "@/services/authService";

export const useAuthStore = create(
  devtools(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null });
          const { user } = await authService.login(credentials);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Login failed",
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
          throw error;
        }
      },

      register: async (userData) => {
        try {
          set({ isLoading: true, error: null });
          const { user } = await authService.register(userData);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Registration failed",
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          await authService.logout();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          // Even if logout fails, clear local state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      getCurrentUser: async () => {
        try {
          set({ isLoading: true, error: null });
          const user = await authService.getCurrentUser();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to get user",
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
          authService.logout(); // Clear invalid auth data
        }
      },

      updateProfile: async (userData) => {
        try {
          set({ isLoading: true, error: null });
          const user = await authService.updateProfile(userData);
          set({
            user,
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to update profile",
            isLoading: false,
          });
          throw error;
        }
      },

      changePassword: async (currentPassword, newPassword) => {
        try {
          set({ isLoading: true, error: null });
          await authService.changePassword(currentPassword, newPassword);
          set({ isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to change password",
            isLoading: false,
          });
          throw error;
        }
      },

      initializeAuth: () => {
        const storedUser = authService.getStoredUser();
        const isAuthenticated = authService.isAuthenticated();

        if (storedUser && isAuthenticated) {
          set({
            user: storedUser,
            isAuthenticated: true,
            isLoading: false,
          });

          get()
            .getCurrentUser()
            .catch(() => {
              // If validation fails, auth will be cleared
            });
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "auth-store",
    },
  ),
);
