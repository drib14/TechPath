import { Technology } from '../models/Technology';
import { Course } from '../models/Course';
import { Domain } from '../models/Domain';
import { ApiError } from '../utils/ApiError';
import { CreateTechnologyInput, UpdateTechnologyInput } from '../validators/technology.validator';

export class TechnologyService {
  static async getAll(publishedOnly: boolean = true) {
    const filter = publishedOnly ? { status: 'published' } : {};
    return Technology.find(filter)
      .populate('domainId', 'name slug')
      .sort({ order: 1, createdAt: -1 });
  }

  static async getByDomain(domainId: string, publishedOnly: boolean = true) {
    const filter: any = { domainId };
    if (publishedOnly) filter.status = 'published';
    return Technology.find(filter).sort({ order: 1, createdAt: -1 });
  }

  static async getBySlug(slug: string) {
    const tech = await Technology.findOne({ slug, status: 'published' }).populate(
      'domainId',
      'name slug'
    );
    if (!tech) {
      throw ApiError.notFound('Technology not found', 'TECHNOLOGY_NOT_FOUND');
    }
    return tech;
  }

  static async getById(id: string) {
    const tech = await Technology.findById(id).populate('domainId', 'name slug');
    if (!tech) {
      throw ApiError.notFound('Technology not found', 'TECHNOLOGY_NOT_FOUND');
    }
    return tech;
  }

  static async create(data: CreateTechnologyInput) {
    // Verify parent domain exists
    const domain = await Domain.findById(data.domainId);
    if (!domain) {
      throw ApiError.notFound('Parent domain not found', 'DOMAIN_NOT_FOUND');
    }

    const existing = await Technology.findOne({ slug: data.slug });
    if (existing) {
      throw ApiError.conflict('Technology with this slug already exists', 'TECHNOLOGY_SLUG_EXISTS');
    }

    return Technology.create(data);
  }

  static async update(id: string, data: UpdateTechnologyInput) {
    if (data.domainId) {
      const domain = await Domain.findById(data.domainId);
      if (!domain) {
        throw ApiError.notFound('Parent domain not found', 'DOMAIN_NOT_FOUND');
      }
    }

    if (data.slug) {
      const existing = await Technology.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        throw ApiError.conflict('Technology with this slug already exists', 'TECHNOLOGY_SLUG_EXISTS');
      }
    }

    const tech = await Technology.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!tech) {
      throw ApiError.notFound('Technology not found', 'TECHNOLOGY_NOT_FOUND');
    }
    return tech;
  }

  static async delete(id: string) {
    const courseCount = await Course.countDocuments({ technologyId: id });
    if (courseCount > 0) {
      throw ApiError.badRequest(
        'Cannot delete technology with existing courses. Remove courses first.',
        'TECHNOLOGY_HAS_CHILDREN'
      );
    }

    const tech = await Technology.findByIdAndDelete(id);
    if (!tech) {
      throw ApiError.notFound('Technology not found', 'TECHNOLOGY_NOT_FOUND');
    }
    return tech;
  }

  static async reorder(items: { id: string; order: number }[]) {
    const operations = items.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { order },
      },
    }));
    await Technology.bulkWrite(operations);
  }
}
