import { BookService } from "./book.service.js";
export class BookController {
    // POST /api/books
    static createBook = async (req, res, next) => {
        try {
            const { title, author, isbn, genre, publishedYear, totalCopies, availableCopies, } = req.body;
            const book = await BookService.createBook({
                title,
                author,
                isbn,
                genre,
                publishedYear: Number(publishedYear),
                totalCopies: Number(totalCopies),
                availableCopies: availableCopies !== undefined
                    ? Number(availableCopies)
                    : Number(totalCopies),
            });
            res.status(201).json({ success: true, data: book });
        }
        catch (error) {
            next(error);
        }
    };
    // GET /api/books
    static getAllBooks = async (req, res, next) => {
        try {
            const { search, genre, page, limit } = req.query;
            const result = await BookService.getAllBooks({
                search: search,
                genre: genre,
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined,
            });
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    };
    // GET /api/books/:id
    static getBookById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const book = await BookService.getBookById(id);
            res.status(200).json({ success: true, data: book });
        }
        catch (error) {
            next(error);
        }
    };
    // PUT /api/books/:id
    static updateBook = async (req, res, next) => {
        try {
            const id = req.params.id;
            const updatedBook = await BookService.updateBook(id, req.body);
            res.status(200).json({ success: true, data: updatedBook });
        }
        catch (error) {
            next(error);
        }
    };
    // DELETE /api/books/:id
    static deleteBook = async (req, res, next) => {
        try {
            const id = req.params.id;
            const result = await BookService.deleteBook(id);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    };
}
