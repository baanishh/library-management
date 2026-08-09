import { ZodError } from "zod";
import { ApiError } from "../errors/api-error.js";
import { env } from "../config/env.js";
// Global error handler
export function errorHandler(err, req, res, _next) {
    let statusCode = 500;
    let message = "Internal Server Error";
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof ZodError) {
        statusCode = 400;
        message = err.issues.map((e) => e.message).join(", ");
    }
    else if ("statusCode" in err && typeof err.statusCode === "number") {
        statusCode = err.statusCode;
        message = err.message || message;
    }
    // Duplicate key (MongoDB 11000)
    if ("code" in err && err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue || {})[0] || "Resource";
        message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    }
    // Validation error
    if (err.name === "ValidationError" && "errors" in err && err.errors) {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
    }
    // JWT error
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid authentication token";
    }
    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Authentication token has expired";
    }
    if (env.NODE_ENV === "development" && statusCode === 500) {
        console.error(`[Unhandled Error] ${req.method} ${req.url}:`, err);
    }
    res.status(statusCode).json({
        success: false,
        error: message,
        statusCode,
        ...(env.NODE_ENV === "development" && err.stack && { stack: err.stack }),
    });
}
