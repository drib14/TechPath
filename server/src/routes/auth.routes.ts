import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { googleAuthSchema } from '../validators/auth.validator';
import rateLimit from 'express-rate-limit';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: 'Too many auth attempts, please try again later', code: 'RATE_LIMITED' },
});

router.post('/google', authLimiter, validate(googleAuthSchema), AuthController.googleAuth);
router.post('/logout', AuthController.logout);
router.get('/me', authenticate, AuthController.me);

export default router;
