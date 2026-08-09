import mongoose from "mongoose";
import { TransactionRepository } from "./transaction.repository.js";
import { BookRepository } from "../book/book.repository.js";
import { ApiError } from "../../errors/api-error.js";
export class TransactionService {
    // Borrow book
    static async borrowBook(userId, bookId) {
        const book = await BookRepository.findById(bookId);
        if (!book) {
            throw ApiError.notFound("Book not found");
        }
        if (book.availableCopies <= 0) {
            throw ApiError.badRequest("No available copies of this book left to borrow");
        }
        const latestTx = await TransactionRepository.findLatestTransaction(userId, bookId);
        if (latestTx && latestTx.type === "BORROW") {
            throw ApiError.badRequest("You already have an active borrow for this book. Please return it first.");
        }
        const updatedBook = await BookRepository.updateById(bookId, {
            availableCopies: book.availableCopies - 1,
        });
        const transaction = await TransactionRepository.create({
            bookId: new mongoose.Types.ObjectId(bookId),
            userId: new mongoose.Types.ObjectId(userId),
            type: "BORROW",
            timestamp: new Date(),
        });
        return {
            message: "Book borrowed successfully",
            transaction,
            availableCopies: updatedBook?.availableCopies,
        };
    }
    // Return book
    static async returnBook(userId, bookId) {
        const book = await BookRepository.findById(bookId);
        if (!book) {
            throw ApiError.notFound("Book not found");
        }
        const latestTx = await TransactionRepository.findLatestTransaction(userId, bookId);
        if (!latestTx || latestTx.type !== "BORROW") {
            throw ApiError.badRequest("You do not have an active borrow for this book");
        }
        const newAvailable = Math.min(book.totalCopies, book.availableCopies + 1);
        const updatedBook = await BookRepository.updateById(bookId, {
            availableCopies: newAvailable,
        });
        const transaction = await TransactionRepository.create({
            bookId: new mongoose.Types.ObjectId(bookId),
            userId: new mongoose.Types.ObjectId(userId),
            type: "RETURN",
            timestamp: new Date(),
        });
        return {
            message: "Book returned successfully",
            transaction,
            availableCopies: updatedBook?.availableCopies,
        };
    }
    // History
    static async getHistory(userId, role, page = 1, limit = 20) {
        const safePage = Math.max(1, Number(page) || 1);
        const safeLimit = Math.max(1, Math.min(100, Number(limit) || 20));
        const skip = (safePage - 1) * safeLimit;
        const filter = {};
        if (role === "STAFF") {
            filter.userId = new mongoose.Types.ObjectId(userId);
        }
        const [transactions, total] = await Promise.all([
            TransactionRepository.findAll(filter, skip, safeLimit),
            TransactionRepository.count(filter),
        ]);
        return {
            transactions,
            pagination: {
                total,
                page: safePage,
                limit: safeLimit,
                totalPages: Math.ceil(total / safeLimit) || 1,
            },
        };
    }
}
