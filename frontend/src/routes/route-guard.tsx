import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth-store";

type Props = {
  children: ReactNode;
};

function Loader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200" />
    </div>
  );
}

export function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuthStore();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export function PublicRoute({ children }: Props) {
  const { user, loading } = useAuthStore();

  if (loading) return <Loader />;
  if (user) return <Navigate to="/" replace />;

  return children;
}

export function AdminRoute({ children }: Props) {
  const { user } = useAuthStore();

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}
