"use client";

import { PageHero } from "@/components/shared";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutUsHero() {
  const { t } = useLanguage();

  return (
    <PageHero
      title={t.aboutUsPage.heroTitle}
      subtitle={t.aboutUsPage.heroSubtitle}
      image="/images/hero/1.png"
    />
  );
}

