"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRandomEstates } from "@/hooks/useEstates";
import { FloorPlanSkeleton } from "@/components/ui/skeleton";
import { Estate } from "@/lib/api/estates";

interface PlanItem {
  id: number;
  type: string;
  area: string;
  description: string;
  image: string;
}

function mapEstateToPlan(estate: Estate): PlanItem {
  return {
    id: estate.id,
    type: `${estate.estate_rooms}-комнатная`,
    area: `${estate.estate_area} м²`,
    description: estate.title || `Этаж ${estate.estate_floor}`,
    image: estate.plan_image || estate.title_image || "/images/hero/planirovka1.png",
  };
}

export default function FloorPlans() {
  const { t } = useLanguage();
  const { data: estates, isLoading } = useRandomEstates(2);

  const plans: PlanItem[] = estates.length > 0
    ? estates.map(mapEstateToPlan)
    : t.floorPlans.plans.map((p, i) => ({
        id: i,
        type: p.type,
        area: p.area,
        description: p.description,
        image: "/images/hero/planirovka1.png",
      }));

  return (
    <section id="plans" className="py-16 lg:py-24 bg-[#F9EFE7]">
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
                key={plan.id}
                href={estates.length > 0 ? `/catalog/${plan.id}` : "/catalog"}
                className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center group cursor-pointer"
              >
                {/* Plan Image */}
                <div className={`relative ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="relative aspect-4/3 bg-white rounded-lg overflow-hidden shadow-sm transition-shadow group-hover:shadow-md">
                    <Image
                      src={plan.image}
                      alt={plan.type}
                      fill
                      className="object-contain p-4 transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized={plan.image.startsWith("http")}
                    />
                  </div>
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
