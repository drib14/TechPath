import { Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { AuditService } from '../services/audit.service';
import { AuthRequest, UserRole } from '../types';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

export class AdminController {
  static async getStats(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getDashboardStats();
      ApiResponse.success(res, stats);
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const search = req.query.search as string;
      const role = req.query.role as string;

      const result = await AdminService.getUsers({ page, limit, search, role });
      ApiResponse.paginated(
        res,
        result.users,
        result.pagination.total,
        result.pagination.page,
        result.pagination.limit
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateUserRole(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { role } = req.body;
      const { id } = req.params;

      if (!role || (role !== 'USER' && role !== 'ADMIN')) {
        throw ApiError.badRequest('Valid role (USER or ADMIN) is required', 'INVALID_ROLE');
      }

      const ipAddress = req.ip || req.socket.remoteAddress || '';
      const userAgent = req.get('user-agent') || '';

      const updatedUser = await AdminService.updateUserRole(
        req.user!.userId,
        id,
        role as UserRole,
        ipAddress,
        userAgent
      );

      ApiResponse.success(res, updatedUser, 'User role updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getAuditLogs(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const action = req.query.action as string;
      const resourceType = req.query.resourceType as string;

      const result = await AuditService.getLogs({ page, limit, action, resourceType });
      ApiResponse.paginated(
        res,
        result.logs,
        result.pagination.total,
        result.pagination.page,
        result.pagination.limit
      );
    } catch (error) {
      next(error);
    }
  }
}
