import LoginPage from "@/features/auth/pages/LoginPage";
import ProfilePage from "@/features/auth/pages/ProfilePage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import RitualCatalog from "@/features/ritual/pages/RitualCataLog";
import RitualDetail from "@/features/ritual/pages/RitualDetail";
import { GuestRoute } from "@/shared/components/common/GuestRoute";
import { LoadingState } from "@/shared/components/common/LoadingState";
import { ProtectedRoute } from "@/shared/components/common/ProtectedRoute";
import MainLayout from "@/shared/layouts/MainLayout";
import HomePage from "@/shared/pages/HomePage";
import NotFoundPage from "@/shared/pages/NotFoundPage";
import UnauhorizedPage from "@/shared/pages/UnauhorizedPage";
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

const AdminLayout = lazy(() => import("@/shared/layouts/AdminLayout"));
const DashboardPage = lazy(
  () => import("@/features/admin/pages/DashboardPage"),
);
const ManageRitualList = lazy(
  () => import("@/features/ritual/pages/ManageRitualList"),
);
const ManageRitualCreate = lazy(
  () => import("@/features/ritual/pages/ManageRitualCreate"),
);
const ManageRitualEdit = lazy(
  () => import("@/features/ritual/pages/ManageRitualEdit"),
);
const UserManagementPage = lazy(
  () => import("@/features/admin/pages/UserManagementPage"),
);

const withSuspense = (children: React.ReactNode) => (
  <Suspense fallback={<LoadingState />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "rituals", element: <RitualCatalog /> },
      { path: "rituals/:id", element: <RitualDetail /> },
      {
        path: "login",
        element: <GuestRoute>{withSuspense(<LoginPage />)}</GuestRoute>,
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
            {withSuspense(<AdminLayout />)}
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
