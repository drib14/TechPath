import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-surface-900 mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'Learner'}! 👋
        </h1>
        <p className="text-surface-500">
          Continue your learning journey where you left off.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardContent className="text-center">
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 mx-auto mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-surface-900 mb-1">Continue Learning</h3>
            <p className="text-sm text-surface-500 mb-3">Pick up where you left off</p>
            <Link to="/courses">
              <Button variant="outline" size="sm">
                Browse Courses <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center">
            <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center text-accent-600 mx-auto mb-3">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-surface-900 mb-1">Your Progress</h3>
            <p className="text-sm text-surface-500 mb-3">Track your learning stats</p>
            <p className="text-2xl font-bold text-primary-600">0 lessons</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mx-auto mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-surface-900 mb-1">Explore Domains</h3>
            <p className="text-sm text-surface-500 mb-3">Discover new technologies</p>
            <Link to="/domains">
              <Button variant="outline" size="sm">
                View Domains <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recently Completed */}
      <div>
        <h2 className="text-xl font-semibold text-surface-900 mb-4">Recently Completed</h2>
        <div className="bg-white rounded-xl border border-surface-200 p-8 text-center">
          <p className="text-surface-500">
            You haven't completed any lessons yet. Start a course to begin tracking your progress!
          </p>
          <Link to="/courses" className="inline-block mt-4">
            <Button variant="primary">
              Start Learning <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
