import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './features/auth/AuthContext';
import { AppRouter } from './routes/AppRouter';

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
