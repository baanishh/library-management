import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
// Access token
export function generateAccessToken(payload) {
    const options = {
        expiresIn: env.ACCESS_TOKEN_EXPIRY,
    };
    return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, options);
}
// Refresh token
export function generateRefreshToken(payload) {
    const options = {
        expiresIn: env.REFRESH_TOKEN_EXPIRY,
    };
    return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, options);
}
// Verify access token
export function verifyAccessToken(token) {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET);
}
// Verify refresh token
export function verifyRefreshToken(token) {
    return jwt.verify(token, env.REFRESH_TOKEN_SECRET);
}
