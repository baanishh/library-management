import { z } from "zod";
// Borrow/Return params validation
export const transactionParamSchema = z.object({
    params: z.object({
        bookId: z.string({ message: "Book ID parameter is required" }).min(1),
    }),
});
// History query validation
export const historyQuerySchema = z.object({
    query: z.object({
        page: z.coerce.number().int().min(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).optional(),
    }),
});
