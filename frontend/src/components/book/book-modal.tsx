import { useState } from "react";
import type { FormEvent } from "react";
import type { Book } from "../../types";
import { Modal } from "../ui/modal";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export type BookModalProps = {
  isOpen: boolean;
  bookToEdit?: Book | null;
  onClose: () => void;
  onSubmit: (data: Omit<Book, "_id" | "createdAt" | "updatedAt">) => Promise<void>;
};

interface BookFormProps {
  bookToEdit?: Book | null;
  onClose: () => void;
  onSubmit: (data: Omit<Book, "_id" | "createdAt" | "updatedAt">) => Promise<void>;
}

function BookForm({ bookToEdit, onClose, onSubmit }: BookFormProps) {
  const [title, setTitle] = useState(bookToEdit?.title || "");
  const [author, setAuthor] = useState(bookToEdit?.author || "");
  const [isbn, setIsbn] = useState(bookToEdit?.isbn || "");
  const [genre, setGenre] = useState(bookToEdit?.genre || "");
  const [publishedYear, setPublishedYear] = useState(
    bookToEdit?.publishedYear || new Date().getFullYear()
  );
  const [totalCopies, setTotalCopies] = useState(bookToEdit?.totalCopies || 5);
  const [availableCopies, setAvailableCopies] = useState(
    bookToEdit?.availableCopies || 5
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title || !author || !isbn || !genre) {
      setError("Please fill out all required fields.");
      return;
    }

    if (availableCopies > totalCopies) {
      setError("Available copies cannot exceed total copies.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await onSubmit({
        title,
        author,
        isbn,
        genre,
        publishedYear: Number(publishedYear),
        totalCopies: Number(totalCopies),
        availableCopies: Number(availableCopies),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save book");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          variant="light"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Design Patterns"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Author"
            variant="light"
            required
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. Erich Gamma"
          />
          <Input
            label="Genre"
            variant="light"
            required
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="e.g. Computer Science"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="ISBN"
            variant="light"
            required
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            placeholder="e.g. 978-0201633610"
          />
          <Input
            label="Published Year"
            variant="light"
            type="number"
            required
            value={publishedYear}
            onChange={(e) => setPublishedYear(Number(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Total Copies"
            variant="light"
            type="number"
            min={1}
            required
            value={totalCopies}
            onChange={(e) => {
              const val = Number(e.target.value);
              setTotalCopies(val);
              if (!bookToEdit) setAvailableCopies(val);
            }}
          />
          <Input
            label="Available Copies"
            variant="light"
            type="number"
            min={0}
            required
            value={availableCopies}
            onChange={(e) => setAvailableCopies(Number(e.target.value))}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" isLoading={loading}>
            {bookToEdit ? "Save Changes" : "Create Book"}
          </Button>
        </div>
      </form>
    </>
  );
}

export function BookModal({ isOpen, bookToEdit, onClose, onSubmit }: BookModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      title={bookToEdit ? "Edit Book" : "Add New Book"}
      onClose={onClose}
      maxWidth="md"
    >
      <BookForm
        key={bookToEdit?._id || "new"}
        bookToEdit={bookToEdit}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </Modal>
  );
}
