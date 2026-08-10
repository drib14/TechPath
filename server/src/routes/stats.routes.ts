import { Router, Request, Response, NextFunction } from 'express';
import { Domain } from '../models/Domain';
import { Technology } from '../models/Technology';
import { Course } from '../models/Course';
import { Lesson } from '../models/Lesson';
import { ApiResponse } from '../utils/ApiResponse';

const router = Router();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [domainsCount, technologiesCount, coursesCount, lessonsCount] = await Promise.all([
      Domain.countDocuments({ status: 'published' }),
      Technology.countDocuments({ status: 'published' }),
      Course.countDocuments({ status: 'published' }),
      Lesson.countDocuments({ status: 'published' }),
    ]);

    ApiResponse.success(res, {
      domains: domainsCount,
      technologies: technologiesCount,
      courses: coursesCount,
      lessons: lessonsCount,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
