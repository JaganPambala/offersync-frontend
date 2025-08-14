import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { navigationLinks } from "../utils/constants";
// Pages
import Login from "../pages/auth/login";
import Register from "../pages/auth/signup";
import Dashboard from "../pages/dashboard";
import Offers from "../pages/offer";
import CandidateCheck from "../pages/CandidateCheck";
import Communications from "../pages/Communication";
import NotFound from "../pages/notFound"; // create this page

// Layouts
import MainLayout from "../layout/mainLayout";
import AuthLayout from "../layout/authLayout"; // make sure you have this
import ProtectedRoute from "./protectedRoutes";

// Define routes
const router = createBrowserRouter([
  // Auth pages
  {
    element: <AuthLayout />,
    children: [
      { path: navigationLinks.login.path, element: <Login /> },
      { path: navigationLinks.register.path, element: <Register /> }
    ]
  },

  // Public pages (no authentication needed)
  {
    element: <MainLayout />,
    children: [
      { path: navigationLinks.home.path, element: <Dashboard /> }
    ]
  },

  // Protected pages (authentication required)
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: navigationLinks.candidateCheck.path, element: <CandidateCheck /> },
      { path: navigationLinks.offers.path, element: <Offers /> },
      { path: navigationLinks.communications.path, element: <Communications /> }
    ]
  },

  { path: "*", element: <NotFound /> }
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
