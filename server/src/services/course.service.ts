import { Course } from '../models/Course';
import { Module } from '../models/Module';
import { Technology } from '../models/Technology';
import { ApiError } from '../utils/ApiError';
import { CreateCourseInput, UpdateCourseInput } from '../validators/course.validator';

export class CourseService {
  static async getAll(publishedOnly: boolean = true) {
    const filter = publishedOnly ? { status: 'published' } : {};
    return Course.find(filter)
      .populate('technologyId', 'name slug')
      .sort({ order: 1, createdAt: -1 });
  }

  static async getByTechnology(technologyId: string, publishedOnly: boolean = true) {
    const filter: any = { technologyId };
    if (publishedOnly) filter.status = 'published';
    return Course.find(filter).sort({ order: 1, createdAt: -1 });
  }

  static async getBySlug(slug: string) {
    const course = await Course.findOne({ slug, status: 'published' }).populate(
      'technologyId',
      'name slug domainId'
    );
    if (!course) {
      throw ApiError.notFound('Course not found', 'COURSE_NOT_FOUND');
    }
    return course;
  }

  static async getById(id: string) {
    const course = await Course.findById(id).populate('technologyId', 'name slug');
    if (!course) {
      throw ApiError.notFound('Course not found', 'COURSE_NOT_FOUND');
    }
    return course;
  }

  static async create(data: CreateCourseInput) {
    const tech = await Technology.findById(data.technologyId);
    if (!tech) {
      throw ApiError.notFound('Parent technology not found', 'TECHNOLOGY_NOT_FOUND');
    }

    const existing = await Course.findOne({ slug: data.slug });
    if (existing) {
      throw ApiError.conflict('Course with this slug already exists', 'COURSE_SLUG_EXISTS');
    }

    return Course.create(data);
  }

  static async update(id: string, data: UpdateCourseInput) {
    if (data.technologyId) {
      const tech = await Technology.findById(data.technologyId);
      if (!tech) {
        throw ApiError.notFound('Parent technology not found', 'TECHNOLOGY_NOT_FOUND');
      }
    }

    if (data.slug) {
      const existing = await Course.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        throw ApiError.conflict('Course with this slug already exists', 'COURSE_SLUG_EXISTS');
      }
    }

    const course = await Course.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      throw ApiError.notFound('Course not found', 'COURSE_NOT_FOUND');
    }
    return course;
  }

  static async delete(id: string) {
    const moduleCount = await Module.countDocuments({ courseId: id });
    if (moduleCount > 0) {
      throw ApiError.badRequest(
        'Cannot delete course with existing modules. Remove modules first.',
        'COURSE_HAS_CHILDREN'
      );
    }

    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      throw ApiError.notFound('Course not found', 'COURSE_NOT_FOUND');
    }
    return course;
  }

  static async reorder(items: { id: string; order: number }[]) {
    const operations = items.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { order },
      },
    }));
    await Course.bulkWrite(operations);
  }
}
