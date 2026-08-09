import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import authRoutes from "./modules/auth/auth.route.js";
import bookRoutes from "./modules/book/book.route.js";
import transactionRoutes from "./modules/transaction/transaction.route.js";
import { errorHandler } from "./middleware/error.middleware.js";
const app = express();
app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is healthy" });
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/transactions", transactionRoutes);
// Error handler
app.use(errorHandler);
export default app;
