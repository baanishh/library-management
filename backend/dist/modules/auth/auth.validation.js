import { z } from "zod";
// Register validation (public registration is restricted to username + password)
export const registerSchema = z.object({
    body: z.object({
        username: z
            .string({ message: "Username is required" })
            .trim()
            .min(3, "Username must be at least 3 characters long"),
        password: z
            .string({ message: "Password is required" })
            .min(6, "Password must be at least 6 characters long"),
    }),
});
// Login validation
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
// Update user role validation (Admin only)
export const updateUserRoleSchema = z.object({
    params: z.object({
        id: z.string({ message: "User ID is required" }).min(1),
    }),
    body: z.object({
        role: z.enum(["ADMIN", "STAFF"], {
            message: "Role must be either ADMIN or STAFF",
        }),
    }),
});
