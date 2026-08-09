import { Router } from "express";
import { TransactionController } from "./transaction.controller.js";
import { authenticate, requireRole } from "../../middleware/auth.middleware.js";
import { validateOperatingHours } from "../../middleware/time.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { transactionParamSchema, historyQuerySchema, } from "./transaction.validation.js";
const router = Router();
// Public status check (operating hours)
router.get("/status", TransactionController.getStatus);
// Protected routes
router.use(authenticate);
// History
router.get("/history", validate(historyQuerySchema), requireRole(["ADMIN", "STAFF"]), TransactionController.getHistory);
// Borrow book
router.post("/borrow/:bookId", validate(transactionParamSchema), validateOperatingHours, requireRole(["ADMIN", "STAFF"]), TransactionController.borrowBook);
// Return book
router.post("/return/:bookId", validate(transactionParamSchema), validateOperatingHours, requireRole(["ADMIN", "STAFF"]), TransactionController.returnBook);
export default router;
