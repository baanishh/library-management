import { Router } from "express";
import { BookController } from "./book.controller.js";
import { authenticate, requireRole } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createBookSchema,
  updateBookSchema,
  bookIdParamSchema,
} from "./book.validation.js";

const router = Router();

router.use(authenticate);

router.get("/", requireRole("ADMIN", "STAFF"), BookController.getAllBooks);

router.get(
  "/:id",
  validate(bookIdParamSchema),
  requireRole("ADMIN", "STAFF"),
  BookController.getBookById,
);

router.post(
  "/",
  validate(createBookSchema),
  requireRole("ADMIN"),
  BookController.createBook,
);

router.put(
  "/:id",
  validate(updateBookSchema),
  requireRole("ADMIN"),
  BookController.updateBook,
);

router.delete(
  "/:id",
  validate(bookIdParamSchema),
  requireRole("ADMIN"),
  BookController.deleteBook,
);

export default router;
