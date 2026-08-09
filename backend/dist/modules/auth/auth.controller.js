import { AuthService } from "./auth.service.js";
import { User } from "./user.model.js";
import { setRefreshTokenCookie, clearRefreshTokenCookie, getRefreshToken, } from "../../utils/cookie.js";
import { ApiError } from "../../errors/api-error.js";
export class AuthController {
    // POST /api/auth/register
    static register = async (req, res, next) => {
        try {
            const { username, password } = req.body;
            const user = await AuthService.register(username, password);
            res.status(201).json({ success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    };
    // POST /api/auth/login
    static login = async (req, res, next) => {
        try {
            const { username, password } = req.body;
            const { user, accessToken, refreshToken } = await AuthService.login(username, password);
            setRefreshTokenCookie(res, refreshToken);
            res.status(200).json({ success: true, data: { user, accessToken } });
        }
        catch (error) {
            next(error);
        }
    };
    // POST /api/auth/refresh
    static refresh = async (req, res, next) => {
        try {
            const token = getRefreshToken(req);
            if (!token) {
                throw ApiError.unauthorized("Refresh token is missing");
            }
            const { accessToken, refreshToken: newRefreshToken } = await AuthService.refresh(token);
            setRefreshTokenCookie(res, newRefreshToken);
            res.status(200).json({ success: true, data: { accessToken } });
        }
        catch (error) {
            next(error);
        }
    };
    // POST /api/auth/logout
    static logout = async (req, res, next) => {
        try {
            const authReq = req;
            const userId = authReq.user?.userId;
            if (userId) {
                await AuthService.logout(userId);
            }
            clearRefreshTokenCookie(res);
            res.status(200).json({ success: true, message: "Successfully logged out" });
        }
        catch (error) {
            next(error);
        }
    };
    // GET /api/auth/me
    static me = async (req, res, next) => {
        try {
            const authReq = req;
            const userId = authReq.user?.userId;
            if (!userId) {
                throw ApiError.unauthorized();
            }
            const user = await User.findById(userId).select("-password -refreshToken");
            if (!user) {
                throw ApiError.notFound("User not found");
            }
            res.status(200).json({ success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    };
    // GET /api/auth/users (Admin only)
    static getUsers = async (_req, res, next) => {
        try {
            const users = await AuthService.getAllUsers();
            res.status(200).json({ success: true, data: users });
        }
        catch (error) {
            next(error);
        }
    };
    // PATCH /api/auth/users/:id/role (Admin only)
    static updateUserRole = async (req, res, next) => {
        try {
            const authReq = req;
            const adminUserId = authReq.user?.userId;
            if (!adminUserId) {
                throw ApiError.unauthorized();
            }
            const targetUserId = req.params.id;
            const { role } = req.body;
            const updatedUser = await AuthService.updateUserRole(adminUserId, targetUserId, role);
            res.status(200).json({ success: true, data: updatedUser });
        }
        catch (error) {
            next(error);
        }
    };
}
