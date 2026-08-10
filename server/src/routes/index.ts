import { Router } from 'express';
import authRoutes from './auth.routes';
import domainRoutes from './domain.routes';
import technologyRoutes from './technology.routes';
import courseRoutes from './course.routes';
import moduleRoutes from './module.routes';
import lessonRoutes from './lesson.routes';
import searchRoutes from './search.routes';
import statsRoutes from './stats.routes';
import assessmentRoutes from './assessment.routes';
import exerciseRoutes from './exercise.routes';
import progressRoutes from './progress.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/domains', domainRoutes);
router.use('/technologies', technologyRoutes);
router.use('/courses', courseRoutes);
router.use('/modules', moduleRoutes);
router.use('/lessons', lessonRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/exercises', exerciseRoutes);
router.use('/progress', progressRoutes);
router.use('/search', searchRoutes);
router.use('/stats', statsRoutes);
router.use('/admin', adminRoutes);

export default router;
