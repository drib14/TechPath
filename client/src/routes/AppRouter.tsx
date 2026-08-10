import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';

// Public / Learner Pages
import { Landing } from '../pages/Landing';
import { Domains } from '../pages/Domains';
import { DomainDetail } from '../pages/DomainDetail';
import { TechnologyDetail } from '../pages/TechnologyDetail';
import { Courses } from '../pages/Courses';
import { CourseDetail } from '../pages/CourseDetail';
import { LessonPage } from '../pages/LessonPage';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { SearchPage } from '../pages/SearchPage';
import { NotFound } from '../pages/NotFound';

// Dedicated Admin CMS & Security Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminDomains } from '../pages/admin/AdminDomains';
import { AdminTechnologies } from '../pages/admin/AdminTechnologies';
import { AdminCourses } from '../pages/admin/AdminCourses';
import { AdminCourseCurriculum } from '../pages/admin/AdminCourseCurriculum';
import { AdminLessonEditor } from '../pages/admin/AdminLessonEditor';
import { AdminAssessments } from '../pages/admin/AdminAssessments';
import { AdminUsers } from '../pages/admin/AdminUsers';
import { AdminAuditLogs } from '../pages/admin/AdminAuditLogs';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Learner Workstation & Public Portal */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/domains" element={<Domains />} />
          <Route path="/domains/:slug" element={<DomainDetail />} />
          <Route path="/technologies/:slug" element={<TechnologyDetail />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/learn/:lessonSlug" element={<LessonPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Learner Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Dedicated Admin Console & CMS (Protected: ADMIN role required) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="domains" element={<AdminDomains />} />
          <Route path="technologies" element={<AdminTechnologies />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="courses/:courseId/curriculum" element={<AdminCourseCurriculum />} />
          <Route path="lessons/:lessonId/editor" element={<AdminLessonEditor />} />
          <Route path="assessments" element={<AdminAssessments />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
        </Route>

        {/* Global 404 Route */}
        <Route
          path="*"
          element={
            <MainLayout>
              <NotFound />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
