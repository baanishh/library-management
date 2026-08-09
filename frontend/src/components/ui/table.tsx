import type { ReactNode } from "react";
import CustomIcon from "../../assets/custom-icon";
import { Pagination } from "./pagination";

export type TableColumn<T> = {
  key: string;
  header: string;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
};

export type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  className?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filterElement?: ReactNode;
  actionButton?: ReactNode;
  // Pagination props
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
};

export function Table<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  emptyMessage = "No records found.",
  emptyIcon = "📄",
  className = "",
  searchPlaceholder,
  searchValue,
  onSearchChange,
  filterElement,
  actionButton,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: TableProps<T>) {
  const showToolbar = onSearchChange || filterElement || actionButton;

  return (
    <div
      className={`w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all ${className}`}
    >
      {showToolbar && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-b border-slate-200/80">
          {/* Left Side: Search & Filter */}
          <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-lg">
            {onSearchChange && (
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <CustomIcon icon="search" className="w-4 h-4" />
                </span>
                <input
                  type="search"
                  value={searchValue || ""}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder || "Search..."}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-all"
                />
              </div>
            )}
            {filterElement}
          </div>
          {/* Right Side: Action Button */}
          {actionButton && (
            <div className="w-full sm:w-auto flex justify-end">
              {actionButton}
            </div>
          )}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-175">
          {/* Signature Red Header Bar */}
          <thead>
            <tr className="bg-[#eb3338] text-white">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider ${
                    col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                        ? "text-right"
                        : "text-left"
                  } ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-[#eb3338]" />
                    <span className="text-xs font-medium text-slate-400">
                      Loading data...
                    </span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <span className="text-3xl">{emptyIcon}</span>
                    <p className="text-sm font-medium text-slate-600">
                      {emptyMessage}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={keyExtractor(item, index)}
                  className="hover:bg-slate-50/90 transition-colors duration-150"
                >
                  {columns.map((col) => {
                    const content = col.render
                      ? col.render(item, index)
                      : (item as Record<string, unknown>)[col.key] !== undefined
                        ? String((item as Record<string, unknown>)[col.key])
                        : "—";

                    return (
                      <td
                        key={col.key}
                        className={`px-5 py-3.5 text-sm align-middle ${
                          col.align === "center"
                            ? "text-center"
                            : col.align === "right"
                              ? "text-right"
                              : "text-left"
                        } ${col.className || ""}`}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {onPageChange && totalPages !== undefined && totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <Pagination
            currentPage={currentPage || 1}
            totalPages={totalPages}
            totalItems={totalItems || 0}
            itemsPerPage={itemsPerPage || 10}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
