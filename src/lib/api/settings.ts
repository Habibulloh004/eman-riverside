import apiClient from './client';

export interface SiteSetting {
  id: number;
  key: string;
  value: string;
  type: 'string' | 'json' | 'number' | 'boolean';
  category: string;
  label: string;
  label_uz: string;
  created_at: string;
  updated_at: string;
}

export interface SettingsCategory {
  key: string;
  label: string;
  label_uz: string;
}

// Setting category type
export type SettingCategory = 'contact' | 'social' | 'pricing' | 'faq' | 'features' | 'content';

export interface PaymentPlan {
  title: string;
  description: string;
  price: string;
  period: string;
  features: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProjectItemDetail {
  title: string;
  list?: string[];
  description?: string;
}

export interface ProjectItem {
  number: string;
  label: string;
  title: string;
  titleLine2: string;
  image: string;
  items?: ProjectItemDetail[];
  description?: string;
  features?: string[];
}

export interface GalleryItem {
  image: string;
  title: string;
  description: string;
}

// Grouped settings response from public API
export type SettingsResponse = Record<string, SiteSetting[]>;

// Helper to parse JSON setting values
export function parseSettingValue<T>(setting: SiteSetting | undefined, defaultValue: T): T {
  if (!setting) return defaultValue;

  if (setting.type === 'json') {
    try {
      return JSON.parse(setting.value) as T;
    } catch {
      return defaultValue;
    }
  }

  if (setting.type === 'number') {
    return Number(setting.value) as unknown as T;
  }

  if (setting.type === 'boolean') {
    return (setting.value === 'true') as unknown as T;
  }

  return setting.value as unknown as T;
}

// Helper to get setting value by key from grouped settings
export function getSettingValue(
  settings: SettingsResponse,
  category: string,
  key: string,
  defaultValue = ''
): string {
  const categorySettings = settings[category];
  if (!categorySettings) return defaultValue;

  const setting = categorySettings.find(s => s.key === key);
  return setting?.value ?? defaultValue;
}

export const settingsApi = {
  // ============ PUBLIC ============

  // Get all settings grouped by category
  getAll: () =>
    apiClient.get<SettingsResponse>('/api/settings'),

  // Get settings for a specific category (as key-value map)
  getByCategory: (category: string) =>
    apiClient.get<Record<string, string>>(`/api/settings/${category}`),

  // ============ ADMIN ============

  // List all settings (flat array)
  list: (category?: string) => {
    const params = category ? `?category=${category}` : '';
    return apiClient.get<SiteSetting[]>(`/api/admin/settings${params}`);
  },

  // Get all categories
  getCategories: () =>
    apiClient.get<SettingsCategory[]>('/api/admin/settings/categories'),

  // Get single setting by key
  get: (key: string) =>
    apiClient.get<SiteSetting>(`/api/admin/settings/${key}`),

  // Update single setting
  update: (key: string, value: string) =>
    apiClient.put<SiteSetting>(`/api/admin/settings/${key}`, { value }),

  // Bulk update multiple settings
  bulkUpdate: (settings: { key: string; value: string }[]) =>
    apiClient.post<{ success: boolean; count: number }>('/api/admin/settings/bulk', { settings }),

  // Reset to defaults
  seed: () =>
    apiClient.post<{ success: boolean; count: number }>('/api/admin/settings/seed'),
};
