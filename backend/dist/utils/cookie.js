import { env } from "../config/env.js";
const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
// Set refresh cookie
export function setRefreshTokenCookie(res, token) {
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, COOKIE_OPTIONS);
}
// Clear refresh cookie
export function clearRefreshTokenCookie(res) {
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
    });
}
// Extract refresh token
export function getRefreshToken(req) {
    return req.cookies?.[REFRESH_TOKEN_COOKIE_NAME] || req.body?.refreshToken;
}
