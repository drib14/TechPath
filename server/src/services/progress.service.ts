import { Progress } from '../models/Progress';
import { Lesson } from '../models/Lesson';
import { Module } from '../models/Module';
import { Course } from '../models/Course';
import { Technology } from '../models/Technology';
import { ApiError } from '../utils/ApiError';
import mongoose from 'mongoose';

export class ProgressService {
  /**
   * Get all progress records for a user.
   */
  static async getByUser(userId: string) {
    return Progress.find({ userId, completed: true })
      .populate('lessonId', 'title slug moduleId')
      .sort({ completedAt: -1 })
      .lean();
  }

  /**
   * Mark a lesson as completed. Upserts to prevent duplicates.
   */
  static async completeLesson(userId: string, lessonId: string) {
    // Verify the lesson exists and is published
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      throw ApiError.notFound('Lesson not found', 'LESSON_NOT_FOUND');
    }
    if (lesson.status !== 'published') {
      throw ApiError.badRequest('Cannot complete an unpublished lesson', 'LESSON_NOT_PUBLISHED');
    }

    const progress = await Progress.findOneAndUpdate(
      { userId, lessonId },
      {
        completed: true,
        completedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return progress;
  }

  /**
   * Check if a specific lesson is completed by a user.
   */
  static async isLessonCompleted(userId: string, lessonId: string) {
    const progress = await Progress.findOne({
      userId,
      lessonId,
      completed: true,
    }).lean();
    return !!progress;
  }

  /**
   * Calculate progress for a specific course.
   * Returns total lessons, completed lessons, and percentage.
   */
  static async getCourseProgress(userId: string, courseId: string) {
    // Get all modules for this course
    const modules = await Module.find({ courseId }).select('_id').lean();
    const moduleIds = modules.map((m) => m._id);

    // Get all published lessons for these modules
    const lessons = await Lesson.find({
      moduleId: { $in: moduleIds },
      status: 'published',
    })
      .select('_id')
      .lean();

    const totalLessons = lessons.length;
    if (totalLessons === 0) {
      return { totalLessons: 0, completedLessons: 0, percentage: 0 };
    }

    const lessonIds = lessons.map((l) => l._id);

    // Count completed lessons
    const completedLessons = await Progress.countDocuments({
      userId,
      lessonId: { $in: lessonIds },
      completed: true,
    });

    const percentage = Math.round((completedLessons / totalLessons) * 100);

    return { totalLessons, completedLessons, percentage };
  }

  /**
   * Get dashboard data for a user:
   * - Recently completed lessons
   * - Courses in progress with percentages
   * - Continue learning (last incomplete lesson)
   * - Stats
   */
  static async getDashboardData(userId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1. Recently completed lessons (last 10)
    const recentlyCompleted = await Progress.find({
      userId: userObjectId,
      completed: true,
    })
      .populate({
        path: 'lessonId',
        select: 'title slug moduleId',
        populate: {
          path: 'moduleId',
          select: 'title courseId',
        },
      })
      .sort({ completedAt: -1 })
      .limit(10)
      .lean();

    // 2. Find all courses the user has interacted with
    // Get all completed lesson IDs
    const allProgress = await Progress.find({
      userId: userObjectId,
      completed: true,
    })
      .select('lessonId')
      .lean();

    const completedLessonIds = allProgress.map((p) => p.lessonId);

    // Find which modules these lessons belong to
    const completedLessons = await Lesson.find({
      _id: { $in: completedLessonIds },
    })
      .select('moduleId')
      .lean();

    const moduleIds = [...new Set(completedLessons.map((l) => l.moduleId.toString()))];

    // Find which courses these modules belong to
    const modules = await Module.find({
      _id: { $in: moduleIds },
    })
      .select('courseId')
      .lean();

    const courseIds = [...new Set(modules.map((m) => m.courseId.toString()))];

    // 3. Calculate progress for each enrolled course
    const enrolledCourses = [];
    for (const courseId of courseIds) {
      const course = await Course.findById(courseId)
        .populate('technologyId', 'name slug')
        .select('title slug description difficulty thumbnail technologyId')
        .lean();

      if (course) {
        const progress = await ProgressService.getCourseProgress(userId, courseId);
        enrolledCourses.push({
          course,
          ...progress,
        });
      }
    }

    // Sort: incomplete courses first, then by percentage descending
    enrolledCourses.sort((a, b) => {
      if (a.percentage === 100 && b.percentage !== 100) return 1;
      if (a.percentage !== 100 && b.percentage === 100) return -1;
      return b.percentage - a.percentage;
    });

    // 4. Continue learning: find the most recent incomplete course
    // and the next incomplete lesson in that course
    let continueLearning = null;
    const inProgressCourse = enrolledCourses.find((c) => c.percentage < 100);

    if (inProgressCourse) {
      const courseModules = await Module.find({
        courseId: inProgressCourse.course._id,
      })
        .sort({ order: 1 })
        .lean();

      for (const mod of courseModules) {
        const moduleLessons = await Lesson.find({
          moduleId: mod._id,
          status: 'published',
        })
          .sort({ order: 1 })
          .select('title slug')
          .lean();

        for (const lesson of moduleLessons) {
          const isCompleted = await Progress.findOne({
            userId: userObjectId,
            lessonId: lesson._id,
            completed: true,
          }).lean();

          if (!isCompleted) {
            continueLearning = {
              course: inProgressCourse.course,
              lesson,
              module: { title: mod.title },
              courseProgress: inProgressCourse.percentage,
            };
            break;
          }
        }
        if (continueLearning) break;
      }
    }

    // 5. Stats
    const totalCompletedLessons = allProgress.length;

    return {
      recentlyCompleted: recentlyCompleted
        .filter((p) => p.lessonId) // Filter out any progress with deleted lessons
        .map((p) => ({
          lesson: p.lessonId,
          completedAt: p.completedAt,
        })),
      enrolledCourses,
      continueLearning,
      stats: {
        totalCompletedLessons,
        coursesInProgress: enrolledCourses.filter((c) => c.percentage < 100).length,
        coursesCompleted: enrolledCourses.filter((c) => c.percentage === 100).length,
      },
    };
  }
}
