import type { NextFunction, Response } from "express";
import type { UserRole } from "../modules/auth/user.model.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { ApiError } from "../errors/api-error.js";
import { AuthRequest } from "../types/auth.js";

export function authenticate(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Access token is missing or invalid"));
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(ApiError.unauthorized("Access token is expired or invalid"));
  }
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden());
    }

    next();
  };
}
