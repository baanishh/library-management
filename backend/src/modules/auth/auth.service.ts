import { User } from "./user.model.js";
import { UserRepository } from "./user.repository.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import { comparePassword } from "../../utils/hash.js";
import { ApiError } from "../../errors/api-error.js";

export class AuthService {
  static async login(username: string, password: string) {
    const user = await UserRepository.findByUsername(username);

    if (!user || !user.password) {
      throw ApiError.unauthorized("Invalid username or password");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw ApiError.unauthorized("Invalid username or password");
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
    });

    await UserRepository.updateRefreshToken(user._id.toString(), refreshToken);

    return {
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  static async createStaff(username: string, password: string) {
    const existing = await UserRepository.findByUsername(username);

    if (existing) {
      throw ApiError.conflict("Username is already taken");
    }

    const user = new User({
      username,
      password,
      role: "STAFF",
    });

    await user.save();

    return {
      _id: user._id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static async getAllUsers() {
    return User.find()
      .select("-password -refreshToken")
      .sort({ createdAt: -1 });
  }

  static async deleteUser(id: string) {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      throw ApiError.notFound("User not found");
    }
  }

  static async refresh(token: string) {
    let decoded: { userId: string };

    try {
      decoded = verifyRefreshToken(token);
    } catch {
      throw ApiError.unauthorized("Invalid or expired refresh token");
    }

    const user = await UserRepository.findById(decoded.userId);

    if (!user || user.refreshToken !== token) {
      throw ApiError.unauthorized("Invalid or revoked refresh token");
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
    });

    await UserRepository.updateRefreshToken(user._id.toString(), refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  static async logout(userId: string) {
    await UserRepository.updateRefreshToken(userId, null);
  }
}
