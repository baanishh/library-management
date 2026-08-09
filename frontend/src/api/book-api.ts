import { apiFetch } from "./client";
import type { Book, Pagination, DashboardOverview } from "../types";

export type BookInput = {
  title: string;
  author: string;
  isbn: string;
  genre: string;
  publishedYear: number;
  totalCopies: number;
  availableCopies?: number;
};

export interface BookListResponse {
  books: Book[];
  pagination: Pagination;
  overview: DashboardOverview;
}

export interface GetBooksParams {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
}

export const bookApi = {
  getBooks: (params: GetBooksParams = {}) => {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.limit !== undefined) query.set("limit", String(params.limit));
    if (params.search?.trim()) query.set("search", params.search.trim());
    if (params.genre?.trim()) query.set("genre", params.genre.trim());

    const qs = query.toString();
    return apiFetch<BookListResponse>(`/api/books${qs ? `?${qs}` : ""}`);
  },

  getBookById: (id: string) => apiFetch<Book>(`/api/books/${id}`),

  createBook: (data: BookInput) =>
    apiFetch<Book>("/api/books", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateBook: (id: string, data: Partial<BookInput>) =>
    apiFetch<Book>(`/api/books/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteBook: (id: string) =>
    apiFetch(`/api/books/${id}`, {
      method: "DELETE",
    }),
};
