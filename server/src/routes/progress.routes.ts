import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { ProgressController } from '../controllers/progress.controller';

const router = Router();

// All progress routes require authentication
router.use(authenticate);

router.get('/', ProgressController.getProgress);
router.get('/dashboard', ProgressController.getDashboard);
router.get('/:lessonId/status', ProgressController.checkLessonStatus);
router.post('/:lessonId/complete', ProgressController.completeLesson);

export default router;
