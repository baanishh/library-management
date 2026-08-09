import type { NextFunction, Request, Response } from "express";
import { BookService } from "./book.service.js";

type BookParams = {
  id: string;
};

export class BookController {
  static async createBook(req: Request, res: Response, next: NextFunction) {
    try {
      const book = await BookService.createBook(req.body);

      res.status(201).json({
        success: true,
        data: book,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await BookService.getAllBooks({
        search: req.query.search as string | undefined,
        genre: req.query.genre as string | undefined,
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getBookById(
    req: Request<BookParams>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const book = await BookService.getBookById(req.params.id);

      res.json({
        success: true,
        data: book,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateBook(
    req: Request<BookParams>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const book = await BookService.updateBook(req.params.id, req.body);

      res.json({
        success: true,
        data: book,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteBook(
    req: Request<BookParams>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await BookService.deleteBook(req.params.id);

      res.json({
        success: true,
        message: "Book deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
