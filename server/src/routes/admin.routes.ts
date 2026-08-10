import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { domainAdminRouter } from './domain.routes';
import { technologyAdminRouter } from './technology.routes';
import { courseAdminRouter } from './course.routes';
import { moduleAdminRouter } from './module.routes';
import { lessonAdminRouter } from './lesson.routes';

const router = Router();

// All admin routes require authentication and ADMIN role
router.use(authenticate, authorize('ADMIN'));

router.use('/domains', domainAdminRouter);
router.use('/technologies', technologyAdminRouter);
router.use('/courses', courseAdminRouter);
router.use('/modules', moduleAdminRouter);
router.use('/lessons', lessonAdminRouter);

export default router;
