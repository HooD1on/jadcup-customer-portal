import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  PortalApiError,
  portalAccountApi,
  type PortalAccountStatus,
  type PortalAccountStatusResult,
} from '../../services/portalAccountApi';

interface StoredSession {
  token: string;
  userName: string;
  accountStatus: PortalAccountStatus;
}

interface AuthContextValue {
  session?: StoredSession;
  statusInfo?: PortalAccountStatusResult;
  isInitializing: boolean;
  sessionError?: string;
  login: (userName: string, password: string, rememberMe: boolean) => Promise<PortalAccountStatus>;
  logout: () => void;
  refreshStatus: () => Promise<PortalAccountStatusResult | undefined>;
}

const LOCAL_SESSION_KEY = 'jadcup.portal.session';
const SESSION_SESSION_KEY = 'jadcup.portal.tab-session';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readSession(): { session?: StoredSession; persistent: boolean } {
  const localValue = localStorage.getItem(LOCAL_SESSION_KEY);
  const sessionValue = sessionStorage.getItem(SESSION_SESSION_KEY);
  const rawValue = localValue || sessionValue;
  if (!rawValue) return { persistent: false };

  try {
    const parsed = JSON.parse(rawValue) as StoredSession;
    if (!parsed.token || !parsed.userName || !parsed.accountStatus) {
      throw new Error('Invalid session');
    }
    return { session: parsed, persistent: Boolean(localValue) };
  } catch {
    localStorage.removeItem(LOCAL_SESSION_KEY);
    sessionStorage.removeItem(SESSION_SESSION_KEY);
    return { persistent: false };
  }
}

function removeStoredSession() {
  localStorage.removeItem(LOCAL_SESSION_KEY);
  sessionStorage.removeItem(SESSION_SESSION_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(readSession, []);
  const [session, setSession] = useState<StoredSession | undefined>(initial.session);
  const [persistent, setPersistent] = useState(initial.persistent);
  const [statusInfo, setStatusInfo] = useState<PortalAccountStatusResult>();
  const [isInitializing, setIsInitializing] = useState(Boolean(initial.session));
  const [sessionError, setSessionError] = useState<string>();

  const saveSession = useCallback((nextSession: StoredSession, keepSignedIn: boolean) => {
    removeStoredSession();
    const storage = keepSignedIn ? localStorage : sessionStorage;
    storage.setItem(
      keepSignedIn ? LOCAL_SESSION_KEY : SESSION_SESSION_KEY,
      JSON.stringify(nextSession),
    );
    setPersistent(keepSignedIn);
    setSession(nextSession);
  }, []);

  const logout = useCallback(() => {
    removeStoredSession();
    setSession(undefined);
    setStatusInfo(undefined);
    setSessionError(undefined);
    setPersistent(false);
  }, []);

  const applyStatus = useCallback((info: PortalAccountStatusResult) => {
    setStatusInfo(info);
    setSession((current) => {
      if (!current) return current;
      const nextSession = { ...current, accountStatus: info.accountStatus };
      const storage = persistent ? localStorage : sessionStorage;
      storage.setItem(
        persistent ? LOCAL_SESSION_KEY : SESSION_SESSION_KEY,
        JSON.stringify(nextSession),
      );
      return nextSession;
    });
  }, [persistent]);

  const refreshStatus = useCallback(async () => {
    if (!session) return undefined;
    try {
      const info = await portalAccountApi.getStatus(session.token);
      setSessionError(undefined);
      applyStatus(info);
      return info;
    } catch (error) {
      if (error instanceof PortalApiError && error.status === 401) {
        logout();
      } else {
        setSessionError(error instanceof Error ? error.message : 'Unable to check your account status.');
      }
      throw error;
    }
  }, [applyStatus, logout, session]);

  useEffect(() => {
    if (!initial.session) {
      setIsInitializing(false);
      return;
    }

    let active = true;
    portalAccountApi.getStatus(initial.session.token)
      .then((info) => {
        if (!active) return;
        setStatusInfo(info);
        setSession((current) => current ? { ...current, accountStatus: info.accountStatus } : current);
        const storage = initial.persistent ? localStorage : sessionStorage;
        storage.setItem(
          initial.persistent ? LOCAL_SESSION_KEY : SESSION_SESSION_KEY,
          JSON.stringify({ ...initial.session, accountStatus: info.accountStatus }),
        );
      })
      .catch((error) => {
        if (!active) return;
        if (error instanceof PortalApiError && error.status === 401) {
          removeStoredSession();
          setSession(undefined);
          setStatusInfo(undefined);
        } else {
          setSessionError(error instanceof Error ? error.message : 'Unable to restore your session.');
        }
      })
      .finally(() => {
        if (active) setIsInitializing(false);
      });

    return () => {
      active = false;
    };
  }, [initial]);

  const login = useCallback(async (
    userName: string,
    password: string,
    rememberMe: boolean,
  ) => {
    const result = await portalAccountApi.login(userName, password);
    saveSession({
      token: result.token,
      userName: userName.trim(),
      accountStatus: result.accountStatus,
    }, rememberMe);
    setStatusInfo(undefined);
    setSessionError(undefined);
    return result.accountStatus;
  }, [saveSession]);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    statusInfo,
    isInitializing,
    sessionError,
    login,
    logout,
    refreshStatus,
  }), [isInitializing, login, logout, refreshStatus, session, sessionError, statusInfo]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// The provider and its hook intentionally share this module so they cannot use different contexts.
// oxlint-disable-next-line react/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
