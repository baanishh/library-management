import mongoose, { Schema } from "mongoose";
import { hashPassword } from "../../utils/hash.js";
const userSchema = new Schema({
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
}, {
    timestamps: true,
});
// Hash password
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    if (this.password) {
        this.password = await hashPassword(this.password);
    }
});
export const User = mongoose.model("User", userSchema);
