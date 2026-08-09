import type { InputHTMLAttributes, ReactNode } from "react";

export type InputVariant = "light" | "dark";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: InputVariant;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
}

const variantStyles: Record<InputVariant, string> = {
  light:
    "bg-[#edf2f7] border-transparent text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:bg-white",
  dark:
    "bg-slate-800/80 border-slate-700/80 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:bg-slate-900",
};

const labelStyles: Record<InputVariant, string> = {
  light: "text-slate-800",
  dark: "text-slate-300",
};

export function Input({
  label,
  error,
  helperText,
  variant = "dark",
  leftIcon,
  rightElement,
  id,
  className = "",
  required,
  ...props
}: InputProps) {
  const inputId =
    id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-xs font-semibold mb-1.5 ${labelStyles[variant]}`}
        >
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          required={required}
          className={`w-full py-3 text-sm rounded-xl border focus:outline-none transition-all ${
            leftIcon ? "pl-10" : "px-4"
          } ${rightElement ? "pr-11" : "px-4"} ${
            error
              ? "border-rose-500/80 bg-rose-50 text-rose-900 focus:border-rose-500"
              : variantStyles[variant]
          } ${className}`}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-3.5 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-rose-500 mt-1.5 font-medium">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-xs text-slate-400 mt-1.5">{helperText}</p>
      )}
    </div>
  );
}
