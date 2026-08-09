import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { authApi } from "../../api/auth-api";
import { Modal } from "../ui/modal";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export type StaffModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function StaffModal({ isOpen, onClose, onSuccess }: StaffModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setUsername("");
      setPassword("");
      setError("");
    }
  }, [isOpen]);

  async function handleCreateStaff(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please provide both username and password");
      return;
    }

    try {
      setCreating(true);
      await authApi.createStaff(username.trim(), password);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create staff account");
    } finally {
      setCreating(false);
    }
  }

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      title="Add Staff Member"
      onClose={onClose}
      maxWidth="md"
    >
      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleCreateStaff} className="space-y-4">
        <Input
          label="Staff Username"
          variant="light"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. librarian_emma"
        />

        <Input
          label="Temporary Password"
          variant="light"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 6 characters"
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={creating}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" isLoading={creating}>
            Create Staff Account
          </Button>
        </div>
      </form>
    </Modal>
  );
}
