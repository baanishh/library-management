import { z } from "zod";

export const createBookSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, "Book title is required"),
    author: z.string().trim().min(1, "Author is required"),
    isbn: z.string().trim().min(1, "ISBN is required"),
    genre: z.string().trim().min(1, "Genre is required"),
    publishedYear: z.coerce.number().int("Published year must be an integer"),
    totalCopies: z.coerce
      .number()
      .int("Total copies must be an integer")
      .min(1, "Total copies must be at least 1"),
  }),
});

export const updateBookSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Book ID is required"),
  }),
  body: z.object({
    title: z.string().trim().min(1).optional(),
    author: z.string().trim().min(1).optional(),
    isbn: z.string().trim().min(1).optional(),
    genre: z.string().trim().min(1).optional(),
    publishedYear: z.coerce.number().int().optional(),
    totalCopies: z.coerce.number().int().min(1).optional(),
  }),
});

export const bookIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Book ID is required"),
  }),
});
