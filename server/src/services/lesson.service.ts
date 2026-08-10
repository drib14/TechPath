import { Lesson } from '../models/Lesson';
import { Module } from '../models/Module';
import { ApiError } from '../utils/ApiError';
import { CreateLessonInput, UpdateLessonInput } from '../validators/lesson.validator';

export class LessonService {
  static async getByModule(moduleId: string, publishedOnly: boolean = true) {
    const filter: any = { moduleId };
    if (publishedOnly) filter.status = 'published';
    return Lesson.find(filter).select('-content').sort({ order: 1 });
  }

  static async getBySlug(slug: string) {
    const lesson = await Lesson.findOne({ slug, status: 'published' });
    if (!lesson) {
      throw ApiError.notFound('Lesson not found', 'LESSON_NOT_FOUND');
    }
    return lesson;
  }

  static async getById(id: string) {
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      throw ApiError.notFound('Lesson not found', 'LESSON_NOT_FOUND');
    }
    return lesson;
  }

  static async create(data: CreateLessonInput) {
    const mod = await Module.findById(data.moduleId);
    if (!mod) {
      throw ApiError.notFound('Parent module not found', 'MODULE_NOT_FOUND');
    }

    const existing = await Lesson.findOne({ slug: data.slug });
    if (existing) {
      throw ApiError.conflict('Lesson with this slug already exists', 'LESSON_SLUG_EXISTS');
    }

    return Lesson.create(data);
  }

  static async update(id: string, data: UpdateLessonInput) {
    if (data.moduleId) {
      const mod = await Module.findById(data.moduleId);
      if (!mod) {
        throw ApiError.notFound('Parent module not found', 'MODULE_NOT_FOUND');
      }
    }

    if (data.slug) {
      const existing = await Lesson.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        throw ApiError.conflict('Lesson with this slug already exists', 'LESSON_SLUG_EXISTS');
      }
    }

    const lesson = await Lesson.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!lesson) {
      throw ApiError.notFound('Lesson not found', 'LESSON_NOT_FOUND');
    }
    return lesson;
  }

  static async delete(id: string) {
    const lesson = await Lesson.findByIdAndDelete(id);
    if (!lesson) {
      throw ApiError.notFound('Lesson not found', 'LESSON_NOT_FOUND');
    }
    return lesson;
  }

  static async reorder(items: { id: string; order: number }[]) {
    const operations = items.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { order },
      },
    }));
    await Lesson.bulkWrite(operations);
  }

  static async getAdjacentLessons(lesson: any) {
    const moduleLessons = await Lesson.find({
      moduleId: lesson.moduleId,
      status: 'published',
    })
      .select('title slug order')
      .sort({ order: 1 });

    const currentIndex = moduleLessons.findIndex(
      (l) => l._id.toString() === lesson._id.toString()
    );

    return {
      previous: currentIndex > 0 ? moduleLessons[currentIndex - 1] : null,
      next: currentIndex < moduleLessons.length - 1 ? moduleLessons[currentIndex + 1] : null,
    };
  }
}
