"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { uzCyrl, ru } from "@/lib/i18n/admin";
import type { AdminTranslations } from "@/lib/i18n/admin";

export type AdminLang = "uz-cyrl" | "ru";

const translations: Record<AdminLang, AdminTranslations> = {
  "uz-cyrl": uzCyrl,
  ru,
};

interface AdminLanguageContextType {
  lang: AdminLang;
  setLang: (lang: AdminLang) => void;
  t: AdminTranslations;
}

const AdminLanguageContext = createContext<AdminLanguageContextType | undefined>(undefined);

const STORAGE_KEY = "admin-lang";

export function AdminLanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<AdminLang>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "ru" || saved === "uz-cyrl") return saved;
    }
    return "uz-cyrl";
  });

  const setLang = useCallback((newLang: AdminLang) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  }, []);

  const t = translations[lang];

  return (
    <AdminLanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </AdminLanguageContext.Provider>
  );
}

export function useAdminLanguage() {
  const context = useContext(AdminLanguageContext);
  if (!context) {
    throw new Error("useAdminLanguage must be used within AdminLanguageProvider");
  }
  return context;
}
