import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { LoginPage } from "../pages/login-page";
import { DashboardPage } from "../pages/dashboard-page";
import { CatalogPage } from "../pages/catalog-page";
import { StaffPage } from "../pages/staff-page";
import { HistoryPage } from "../pages/history-page";

import { Layout } from "../components/common/layout";

import { ProtectedRoute, PublicRoute, AdminRoute } from "./route-guard";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="history" element={<HistoryPage />} />

          <Route
            path="staff"
            element={
              <AdminRoute>
                <StaffPage />
              </AdminRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
