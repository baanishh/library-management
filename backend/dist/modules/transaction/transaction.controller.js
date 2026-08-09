import { TransactionService } from "./transaction.service.js";
import { checkOperatingHours } from "../../middleware/time.middleware.js";
import { ApiError } from "../../errors/api-error.js";
export class TransactionController {
    // POST /api/transactions/borrow/:bookId
    static borrowBook = async (req, res, next) => {
        try {
            const authReq = req;
            const userId = authReq.user?.userId;
            if (!userId) {
                throw ApiError.unauthorized();
            }
            const bookId = req.params.bookId;
            const result = await TransactionService.borrowBook(userId, bookId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    };
    // POST /api/transactions/return/:bookId
    static returnBook = async (req, res, next) => {
        try {
            const authReq = req;
            const userId = authReq.user?.userId;
            if (!userId) {
                throw ApiError.unauthorized();
            }
            const bookId = req.params.bookId;
            const result = await TransactionService.returnBook(userId, bookId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    };
    // GET /api/transactions/history
    static getHistory = async (req, res, next) => {
        try {
            const authReq = req;
            const userId = authReq.user?.userId;
            const role = authReq.user?.role;
            if (!userId || !role) {
                throw ApiError.unauthorized();
            }
            const { page, limit } = req.query;
            const result = await TransactionService.getHistory(userId, role, page ? Number(page) : 1, limit ? Number(limit) : 20);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    };
    // GET /api/transactions/status
    static getStatus = async (_req, res, next) => {
        try {
            const status = checkOperatingHours();
            res.status(200).json({ success: true, data: status });
        }
        catch (error) {
            next(error);
        }
    };
}
