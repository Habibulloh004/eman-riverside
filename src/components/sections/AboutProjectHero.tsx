"use client";

import { PageHero } from "@/components/shared";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutProjectHero() {
  const { t } = useLanguage();

  return (
    <PageHero
      title={t.about.heroTitle}
      subtitle={t.about.heroSubtitle}
      image="/images/hero/1.png"
    />
  );
}
