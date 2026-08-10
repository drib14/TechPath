import { Response } from 'express';

interface ApiResponseData<T> {
  success: boolean;
  message?: string;
  data?: T;
  code?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export class ApiResponse {
  static success<T>(res: Response, data: T, message?: string, statusCode: number = 200) {
    const response: ApiResponseData<T> = {
      success: true,
      data,
    };
    if (message) response.message = message;
    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T, message: string = 'Created successfully') {
    return ApiResponse.success(res, data, message, 201);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    total: number,
    page: number,
    limit: number,
    message?: string
  ) {
    const response: ApiResponseData<T[]> = {
      success: true,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
    if (message) response.message = message;
    return res.status(200).json(response);
  }

  static error(res: Response, statusCode: number, message: string, code?: string) {
    const response: ApiResponseData<null> = {
      success: false,
      message,
    };
    if (code) response.code = code;
    return res.status(statusCode).json(response);
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }
}
