"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRandomEstates } from "@/hooks/useEstates";
import { FloorPlanSkeleton } from "@/components/ui/skeleton";
import { Estate } from "@/lib/api/estates";

interface PlanItem {
  key: string;
  href: string;
  type: string;
  area: string;
  description: string;
  images: string[];
}

function getEstateImages(estate: Estate): string[] {
  const images: string[] = [];

  if (estate.images && estate.images.length > 0) {
    estate.images.forEach(group => {
      group.images.forEach(img => {
        if (img.file_url) images.push(img.file_url);
      });
    });
  }

  if (images.length === 0) {
    if (estate.plan_image) images.push(estate.plan_image);
    if (estate.title_image && estate.title_image !== estate.plan_image) {
      images.push(estate.title_image);
    }
  }

  if (images.length === 0) {
    images.push("/images/hero/planirovka1.png");
  }

  return images;
}

function mapEstateToPlan(estate: Estate): PlanItem {
  return {
    key: `estate-${estate.id}-${estate.estate_floor}-${estate.estate_rooms}-${estate.estate_area}`,
    href: `/catalog/${estate.id}`,
    type: `${estate.estate_rooms}-комнатная`,
    area: `${estate.estate_area} м²`,
    description: estate.title || `Этаж ${estate.estate_floor}`,
    images: getEstateImages(estate),
  };
}

function PlanCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [current, setCurrent] = useState(0);

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((c) => (c - 1 + images.length) % images.length);
  };

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((c) => (c + 1) % images.length);
  };

  return (
    <div className="relative aspect-4/3 bg-white rounded-lg overflow-hidden shadow-sm group/carousel">
      <Image
        src={images[current]}
        alt={alt}
        fill
        className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.02]"
        sizes="(max-width: 768px) 100vw, 50vw"
        unoptimized={images[current].startsWith("http")}
        data-no-hover-scale="true"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-colors z-10 opacity-0 group-hover/carousel:opacity-100"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-colors z-10 opacity-0 group-hover/carousel:opacity-100"
          >
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrent(idx);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === current ? "bg-primary" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function FloorPlans() {
  const { t } = useLanguage();
  const { data: estates, isLoading } = useRandomEstates(2);
  const sectionRef = useRef<HTMLElement | null>(null);

  const estatePlans = estates.map(mapEstateToPlan);
  const fallbackPlans: PlanItem[] = t.floorPlans.plans.map((p, i) => ({
    key: `fallback-${i}`,
    href: "/catalog",
    type: p.type,
    area: p.area,
    description: p.description,
    images: ["/images/hero/planirovka1.png"],
  }));
  const MIN_PLANS = 2;
  const plans: PlanItem[] = estatePlans.length >= MIN_PLANS
    ? estatePlans.slice(0, MIN_PLANS)
    : [...estatePlans, ...fallbackPlans.slice(0, MIN_PLANS - estatePlans.length)];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isLoading) return;

    const targets = Array.from(
      section.querySelectorAll<HTMLElement>(".gallery-reveal:not(.gallery-reveal-visible)")
    );
    if (targets.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((target) => target.classList.add("gallery-reveal-visible"));
      return;
    }

    const isInView = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const triggerLine = viewportHeight * 0.9;
      return rect.bottom > 0 && rect.top < triggerLine;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("gallery-reveal-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    targets.forEach((target) => {
      observer.observe(target);
      if (isInView(target)) {
        target.classList.add("gallery-reveal-visible");
        observer.unobserve(target);
      }
    });

    return () => observer.disconnect();
  }, [isLoading, plans.length]);

  return (
    <section id="plans" ref={sectionRef} className="py-16 lg:py-24 bg-[#F9EFE7]">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 lg:mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-primary" />
              <span className="text-xs text-primary font-medium uppercase tracking-[0.2em]">
                {t.floorPlans.label}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif">
              {t.floorPlans.title}
            </h2>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
          >
            {t.floorPlans.viewAll || "To'liq ko'rish"}
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {/* Floor Plans */}
        <div className="space-y-16 lg:space-y-24">
          {isLoading ? (
            <>
              <FloorPlanSkeleton />
              <FloorPlanSkeleton />
            </>
          ) : (
            plans.map((plan, index) => (
              <Link
                key={`${plan.key}-${index}`}
                href={plan.href}
                className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center group cursor-pointer gallery-reveal gallery-reveal-step gallery-step-${(index * 2) % 10} ${index % 2 === 0 ? "gallery-enter-from-left-bottom" : "gallery-enter-from-right-bottom"}`}
              >
                {/* Plan Image Carousel */}
                <div className={`relative ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                  <PlanCarousel images={plan.images} alt={plan.type} />
                </div>

                {/* Plan Info */}
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <h3 className="text-2xl lg:text-4xl font-serif mb-4 group-hover:text-primary transition-colors">
                    {plan.type}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {plan.area}
                  </p>
                  <p className="text-muted-foreground italic mb-4">
                    {plan.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                    {t.floorPlans.details || "Batafsil"}
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
