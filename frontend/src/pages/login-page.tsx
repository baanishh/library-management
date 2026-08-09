import { useState } from "react";
import type { FormEvent } from "react";
import { useAuthStore } from "../store/auth-store";
import { Input, Button } from "../components/ui";
import CustomIcon from "../assets/custom-icon";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const { login, loading } = useAuthStore();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalError("");

    if (!username.trim() || !password.trim()) {
      setLocalError("Please enter both username and password");
      return;
    }

    try {
      await login(username.trim(), password);
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Invalid username or password",
      );
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      {/* Left side: Vibrant Coral-Pink Gradient */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-linear-to-tr from-[#f43f5e] via-[#eb3349] to-[#f45c43] text-white">
        <div />
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            libtracker<span className="text-white">.</span>
          </h2>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white min-h-screen">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Enter your details to access your account.
            </p>
          </div>

          {localError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-center font-medium">
              {localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="username"
              label="Username"
              variant="light"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />

            <Input
              id="password"
              label="Password"
              variant="light"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <CustomIcon icon="eye-off" className="w-4 h-4" />
                  ) : (
                    <CustomIcon icon="eye" className="w-4 h-4" />
                  )}
                </button>
              }
            />

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() =>
                  setLocalError(
                    "Please contact your system administrator to reset credentials.",
                  )
                }
                className="text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Forgot your password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={loading}
              className="mt-2"
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
