import type { CookieOptions, Request, Response } from "express";
import { env } from "../config/env.js";

const COOKIE_NAME = "refreshToken";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export function setRefreshTokenCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, cookieOptions);
}

export function clearRefreshTokenCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, cookieOptions);
}

export function getRefreshToken(req: Request) {
  return req.cookies?.[COOKIE_NAME];
}
