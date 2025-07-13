// src/routes/AppRoutes.jsx
import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import DashboardLayout from "../layout/DashboardLayout";
import SignInPage from "../pages/Authentication/SignInPage";
import SignUpPage from "../pages/Authentication/SignUpPage";
import HomePage from "../pages/Home/HomePage";
import PrivateRoute from "./PrivateRoute";
import CreateDonationPage from "../pages/Dashboard/CreateDonationPage";
import MyDonationRequestPage from "../pages/Dashboard/MyDonationRequestPage";
import FundingPage from "../pages/Funding/FundingPage";
import ProfilePage from "../pages/Dashboard/ProfilePage";
import BloodRequestPage from "../pages/BloodRequest/BloodRequestPage";
import BloodRequestDetails from "../pages/BloodRequest/BloodRequestDetails";
import SearchPage from "../pages/Search/SearchPage";
import ManageUsersPage from "../pages/Dashboard/ManageUsersPage";

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
        path: "/blood-requests",
        element: <BloodRequestPage />,
      },
      {
        path: "/blood-requests/:id",
        element: (
          <PrivateRoute>
            <BloodRequestDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/search",
        element: <SearchPage />,
      },

      {
        path: "/blog",
        element: <div>Blog Page Placeholder</div>,
      },
      {
        path: "/blog",
        element: <div>Blog Page Placeholder</div>,
      },
      {
        path: "/funding",
        element: (
          <PrivateRoute>
            <FundingPage />
          </PrivateRoute>
        ),
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
        element: (
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        ),
      },
      {
        path: "create-donation-request",
        element: (
          <PrivateRoute>
            <CreateDonationPage />
          </PrivateRoute>
        ),
      },
      {
        path: "my-donation-request",
        element: (
          <PrivateRoute>
            <MyDonationRequestPage />
          </PrivateRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <PrivateRoute>
            <ManageUsersPage />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
