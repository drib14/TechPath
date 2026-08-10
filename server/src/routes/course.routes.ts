import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { validate } from '../middleware/validate.middleware';
import { createCourseSchema, updateCourseSchema } from '../validators/course.validator';

const router = Router();

// Public routes
router.get('/', CourseController.getAll);
router.get('/:slug', CourseController.getBySlug);
router.get('/technology/:technologyId', CourseController.getByTechnology);

export const courseAdminRouter = Router();
courseAdminRouter.get('/', CourseController.adminGetAll);
courseAdminRouter.post('/', validate(createCourseSchema), CourseController.create);
courseAdminRouter.patch('/:id', validate(updateCourseSchema), CourseController.update);
courseAdminRouter.delete('/:id', CourseController.delete);
courseAdminRouter.patch('/reorder', CourseController.reorder);

export default router;
