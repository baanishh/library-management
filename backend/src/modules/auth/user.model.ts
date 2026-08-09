import mongoose, { Schema } from "mongoose";
import { hashPassword } from "../../utils/hash.js";

export type UserRole = "ADMIN" | "STAFF";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  role: UserRole;
  refreshToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "STAFF"],
      required: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await hashPassword(this.password);
});

export const User = mongoose.model<IUser>("User", userSchema);
