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
import { useLanguage } from '../language/LanguageContext';
import { useAuth } from './AuthContext';

const statusContent: Record<PortalAccountStatus, {
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  icon: typeof Clock3;
  iconClasses: string;
}> = {
  Pending: {
    title: 'Your application is under review',
    titleZh: '您的申请正在审核中',
    description: 'Jadcup staff are checking your company details and matching your portal account to the correct customer record.',
    descriptionZh: 'Jadcup 团队正在核实企业资料，并将门户账号匹配到正确的客户档案。',
    icon: Clock3,
    iconClasses: 'bg-amber-100 text-amber-700',
  },
  Approved: {
    title: 'Your account is approved',
    titleZh: '您的账户已通过审核',
    description: 'Your Customer Portal account is active and ready to use.',
    descriptionZh: '您的客户门户账户已启用，可以开始使用。',
    icon: CheckCircle2,
    iconClasses: 'bg-jade-100 text-jade-700',
  },
  Rejected: {
    title: 'Your application was not approved',
    titleZh: '您的申请未通过审核',
    description: 'Please review the information below or contact Jadcup if you need assistance.',
    descriptionZh: '请查看下方说明；如需协助，请联系 Jadcup。',
    icon: AlertTriangle,
    iconClasses: 'bg-red-100 text-red-700',
  },
  Disabled: {
    title: 'Your account has been disabled',
    titleZh: '您的账户已停用',
    description: 'Portal access is currently unavailable. Please contact Jadcup if you believe this is a mistake.',
    descriptionZh: '当前无法访问客户门户。如您认为这是误操作，请联系 Jadcup。',
    icon: ShieldX,
    iconClasses: 'bg-gray-200 text-gray-700',
  },
};

function formatUpdatedAt(value: string | undefined, locale: string) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function ApplicationStatusPage() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
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
      setError(requestError instanceof Error ? requestError.message : t('Unable to check your account status.', '暂时无法查询账户状态。'));
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
  const updatedAt = formatUpdatedAt(statusInfo?.updatedAt, language === 'zh' ? 'zh-CN' : 'en-NZ');
  const statusLabel = language === 'zh'
    ? ({ Pending: '待审核', Approved: '已通过', Rejected: '未通过', Disabled: '已停用' } as const)[status]
    : status;

  return (
    <main className="flex-1 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="bg-white rounded-(--radius-card) shadow-(--shadow-card) p-6 sm:p-10 text-center">
          {loading && !statusInfo ? (
            <div className="py-10" role="status">
              <Loader2 size={36} className="animate-spin text-jade-600 mx-auto mb-4" />
              <p className="text-sm text-gray-500">{t('Checking your application status...', '正在查询申请状态……')}</p>
            </div>
          ) : (
            <>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${content.iconClasses}`}>
                <StatusIcon size={30} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                {t('Account status', '账户状态')}: {statusLabel}
              </p>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{t(content.title, content.titleZh)}</h1>
              <p className="text-gray-600 leading-relaxed max-w-lg mx-auto">{t(content.description, content.descriptionZh)}</p>

              {status === 'Rejected' && statusInfo?.rejectionReason && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-(--radius-button) text-left">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-600 mb-1">{t('Review reason', '审核说明')}</p>
                  <p className="text-sm text-red-800">{statusInfo.rejectionReason}</p>
                </div>
              )}

              {error && (
                <div className="mt-6 p-3 bg-red-50 border border-red-100 rounded-(--radius-button)" role="alert">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="mt-7 p-4 bg-gray-50 rounded-(--radius-button) text-left">
                <p className="text-sm text-gray-700"><span className="font-medium">{t('Username', '用户名')}:</span> {session?.userName}</p>
                {updatedAt && (
                  <p className="text-sm text-gray-500 mt-1"><span className="font-medium">{t('Last updated', '最后更新')}:</span> {updatedAt}</p>
                )}
              </div>

              <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
                {status === 'Approved' && (
                  <Button onClick={() => navigate('/dashboard')}>{t('Continue to Dashboard', '进入客户工作台')}</Button>
                )}
                {status !== 'Approved' && (
                  <Button variant="outline" onClick={loadStatus} disabled={loading}>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                    {t('Refresh Status', '刷新状态')}
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
                  {t('Sign Out', '退出登录')}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
