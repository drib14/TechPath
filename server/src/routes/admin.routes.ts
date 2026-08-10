import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { AdminController } from '../controllers/admin.controller';
import { domainAdminRouter } from './domain.routes';
import { technologyAdminRouter } from './technology.routes';
import { courseAdminRouter } from './course.routes';
import { moduleAdminRouter } from './module.routes';
import { lessonAdminRouter } from './lesson.routes';
import { assessmentAdminRouter } from './assessment.routes';
import { exerciseAdminRouter } from './exercise.routes';

const router = Router();

// All admin routes require authentication and ADMIN role
router.use(authenticate, authorize('ADMIN'));

// Admin Dashboard stats & overview
router.get('/stats', AdminController.getStats);

// User & Role Management
router.get('/users', AdminController.getUsers);
router.patch('/users/:id/role', AdminController.updateUserRole);

// Security & Audit Logs
router.get('/audit-logs', AdminController.getAuditLogs);

// CMS Resource Sub-routers
router.use('/domains', domainAdminRouter);
router.use('/technologies', technologyAdminRouter);
router.use('/courses', courseAdminRouter);
router.use('/modules', moduleAdminRouter);
router.use('/lessons', lessonAdminRouter);
router.use('/assessments', assessmentAdminRouter);
router.use('/exercises', exerciseAdminRouter);

export default router;
