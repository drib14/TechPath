import mongoose, { Schema, Document, Types } from 'mongoose';

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'REORDER'
  | 'PUBLISH'
  | 'UNPUBLISH'
  | 'ROLE_CHANGE'
  | 'LOGIN';

export type AuditResourceType =
  | 'Domain'
  | 'Technology'
  | 'Course'
  | 'Module'
  | 'Lesson'
  | 'Exercise'
  | 'Assessment'
  | 'User'
  | 'System';

export interface IAuditLog extends Document {
  userId: Types.ObjectId;
  userName: string;
  userEmail: string;
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId?: string;
  details: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: [
        'CREATE',
        'UPDATE',
        'DELETE',
        'REORDER',
        'PUBLISH',
        'UNPUBLISH',
        'ROLE_CHANGE',
        'LOGIN',
      ],
      required: true,
      index: true,
    },
    resourceType: {
      type: String,
      enum: [
        'Domain',
        'Technology',
        'Course',
        'Module',
        'Lesson',
        'Exercise',
        'Assessment',
        'User',
        'System',
      ],
      required: true,
      index: true,
    },
    resourceId: {
      type: String,
      default: '',
    },
    details: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
