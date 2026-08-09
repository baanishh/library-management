import type { ReactNode } from "react";

export type InfoSectionProps = {
  loading?: boolean;
  loadingMessage?: string;
  error?: string;
  onClearError?: () => void;
  children: ReactNode;
};

export function InfoSection({
  loading = false,
  loadingMessage = "Loading data...",
  error = "",
  onClearError,
  children,
}: InfoSectionProps) {
  if (error) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
        <span>{error}</span>
        {onClearError && (
          <button
            type="button"
            onClick={onClearError}
            className="ml-3 text-base hover:opacity-70 cursor-pointer"
            aria-label="Close error"
          >
            ×
          </button>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-[#eb3338]" />
        <span className="text-xs text-slate-400">{loadingMessage}</span>
      </div>
    );
  }

  return <>{children}</>;
}
