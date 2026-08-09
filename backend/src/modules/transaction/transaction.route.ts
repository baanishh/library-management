import { Router } from "express";
import { TransactionController } from "./transaction.controller.js";
import { authenticate, requireRole } from "../../middleware/auth.middleware.js";
import { validateOperatingHours } from "../../middleware/time.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { transactionParamSchema } from "./transaction.validation.js";

const router = Router();

router.use(authenticate);

router.post(
  "/borrow/:bookId",
  requireRole("ADMIN", "STAFF"),
  validate(transactionParamSchema),
  validateOperatingHours,
  TransactionController.borrowBook,
);

router.post(
  "/return/:bookId",
  requireRole("ADMIN", "STAFF"),
  validate(transactionParamSchema),
  validateOperatingHours,
  TransactionController.returnBook,
);

router.get(
  "/history",
  requireRole("ADMIN", "STAFF"),
  TransactionController.getHistory,
);

export default router;
