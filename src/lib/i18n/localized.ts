export type ClientLanguage = "ru" | "uz" | "en";

type LocalizedString = {
  ru?: string | null;
  uz?: string | null;
  en?: string | null;
};

export function pickLocalizedString(
  language: ClientLanguage,
  values: LocalizedString,
  fallback = ""
): string {
  const ru = values.ru?.trim() || "";
  const uz = values.uz?.trim() || "";
  const en = values.en?.trim() || "";

  if (language === "uz") {
    return uz || ru || en || fallback;
  }

  if (language === "en") {
    return en || ru || uz || fallback;
  }

  return ru || uz || en || fallback;
}

export function isUzbekLanguage(language: ClientLanguage): boolean {
  return language === "uz";
}
