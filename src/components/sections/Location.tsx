"use client";

import { useState } from "react";
import Image from "next/image";
import { Globe, X } from "lucide-react";
import { YandexMap } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Location() {
  const { t } = useLanguage();
  const [isPanoramaOpen, setIsPanoramaOpen] = useState(false);
  const panoramaUrl = "https://uzbekistan360.uz/ru/location/zhk-eman-riversideWwl";

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
            <Button
              size="sm"
              className="absolute bottom-4 right-4 z-10 rounded-full shadow-lg px-4"
              onClick={() => setIsPanoramaOpen(true)}
            >
              <Globe className="w-4 h-4" />
              {t.location.panoramaButton}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isPanoramaOpen} onOpenChange={setIsPanoramaOpen}>
        <DialogContent className="w-[95vw] max-w-[1200px] h-[85vh] sm:h-[90vh] p-0 sm:rounded-2xl overflow-hidden flex flex-col [&>button]:hidden">
          <DialogHeader className="flex-row items-center justify-between text-left gap-0 px-5 sm:px-6 py-4 border-b">
            <DialogTitle className="text-lg sm:text-xl font-serif">
              {t.location.panoramaTitle}
            </DialogTitle>
            <DialogClose
              className="inline-flex items-center justify-center rounded-full border border-border bg-white size-9 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
              aria-label={t.common.close}
            >
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>
          <div className="flex-1 p-4 sm:p-5">
            <div className="relative h-full w-full rounded-2xl overflow-hidden bg-muted border">
              <iframe
                src={panoramaUrl}
                title={t.location.panoramaTitle}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
