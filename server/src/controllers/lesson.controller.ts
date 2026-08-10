import { Request, Response, NextFunction } from 'express';
import { LessonService } from '../services/lesson.service';
import { ApiResponse } from '../utils/ApiResponse';

export class LessonController {
  // Public
  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const lesson = await LessonService.getBySlug(req.params.slug);
      const adjacent = await LessonService.getAdjacentLessons(lesson);
      ApiResponse.success(res, { lesson, ...adjacent });
    } catch (error) {
      next(error);
    }
  }

  static async getByModule(req: Request, res: Response, next: NextFunction) {
    try {
      const lessons = await LessonService.getByModule(req.params.moduleId, true);
      ApiResponse.success(res, lessons);
    } catch (error) {
      next(error);
    }
  }

  // Admin
  static async adminGetByModule(req: Request, res: Response, next: NextFunction) {
    try {
      const lessons = await LessonService.getByModule(req.params.moduleId, false);
      ApiResponse.success(res, lessons);
    } catch (error) {
      next(error);
    }
  }

  static async adminGetById(req: Request, res: Response, next: NextFunction) {
    try {
      const lesson = await LessonService.getById(req.params.id);
      ApiResponse.success(res, lesson);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const lesson = await LessonService.create(req.body);
      ApiResponse.created(res, lesson);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const lesson = await LessonService.update(req.params.id, req.body);
      ApiResponse.success(res, lesson, 'Lesson updated');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await LessonService.delete(req.params.id);
      ApiResponse.success(res, null, 'Lesson deleted');
    } catch (error) {
      next(error);
    }
  }

  static async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      await LessonService.reorder(req.body.items);
      ApiResponse.success(res, null, 'Lessons reordered');
    } catch (error) {
      next(error);
    }
  }
}
