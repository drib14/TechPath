import { Domain } from '../models/Domain';
import { Technology } from '../models/Technology';
import { Course } from '../models/Course';
import { Module } from '../models/Module';
import { Lesson } from '../models/Lesson';
import { Assessment } from '../models/Assessment';
import { Exercise } from '../models/Exercise';
import { User } from '../models/User';
import { AuditLog } from '../models/AuditLog';
import { AuditService } from './audit.service';
import { ApiError } from '../utils/ApiError';
import { UserRole } from '../types';

export class AdminService {
  static async getDashboardStats() {
    const [
      totalDomains,
      publishedDomains,
      totalTechnologies,
      publishedTechnologies,
      totalCourses,
      publishedCourses,
      totalModules,
      totalLessons,
      publishedLessons,
      totalAssessments,
      totalExercises,
      totalUsers,
      adminUsers,
      draftLessons,
      draftCourses,
      recentAuditLogs,
    ] = await Promise.all([
      Domain.countDocuments(),
      Domain.countDocuments({ status: 'published' }),
      Technology.countDocuments(),
      Technology.countDocuments({ status: 'published' }),
      Course.countDocuments(),
      Course.countDocuments({ status: 'published' }),
      Module.countDocuments(),
      Lesson.countDocuments(),
      Lesson.countDocuments({ status: 'published' }),
      Assessment.countDocuments(),
      Exercise.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ role: 'ADMIN' }),
      Lesson.find({ status: 'draft' })
        .populate('moduleId', 'title courseId')
        .sort({ updatedAt: -1 })
        .limit(6)
        .lean(),
      Course.find({ status: 'draft' })
        .populate('technologyId', 'name')
        .sort({ updatedAt: -1 })
        .limit(6)
        .lean(),
      AuditLog.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
    ]);

    return {
      metrics: {
        domains: { total: totalDomains, published: publishedDomains, draft: totalDomains - publishedDomains },
        technologies: { total: totalTechnologies, published: publishedTechnologies, draft: totalTechnologies - publishedTechnologies },
        courses: { total: totalCourses, published: publishedCourses, draft: totalCourses - publishedCourses },
        modules: { total: totalModules },
        lessons: { total: totalLessons, published: publishedLessons, draft: totalLessons - publishedLessons },
        assessments: { total: totalAssessments },
        exercises: { total: totalExercises },
        users: { total: totalUsers, admins: adminUsers, learners: totalUsers - adminUsers },
      },
      drafts: {
        lessons: draftLessons,
        courses: draftCourses,
      },
      recentActivity: recentAuditLogs,
    };
  }

  static async getUsers(options: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  } = {}) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (options.role && (options.role === 'USER' || options.role === 'ADMIN')) {
      filter.role = options.role;
    }
    if (options.search) {
      filter.$or = [
        { name: { $regex: options.search, $options: 'i' } },
        { email: { $regex: options.search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async updateUserRole(
    adminUserId: string,
    targetUserId: string,
    newRole: UserRole,
    ipAddress?: string,
    userAgent?: string
  ) {
    if (adminUserId === targetUserId && newRole !== 'ADMIN') {
      throw ApiError.badRequest('You cannot demote yourself from the ADMIN role', 'CANNOT_DEMOTE_SELF');
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      throw ApiError.notFound('Target user not found', 'USER_NOT_FOUND');
    }

    if (targetUser.role === 'ADMIN' && newRole === 'USER') {
      const adminCount = await User.countDocuments({ role: 'ADMIN' });
      if (adminCount <= 1) {
        throw ApiError.badRequest('Cannot demote the last remaining administrator', 'LAST_ADMIN');
      }
    }

    const oldRole = targetUser.role;
    targetUser.role = newRole;
    await targetUser.save();

    const actingAdmin = await User.findById(adminUserId);

    await AuditService.log({
      userId: adminUserId,
      userName: actingAdmin?.name || 'Admin',
      userEmail: actingAdmin?.email || 'admin@techpath.dev',
      action: 'ROLE_CHANGE',
      resourceType: 'User',
      resourceId: targetUserId,
      details: `Changed role of ${targetUser.name} (${targetUser.email}) from ${oldRole} to ${newRole}`,
      metadata: { targetUserId, oldRole, newRole },
      ipAddress,
      userAgent,
    });

    return targetUser;
  }
}
