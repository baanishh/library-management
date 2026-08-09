import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/api-error.js";

export function checkOperatingHours(date = new Date()) {
  const totalMinutes = date.getHours() * 60 + date.getMinutes();

  const openingTime = 9 * 60;
  const lunchStart = 13 * 60;
  const lunchEnd = 13 * 60 + 45;
  const closingTime = 18 * 60;

  if (totalMinutes < openingTime || totalMinutes >= closingTime) {
    return {
      allowed: false,
      reason:
        "Borrowing and returning books is only allowed between 9:00 AM and 6:00 PM",
    };
  }

  if (totalMinutes >= lunchStart && totalMinutes < lunchEnd) {
    return {
      allowed: false,
      reason: "Transactions are blocked during lunch break (1:00 PM - 1:45 PM)",
    };
  }

  return {
    allowed: true,
  };
}

export function validateOperatingHours(
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  const result = checkOperatingHours();

  if (!result.allowed) {
    return next(ApiError.badRequest(result.reason || "Operation not allowed"));
  }

  next();
}
