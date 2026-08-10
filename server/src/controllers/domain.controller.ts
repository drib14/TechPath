import { Request, Response, NextFunction } from 'express';
import { DomainService } from '../services/domain.service';
import { ApiResponse } from '../utils/ApiResponse';

export class DomainController {
  // Public
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const domains = await DomainService.getAll(true);
      ApiResponse.success(res, domains);
    } catch (error) {
      next(error);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const domain = await DomainService.getBySlug(req.params.slug);
      ApiResponse.success(res, domain);
    } catch (error) {
      next(error);
    }
  }

  // Admin
  static async adminGetAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const domains = await DomainService.getAll(false);
      ApiResponse.success(res, domains);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const domain = await DomainService.create(req.body);
      ApiResponse.created(res, domain);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const domain = await DomainService.update(req.params.id, req.body);
      ApiResponse.success(res, domain, 'Domain updated');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await DomainService.delete(req.params.id);
      ApiResponse.success(res, null, 'Domain deleted');
    } catch (error) {
      next(error);
    }
  }

  static async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      await DomainService.reorder(req.body.items);
      ApiResponse.success(res, null, 'Domains reordered');
    } catch (error) {
      next(error);
    }
  }
}
