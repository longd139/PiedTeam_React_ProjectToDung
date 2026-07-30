import DashboardPage from "@/features/admin/pages/DashboardPage";

import UserManagementPage from "@/features/admin/pages/UserManagementPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import ProfilePage from "@/features/auth/pages/ProfilePage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ManageRitualCreate from "@/features/ritual/pages/ManageRitualCreate";
import ManageRitualEdit from "@/features/ritual/pages/ManageRitualEdit";
import ManageRitualList from "@/features/ritual/pages/ManageRitualList";
import RitualCatalog from "@/features/ritual/pages/RitualCataLog";
import RitualDetail from "@/features/ritual/pages/RitualDetail";
import { GuestRoute } from "@/shared/components/common/GuestRoute";
import { ProtectedRoute } from "@/shared/components/common/ProtectedRoute";
import AdminLayout from "@/shared/layouts/AdminLayout";
import MainLayout from "@/shared/layouts/MainLayout";
import HomePage from "@/shared/pages/HomePage";
import NotFoundPage from "@/shared/pages/NotFoundPage";

import UnauhorizedPage from "@/shared/pages/UnauhorizedPage";

import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "rituals", element: <RitualCatalog /> },
      { path: "rituals/:id", element: <RitualDetail /> },
      {
        path: "login",
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: "register",
        element: (
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        ),
      },
      { path: "unauthorized", element: <UnauhorizedPage /> },

      // Protected: cần đăng nhập
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      // 404 fallback cho userLayout
      { path: "*", element: <NotFoundPage /> },

      // Admin layout
      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRole={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "rituals", element: <ManageRitualList /> },
          {
            path: "rituals/create",
            element: <ManageRitualCreate />,
          },
          {
            path: "rituals/:id/edit",
            element: <ManageRitualEdit />,
          },
          { path: "users", element: <UserManagementPage /> },
        ],
      },
    ],
  },
]);
