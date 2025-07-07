// src/routes/AppRoutes.jsx
import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import DashboardLayout from "../layout/DashboardLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <div>404 - Page Not Found</div>,
    children: [
      {
        path: "/",
        element: <div>Home Page Placeholder</div>,
      },
      {
        path: "/login",
        element: <div>Login Page Placeholder</div>,
      },
      {
        path: "/register",
        element: <div>Register Page Placeholder</div>,
      },
      {
        path: "/blog",
        element: <div>Blog Page Placeholder</div>,
      },
      {
        path: "/search",
        element: <div>Search Page Placeholder</div>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "profile",
        element: <div>Dashboard Profile Page Placeholder</div>,
      },
    ],
  },
]);
