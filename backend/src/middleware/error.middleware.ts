import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/api-error.js";

type AppError = Error & {
  code?: number;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
};

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  if (err.code === 11000) {
    statusCode = 409;

    const field = Object.keys(err.keyValue ?? {})[0];

    message = field
      ? `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      : "Resource already exists";
  }

  if (err.name === "ValidationError" && err.errors) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
  }

  if (statusCode === 500) {
    console.error(`${req.method} ${req.url}`, err);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}
