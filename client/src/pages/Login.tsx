import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../features/auth/AuthContext';
import { TechPathIcon } from '../components/TechPathLogo';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSuccess = async (credentialResponse: any) => {
    try {
      if (credentialResponse.credential) {
        await login(credentialResponse.credential);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <TechPathIcon size={64} className="shadow-lg rounded-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 mb-2">Welcome to TechPath</h1>
          <p className="text-surface-500">
            Sign in to track your progress, save your learning journey, and unlock all features.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-8">
          <h2 className="text-lg font-semibold text-surface-900 mb-6 text-center">Sign in to continue</h2>

          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => console.error('Google login error')}
                theme="outline"
                size="large"
                width="320"
                text="signin_with"
                shape="rectangular"
              />
            </div>
          </GoogleOAuthProvider>

          <div className="mt-6 text-center">
            <p className="text-xs text-surface-400">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-surface-500">
            Don't want to sign in?{' '}
            <a href="/courses" className="text-primary-600 hover:text-primary-700 font-medium">
              Browse courses freely
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
