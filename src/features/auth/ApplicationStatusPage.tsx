import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Loader2,
  LogOut,
  RefreshCw,
  ShieldX,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { PortalApiError, type PortalAccountStatus } from '../../services/portalAccountApi';
import { useAuth } from './AuthContext';

const statusContent: Record<PortalAccountStatus, {
  title: string;
  description: string;
  icon: typeof Clock3;
  iconClasses: string;
}> = {
  Pending: {
    title: 'Your application is under review',
    description: 'Jadcup staff are checking your company details and matching your portal account to the correct customer record.',
    icon: Clock3,
    iconClasses: 'bg-amber-100 text-amber-700',
  },
  Approved: {
    title: 'Your account is approved',
    description: 'Your Customer Portal account is active and ready to use.',
    icon: CheckCircle2,
    iconClasses: 'bg-jade-100 text-jade-700',
  },
  Rejected: {
    title: 'Your application was not approved',
    description: 'Please review the information below or contact Jadcup if you need assistance.',
    icon: AlertTriangle,
    iconClasses: 'bg-red-100 text-red-700',
  },
  Disabled: {
    title: 'Your account has been disabled',
    description: 'Portal access is currently unavailable. Please contact Jadcup if you believe this is a mistake.',
    icon: ShieldX,
    iconClasses: 'bg-gray-200 text-gray-700',
  },
};

function formatUpdatedAt(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat('en-NZ', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function ApplicationStatusPage() {
  const navigate = useNavigate();
  const { session, statusInfo, refreshStatus, logout } = useAuth();
  const [loading, setLoading] = useState(!statusInfo);
  const [error, setError] = useState<string>();

  const loadStatus = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const info = await refreshStatus();
      if (info?.accountStatus === 'Approved') navigate('/dashboard', { replace: true });
    } catch (requestError) {
      if (requestError instanceof PortalApiError && requestError.status === 401) {
        navigate('/login', { replace: true });
        return;
      }
      setError(requestError instanceof Error ? requestError.message : 'Unable to check your account status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
    // This page intentionally refreshes once when opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const status = statusInfo?.accountStatus || session?.accountStatus || 'Pending';
  const content = statusContent[status];
  const StatusIcon = content.icon;
  const updatedAt = formatUpdatedAt(statusInfo?.updatedAt);

  return (
    <main className="flex-1 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-6 sm:p-10 text-center">
          {loading && !statusInfo ? (
            <div className="py-10" role="status">
              <Loader2 size={36} className="animate-spin text-jade-600 mx-auto mb-4" />
              <p className="text-sm text-gray-500">Checking your application status...</p>
            </div>
          ) : (
            <>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${content.iconClasses}`}>
                <StatusIcon size={30} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Account status: {status}
              </p>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{content.title}</h1>
              <p className="text-gray-600 leading-relaxed max-w-lg mx-auto">{content.description}</p>

              {status === 'Rejected' && statusInfo?.rejectionReason && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-(--radius-button) text-left">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-600 mb-1">Review reason</p>
                  <p className="text-sm text-red-800">{statusInfo.rejectionReason}</p>
                </div>
              )}

              {error && (
                <div className="mt-6 p-3 bg-red-50 border border-red-100 rounded-(--radius-button)" role="alert">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="mt-7 p-4 bg-gray-50 rounded-(--radius-button) text-left">
                <p className="text-sm text-gray-700"><span className="font-medium">Username:</span> {session?.userName}</p>
                {updatedAt && (
                  <p className="text-sm text-gray-500 mt-1"><span className="font-medium">Last updated:</span> {updatedAt}</p>
                )}
              </div>

              <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
                {status === 'Approved' && (
                  <Button onClick={() => navigate('/dashboard')}>Continue to Dashboard</Button>
                )}
                {status !== 'Approved' && (
                  <Button variant="outline" onClick={loadStatus} disabled={loading}>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                    Refresh Status
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => {
                    logout();
                    navigate('/login', { replace: true });
                  }}
                >
                  <LogOut size={16} />
                  Sign Out
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
