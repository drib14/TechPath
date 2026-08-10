import { Domain } from '../models/Domain';
import { Technology } from '../models/Technology';
import { ApiError } from '../utils/ApiError';
import { CreateDomainInput, UpdateDomainInput } from '../validators/domain.validator';

export class DomainService {
  static async getAll(publishedOnly: boolean = true) {
    const filter = publishedOnly ? { status: 'published' } : {};
    return Domain.find(filter).sort({ order: 1, createdAt: -1 });
  }

  static async getBySlug(slug: string) {
    const domain = await Domain.findOne({ slug, status: 'published' });
    if (!domain) {
      throw ApiError.notFound('Domain not found', 'DOMAIN_NOT_FOUND');
    }
    return domain;
  }

  static async getById(id: string) {
    const domain = await Domain.findById(id);
    if (!domain) {
      throw ApiError.notFound('Domain not found', 'DOMAIN_NOT_FOUND');
    }
    return domain;
  }

  static async create(data: CreateDomainInput) {
    const existing = await Domain.findOne({ slug: data.slug });
    if (existing) {
      throw ApiError.conflict('Domain with this slug already exists', 'DOMAIN_SLUG_EXISTS');
    }
    return Domain.create(data);
  }

  static async update(id: string, data: UpdateDomainInput) {
    if (data.slug) {
      const existing = await Domain.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        throw ApiError.conflict('Domain with this slug already exists', 'DOMAIN_SLUG_EXISTS');
      }
    }

    const domain = await Domain.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!domain) {
      throw ApiError.notFound('Domain not found', 'DOMAIN_NOT_FOUND');
    }
    return domain;
  }

  static async delete(id: string) {
    // Check for child technologies
    const techCount = await Technology.countDocuments({ domainId: id });
    if (techCount > 0) {
      throw ApiError.badRequest(
        'Cannot delete domain with existing technologies. Remove technologies first.',
        'DOMAIN_HAS_CHILDREN'
      );
    }

    const domain = await Domain.findByIdAndDelete(id);
    if (!domain) {
      throw ApiError.notFound('Domain not found', 'DOMAIN_NOT_FOUND');
    }
    return domain;
  }

  static async reorder(items: { id: string; order: number }[]) {
    const operations = items.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { order },
      },
    }));
    await Domain.bulkWrite(operations);
  }
}
