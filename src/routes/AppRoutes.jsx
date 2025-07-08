// src/routes/AppRoutes.jsx
import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import DashboardLayout from "../layout/DashboardLayout";
import SignInPage from "../pages/Authentication/SignInPage";
import SignUpPage from "../pages/Authentication/SignUpPage";
import HomePage from "../pages/Home/HomePage";
import PrivateRoute from "./PrivateRoute";
import CreateDonationPage from "../pages/Dashboard/CreateDonationPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <div>404 - Page Not Found</div>,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/signin",
        element: <SignInPage />,
      },
      {
        path: "/signup",
        element: <SignUpPage />,
      },
      {
        path: "/blog",
        element: <div>Blog Page Placeholder</div>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "profile",
        element: <div>Dashboard Profile Page Placeholder</div>,
      },
      {
        path: "create-donation-request",
        element: (
          <PrivateRoute>
            <CreateDonationPage />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
