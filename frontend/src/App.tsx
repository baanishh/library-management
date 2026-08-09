import { useEffect } from "react";
import { useAuthStore } from "./store/auth-store";
import { AppRouter } from "./routes/app-router";

export default function App() {
  useEffect(() => {
    useAuthStore.getState().checkAuth();
  }, []);

  return <AppRouter />;
}
