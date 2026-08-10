import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-extrabold gradient-text mb-4">404</div>
        <h1 className="text-2xl font-bold text-surface-900 mb-3">Page not found</h1>
        <p className="text-surface-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/">
            <Button variant="primary">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};
