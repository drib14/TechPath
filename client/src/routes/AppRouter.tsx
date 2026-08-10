import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';
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

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/domains" element={<Domains />} />
          <Route path="/domains/:slug" element={<DomainDetail />} />
          <Route path="/technologies/:slug" element={<TechnologyDetail />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/learn/:lessonSlug" element={<LessonPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
