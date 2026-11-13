// components/LanguageProvider.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '../lib/i18n';

type Lang = 'pt' | 'en' | 'es';

interface LanguageContextData {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: typeof translations['pt']; // Pega a estrutura do português como base
}

const LanguageContext = createContext<LanguageContextData>({} as LanguageContextData);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('pt');

  useEffect(() => {
    // Ao carregar a página, verifica se o usuário já escolheu um idioma antes
    const savedLang = localStorage.getItem('tgt_lang') as Lang;
    if (savedLang && ['pt', 'en', 'es'].includes(savedLang)) {
      setLangState(savedLang);
    }
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('tgt_lang', newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);