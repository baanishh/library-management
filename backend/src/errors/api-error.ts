export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
  ) {
    super(message);
  }

  static badRequest(message: string) {
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

  static conflict(message: string) {
    return new ApiError(message, 409);
  }
}
