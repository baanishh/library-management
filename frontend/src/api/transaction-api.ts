import { apiFetch } from "./client";
import type { Transaction, Pagination } from "../types";

type TransactionResult = {
  message: string;
  availableCopies: number;
};

type HistoryResponse = {
  transactions: Transaction[];
  pagination: Pagination;
};

export const transactionApi = {
  borrowBook: (bookId: string) =>
    apiFetch<TransactionResult>(`/api/transactions/borrow/${bookId}`, {
      method: "POST",
    }),

  returnBook: (bookId: string) =>
    apiFetch<TransactionResult>(`/api/transactions/return/${bookId}`, {
      method: "POST",
    }),

  getHistory: (page = 1, limit = 15) =>
    apiFetch<HistoryResponse>(
      `/api/transactions/history?page=${page}&limit=${limit}`,
    ),
};
