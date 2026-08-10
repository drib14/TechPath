import { Response, NextFunction } from 'express';
import { ProgressService } from '../services/progress.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../types';
import { ApiError } from '../utils/ApiError';
import mongoose from 'mongoose';

export class ProgressController {
  // Get all progress for the authenticated user
  static async getProgress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
      }
      const progress = await ProgressService.getByUser(req.user.userId);
      ApiResponse.success(res, progress);
    } catch (error) {
      next(error);
    }
  }

  // Mark a lesson as complete
  static async completeLesson(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
      }

      const { lessonId } = req.params;

      // Validate lessonId is a valid ObjectId to prevent NoSQL injection
      if (!mongoose.Types.ObjectId.isValid(lessonId)) {
        throw ApiError.badRequest('Invalid lesson ID format', 'INVALID_ID');
      }

      const progress = await ProgressService.completeLesson(
        req.user.userId,
        lessonId
      );
      ApiResponse.success(res, progress, 'Lesson marked as complete');
    } catch (error) {
      next(error);
    }
  }

  // Check if a lesson is completed
  static async checkLessonStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
      }

      const { lessonId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(lessonId)) {
        throw ApiError.badRequest('Invalid lesson ID format', 'INVALID_ID');
      }

      const completed = await ProgressService.isLessonCompleted(
        req.user.userId,
        lessonId
      );
      ApiResponse.success(res, { completed });
    } catch (error) {
      next(error);
    }
  }

  // Get dashboard data for the authenticated user
  static async getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
      }
      const dashboard = await ProgressService.getDashboardData(req.user.userId);
      ApiResponse.success(res, dashboard);
    } catch (error) {
      next(error);
    }
  }
}
