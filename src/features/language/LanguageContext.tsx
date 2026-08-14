import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type PortalLanguage = 'en' | 'zh';

interface LanguageContextValue {
  language: PortalLanguage;
  setLanguage: (language: PortalLanguage) => void;
  t: (english: string, chinese: string) => string;
}

const LANGUAGE_KEY = 'jadcup.portal.language';
const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function initialLanguage(): PortalLanguage {
  const saved = localStorage.getItem(LANGUAGE_KEY);
  if (saved === 'en' || saved === 'zh') return saved;
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<PortalLanguage>(initialLanguage);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language);
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en-NZ';
  }, [language]);

  const t = useCallback(
    (english: string, chinese: string) => language === 'zh' ? chinese : english,
    [language],
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// oxlint-disable-next-line react/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider.');
  return context;
}
