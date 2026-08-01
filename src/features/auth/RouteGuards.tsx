import { Navigate, useLocation } from 'react-router-dom';
import { LoadingState } from '../../components/feedback/LoadingState';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { useAuth } from './AuthContext';

export function RequireApprovedAccount() {
  const { session, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) return <LoadingState message="Checking your account access..." />;
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (session.accountStatus !== 'Approved') {
    return <Navigate to="/application-status" replace />;
  }
  return <AuthLayout />;
}

export function RequirePortalSession({ children }: { children: React.ReactNode }) {
  const { session, isInitializing } = useAuth();

  if (isInitializing) return <LoadingState message="Checking your account..." />;
  if (!session) return <Navigate to="/login" replace />;
  return children;
}
