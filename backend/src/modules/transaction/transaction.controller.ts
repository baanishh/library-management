import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../../types/auth.js";
import { TransactionService } from "./transaction.service.js";
import { TransactionRepository } from "./transaction.repository.js";
import { ApiError } from "../../errors/api-error.js";

type BookParams = {
  bookId: string;
};

export class TransactionController {
  static async borrowBook(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const bookId = req.params.bookId;

      if (!userId) {
        throw ApiError.unauthorized();
      }

      if (!bookId || Array.isArray(bookId)) {
        throw ApiError.badRequest("Invalid book ID");
      }

      const result = await TransactionService.borrowBook(userId, bookId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async returnBook(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const bookId = req.params.bookId;

      if (!userId) {
        throw ApiError.unauthorized();
      }

      if (!bookId || Array.isArray(bookId)) {
        throw ApiError.badRequest("Invalid book ID");
      }

      const result = await TransactionService.returnBook(userId, bookId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 15));
      const skip = (page - 1) * limit;

      const [transactions, total] = await Promise.all([
        TransactionRepository.findHistory(skip, limit),
        TransactionRepository.countHistory(),
      ]);

      res.json({
        success: true,
        data: {
          transactions,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
