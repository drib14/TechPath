import { Request, Response, NextFunction } from 'express';
import { AssessmentService } from '../services/assessment.service';
import { ApiResponse } from '../utils/ApiResponse';

export class AssessmentController {
  // Public
  static async getByLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const assessment = await AssessmentService.getByLesson(req.params.lessonId);
      // For learners, do not expose `isCorrect` before submission
      if (assessment) {
        const sanitized = {
          ...assessment,
          questions: assessment.questions.map((q) => ({
            _id: (q as any)._id,
            question: q.question,
            type: q.type,
            options: q.options.map((o) => ({ text: o.text })),
          })),
        };
        ApiResponse.success(res, sanitized);
      } else {
        ApiResponse.success(res, null);
      }
    } catch (error) {
      next(error);
    }
  }

  static async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AssessmentService.submit(req.params.id, req.body);
      ApiResponse.success(res, result, 'Assessment evaluated');
    } catch (error) {
      next(error);
    }
  }

  // Admin
  static async adminGetAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const assessments = await AssessmentService.getAll();
      ApiResponse.success(res, assessments);
    } catch (error) {
      next(error);
    }
  }

  static async adminGetById(req: Request, res: Response, next: NextFunction) {
    try {
      const assessment = await AssessmentService.getById(req.params.id);
      ApiResponse.success(res, assessment);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const assessment = await AssessmentService.create(req.body);
      ApiResponse.created(res, assessment, 'Assessment created');
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const assessment = await AssessmentService.update(req.params.id, req.body);
      ApiResponse.success(res, assessment, 'Assessment updated');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await AssessmentService.delete(req.params.id);
      ApiResponse.success(res, null, 'Assessment deleted');
    } catch (error) {
      next(error);
    }
  }
}
