export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;

  constructor(statusCode: number, message: string, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string, code: string = 'BAD_REQUEST') {
    return new ApiError(400, message, code);
  }

  static unauthorized(message: string = 'Unauthorized', code: string = 'UNAUTHORIZED') {
    return new ApiError(401, message, code);
  }

  static forbidden(message: string = 'Forbidden', code: string = 'FORBIDDEN') {
    return new ApiError(403, message, code);
  }

  static notFound(message: string = 'Not found', code: string = 'NOT_FOUND') {
    return new ApiError(404, message, code);
  }

  static conflict(message: string, code: string = 'CONFLICT') {
    return new ApiError(409, message, code);
  }

  static internal(message: string = 'Internal server error') {
    return new ApiError(500, message, 'INTERNAL_ERROR');
  }
}
