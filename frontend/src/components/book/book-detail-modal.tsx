import type { Book } from "../../types";
import { Modal } from "../ui/modal";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export type BookDetailModalProps = {
  isOpen: boolean;
  book: Book | null;
  onClose: () => void;
  onBorrow?: (bookId: string) => void;
  onReturn?: (bookId: string) => void;
  isOperatingOpen?: boolean;
};

export function BookDetailModal({
  isOpen,
  book,
  onClose,
  onBorrow,
  onReturn,
  isOperatingOpen = true,
}: BookDetailModalProps) {
  if (!isOpen || !book) return null;

  const isAvailable = (book.availableCopies ?? 0) > 0;
  const isBorrowedOut =
    (book.availableCopies ?? 0) < (book.totalCopies ?? 0);

  return (
    <Modal
      isOpen={isOpen}
      title="Book Details"
      onClose={onClose}
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          <div className="flex items-center gap-2">
            {onReturn && isBorrowedOut && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onReturn(book._id)}
                disabled={!isOperatingOpen}
              >
                Return Book
              </Button>
            )}
            {onBorrow && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onBorrow(book._id)}
                disabled={!isAvailable || !isOperatingOpen}
              >
                {isAvailable ? "Borrow Book" : "Out of Stock"}
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Book Header Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4">
          <div className="w-14 h-18 rounded-xl bg-gradient-to-tr from-[#eb3338] to-[#f45c43] flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-red-500/20 shrink-0">
            📖
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {book.title}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">by {book.author}</p>
            <div className="flex items-center gap-2 mt-2.5">
              <Badge variant="blue">{book.genre}</Badge>
              <Badge variant={isAvailable ? "emerald" : "rose"}>
                {isAvailable
                  ? `${book.availableCopies} available`
                  : "Out of stock"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-slate-500 block mb-1 font-medium">ISBN Number</span>
            <span className="font-mono font-bold text-slate-800 text-sm">
              {book.isbn}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-slate-500 block mb-1 font-medium">Published Year</span>
            <span className="font-bold text-slate-800 text-sm">
              {book.publishedYear}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-slate-500 block mb-1 font-medium">Total Copies</span>
            <span className="font-bold text-slate-800 text-sm">
              {book.totalCopies}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-slate-500 block mb-1 font-medium">Available In Library</span>
            <span className="font-bold text-emerald-600 text-sm">
              {book.availableCopies}
            </span>
          </div>
        </div>

        {/* Timestamp Info */}
        <div className="text-[11px] text-slate-400 flex justify-between px-1 pt-2 border-t border-slate-100">
          <span>Added: {new Date(book.createdAt).toLocaleDateString()}</span>
          <span>Book ID: {book._id.slice(-8)}</span>
        </div>
      </div>
    </Modal>
  );
}
