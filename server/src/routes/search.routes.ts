import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { Domain } from '../models/Domain';
import { Technology } from '../models/Technology';
import { Course } from '../models/Course';
import { Lesson } from '../models/Lesson';
import { ApiResponse } from '../utils/ApiResponse';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = (req.query.q as string) || '';

    if (!query || query.length < 2) {
      ApiResponse.success(res, { domains: [], technologies: [], courses: [], lessons: [] });
      return;
    }

    const searchRegex = new RegExp(query, 'i');

    const [domains, technologies, courses, lessons] = await Promise.all([
      Domain.find({
        status: 'published',
        $or: [{ name: searchRegex }, { description: searchRegex }],
      })
        .select('name slug description icon')
        .limit(5),
      Technology.find({
        status: 'published',
        $or: [{ name: searchRegex }, { description: searchRegex }],
      })
        .select('name slug description icon')
        .limit(5),
      Course.find({
        status: 'published',
        $or: [{ title: searchRegex }, { description: searchRegex }],
      })
        .select('title slug description difficulty thumbnail')
        .limit(10),
      Lesson.find({
        status: 'published',
        $or: [{ title: searchRegex }, { description: searchRegex }],
      })
        .select('title slug description')
        .limit(10),
    ]);

    ApiResponse.success(res, { domains, technologies, courses, lessons });
  } catch (error) {
    next(error);
  }
});

export default router;
