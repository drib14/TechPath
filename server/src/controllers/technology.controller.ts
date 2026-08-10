import { Request, Response, NextFunction } from 'express';
import { TechnologyService } from '../services/technology.service';
import { ApiResponse } from '../utils/ApiResponse';

export class TechnologyController {
  // Public
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const techs = await TechnologyService.getAll(true);
      ApiResponse.success(res, techs);
    } catch (error) {
      next(error);
    }
  }

  static async getByDomain(req: Request, res: Response, next: NextFunction) {
    try {
      const techs = await TechnologyService.getByDomain(req.params.domainId, true);
      ApiResponse.success(res, techs);
    } catch (error) {
      next(error);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const tech = await TechnologyService.getBySlug(req.params.slug);
      ApiResponse.success(res, tech);
    } catch (error) {
      next(error);
    }
  }

  // Admin
  static async adminGetAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const techs = await TechnologyService.getAll(false);
      ApiResponse.success(res, techs);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const tech = await TechnologyService.create(req.body);
      ApiResponse.created(res, tech);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const tech = await TechnologyService.update(req.params.id, req.body);
      ApiResponse.success(res, tech, 'Technology updated');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await TechnologyService.delete(req.params.id);
      ApiResponse.success(res, null, 'Technology deleted');
    } catch (error) {
      next(error);
    }
  }

  static async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      await TechnologyService.reorder(req.body.items);
      ApiResponse.success(res, null, 'Technologies reordered');
    } catch (error) {
      next(error);
    }
  }
}
