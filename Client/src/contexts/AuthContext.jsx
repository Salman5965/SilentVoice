import React, { createContext, useContext, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const auth = useAuth();

  useEffect(() => {
    // Initialize auth state from stored data
    auth.initializeAuth();
  }, []);

  const value = {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    login: auth.login,
    register: auth.register,
    logout: auth.logout,
    updateProfile: auth.updateProfile,
    changePassword: auth.changePassword,
    clearError: auth.clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
