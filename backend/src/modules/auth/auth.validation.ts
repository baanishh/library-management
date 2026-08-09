import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    username: z
      .string({ message: "Username is required" })
      .trim()
      .min(1, "Username is required"),

    password: z
      .string({ message: "Password is required" })
      .min(1, "Password is required"),
  }),
});

export const createStaffSchema = z.object({
  body: z.object({
    username: z
      .string({ message: "Username is required" })
      .trim()
      .min(3, "Username must be at least 3 characters"),

    password: z
      .string({ message: "Password is required" })
      .min(6, "Password must be at least 6 characters"),
  }),
});
