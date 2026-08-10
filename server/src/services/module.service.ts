import { Module } from '../models/Module';
import { Lesson } from '../models/Lesson';
import { Course } from '../models/Course';
import { ApiError } from '../utils/ApiError';
import { CreateModuleInput, UpdateModuleInput } from '../validators/module.validator';

export class ModuleService {
  static async getByCourse(courseId: string) {
    return Module.find({ courseId }).sort({ order: 1 });
  }

  static async getById(id: string) {
    const mod = await Module.findById(id);
    if (!mod) {
      throw ApiError.notFound('Module not found', 'MODULE_NOT_FOUND');
    }
    return mod;
  }

  static async create(data: CreateModuleInput) {
    const course = await Course.findById(data.courseId);
    if (!course) {
      throw ApiError.notFound('Parent course not found', 'COURSE_NOT_FOUND');
    }
    return Module.create(data);
  }

  static async update(id: string, data: UpdateModuleInput) {
    if (data.courseId) {
      const course = await Course.findById(data.courseId);
      if (!course) {
        throw ApiError.notFound('Parent course not found', 'COURSE_NOT_FOUND');
      }
    }

    const mod = await Module.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!mod) {
      throw ApiError.notFound('Module not found', 'MODULE_NOT_FOUND');
    }
    return mod;
  }

  static async delete(id: string) {
    const lessonCount = await Lesson.countDocuments({ moduleId: id });
    if (lessonCount > 0) {
      throw ApiError.badRequest(
        'Cannot delete module with existing lessons. Remove lessons first.',
        'MODULE_HAS_CHILDREN'
      );
    }

    const mod = await Module.findByIdAndDelete(id);
    if (!mod) {
      throw ApiError.notFound('Module not found', 'MODULE_NOT_FOUND');
    }
    return mod;
  }

  static async reorder(items: { id: string; order: number }[]) {
    const operations = items.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { order },
      },
    }));
    await Module.bulkWrite(operations);
  }
}
