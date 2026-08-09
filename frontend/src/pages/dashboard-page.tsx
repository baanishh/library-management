import { useEffect, useState } from "react";
import { bookApi } from "../api/book-api";
import { InfoSection } from "../components/ui";

const initialOverview = {
  totalTitles: 0,
  totalCopies: 0,
  availableCopies: 0,
  borrowedCopies: 0,
  totalUsers: 0,
};

export function DashboardPage() {
  const [overview, setOverview] = useState(initialOverview);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOverview() {
    try {
      const response = await bookApi.getBooks({ page: 1, limit: 1 });
      setOverview(response.overview);
    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOverview();
  }, []);

  const cards = [
    {
      label: "Total Book Copies",
      value: overview.totalCopies,
    },
    {
      label: "Available Stock",
      value: overview.availableCopies,
    },
    {
      label: "Currently Borrowed",
      value: overview.borrowedCopies,
    },
    {
      label: "Total Registered Users",
      value: overview.totalUsers,
    },
  ];

  return (
    <InfoSection
      loading={loading}
      loadingMessage="Loading overview..."
      error={error}
      onClearError={() => setError("")}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome to LibTracker
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Here's what's happening at your library today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="h-44 rounded-3xl border border-slate-200 bg-white p-6"
          >
            <p className="text-xs font-semibold text-slate-500">{card.label}</p>

            <p className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
              {card.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </InfoSection>
  );
}
