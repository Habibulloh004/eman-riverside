"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutHeader() {
  const { t } = useLanguage();

  return (
    <section className="container mx-auto px-4 pb-10 pt-4 lg:px-8 lg:pb-12 lg:pt-6">
      <div className="max-w-[980px]">
        <p className="text-sm uppercase tracking-[0.32em] text-primary/55">
          {t.aboutHeader.label}
        </p>
        <h2 className="mt-4 max-w-[620px] text-4xl font-light leading-[0.98] tracking-[-0.04em] text-primary sm:text-5xl lg:text-[62px]">
          {t.aboutHeader.question}
        </h2>
      </div>
    </section>
  );
}
