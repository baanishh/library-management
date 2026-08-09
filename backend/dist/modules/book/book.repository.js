import { Book } from "./book.model.js";
export class BookRepository {
    // Create book
    static async create(bookData) {
        const book = new Book(bookData);
        return book.save();
    }
    // Find all
    static async findAll(filter = {}, skip = 0, limit = 20) {
        return Book.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
    }
    // Count total
    static async count(filter = {}) {
        return Book.countDocuments(filter);
    }
    // Find by ID
    static async findById(id) {
        return Book.findById(id);
    }
    // Find by ISBN
    static async findByIsbn(isbn) {
        return Book.findOne({ isbn });
    }
    // Update by ID
    static async updateById(id, updateData) {
        return Book.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
    }
    // Delete by ID
    static async deleteById(id) {
        return Book.findByIdAndDelete(id);
    }
}
