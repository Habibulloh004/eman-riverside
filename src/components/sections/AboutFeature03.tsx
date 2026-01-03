"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutFeature03() {
  const { t } = useLanguage();

  return (
    <section id="feature-03" className="relative py-24 lg:py-32 scroll-mt-20 bg-[#F9EFE7] overflow-hidden">
      {/* Background image with low opacity */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/1.png"
          alt=""
          fill
          className="object-cover opacity-[0.04]"
        />
      </div>
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Content */}
          <div className="relative">
            {/* Large number background */}
            <span className="absolute -top-8 -left-4 text-[120px] lg:text-[180px] font-serif font-bold text-primary/10 leading-none select-none pointer-events-none">
              03
            </span>

            <div className="relative z-10 pt-16 lg:pt-24">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-px bg-primary" />
                <span className="text-xs text-primary font-medium uppercase tracking-[0.2em]">
                  {t.feature03.label}
                </span>
              </div>

              <h3 className="text-2xl lg:text-4xl font-serif mb-8">
                {t.feature03.title}<br />{t.feature03.titleLine2}
              </h3>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.feature03.description}
                </p>
                <ul className="space-y-2">
                  {t.feature03.features.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
            <Image
              src="/images/hero/1.png"
              alt={t.feature03.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
