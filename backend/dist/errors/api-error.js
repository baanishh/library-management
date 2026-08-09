export class ApiError extends Error {
    statusCode;
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
    static badRequest(message) {
        return new ApiError(message, 400);
    }
    static unauthorized(message = "Unauthorized") {
        return new ApiError(message, 401);
    }
    static forbidden(message = "Forbidden") {
        return new ApiError(message, 403);
    }
    static notFound(message = "Resource not found") {
        return new ApiError(message, 404);
    }
    static conflict(message) {
        return new ApiError(message, 409);
    }
}
