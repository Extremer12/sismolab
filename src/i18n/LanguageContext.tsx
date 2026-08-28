import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translations } from './types';
import { es } from './locales/es';
import { en } from './locales/en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  toggleLanguage: () => void;
}

const LANGUAGE_STORAGE_KEY = 'sismolab_app_lang_v1';

const dictionaries: Record<Language, Translations> = {
  es,
  en,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
        if (stored === 'es' || stored === 'en') return stored;
        
        // Detect browser language
        const browserLang = navigator.language.slice(0, 2);
        if (browserLang === 'en') return 'en';
      }
    } catch {
      // fallback
    }
    return 'es';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      // fallback
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: dictionaries[language],
        toggleLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Minimalist Floating or Embedded Language Switcher Component
export const LanguageToggle: React.FC<{ className?: string; compact?: boolean }> = ({
  className = '',
  compact = false,
}) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      type="button"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-navy-900/90 border border-brand-cyan/40 text-xs font-black text-white hover:border-brand-cyan hover:bg-navy-800 transition-all shadow-sm active:scale-95 ${className}`}
      title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
      aria-label="Toggle language"
    >
      <span className="text-sm">{language === 'es' ? '🇦🇷' : '🇺🇸'}</span>
      <span className="text-[11px] uppercase tracking-wider text-brand-cyan">
        {compact ? (language === 'es' ? 'ES' : 'EN') : (language === 'es' ? 'ES · EN' : 'EN · ES')}
      </span>
    </button>
  );
};
