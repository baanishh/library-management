import mongoose from "mongoose";
import { Transaction } from "./transaction.model.js";
export class TransactionRepository {
    // Create transaction
    static async create(data) {
        const transaction = new Transaction(data);
        return transaction.save();
    }
    // Latest tx
    static async findLatestTransaction(userId, bookId) {
        return Transaction.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            bookId: new mongoose.Types.ObjectId(bookId),
        }).sort({ createdAt: -1 });
    }
    // List transactions
    static async findAll(filter = {}, skip = 0, limit = 20) {
        return Transaction.find(filter)
            .populate("bookId", "title author isbn genre")
            .populate("userId", "username role")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
    }
    // Count total
    static async count(filter = {}) {
        return Transaction.countDocuments(filter);
    }
}
