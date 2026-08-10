import { Router } from 'express';
import { AssessmentController } from '../controllers/assessment.controller';
import { validate } from '../middleware/validate.middleware';
import {
  createAssessmentSchema,
  updateAssessmentSchema,
  submitAssessmentSchema,
} from '../validators/assessment.validator';

const router = Router();

// Public routes
router.get('/lesson/:lessonId', AssessmentController.getByLesson);
router.post('/:id/submit', validate(submitAssessmentSchema), AssessmentController.submit);

// Admin routes
export const assessmentAdminRouter = Router();
assessmentAdminRouter.get('/', AssessmentController.adminGetAll);
assessmentAdminRouter.get('/:id', AssessmentController.adminGetById);
assessmentAdminRouter.get('/lesson/:lessonId', AssessmentController.getByLesson);
assessmentAdminRouter.post('/', validate(createAssessmentSchema), AssessmentController.create);
assessmentAdminRouter.patch('/:id', validate(updateAssessmentSchema), AssessmentController.update);
assessmentAdminRouter.delete('/:id', AssessmentController.delete);

export default router;
