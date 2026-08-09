import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth-store";
import { bookApi, type BookInput } from "../api/book-api";
import { transactionApi } from "../api/transaction-api";
import CustomIcon from "../assets/custom-icon";
import type { Book, Pagination as PaginationType } from "../types";
import {
  Table,
  type TableColumn,
  Button,
  Badge,
  Select,
  type SelectOption,
} from "../components/ui";
import { ConfirmModal } from "../components/common/confirm-modal";
import { BookModal } from "../components/book/book-modal";
import { BookDetailModal } from "../components/book/book-detail-modal";

type Alert = {
  type: "success" | "error";
  message: string;
};

const genreOptions: SelectOption[] = [
  { value: "", label: "All Genres" },
  { value: "Fiction", label: "Fiction" },
  { value: "Non-Fiction", label: "Non-Fiction" },
  { value: "Science", label: "Science" },
  { value: "Technology", label: "Technology" },
  { value: "History", label: "History" },
  { value: "Philosophy", label: "Philosophy" },
];

export function CatalogPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";

  const [books, setBooks] = useState<Book[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [viewingBook, setViewingBook] = useState<Book | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [alert, setAlert] = useState<Alert | null>(null);

  async function fetchBooks() {
    try {
      setLoading(true);
      const response = await bookApi.getBooks({
        page,
        limit: 10,
        search: search || undefined,
        genre: genre || undefined,
      });
      setBooks(response.books);
      setPagination(response.pagination);
    } catch (error) {
      setAlert({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to load books",
      });
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchBooks(); }, [page, search, genre]);


  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleGenreChange(value: string) {
    setGenre(value);
    setPage(1);
  }

  async function handleTransaction(
    bookId: string,
    action: "borrow" | "return",
  ) {
    try {
      setActionLoadingId(bookId);

      const response =
        action === "borrow"
          ? await transactionApi.borrowBook(bookId)
          : await transactionApi.returnBook(bookId);

      setAlert({
        type: "success",
        message: response.message,
      });

      await fetchBooks();
    } catch (error) {
      setAlert({
        type: "error",
        message:
          error instanceof Error ? error.message : `Failed to ${action} book`,
      });
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleSaveBook(data: BookInput) {
    try {
      if (editingBook) {
        await bookApi.updateBook(editingBook._id, data);

        setAlert({
          type: "success",
          message: "Book updated successfully",
        });
      } else {
        await bookApi.createBook(data);

        setAlert({
          type: "success",
          message: "Book added successfully",
        });
      }

      setBookModalOpen(false);
      setEditingBook(null);

      await fetchBooks();
    } catch (error) {
      setAlert({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to save book",
      });
    }
  }

  async function handleDeleteBook() {
    if (!deletingId) return;

    try {
      await bookApi.deleteBook(deletingId);

      setAlert({
        type: "success",
        message: "Book deleted successfully",
      });

      setDeletingId(null);

      await fetchBooks();
    } catch (error) {
      setAlert({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to delete book",
      });
    }
  }

  function openEditModal(book: Book) {
    setEditingBook(book);
    setBookModalOpen(true);
  }

  function openAddModal() {
    setEditingBook(null);
    setBookModalOpen(true);
  }

  function closeBookModal() {
    setBookModalOpen(false);
    setEditingBook(null);
  }

  const columns: TableColumn<Book>[] = [
    {
      key: "_id",
      header: "ID",
      render: (book) => (
        <span className="font-mono text-xs font-medium text-slate-500">
          {book._id.slice(-8)}
        </span>
      ),
    },
    {
      key: "title",
      header: "Book Details",
      render: (book) => (
        <div className="flex items-center gap-3">
          <div>
            <p className="font-bold leading-tight text-slate-900">
              {book.title}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">{book.author}</p>
          </div>
        </div>
      ),
    },
    {
      key: "isbn",
      header: "ISBN",
      render: (book) => (
        <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
          {book.isbn}
        </span>
      ),
    },
    {
      key: "genre",
      header: "Genre",
      render: (book) => <Badge variant="blue">{book.genre}</Badge>,
    },
    {
      key: "availableCopies",
      header: "Stock",
      render: (book) => {
        const isAvailable = book.availableCopies > 0;

        return (
          <div className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${
                isAvailable ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />

            <span className="text-xs font-semibold text-slate-700">
              {book.availableCopies} / {book.totalCopies}
            </span>
          </div>
        );
      },
    },
    {
      key: "publishedYear",
      header: "Year",
      render: (book) => (
        <span className="text-xs text-slate-600">{book.publishedYear}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (book) => {
        const isAvailable = book.availableCopies > 0;
        const isBorrowed = book.availableCopies < book.totalCopies;
        const isBusy = actionLoadingId === book._id;

        return (
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              disabled={!isAvailable || isBusy}
              onClick={() => handleTransaction(book._id, "borrow")}
              title={isAvailable ? "Borrow Book" : "Out of Stock"}
              className="cursor-pointer rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-emerald-50 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <CustomIcon icon="plus" className="h-4 w-4" />
            </button>

            <button
              type="button"
              disabled={!isBorrowed || isBusy}
              onClick={() => handleTransaction(book._id, "return")}
              title={isBorrowed ? "Return Book" : "All Copies Present"}
              className="cursor-pointer rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <CustomIcon icon="return" className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setViewingBook(book)}
              title="View Details"
              className="cursor-pointer rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <CustomIcon icon="eye" className="h-4 w-4" />
            </button>

            {isAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => openEditModal(book)}
                  title="Edit Book"
                  className="cursor-pointer rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <CustomIcon icon="edit" className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setDeletingId(book._id)}
                  title="Delete Book"
                  className="cursor-pointer rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <CustomIcon icon="trash" className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        );
      },
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
            Books
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Manage all library books. View availability, borrow, return, and
            edit records.
          </p>
        </div>

        <Table
          columns={columns}
          data={books}
          keyExtractor={(book) => book._id}
          loading={loading}
          emptyMessage={
            search || genre
              ? "No matching books found."
              : "No books in the inventory yet."
          }
          searchPlaceholder="Search books..."
          searchValue={search}
          onSearchChange={handleSearchChange}
          filterElement={
            <Select
              value={genre}
              onChange={handleGenreChange}
              options={genreOptions}
            />
          }
          actionButton={
            isAdmin ? (
              <Button
                size="sm"
                variant="primary"
                onClick={openAddModal}
                leftIcon={<CustomIcon icon="plus" className="h-4 w-4" />}
              >
                Add Book
              </Button>
            ) : undefined
          }
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={setPage}
        />
      </div>

      <BookModal
        isOpen={bookModalOpen}
        bookToEdit={editingBook}
        onClose={closeBookModal}
        onSubmit={handleSaveBook}
      />

      <BookDetailModal
        isOpen={Boolean(viewingBook)}
        book={viewingBook}
        onClose={() => setViewingBook(null)}
        onBorrow={(bookId) => handleTransaction(bookId, "borrow")}
        onReturn={(bookId) => handleTransaction(bookId, "return")}
      />

      <ConfirmModal
        isOpen={Boolean(deletingId)}
        title="Delete Book"
        message="Are you sure you want to delete this book record from the inventory?"
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteBook}
      />
    </>
  );
}
