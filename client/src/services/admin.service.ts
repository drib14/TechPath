import api from '../lib/axios';
import type {
  AdminDashboardData,
  Domain,
  Technology,
  Course,
  Module,
  Lesson,
  Assessment,
  User,
  AuditLog,
  ApiResponse,
  UserRole,
} from '../types';

export const adminService = {
  // Dashboard & Analytics
  async getDashboardStats(): Promise<AdminDashboardData> {
    const { data } = await api.get<ApiResponse<AdminDashboardData>>('/admin/stats');
    return data.data!;
  },

  // Users & Role Management
  async getUsers(params: { page?: number; limit?: number; search?: string; role?: string } = {}): Promise<{
    users: User[];
    meta?: ApiResponse<User[]>['meta'];
  }> {
    const { data } = await api.get<ApiResponse<User[]>>('/admin/users', { params });
    return { users: data.data || [], meta: data.meta };
  },

  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    const { data } = await api.patch<ApiResponse<User>>(`/admin/users/${userId}/role`, { role });
    return data.data!;
  },

  // Audit Logs
  async getAuditLogs(params: { page?: number; limit?: number; action?: string; resourceType?: string } = {}): Promise<{
    logs: AuditLog[];
    meta?: ApiResponse<AuditLog[]>['meta'];
  }> {
    const { data } = await api.get<ApiResponse<AuditLog[]>>('/admin/audit-logs', { params });
    return { logs: data.data || [], meta: data.meta };
  },

  // Domain Management
  async getDomains(): Promise<Domain[]> {
    const { data } = await api.get<ApiResponse<Domain[]>>('/admin/domains');
    return data.data || [];
  },

  async createDomain(domain: Partial<Domain>): Promise<Domain> {
    const { data } = await api.post<ApiResponse<Domain>>('/admin/domains', domain);
    return data.data!;
  },

  async updateDomain(id: string, domain: Partial<Domain>): Promise<Domain> {
    const { data } = await api.patch<ApiResponse<Domain>>(`/admin/domains/${id}`, domain);
    return data.data!;
  },

  async deleteDomain(id: string): Promise<void> {
    await api.delete(`/admin/domains/${id}`);
  },

  async reorderDomains(items: { id: string; order: number }[]): Promise<void> {
    await api.patch('/admin/domains/reorder', { items });
  },

  // Technology Management
  async getTechnologies(domainId?: string): Promise<Technology[]> {
    const url = domainId ? `/admin/technologies/domain/${domainId}` : '/admin/technologies';
    const { data } = await api.get<ApiResponse<Technology[]>>(url);
    return data.data || [];
  },

  async createTechnology(tech: Partial<Technology>): Promise<Technology> {
    const { data } = await api.post<ApiResponse<Technology>>('/admin/technologies', tech);
    return data.data!;
  },

  async updateTechnology(id: string, tech: Partial<Technology>): Promise<Technology> {
    const { data } = await api.patch<ApiResponse<Technology>>(`/admin/technologies/${id}`, tech);
    return data.data!;
  },

  async deleteTechnology(id: string): Promise<void> {
    await api.delete(`/admin/technologies/${id}`);
  },

  async reorderTechnologies(items: { id: string; order: number }[]): Promise<void> {
    await api.patch('/admin/technologies/reorder', { items });
  },

  // Course Management
  async getCourses(technologyId?: string): Promise<Course[]> {
    const url = technologyId ? `/admin/courses/technology/${technologyId}` : '/admin/courses';
    const { data } = await api.get<ApiResponse<Course[]>>(url);
    return data.data || [];
  },

  async createCourse(course: Partial<Course>): Promise<Course> {
    const { data } = await api.post<ApiResponse<Course>>('/admin/courses', course);
    return data.data!;
  },

  async updateCourse(id: string, course: Partial<Course>): Promise<Course> {
    const { data } = await api.patch<ApiResponse<Course>>(`/admin/courses/${id}`, course);
    return data.data!;
  },

  async deleteCourse(id: string): Promise<void> {
    await api.delete(`/admin/courses/${id}`);
  },

  async reorderCourses(items: { id: string; order: number }[]): Promise<void> {
    await api.patch('/admin/courses/reorder', { items });
  },

  // Module Management
  async getModules(courseId: string): Promise<Module[]> {
    const { data } = await api.get<ApiResponse<Module[]>>(`/admin/modules/course/${courseId}`);
    return data.data || [];
  },

  async createModule(mod: Partial<Module>): Promise<Module> {
    const { data } = await api.post<ApiResponse<Module>>('/admin/modules', mod);
    return data.data!;
  },

  async updateModule(id: string, mod: Partial<Module>): Promise<Module> {
    const { data } = await api.patch<ApiResponse<Module>>(`/admin/modules/${id}`, mod);
    return data.data!;
  },

  async deleteModule(id: string): Promise<void> {
    await api.delete(`/admin/modules/${id}`);
  },

  async reorderModules(items: { id: string; order: number }[]): Promise<void> {
    await api.patch('/admin/modules/reorder', { items });
  },

  // Lesson Management
  async getLessonsByModule(moduleId: string): Promise<Lesson[]> {
    const { data } = await api.get<ApiResponse<Lesson[]>>(`/admin/lessons/module/${moduleId}`);
    return data.data || [];
  },

  async getLessonById(id: string): Promise<Lesson> {
    const { data } = await api.get<ApiResponse<Lesson>>(`/admin/lessons/${id}`);
    return data.data!;
  },

  async createLesson(lesson: Partial<Lesson>): Promise<Lesson> {
    const { data } = await api.post<ApiResponse<Lesson>>('/admin/lessons', lesson);
    return data.data!;
  },

  async updateLesson(id: string, lesson: Partial<Lesson>): Promise<Lesson> {
    const { data } = await api.patch<ApiResponse<Lesson>>(`/admin/lessons/${id}`, lesson);
    return data.data!;
  },

  async deleteLesson(id: string): Promise<void> {
    await api.delete(`/admin/lessons/${id}`);
  },

  async reorderLessons(items: { id: string; order: number }[]): Promise<void> {
    await api.patch('/admin/lessons/reorder', { items });
  },

  // Assessment Management
  async getAssessments(): Promise<Assessment[]> {
    const { data } = await api.get<ApiResponse<Assessment[]>>('/admin/assessments');
    return data.data || [];
  },

  async getAssessmentById(id: string): Promise<Assessment> {
    const { data } = await api.get<ApiResponse<Assessment>>(`/admin/assessments/${id}`);
    return data.data!;
  },

  async getAssessmentByLesson(lessonId: string): Promise<Assessment | null> {
    const { data } = await api.get<ApiResponse<Assessment>>(`/admin/assessments/lesson/${lessonId}`);
    return data.data || null;
  },

  async createAssessment(assessment: Partial<Assessment>): Promise<Assessment> {
    const { data } = await api.post<ApiResponse<Assessment>>('/admin/assessments', assessment);
    return data.data!;
  },

  async updateAssessment(id: string, assessment: Partial<Assessment>): Promise<Assessment> {
    const { data } = await api.patch<ApiResponse<Assessment>>(`/admin/assessments/${id}`, assessment);
    return data.data!;
  },

  async deleteAssessment(id: string): Promise<void> {
    await api.delete(`/admin/assessments/${id}`);
  },
};
