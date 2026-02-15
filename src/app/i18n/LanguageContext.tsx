import React, { createContext, useContext, useState } from 'react';
import { translations } from './translations';

type Language = 'en' | 'zh';
type Translations = typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
  trans: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Simple nested object accessor
  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = translations[language];
    
    for (const key of keys) {
      if (current[key] === undefined) {
        console.warn(`Translation missing for key: ${path} in language: ${language}`);
        return path;
      }
      current = current[key];
    }
    
    return current;
  };

  const value = {
    language,
    setLanguage,
    t,
    trans: translations[language]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  
  // If context is undefined (e.g. used outside provider during isolated component preview),
  // return a default English context to prevent crashing.
  if (context === undefined) {
    console.warn('useLanguage used outside of LanguageProvider. Falling back to default English.');
    
    const defaultT = (path: string): string => {
        const keys = path.split('.');
        let current: any = translations['en'];
        for (const key of keys) {
          if (current[key] === undefined) return path;
          current = current[key];
        }
        return current;
    };

    return {
        language: 'en',
        setLanguage: () => console.warn('setLanguage called outside provider'),
        t: defaultT,
        trans: translations['en']
    };
  }
  
  return context;
}
