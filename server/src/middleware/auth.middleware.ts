import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthRequest, JwtPayload, UserRole } from '../types';
import { ApiError } from '../utils/ApiError';

export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      throw ApiError.unauthorized('Authentication required');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(ApiError.unauthorized('Invalid or expired token'));
    }
  }
};

export const optionalAuth = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies?.token;

    if (token) {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      req.user = {
        userId: decoded.userId,
        role: decoded.role,
      };
    }

    next();
  } catch {
    // Token invalid/expired — continue as unauthenticated
    next();
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(ApiError.unauthorized('Authentication required'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(ApiError.forbidden('Insufficient permissions'));
      return;
    }

    next();
  };
};
