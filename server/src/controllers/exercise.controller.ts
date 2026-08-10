import { Request, Response, NextFunction } from 'express';
import { ExerciseService } from '../services/exercise.service';
import { ApiResponse } from '../utils/ApiResponse';

export class ExerciseController {
  // Public: get exercises for a lesson (sanitized — no correct answers)
  static async getByLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const exercises = await ExerciseService.getByLesson(req.params.lessonId);
      ApiResponse.success(res, exercises);
    } catch (error) {
      next(error);
    }
  }

  // Public: submit an answer and get server-validated result
  static async submitAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ExerciseService.checkAnswer(req.params.id, req.body);
      ApiResponse.success(res, result, 'Answer checked');
    } catch (error) {
      next(error);
    }
  }

  // Admin: get exercises for a lesson (full data)
  static async adminGetByLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const exercises = await ExerciseService.getByLessonAdmin(req.params.lessonId);
      ApiResponse.success(res, exercises);
    } catch (error) {
      next(error);
    }
  }

  // Admin: get single exercise
  static async adminGetById(req: Request, res: Response, next: NextFunction) {
    try {
      const exercise = await ExerciseService.getById(req.params.id);
      ApiResponse.success(res, exercise);
    } catch (error) {
      next(error);
    }
  }

  // Admin: create exercise
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const exercise = await ExerciseService.create(req.body);
      ApiResponse.created(res, exercise, 'Exercise created');
    } catch (error) {
      next(error);
    }
  }

  // Admin: update exercise
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const exercise = await ExerciseService.update(req.params.id, req.body);
      ApiResponse.success(res, exercise, 'Exercise updated');
    } catch (error) {
      next(error);
    }
  }

  // Admin: delete exercise
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ExerciseService.delete(req.params.id);
      ApiResponse.success(res, null, 'Exercise deleted');
    } catch (error) {
      next(error);
    }
  }
}
