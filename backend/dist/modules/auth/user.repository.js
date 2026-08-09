import { User } from "./user.model.js";
export class UserRepository {
    // Find by username
    static async findByUsername(username) {
        return User.findOne({ username });
    }
    // Find by ID
    static async findById(id) {
        return User.findById(id);
    }
    // Create user
    static async create(userData) {
        const user = new User(userData);
        return user.save();
    }
    // Update refresh token
    static async updateRefreshToken(userId, token) {
        return User.findByIdAndUpdate(userId, { refreshToken: token }, { new: true });
    }
}
