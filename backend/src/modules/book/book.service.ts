import type { IBook } from "./book.model.js";
import { BookRepository } from "./book.repository.js";
import { User } from "../auth/user.model.js";
import { ApiError } from "../../errors/api-error.js";

export interface BookFilterParams {
  search?: string;
  genre?: string;
  page?: number;
  limit?: number;
}

export class BookService {
  static async createBook(data: Partial<IBook>) {
    if (!data.isbn) {
      throw ApiError.badRequest("ISBN is required");
    }

    const existingBook = await BookRepository.findByIsbn(data.isbn);

    if (existingBook) {
      throw ApiError.conflict("A book with this ISBN already exists");
    }

    if (data.totalCopies !== undefined) {
      data.availableCopies = data.totalCopies;
    }

    return BookRepository.create(data);
  }

  static async getAllBooks(params: BookFilterParams = {}) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 10));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (params.search && params.search.trim()) {
      const searchRegex = { $regex: params.search.trim(), $options: "i" };
      filter.$or = [
        { title: searchRegex },
        { author: searchRegex },
        { isbn: searchRegex },
      ];
    }

    if (params.genre && params.genre.trim()) {
      filter.genre = { $regex: `^${params.genre.trim()}$`, $options: "i" };
    }

    const [books, total, aggregation, totalUsers] = await Promise.all([
      BookRepository.findAll(filter, skip, limit),
      BookRepository.count(filter),
      BookRepository.getOverviewStats(),
      User.countDocuments(),
    ]);

    const { totalTitles = 0, totalCopies = 0, availableCopies = 0 } =
      aggregation[0] ?? {};
    const borrowedCopies = Math.max(0, totalCopies - availableCopies);

    return {
      books,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
      overview: {
        totalTitles,
        totalCopies,
        availableCopies,
        borrowedCopies,
        totalUsers,
      },
    };
  }

  static async getBookById(id: string) {
    const book = await BookRepository.findById(id);

    if (!book) {
      throw ApiError.notFound("Book not found");
    }

    return book;
  }

  static async updateBook(id: string, data: Partial<IBook>) {
    const book = await BookRepository.findById(id);

    if (!book) {
      throw ApiError.notFound("Book not found");
    }

    if (data.isbn && data.isbn !== book.isbn) {
      const existingBook = await BookRepository.findByIsbn(data.isbn);

      if (existingBook) {
        throw ApiError.conflict("A book with this ISBN already exists");
      }
    }

    const totalCopies = data.totalCopies ?? book.totalCopies;
    const availableCopies = data.availableCopies ?? book.availableCopies;

    if (availableCopies > totalCopies) {
      throw ApiError.badRequest("Available copies cannot exceed total copies");
    }

    return BookRepository.updateById(id, data);
  }

  static async deleteBook(id: string) {
    const book = await BookRepository.findById(id);

    if (!book) {
      throw ApiError.notFound("Book not found");
    }

    await BookRepository.deleteById(id);
  }
}
