import { isAuthenticated } from '@/lib/auth';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { toast } from 'sonner';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    toast.error('You must be logged in to access this page.');
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
