"use client";

import Image from "next/image";
import { YandexMap } from "@/components/shared";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Location() {
  const { t } = useLanguage();

  return (
    <section id="location" className="relative py-16 lg:py-24 bg-[#F9EFE7] overflow-hidden">
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
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6">
              {t.location.title}
            </h2>

            <p className="text-muted-foreground mb-8 italic">
              {t.location.subtitle}
            </p>

            {/* Nearby Places */}
            <ul className="space-y-4">
              {t.location.places.map((place) => (
                <li key={place} className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-foreground">{place}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right - Map */}
          <div className="relative aspect-square lg:aspect-4/3 rounded-lg overflow-hidden bg-muted">
            <YandexMap className="absolute inset-0" markerHint="Eman Riverside" />
          </div>
        </div>
      </div>
    </section>
  );
}
