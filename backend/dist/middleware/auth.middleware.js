import { verifyAccessToken } from "../utils/jwt.js";
import { ApiError } from "../errors/api-error.js";
// Auth guard
export const authenticate = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(ApiError.unauthorized("Access token is missing or invalid"));
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    }
    catch {
        next(ApiError.unauthorized("Access token is expired or invalid"));
    }
};
// Role guard
export const requireRole = (allowedRoles) => {
    return (req, _res, next) => {
        const authReq = req;
        if (!authReq.user) {
            return next(ApiError.unauthorized("Unauthorized"));
        }
        if (!allowedRoles.includes(authReq.user.role)) {
            return next(ApiError.forbidden("Forbidden: You do not have permission to access this resource"));
        }
        next();
    };
};
