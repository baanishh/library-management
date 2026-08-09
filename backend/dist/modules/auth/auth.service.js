import { User } from "./user.model.js";
import { UserRepository } from "./user.repository.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, } from "../../utils/jwt.js";
import { comparePassword } from "../../utils/hash.js";
import { ApiError } from "../../errors/api-error.js";
export class AuthService {
    // Register user (defaults to STAFF role)
    static async register(username, password) {
        const existingUser = await UserRepository.findByUsername(username);
        if (existingUser) {
            throw ApiError.conflict("Username is already taken");
        }
        const newUser = await UserRepository.create({
            username,
            password,
            role: "STAFF",
        });
        const userObject = newUser.toObject();
        delete userObject.password;
        delete userObject.refreshToken;
        return userObject;
    }
    // Login user
    static async login(username, password) {
        const user = await UserRepository.findByUsername(username);
        if (!user || !user.password) {
            throw ApiError.unauthorized("Invalid username or password");
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            throw ApiError.unauthorized("Invalid username or password");
        }
        const accessToken = generateAccessToken({
            userId: user._id.toString(),
            username: user.username,
            role: user.role,
        });
        const refreshToken = generateRefreshToken({ userId: user._id.toString() });
        await UserRepository.updateRefreshToken(user._id.toString(), refreshToken);
        const userObject = user.toObject();
        delete userObject.password;
        delete userObject.refreshToken;
        return { user: userObject, accessToken, refreshToken };
    }
    // Refresh token
    static async refresh(token) {
        let decoded;
        try {
            decoded = verifyRefreshToken(token);
        }
        catch {
            throw ApiError.unauthorized("Invalid or expired refresh token");
        }
        const user = await UserRepository.findById(decoded.userId);
        if (!user || user.refreshToken !== token) {
            throw ApiError.unauthorized("Invalid or revoked refresh token");
        }
        const newAccessToken = generateAccessToken({
            userId: user._id.toString(),
            username: user.username,
            role: user.role,
        });
        const newRefreshToken = generateRefreshToken({
            userId: user._id.toString(),
        });
        await UserRepository.updateRefreshToken(user._id.toString(), newRefreshToken);
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
    // Logout user
    static async logout(userId) {
        await UserRepository.updateRefreshToken(userId, null);
    }
    // Get all users (Admin only)
    static async getAllUsers() {
        return User.find().select("-password -refreshToken").sort({ createdAt: -1 });
    }
    // Update user role (Admin only)
    static async updateUserRole(adminUserId, targetUserId, newRole) {
        if (adminUserId === targetUserId && newRole !== "ADMIN") {
            throw ApiError.badRequest("You cannot demote your own admin account");
        }
        const user = await User.findById(targetUserId);
        if (!user) {
            throw ApiError.notFound("User not found");
        }
        user.role = newRole;
        await user.save();
        const userObject = user.toObject();
        delete userObject.password;
        delete userObject.refreshToken;
        return userObject;
    }
}
