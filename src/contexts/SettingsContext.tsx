"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import {
  settingsApi,
  SettingsResponse,
  PaymentPlan,
  FAQItem,
  ProjectItem,
  GalleryItem,
  HeroBannerItem,
  parseSettingValue,
} from "@/lib/api/settings";

interface ContactSettings {
  phone: string;
  email: string;
  address: string;
  address_uz: string;
  working_hours: string;
  working_hours_uz: string;
}

interface SocialSettings {
  telegram: string;
  instagram: string;
  facebook: string;
  youtube: string;
  threads: string;
  whatsapp: string;
}

interface ContentSettings {
  hero_title: string;
  hero_subtitle: string;
  hero_subtitle_uz: string;
  hero_banners: HeroBannerItem[];
  map_embed_url: string;
  map_coordinates: string;
  background_music_url: string;
  brochure_file_url: string;
  brochure_file_name: string;
}

interface SiteSettings {
  contact: ContactSettings;
  social: SocialSettings;
  content: ContentSettings;
  payment_plans: PaymentPlan[];
  payment_plans_uz: PaymentPlan[];
  faq_items: FAQItem[];
  faq_items_uz: FAQItem[];
  projects: ProjectItem[];
  projects_uz: ProjectItem[];
  gallery_items: GalleryItem[];
  gallery_items_uz: GalleryItem[];
  raw: SettingsResponse;
}

interface SettingsContextType {
  settings: SiteSettings | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
  contact: {
    phone: "+998 90 123 45 67",
    email: "info@eman-riverside.uz",
    address: "Город Ташкент",
    address_uz: "Toshkent shahri",
    working_hours: "Пн-Пт: 9:00 - 18:00",
    working_hours_uz: "Du-Ju: 9:00 - 18:00",
  },
  social: {
    telegram: "https://t.me/emanriverside",
    instagram: "https://instagram.com/emanriverside",
    facebook: "https://facebook.com/emanriverside",
    youtube: "https://youtube.com/@emanriverside",
    threads: "https://www.threads.net/@emanriverside",
    whatsapp: "+998901234567",
  },
  content: {
    hero_title: "EMAN RIVERSIDE",
    hero_subtitle: "Жилой комплекс нового уровня",
    hero_subtitle_uz: "Yangi darajadagi turar-joy majmuasi",
    hero_banners: [],
    map_embed_url: "",
    map_coordinates: "41.3111,69.2401",
    background_music_url: "",
    brochure_file_url: "",
    brochure_file_name: "",
  },
  payment_plans: [],
  payment_plans_uz: [],
  faq_items: [],
  faq_items_uz: [],
  projects: [],
  projects_uz: [],
  gallery_items: [],
  gallery_items_uz: [],
  raw: {},
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Helper to extract value from settings response
function getValue(data: SettingsResponse, category: string, key: string, defaultValue = ""): string {
  const categoryData = data[category];
  if (!categoryData) return defaultValue;
  const setting = categoryData.find(s => s.key === key);
  return setting?.value ?? defaultValue;
}

// Helper to parse JSON value
function getJSONValue<T>(data: SettingsResponse, category: string, key: string, defaultValue: T): T {
  const categoryData = data[category];
  if (!categoryData) return defaultValue;
  const setting = categoryData.find(s => s.key === key);
  if (!setting) return defaultValue;
  return parseSettingValue(setting, defaultValue);
}

function extractFileNameFromUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";

  const cleanPath = trimmed.split(/[?#]/)[0];
  const rawName = cleanPath.substring(cleanPath.lastIndexOf("/") + 1);
  if (!rawName) return "";

  try {
    return decodeURIComponent(rawName);
  } catch {
    return rawName;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await settingsApi.getAll();
      const brochureFileUrl = getValue(
        data,
        "content",
        "brochure_file_url",
        defaultSettings.content.brochure_file_url
      );
      const brochureFileName =
        getValue(data, "content", "brochure_file_name", "") ||
        extractFileNameFromUrl(brochureFileUrl);

      const parsed: SiteSettings = {
        contact: {
          phone: getValue(data, "contact", "phone", defaultSettings.contact.phone),
          email: getValue(data, "contact", "email", defaultSettings.contact.email),
          address: getValue(data, "contact", "address", defaultSettings.contact.address),
          address_uz: getValue(data, "contact", "address_uz", defaultSettings.contact.address_uz),
          working_hours: getValue(data, "contact", "working_hours", defaultSettings.contact.working_hours),
          working_hours_uz: getValue(data, "contact", "working_hours_uz", defaultSettings.contact.working_hours_uz),
        },
        social: {
          telegram: getValue(data, "social", "telegram", defaultSettings.social.telegram),
          instagram: getValue(data, "social", "instagram", defaultSettings.social.instagram),
          facebook: getValue(data, "social", "facebook", defaultSettings.social.facebook),
          youtube: getValue(data, "social", "youtube", defaultSettings.social.youtube),
          threads: getValue(data, "social", "threads", defaultSettings.social.threads),
          whatsapp: getValue(data, "social", "whatsapp", defaultSettings.social.whatsapp),
        },
        content: {
          hero_title: getValue(data, "content", "hero_title", defaultSettings.content.hero_title),
          hero_subtitle: getValue(data, "content", "hero_subtitle", defaultSettings.content.hero_subtitle),
          hero_subtitle_uz: getValue(data, "content", "hero_subtitle_uz", defaultSettings.content.hero_subtitle_uz),
          hero_banners: getJSONValue<HeroBannerItem[]>(data, "content", "hero_banners", []),
          map_embed_url: getValue(data, "content", "map_embed_url", defaultSettings.content.map_embed_url),
          map_coordinates: getValue(data, "content", "map_coordinates", defaultSettings.content.map_coordinates),
          background_music_url: getValue(
            data,
            "content",
            "background_music_url",
            defaultSettings.content.background_music_url
          ),
          brochure_file_url: brochureFileUrl,
          brochure_file_name: brochureFileName,
        },
        payment_plans: getJSONValue<PaymentPlan[]>(data, "pricing", "payment_plans", []),
        payment_plans_uz: getJSONValue<PaymentPlan[]>(data, "pricing", "payment_plans_uz", []),
        faq_items: getJSONValue<FAQItem[]>(data, "faq", "faq_items", []),
        faq_items_uz: getJSONValue<FAQItem[]>(data, "faq", "faq_items_uz", []),
        projects: getJSONValue<ProjectItem[]>(data, "projects", "projects", []),
        projects_uz: getJSONValue<ProjectItem[]>(data, "projects", "projects_uz", []),
        gallery_items: getJSONValue<GalleryItem[]>(data, "gallery", "gallery_items", []),
        gallery_items_uz: getJSONValue<GalleryItem[]>(data, "gallery", "gallery_items_uz", []),
        raw: data,
      };

      setSettings(parsed);
    } catch (err) {
      console.error("Failed to load settings:", err);
      setError("Failed to load settings");
      // Use defaults on error
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        error,
        refresh: loadSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

// Convenience hook that returns settings with defaults
export function useSiteSettings() {
  const { settings, isLoading } = useSettings();
  return {
    settings: settings ?? defaultSettings,
    isLoading,
  };
}
