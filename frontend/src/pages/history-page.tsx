import { useEffect, useState } from "react";
import { transactionApi } from "../api/transaction-api";
import type { Transaction, Pagination as PaginationType } from "../types";
import { Table, type TableColumn, Badge } from "../components/ui";

type Alert = {
  type: "success" | "error";
  message: string;
};

export function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<Alert | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);
        const response = await transactionApi.getHistory(page, 10);
        setTransactions(response.transactions);
        setPagination(response.pagination);
      } catch (error) {
        setAlert({
          type: "error",
          message: error instanceof Error ? error.message : "Failed to load history",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [page]);

  const columns: TableColumn<Transaction>[] = [
    {
      key: "type",
      header: "Action",
      render: (tx) => (
        <Badge variant={tx.type === "BORROW" ? "indigo" : "emerald"}>
          {tx.type}
        </Badge>
      ),
    },
    {
      key: "bookId",
      header: "Book Details",
      render: (tx) => (
        <div>
          <p className="font-semibold text-slate-900">
            {tx.bookId?.title || "Unknown Book"}
          </p>
          <p className="text-xs text-slate-500">
            by {tx.bookId?.author || "—"}
          </p>
        </div>
      ),
    },
    {
      key: "isbn",
      header: "ISBN",
      render: (tx) => (
        <span className="font-mono text-xs text-slate-500">
          {tx.bookId?.isbn || "—"}
        </span>
      ),
    },
    {
      key: "userId",
      header: "User Details",
      render: (tx) => (
        <div>
          <p className="font-semibold text-slate-900">
            {tx.userId?.username || "—"}
          </p>
          <p className="text-xs text-slate-500">
            Role: {tx.userId?.role || "STAFF"}
          </p>
        </div>
      ),
    },
    {
      key: "timestamp",
      header: "Date & Time",
      render: (tx) => (
        <span className="text-xs text-slate-600">
          {new Date(tx.timestamp || tx.createdAt).toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <>
      {alert && (
        <div
          className={`mb-6 flex items-center justify-between rounded-2xl border p-4 text-xs font-semibold ${
            alert.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <span>{alert.message}</span>
          <button
            type="button"
            onClick={() => setAlert(null)}
            className="ml-3 cursor-pointer text-base leading-none hover:opacity-75"
          >
            ×
          </button>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            History Log
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Audit logs of all borrow and return transactions.
          </p>
        </div>

        <Table
          columns={columns}
          data={transactions}
          keyExtractor={(tx) => tx._id}
          loading={loading}
          emptyMessage="No transaction logs found."
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={setPage}
        />
      </div>
    </>
  );
}
