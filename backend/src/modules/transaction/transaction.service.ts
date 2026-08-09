import mongoose from "mongoose";
import { TransactionRepository } from "./transaction.repository.js";
import { BookRepository } from "../book/book.repository.js";
import { ApiError } from "../../errors/api-error.js";

export class TransactionService {
  static async borrowBook(userId: string, bookId: string) {
    const book = await BookRepository.findById(bookId);

    if (!book) {
      throw ApiError.notFound("Book not found");
    }

    if (book.availableCopies <= 0) {
      throw ApiError.badRequest("No copies available");
    }

    const latestTransaction = await TransactionRepository.findLatestTransaction(
      userId,
      bookId,
    );

    if (latestTransaction?.type === "BORROW") {
      throw ApiError.badRequest("You already borrowed this book");
    }

    const updatedBook = await BookRepository.updateById(bookId, {
      availableCopies: book.availableCopies - 1,
    });

    await TransactionRepository.create({
      bookId: new mongoose.Types.ObjectId(bookId),
      userId: new mongoose.Types.ObjectId(userId),
      type: "BORROW",
    });

    return {
      message: "Book borrowed successfully",
      availableCopies: updatedBook?.availableCopies,
    };
  }

  static async returnBook(userId: string, bookId: string) {
    const book = await BookRepository.findById(bookId);

    if (!book) {
      throw ApiError.notFound("Book not found");
    }

    const latestTransaction = await TransactionRepository.findLatestTransaction(
      userId,
      bookId,
    );

    if (!latestTransaction || latestTransaction.type !== "BORROW") {
      throw ApiError.badRequest("You have not borrowed this book");
    }

    const updatedBook = await BookRepository.updateById(bookId, {
      availableCopies: book.availableCopies + 1,
    });

    await TransactionRepository.create({
      bookId: new mongoose.Types.ObjectId(bookId),
      userId: new mongoose.Types.ObjectId(userId),
      type: "RETURN",
    });

    return {
      message: "Book returned successfully",
      availableCopies: updatedBook?.availableCopies,
    };
  }
}
