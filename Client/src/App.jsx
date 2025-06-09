import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PrivateRoute } from "@/components/shared/PrivateRoute";
import { ROUTES } from "@/utils/constant";

// Import pages
import { Home } from "./pages/Home";
import { BlogDetails } from "./pages/BlogDetails";
import { Login } from "./pages/Login";
import Register from "./pages/Register";
import { CreateBlog } from "./pages/CreateBlog";
import { Dashboard } from "./pages/Dashboard";
import { MyBlogs } from "./pages/MyBlogs";
import Profile from "./pages/Profile";
import { EditBlog } from "./pages/EditBlog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path={ROUTES.HOME} element={<Home />} />
                  <Route
                    path={`${ROUTES.BLOG_DETAILS}/:slug`}
                    element={<BlogDetails />}
                  />
                  <Route path={ROUTES.LOGIN} element={<Login />} />
                  <Route path={ROUTES.REGISTER} element={<Register />} />

                  {/* Protected Routes */}
                  <Route
                    path={ROUTES.CREATE_BLOG}
                    element={
                      <PrivateRoute>
                        <CreateBlog />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={`${ROUTES.EDIT_BLOG}/:id`}
                    element={
                      <PrivateRoute>
                        <EditBlog />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={ROUTES.DASHBOARD}
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={ROUTES.MY_BLOGS}
                    element={
                      <PrivateRoute>
                        <MyBlogs />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={ROUTES.PROFILE}
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />

                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
