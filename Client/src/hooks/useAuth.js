// import { useAuthStore } from "@/features/auth/authStore";

// export const useAuth = () => {
//   const {
//     user,
//     isAuthenticated,
//     isLoading,
//     error,
//     login,
//     register,
//     logout,
//     getCurrentUser,
//     updateProfile,
//     changePassword,
//     initializeAuth,
//     clearError,
//   } = useAuthStore();

//   return {
//     // State
//     user,
//     isAuthenticated,
//     isLoading,
//     error,

//     // Actions
//     login: async (credentials) => {
//       await login(credentials);
//     },

//     register: async (userData) => {
//       await register(userData);
//     },

//     logout: async () => {
//       await logout();
//     },

//     getCurrentUser: async () => {
//       await getCurrentUser();
//     },

//     updateProfile: async (userData) => {
//       await updateProfile(userData);
//     },

//     changePassword: async (currentPassword, newPassword) => {
//       await changePassword(currentPassword, newPassword);
//     },

//     initializeAuth,
//     clearError,
//   };
// };





import { useAuthStore } from "@/features/auth/authStore";

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    getCurrentUser,
    updateProfile,
    changePassword,
    initializeAuth,
    clearError,
  } = useAuthStore();

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login: (credentials) => {
      return login(credentials); // Return promise so errors propagate
    },

    register: (userData) => {
      return register(userData);
    },

    logout: () => {
      return logout();
    },

    getCurrentUser: () => {
      return getCurrentUser();
    },

    updateProfile: (userData) => {
      return updateProfile(userData);
    },

    changePassword: (currentPassword, newPassword) => {
      return changePassword(currentPassword, newPassword);
    },

    initializeAuth,
    clearError,
  };
};
