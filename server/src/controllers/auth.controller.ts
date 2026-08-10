import { Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../types';
import { ApiResponse } from '../utils/ApiResponse';
import { env } from '../config/env';

export class AuthController {
  static async googleAuth(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { credential } = req.body;
      const { user, token } = await AuthService.googleAuth(credential);

      // Set HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      ApiResponse.success(res, {
        _id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      }, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  static async logout(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
      });

      ApiResponse.success(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  static async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getCurrentUser(req.user!.userId);
      ApiResponse.success(res, user);
    } catch (error) {
      next(error);
    }
  }
}
