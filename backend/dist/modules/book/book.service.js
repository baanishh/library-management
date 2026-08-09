import { BookRepository } from "./book.repository.js";
import { ApiError } from "../../errors/api-error.js";
export class BookService {
    // Create book
    static async createBook(data) {
        if (!data.isbn) {
            throw ApiError.badRequest("ISBN is required");
        }
        const existingBook = await BookRepository.findByIsbn(data.isbn);
        if (existingBook) {
            throw ApiError.conflict("A book with this ISBN already exists");
        }
        if (data.availableCopies === undefined && data.totalCopies !== undefined) {
            data.availableCopies = data.totalCopies;
        }
        if (data.totalCopies !== undefined &&
            data.availableCopies !== undefined &&
            data.availableCopies > data.totalCopies) {
            throw ApiError.badRequest("Available copies cannot exceed total copies");
        }
        return BookRepository.create(data);
    }
    // Get books
    static async getAllBooks(params) {
        const page = Math.max(1, Number(params.page) || 1);
        const limit = Math.max(1, Math.min(100, Number(params.limit) || 20));
        const skip = (page - 1) * limit;
        const filter = {};
        if (params.search && params.search.trim()) {
            const searchRegex = { $regex: params.search.trim(), $options: "i" };
            filter.$or = [
                { title: searchRegex },
                { author: searchRegex },
                { isbn: searchRegex },
            ];
        }
        if (params.genre && params.genre.trim()) {
            filter.genre = { $regex: params.genre.trim(), $options: "i" };
        }
        const [books, total] = await Promise.all([
            BookRepository.findAll(filter, skip, limit),
            BookRepository.count(filter),
        ]);
        return {
            books,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    }
    // Get single
    static async getBookById(id) {
        const book = await BookRepository.findById(id);
        if (!book) {
            throw ApiError.notFound("Book not found");
        }
        return book;
    }
    // Update book
    static async updateBook(id, updateData) {
        const existingBook = await BookRepository.findById(id);
        if (!existingBook) {
            throw ApiError.notFound("Book not found");
        }
        if (updateData.isbn && updateData.isbn !== existingBook.isbn) {
            const duplicate = await BookRepository.findByIsbn(updateData.isbn);
            if (duplicate && duplicate._id.toString() !== id) {
                throw ApiError.conflict("A book with this ISBN already exists");
            }
        }
        const totalCopies = updateData.totalCopies ?? existingBook.totalCopies;
        const availableCopies = updateData.availableCopies ?? existingBook.availableCopies;
        if (availableCopies > totalCopies) {
            throw ApiError.badRequest("Available copies cannot exceed total copies");
        }
        return BookRepository.updateById(id, updateData);
    }
    // Delete book
    static async deleteBook(id) {
        const existingBook = await BookRepository.findById(id);
        if (!existingBook) {
            throw ApiError.notFound("Book not found");
        }
        await BookRepository.deleteById(id);
        return { message: "Book successfully deleted" };
    }
}
