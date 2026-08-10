import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthRequest, JwtPayload, UserRole } from '../types';
import { ApiError } from '../utils/ApiError';
import { User } from '../models/User';

const isConfiguredAdmin = (email: string): boolean => {
  if (!env.ADMIN_EMAILS) return false;
  const adminEmails = env.ADMIN_EMAILS.split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.includes(email.trim().toLowerCase());
};

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      throw ApiError.unauthorized('Authentication required');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    // Fetch fresh user from DB to verify active status and current role
    const user = await User.findById(decoded.userId).select('role email name avatar');
    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    let role = user.role;

    // Auto-promote if in ADMIN_EMAILS or if there are zero existing admins in system
    if (isConfiguredAdmin(user.email)) {
      if (role !== 'ADMIN') {
        user.role = 'ADMIN';
        await user.save();
        role = 'ADMIN';
      }
    } else {
      const adminCount = await User.countDocuments({ role: 'ADMIN' });
      if (adminCount === 0) {
        user.role = 'ADMIN';
        await user.save();
        role = 'ADMIN';
      }
    }

    req.user = {
      userId: user._id.toString(),
      role,
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

export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (token) {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      const user = await User.findById(decoded.userId).select('role email');
      if (user) {
        req.user = {
          userId: user._id.toString(),
          role: user.role,
        };
      }
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
