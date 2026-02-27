"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutHeader() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-px bg-primary" />
        <span className="text-xl text-primary font-medium uppercase tracking-[0.2em]">
          {t.aboutHeader.label}
        </span>
      </div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif">
        {t.aboutHeader.question}
      </h2>
    </div>
  );
}
