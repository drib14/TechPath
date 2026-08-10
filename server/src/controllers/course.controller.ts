import { Request, Response, NextFunction } from 'express';
import { CourseService } from '../services/course.service';
import { ApiResponse } from '../utils/ApiResponse';

export class CourseController {
  // Public
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await CourseService.getAll(true);
      ApiResponse.success(res, courses);
    } catch (error) {
      next(error);
    }
  }

  static async getByTechnology(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await CourseService.getByTechnology(req.params.technologyId, true);
      ApiResponse.success(res, courses);
    } catch (error) {
      next(error);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await CourseService.getBySlug(req.params.slug);
      ApiResponse.success(res, course);
    } catch (error) {
      next(error);
    }
  }

  // Admin
  static async adminGetAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await CourseService.getAll(false);
      ApiResponse.success(res, courses);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await CourseService.create(req.body);
      ApiResponse.created(res, course);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await CourseService.update(req.params.id, req.body);
      ApiResponse.success(res, course, 'Course updated');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await CourseService.delete(req.params.id);
      ApiResponse.success(res, null, 'Course deleted');
    } catch (error) {
      next(error);
    }
  }

  static async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      await CourseService.reorder(req.body.items);
      ApiResponse.success(res, null, 'Courses reordered');
    } catch (error) {
      next(error);
    }
  }
}
