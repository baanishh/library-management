import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth-store";
import { authApi } from "../api/auth-api";
import CustomIcon from "../assets/custom-icon";
import type { User } from "../types";
import {
  Table,
  type TableColumn,
  Button,
  Badge,
  Select,
  type SelectOption,
} from "../components/ui";
import { StaffModal } from "../components/common/staff-modal";

type Alert = {
  type: "success" | "error";
  message: string;
};

const roleOptions: SelectOption[] = [
  { value: "", label: "All Roles" },
  { value: "ADMIN", label: "ADMIN" },
  { value: "STAFF", label: "STAFF" },
];

export function StaffPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchUsers() {
    try {
      setLoading(true);

      const data = await authApi.getUsers();
      setUsers(data);
    } catch (error) {
      setAlert({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to load users",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleDeleteUser(id: string) {
    try {
      setDeletingId(id);
      await authApi.deleteUser(id);
      setAlert({ type: "success", message: "User deleted successfully." });
      await fetchUsers();
    } catch (error) {
      setAlert({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to delete user",
      });
    } finally {
      setDeletingId(null);
    }
  }

  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      !searchValue ||
      user.username.toLowerCase().includes(searchValue) ||
      user._id.toLowerCase().includes(searchValue);

    const matchesRole = !role || user.role === role;

    return matchesSearch && matchesRole;
  });

  const columns: TableColumn<User>[] = [
    {
      key: "_id",
      header: "ID",
      render: (user) => (
        <span className="font-mono text-xs text-slate-500">
          {user._id.slice(-8)}
        </span>
      ),
    },
    {
      key: "username",
      header: "Username",
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold uppercase text-slate-700">
            {user.username.charAt(0)}
          </div>

          <div>
            <p className="font-semibold text-slate-900">{user.username}</p>

            <p className="text-xs text-slate-500">
              {user.role.toLowerCase()}@libtracker.local
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (user) => (
        <Badge variant={user.role === "ADMIN" ? "violet" : "emerald"}>
          {user.role}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Joined At",
      render: (user) => (
        <span className="text-xs text-slate-600">
          {new Date(user.createdAt).toLocaleString()}
        </span>
      ),
    },
    ...(isAdmin
      ? [
          {
            key: "actions",
            header: "",
            align: "right" as const,
            render: (u: User) =>
              u._id === user?._id ? null : (
                <button
                  type="button"
                  disabled={deletingId === u._id}
                  onClick={() => handleDeleteUser(u._id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CustomIcon icon="trash" className="h-3.5 w-3.5" />
                  {deletingId === u._id ? "Deleting..." : "Delete"}
                </button>
              ),
          },
        ]
      : []),
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
            Users
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Manage registered users and staff members.
          </p>
        </div>

        <Table
          columns={columns}
          data={filteredUsers}
          keyExtractor={(user) => user._id}
          loading={loading}
          emptyMessage="No registered users found."
          searchPlaceholder="Search users..."
          searchValue={search}
          onSearchChange={setSearch}
          filterElement={
            <Select
              value={role}
              onChange={setRole}
              options={roleOptions}
            />
          }
          actionButton={
            isAdmin ? (
              <Button
                size="sm"
                variant="primary"
                onClick={() => setStaffModalOpen(true)}
                leftIcon={<CustomIcon icon="user-plus" className="h-4 w-4" />}
              >
                Add Staff
              </Button>
            ) : undefined
          }
        />
      </div>

      {isAdmin && (
        <StaffModal
          isOpen={staffModalOpen}
          onSuccess={fetchUsers}
          onClose={() => setStaffModalOpen(false)}
        />
      )}
    </>
  );
}
