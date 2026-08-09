import { Book } from "./book.model.js";
import type { IBook } from "./book.model.js";

export class BookRepository {
  static create(bookData: Partial<IBook>) {
    return Book.create(bookData);
  }

  static findAll(filter: Record<string, unknown> = {}, skip = 0, limit = 20) {
    return Book.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
  }

  static count(filter: Record<string, unknown> = {}) {
    return Book.countDocuments(filter);
  }

  static findById(id: string) {
    return Book.findById(id);
  }

  static findByIsbn(isbn: string) {
    return Book.findOne({ isbn });
  }

  static updateById(id: string, data: Partial<IBook>) {
    return Book.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  static deleteById(id: string) {
    return Book.findByIdAndDelete(id);
  }

  static getOverviewStats() {
    return Book.aggregate<{
      totalTitles: number;
      totalCopies: number;
      availableCopies: number;
    }>([
      {
        $group: {
          _id: null,
          totalTitles: { $sum: 1 },
          totalCopies: { $sum: "$totalCopies" },
          availableCopies: { $sum: "$availableCopies" },
        },
      },
      { $project: { _id: 0 } },
    ]);
  }
}
