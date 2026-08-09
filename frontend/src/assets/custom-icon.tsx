import {
  Home,
  BookOpen,
  Users,
  ArrowRight,
  LogOut,
  Plus,
  Eye,
  EyeOff,
  Undo2,
  Pencil,
  Trash2,
  Menu,
  Search,
  UserPlus,
  History,
  type LucideProps,
} from "lucide-react";

type IconName =
  | "home"
  | "book-open"
  | "users"
  | "arrow-right"
  | "log-out"
  | "plus"
  | "eye"
  | "eye-off"
  | "return"
  | "edit"
  | "trash"
  | "menu"
  | "search"
  | "user-plus"
  | "history"
  | "sparkline-1"
  | "sparkline-2"
  | "sparkline-3"
  | "sparkline-4";

type CustomIconProps = {
  icon: IconName | string;
  className?: string;
};

const lucideIcons: Record<string, React.FC<LucideProps>> = {
  home: Home,
  "book-open": BookOpen,
  users: Users,
  "arrow-right": ArrowRight,
  "log-out": LogOut,
  plus: Plus,
  eye: Eye,
  "eye-off": EyeOff,
  return: Undo2,
  edit: Pencil,
  trash: Trash2,
  menu: Menu,
  search: Search,
  "user-plus": UserPlus,
  history: History,
};

import type React from "react";

function CustomIcon({ icon, className = "" }: CustomIconProps) {
  if (icon === "sparkline-1") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
      >
        <path
          d="M0 30 Q 20 10, 40 25 T 80 15 T 100 20 L 100 40 L 0 40 Z"
          fill="url(#sg1)"
        />
        <path
          d="M0 30 Q 20 10, 40 25 T 80 15 T 100 20"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient id="sg1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (icon === "sparkline-2") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
      >
        <path
          d="M0 25 Q 25 35, 50 15 T 85 20 T 100 10 L 100 40 L 0 40 Z"
          fill="url(#sg2)"
        />
        <path
          d="M0 25 Q 25 35, 50 15 T 85 20 T 100 10"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (icon === "sparkline-3") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
      >
        <path
          d="M0 20 Q 30 38, 55 18 T 85 30 T 100 25 L 100 40 L 0 40 Z"
          fill="url(#sg3)"
        />
        <path
          d="M0 20 Q 30 38, 55 18 T 85 30 T 100 25"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient id="sg3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (icon === "sparkline-4") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
      >
        <path
          d="M0 32 Q 25 15, 60 30 T 85 10 T 100 18 L 100 40 L 0 40 Z"
          fill="url(#sg4)"
        />
        <path
          d="M0 32 Q 25 15, 60 30 T 85 10 T 100 18"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient id="sg4" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  const Icon = lucideIcons[icon];
  if (!Icon) return null;

  return <Icon className={className} />;
}

export default CustomIcon;
