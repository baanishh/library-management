import type { ReactNode } from "react";

export type BadgeVariant = "emerald" | "violet" | "indigo" | "amber" | "rose" | "slate" | "blue";

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const badgeVariants: Record<BadgeVariant, string> = {
  emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  violet: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  indigo: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  rose: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  slate: "bg-slate-800 text-slate-300 border-slate-700/60",
  blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

export function Badge({ variant = "slate", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${badgeVariants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
