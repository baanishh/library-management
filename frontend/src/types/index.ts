export type UserRole = "ADMIN" | "STAFF";

export interface User {
  _id: string;
  username: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  publishedYear: number;
  totalCopies: number;
  availableCopies: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  bookId: {
    _id: string;
    title: string;
    author: string;
    isbn: string;
    genre: string;
  };
  userId: {
    _id: string;
    username: string;
    role: UserRole;
  };
  type: "BORROW" | "RETURN";
  timestamp: string;
  createdAt: string;
}

export interface OperatingStatus {
  allowed: boolean;
  reason?: string;
  currentStatus: {
    isOpenHours: boolean;
    isLunchBreak: boolean;
    serverTime: string;
  };
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardOverview {
  totalTitles: number;
  totalCopies: number;
  availableCopies: number;
  borrowedCopies: number;
  totalUsers: number;
}
