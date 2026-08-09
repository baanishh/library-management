import { useEffect, useRef, useState, useCallback } from "react";
import CustomIcon from "../../assets/custom-icon";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  disabled = false,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = options.find((opt) => opt.value === value);

  // close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // keep highlighted option in view + synced to current value when opening
  useEffect(() => {
    if (open) {
      const idx = options.findIndex((opt) => opt.value === value);
      setHighlighted(idx >= 0 ? idx : 0);
    }
  }, [open, value, options]);

  useEffect(() => {
    if (open) {
      listRef.current
        ?.querySelector(`[data-index="${highlighted}"]`)
        ?.scrollIntoView({ block: "nearest" });
    }
  }, [highlighted, open]);

  const selectOption = useCallback(
    (opt: SelectOption) => {
      onChange?.(opt.value);
      setOpen(false);
    },
    [onChange],
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;

    if (
      !open &&
      (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")
    ) {
      e.preventDefault();
      setOpen(true);
      return;
    }

    if (open) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlighted((i) => Math.min(i + 1, options.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlighted((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (options[highlighted]) selectOption(options[highlighted]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      } else if (e.key === "Tab") {
        setOpen(false);
      }
    }
  }

  return (
    <div ref={rootRef} className="relative w-full sm:w-auto">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        className={`flex items-center justify-between gap-2 w-full sm:w-auto px-3.5 pr-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 transition-all
          hover:border-slate-300
          focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-200
          ${open ? "border-slate-400 ring-2 ring-slate-300" : ""}
          ${className}`}
      >
        <span
          className={selected ? "text-slate-700" : "text-slate-400 font-medium"}
        >
          {selected ? selected.label : placeholder}
        </span>
        <CustomIcon
          icon="chevron-down"
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-50 mt-1.5 w-full sm:min-w-40 max-h-60 overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-lg shadow-slate-900/5 py-1.5 origin-top animate-[dropdownIn_140ms_ease-out]"
        >
          {options.map((opt, i) => {
            const isSelected = opt.value === value;
            const isHighlighted = i === highlighted;
            return (
              <li
                key={opt.value}
                data-index={i}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlighted(i)}
                onClick={() => selectOption(opt)}
                className={`flex items-center justify-between gap-2 mx-1.5 px-2.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors
                  ${isSelected ? "text-slate-900" : "text-slate-600"}
                  ${isHighlighted ? "bg-slate-100" : "hover:bg-slate-50"}`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && (
                  <CustomIcon
                    icon="check"
                    className="w-3.5 h-3.5 text-slate-700 shrink-0"
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}

      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-4px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
