import type { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { User } from "./user.model.js";
import type { AuthRequest } from "../../types/auth.js";
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  getRefreshToken,
} from "../../utils/cookie.js";
import { ApiError } from "../../errors/api-error.js";

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;

      const { user, accessToken, refreshToken } = await AuthService.login(
        username,
        password,
      );

      setRefreshTokenCookie(res, refreshToken);

      res.json({
        success: true,
        data: {
          user,
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = getRefreshToken(req);

      if (!token) {
        throw ApiError.unauthorized("Refresh token is missing");
      }

      const { accessToken, refreshToken } = await AuthService.refresh(token);

      setRefreshTokenCookie(res, refreshToken);

      res.json({
        success: true,
        data: { accessToken },
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (req.user?.userId) {
        await AuthService.logout(req.user.userId);
      }

      clearRefreshTokenCookie(res);

      res.json({
        success: true,
        message: "Successfully logged out",
      });
    } catch (error) {
      next(error);
    }
  }

  static async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw ApiError.unauthorized();
      }

      const user = await User.findById(userId).select(
        "-password -refreshToken",
      );

      if (!user) {
        throw ApiError.notFound("User not found");
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createStaff(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      const staff = await AuthService.createStaff(username, password);

      res.status(201).json({
        success: true,
        data: staff,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await AuthService.getAllUsers();

      res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (req.user?.userId === id) {
        throw ApiError.badRequest("You cannot delete your own account");
      }

      await AuthService.deleteUser(id as string);

      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
