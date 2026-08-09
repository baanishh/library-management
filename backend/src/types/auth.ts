import type { Request } from "express";
import type { UserRole } from "../modules/auth/user.model.js";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    username: string;
    role: UserRole;
  };
}
