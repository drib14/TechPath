import { Router } from 'express';
import { LessonController } from '../controllers/lesson.controller';
import { validate } from '../middleware/validate.middleware';
import { createLessonSchema, updateLessonSchema } from '../validators/lesson.validator';

const router = Router();

// Public routes
router.get('/:slug', LessonController.getBySlug);
router.get('/module/:moduleId', LessonController.getByModule);

export const lessonAdminRouter = Router();
lessonAdminRouter.get('/module/:moduleId', LessonController.adminGetByModule);
lessonAdminRouter.get('/:id', LessonController.adminGetById);
lessonAdminRouter.post('/', validate(createLessonSchema), LessonController.create);
lessonAdminRouter.patch('/:id', validate(updateLessonSchema), LessonController.update);
lessonAdminRouter.delete('/:id', LessonController.delete);
lessonAdminRouter.patch('/reorder', LessonController.reorder);

export default router;
