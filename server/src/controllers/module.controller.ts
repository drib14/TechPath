import { Request, Response, NextFunction } from 'express';
import { ModuleService } from '../services/module.service';
import { ApiResponse } from '../utils/ApiResponse';

export class ModuleController {
  // Public
  static async getByCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const modules = await ModuleService.getByCourse(req.params.courseId);
      ApiResponse.success(res, modules);
    } catch (error) {
      next(error);
    }
  }

  // Admin
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const mod = await ModuleService.create(req.body);
      ApiResponse.created(res, mod);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const mod = await ModuleService.update(req.params.id, req.body);
      ApiResponse.success(res, mod, 'Module updated');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ModuleService.delete(req.params.id);
      ApiResponse.success(res, null, 'Module deleted');
    } catch (error) {
      next(error);
    }
  }

  static async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      await ModuleService.reorder(req.body.items);
      ApiResponse.success(res, null, 'Modules reordered');
    } catch (error) {
      next(error);
    }
  }
}
