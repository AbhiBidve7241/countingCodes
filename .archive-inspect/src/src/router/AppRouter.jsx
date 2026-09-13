import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../features/home/HomePage';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { CourseListPage } from '../features/courses/CourseListPage';
import { CourseDetailPage } from '../features/courses/CourseDetailPage';
import { QuizPage } from '../features/quiz/QuizPage';
import { RevisionPage } from '../features/revision/RevisionPage';
import { ProgressPage } from '../features/progress/ProgressPage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { AdminDashboard } from '../features/admin/AdminDashboard';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const AppRouter = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Index: show homepage for guests, dashboard for auth users */}
        <Route
          index
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <HomePage />
          }
        />

        {/* Public Auth Routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Protected App Routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="courses"
          element={
            <ProtectedRoute>
              <CourseListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="courses/:slug"
          element={
            <ProtectedRoute>
              <CourseDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="quiz"
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="revision"
          element={
            <ProtectedRoute>
              <RevisionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="progress"
          element={
            <ProtectedRoute>
              <ProgressPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
