import { z } from "zod";

export const transactionParamSchema = z.object({
  params: z.object({
    bookId: z.string().min(1, "Book ID is required"),
  }),
});
