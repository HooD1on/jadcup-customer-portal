import { Navigate, useLocation } from 'react-router-dom';
import { LoadingState } from '../../components/feedback/LoadingState';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { useAuth } from './AuthContext';
import { useLanguage } from '../language/LanguageContext';

export function RequireApprovedAccount() {
  const { session, isInitializing } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  if (isInitializing) return <LoadingState message={t('Checking your account access...', '正在检查账户访问权限……')} />;
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (session.accountStatus !== 'Approved') {
    return <Navigate to="/application-status" replace />;
  }
  return <AuthLayout />;
}

export function RequirePortalSession({ children }: { children: React.ReactNode }) {
  const { session, isInitializing } = useAuth();
  const { t } = useLanguage();

  if (isInitializing) return <LoadingState message={t('Checking your account...', '正在检查您的账户……')} />;
  if (!session) return <Navigate to="/login" replace />;
  return children;
}
