import mongoose from "mongoose";
import { Transaction } from "./transaction.model.js";
import type { ITransaction } from "./transaction.model.js";

export class TransactionRepository {
  static create(data: Partial<ITransaction>) {
    return Transaction.create(data);
  }

  static findLatestTransaction(userId: string, bookId: string) {
    return Transaction.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      bookId: new mongoose.Types.ObjectId(bookId),
    }).sort({ createdAt: -1 });
  }

  static findHistory(skip = 0, limit = 10) {
    return Transaction.find()
      .populate("bookId", "title author isbn genre")
      .populate("userId", "username role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  static countHistory() {
    return Transaction.countDocuments();
  }
}
