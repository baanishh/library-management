import { z } from "zod";
// Create book validation
export const createBookSchema = z.object({
    body: z.object({
        title: z
            .string({ message: "Book title is required" })
            .trim()
            .min(1, "Book title is required"),
        author: z
            .string({ message: "Author is required" })
            .trim()
            .min(1, "Author is required"),
        isbn: z
            .string({ message: "ISBN is required" })
            .trim()
            .min(1, "ISBN is required"),
        genre: z
            .string({ message: "Genre is required" })
            .trim()
            .min(1, "Genre is required"),
        publishedYear: z.coerce
            .number({ message: "Published year is required" })
            .int("Published year must be an integer"),
        totalCopies: z.coerce
            .number({ message: "Total copies is required" })
            .int("Total copies must be an integer")
            .min(1, "Total copies must be at least 1"),
        availableCopies: z.coerce
            .number()
            .int("Available copies must be an integer")
            .min(0, "Available copies cannot be negative")
            .optional(),
    }),
});
// Update book validation
export const updateBookSchema = z.object({
    params: z.object({
        id: z.string({ message: "Book ID parameter is required" }).min(1),
    }),
    body: z.object({
        title: z.string().trim().min(1).optional(),
        author: z.string().trim().min(1).optional(),
        isbn: z.string().trim().min(1).optional(),
        genre: z.string().trim().min(1).optional(),
        publishedYear: z.coerce.number().int().optional(),
        totalCopies: z.coerce.number().int().min(1).optional(),
        availableCopies: z.coerce.number().int().min(0).optional(),
    }),
});
// Single book ID validation
export const bookIdParamSchema = z.object({
    params: z.object({
        id: z.string({ message: "Book ID parameter is required" }).min(1),
    }),
});
