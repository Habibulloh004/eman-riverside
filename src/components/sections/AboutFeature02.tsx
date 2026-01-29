"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutFeature02() {
  const { t } = useLanguage();

  const number = "02";
  const label = t.feature02.label;
  const title = t.feature02.title;
  const titleLine2 = t.feature02.titleLine2;
  const image = "/images/hero/1.png";

  const items = [
    { title: t.feature02.landscaping, description: t.feature02.landscapingDesc },
    { title: t.feature02.playground, description: t.feature02.playgroundDesc },
    { title: t.feature02.sports, description: t.feature02.sportsDesc },
  ];

  return (
    <section id="feature-02" className="relative py-24 lg:py-32 scroll-mt-20 bg-[#F9EFE7] overflow-hidden">
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
          {/* Image */}
          <div className="relative aspect-4/5 rounded-lg overflow-hidden lg:order-1 bg-muted">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Content */}
          <div className="relative lg:order-2">
            {/* Large number background */}
            <span className="absolute -top-8 -left-4 text-[120px] lg:text-[180px] font-serif font-bold text-primary/10 leading-none select-none pointer-events-none">
              {number}
            </span>

            <div className="relative z-10 pt-16 lg:pt-24">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-px bg-primary" />
                <span className="text-xs text-primary font-medium uppercase tracking-[0.2em]">
                  {label}
                </span>
              </div>

              <h3 className="text-2xl lg:text-4xl font-serif mb-8">
                {title}<br />{titleLine2}
              </h3>

              <div className="space-y-6">
                {items.map((item, idx) => (
                  <div key={idx}>
                    <h4 className="text-xs text-primary font-medium uppercase tracking-wider mb-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed uppercase tracking-wide">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
