import { User } from "./user.model.js";

export class UserRepository {
  static findByUsername(username: string) {
    return User.findOne({ username });
  }

  static findById(id: string) {
    return User.findById(id);
  }

  static updateRefreshToken(userId: string, token: string | null) {
    return User.findByIdAndUpdate(userId, {
      refreshToken: token,
    });
  }
}
