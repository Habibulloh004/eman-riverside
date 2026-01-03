"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutFeature01() {
  const { t } = useLanguage();

  return (
    <div id="feature-01" className="scroll-mt-20 pb-24 lg:pb-32 pt-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Content */}
          <div className="relative">
            {/* Large number background */}
            <span className="absolute -top-8 -left-4 text-[120px] lg:text-[180px] font-serif font-bold text-primary/10 leading-none select-none pointer-events-none">
              01
            </span>

            <div className="relative z-10 pt-16 lg:pt-24">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-px bg-primary" />
                <span className="text-xs text-primary font-medium uppercase tracking-[0.2em]">
                  {t.feature01.label}
                </span>
              </div>

              <h3 className="text-2xl lg:text-4xl font-serif mb-8">
                {t.feature01.title}<br />{t.feature01.titleLine2}
              </h3>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">{t.feature01.facades}</h4>
                  <ul className="space-y-1.5">
                    {t.feature01.facadesList.map((item) => (
                      <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">{t.feature01.commonAreas}</h4>
                  <ul className="space-y-1.5">
                    {t.feature01.commonAreasList.map((item) => (
                      <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 gap-4">
            <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-muted">
              <Image
                src="/images/hero/1.png"
                alt={t.feature01.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
