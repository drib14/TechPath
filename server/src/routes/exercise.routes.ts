import { Router } from 'express';
import { ExerciseController } from '../controllers/exercise.controller';
import { validate } from '../middleware/validate.middleware';
import {
  createExerciseSchema,
  updateExerciseSchema,
  submitExerciseSchema,
} from '../validators/exercise.validator';

const router = Router();

// Public routes
router.get('/lesson/:lessonId', ExerciseController.getByLesson);
router.post('/:id/submit', validate(submitExerciseSchema), ExerciseController.submitAnswer);

// Admin routes (mounted under /api/admin/exercises via admin.routes.ts)
export const exerciseAdminRouter = Router();
exerciseAdminRouter.get('/lesson/:lessonId', ExerciseController.adminGetByLesson);
exerciseAdminRouter.get('/:id', ExerciseController.adminGetById);
exerciseAdminRouter.post('/', validate(createExerciseSchema), ExerciseController.create);
exerciseAdminRouter.patch('/:id', validate(updateExerciseSchema), ExerciseController.update);
exerciseAdminRouter.delete('/:id', ExerciseController.delete);

export default router;
