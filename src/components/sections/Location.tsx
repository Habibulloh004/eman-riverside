"use client";

import Image from "next/image";
import { useState } from "react";
import { YandexMap } from "@/components/shared";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Location() {
  const { t } = useLanguage();
  const [panoramaSignal, setPanoramaSignal] = useState(0);
  const [isSoonOpen, setIsSoonOpen] = useState(false);

  return (
    <section id="location" className="relative py-16 lg:py-24 bg-[#F9EFE7] overflow-hidden">
      {/* Background image with low opacity */}
      <div className="absolute inset-0 z-0" data-speed="0.85">
        <Image
          src="/images/hero/1.png"
          alt=""
          fill
          className="object-cover opacity-[0.04]"
          sizes="100vw"
        />
      </div>
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="mb-10 lg:mb-14">
          <div className="mb-6 flex items-start justify-between gap-4">
            <h2 className="text-3xl font-light tracking-[-0.04em] text-foreground sm:text-4xl lg:text-[3rem]">
              {t.location.progressTitle}
            </h2>
            <p className="hidden max-w-[280px] pt-2 text-right text-[11px] uppercase tracking-[0.18em] text-foreground/65 lg:block">
              {t.location.progressNote}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setPanoramaSignal((value) => value + 1)}
              className="group relative min-h-[168px] overflow-hidden rounded-[16px] bg-primary text-left"
            >
              <Image
                src="/images/hero/1.png"
                alt=""
                fill
                className="object-cover opacity-35 transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(63,112,77,0.88),rgba(63,112,77,0.72))]" />
              <div className="relative z-10 flex h-full items-end justify-between gap-4 p-5 lg:p-6">
                <span className="max-w-[220px] text-[2rem] font-light leading-[0.98] tracking-[-0.04em] text-white">
                  {t.location.progress360}
                </span>
                <Image
                  src="/icons/360Icon.svg"
                  alt=""
                  width={72}
                  height={72}
                  className="h-16 w-16 shrink-0 lg:h-[72px] lg:w-[72px]"
                />
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIsSoonOpen(true)}
              className="group relative min-h-[168px] overflow-hidden rounded-[16px] bg-primary text-left"
            >
              <Image
                src="/images/hero/background.png"
                alt=""
                fill
                className="object-cover opacity-30 transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(63,112,77,0.9),rgba(63,112,77,0.76))]" />
              <div className="relative z-10 flex h-full items-end justify-between gap-4 p-5 lg:p-6">
                <span className="max-w-[260px] text-[1.85rem] font-light leading-[1.02] tracking-[-0.04em] text-white">
                  {t.location.progressRealtime}
                </span>
                <Image
                  src="/icons/liveIcon.svg"
                  alt=""
                  width={64}
                  height={64}
                  className="h-14 w-14 shrink-0 lg:h-16 lg:w-16"
                />
              </div>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6">
              {t.location.title}
            </h2>

            <p className="text-muted-foreground mb-4">
              {t.location.subtitle}
            </p>

            <p className="text-foreground font-medium mb-5">
              {t.location.listIntro}
            </p>

            {/* Nearby Places */}
            <ul className="space-y-4">
              {t.location.places.map((place) => (
                <li key={place} className="flex items-center gap-3">
                  <span className="text-primary">•</span>
                  <span className="text-foreground">{place}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right - Map */}
          <div className="relative aspect-square lg:aspect-4/3 rounded-lg overflow-hidden bg-muted">
            <YandexMap
              className="absolute inset-0"
              openPanoramaSignal={panoramaSignal}
              showPanoramaButton={false}
            />
          </div>
        </div>
      </div>

      <Dialog open={isSoonOpen} onOpenChange={setIsSoonOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif">
              {t.location.soonTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 text-sm text-muted-foreground">
            {t.location.soonDescription}
          </div>
          <DialogClose className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm text-white">
            {t.common.close}
          </DialogClose>
        </DialogContent>
      </Dialog>
    </section>
  );
}
