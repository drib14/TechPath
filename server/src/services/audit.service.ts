import { Types } from 'mongoose';
import { AuditLog, AuditAction, AuditResourceType } from '../models/AuditLog';

export interface CreateAuditLogParams {
  userId: string | Types.ObjectId;
  userName: string;
  userEmail: string;
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId?: string;
  details: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditService {
  static async log(params: CreateAuditLogParams) {
    try {
      return await AuditLog.create({
        userId: new Types.ObjectId(params.userId),
        userName: params.userName,
        userEmail: params.userEmail,
        action: params.action,
        resourceType: params.resourceType,
        resourceId: params.resourceId || '',
        details: params.details,
        metadata: params.metadata || {},
        ipAddress: params.ipAddress || '',
        userAgent: params.userAgent || '',
      });
    } catch (error) {
      console.error('Failed to write audit log:', error);
      return null;
    }
  }

  static async getLogs(options: {
    page?: number;
    limit?: number;
    action?: string;
    resourceType?: string;
  } = {}) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (options.action) {
      filter.action = options.action;
    }
    if (options.resourceType) {
      filter.resourceType = options.resourceType;
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
