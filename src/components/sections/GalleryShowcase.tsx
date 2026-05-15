"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { pickLocalizedString } from "@/lib/i18n/localized";
import { useGalleryPublic } from "@/hooks/useGallery";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";

type ShowcaseBlock = {
  key: "interior" | "exterior";
  title: string;
  description: string;
  items: { id: string; url: string; title: string }[];
};

const fallbackCopy = {
  ru: {
    interior: {
      title: "Интерьер",
      description:
        "Светлые пространства, продуманная планировка и мягкие натуральные оттенки формируют ощущение спокойствия и комфорта. Пространства созданы так, чтобы каждый день ощущался спокойным и наполненным светом.",
    },
    exterior: {
      title: "Экстерьер",
      description:
        "Архитектурный образ комплекса, вечерние виды и благоустроенные общественные пространства собираются в цельную композицию. Фасады, дворы и освещение работают как единая визуальная система.",
    },
  },
  uz: {
    interior: {
      title: "Interyer",
      description:
        "Yorug' xonalar, o'ylangan reja va tabiiy ranglar uyg'unligi sokin hamda qulay muhit yaratadi. Har bir makon kundalik hayot uchun yorqinlik va osoyishtalik hissini beradi.",
    },
    exterior: {
      title: "Eksteryer",
      description:
        "Majmuaning arxitekturasi, kechki ko'rinishlar va obodonlashtirilgan jamoat hududlari yagona kompozitsiyaga birlashadi. Fasadlar, hovli va yoritish bir tizim kabi ishlaydi.",
    },
  },
  en: {
    interior: {
      title: "Interior",
      description:
        "Bright spaces, thoughtful layouts, and soft natural tones create a calm and comfortable atmosphere. Each space is designed so everyday life feels lighter and more serene.",
    },
    exterior: {
      title: "Exterior",
      description:
        "The architecture of the complex, evening views, and landscaped public spaces come together as one composition. Facades, courtyards, and lighting work as a single visual system.",
    },
  },
} as const;

function resolveImage(url: string) {
  const trimmed = (url || "").trim();
  if (!trimmed) return "/images/hero/1.png";

  if (trimmed.startsWith("/api/proxy/")) return trimmed;
  if (trimmed.startsWith("/uploads/")) return `/api/proxy${trimmed}`;
  if (trimmed.startsWith("uploads/")) return `/api/proxy/${trimmed}`;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const parsed = new URL(trimmed);
      if (parsed.pathname.startsWith("/uploads/")) {
        return `/api/proxy${parsed.pathname}${parsed.search}`;
      }
    } catch {
      // Keep original URL on parse failure.
    }
    return trimmed;
  }

  if (trimmed.startsWith("/")) return trimmed;
  return `${API_URL}${trimmed}`;
}

function normalizeCategory(value?: string) {
  const raw = (value || "").trim().toLowerCase();
  if (!raw) return "";
  if (["interior", "interier", "интерьер"].includes(raw)) return "interior";
  if (["exterior", "extreir", "экстерьер"].includes(raw)) return "exterior";
  return raw;
}

const curatedImages = [
  "/images/04.webp",
  "/images/02.2.webp",
  "/images/05.jpg",
  "/images/03.webp",
  "/images/03.webp",
  "/images/05.jpg",
  "/images/02.2.webp",
  "/images/04.webp",
];

export default function GalleryShowcase() {
  const { language } = useLanguage();
  const { data } = useGalleryPublic({ type: "image" });

  const blocks = useMemo<ShowcaseBlock[]>(() => {
    const locale = language === "uz" ? "uz" : language === "ru" ? "ru" : "en";
    const copy = fallbackCopy[locale];
    const items = data?.items || [];

    const toShowcaseItem = (item: typeof items[number]) => ({
      id: String(item.id),
      url: resolveImage(item.url),
      title: pickLocalizedString(language, {
        ru: item.title,
        uz: item.title_uz,
        en: item.title_en,
      }),
    });

    const fallbackInterior = curatedImages.slice(0, 4).map((url, index) => ({
      id: `curated-int-${index}`,
      url,
      title: "",
    }));

    const fallbackExterior = curatedImages.slice(4, 8).map((url, index) => ({
      id: `curated-ext-${index}`,
      url,
      title: "",
    }));

    const buildShowcaseItems = (
      sourceItems: typeof items,
      fallbackItems: typeof fallbackInterior
    ) => {
      const filledSlots = Array.from({ length: fallbackItems.length }, () => null as typeof sourceItems[number] | null);

      sourceItems
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .forEach((item) => {
          const preferredSlot = Math.min(
            Math.max(item.sort_order ?? 0, 0),
            filledSlots.length - 1
          );

          let targetSlot = preferredSlot;
          while (targetSlot < filledSlots.length && filledSlots[targetSlot] !== null) {
            targetSlot += 1;
          }

          if (targetSlot >= filledSlots.length) {
            targetSlot = filledSlots.findIndex((slot) => slot === null);
          }

          if (targetSlot >= 0) {
            filledSlots[targetSlot] = item;
          }
        });

      return filledSlots.map((item, index) => item ? toShowcaseItem(item) : fallbackItems[index]);
    };

    return [
      {
        key: "interior",
        title: copy.interior.title,
        description: copy.interior.description,
        items: buildShowcaseItems(
          items.filter((item) => normalizeCategory(item.category) === "interior"),
          fallbackInterior
        ),
      },
      {
        key: "exterior",
        title: copy.exterior.title,
        description: copy.exterior.description,
        items: buildShowcaseItems(
          items.filter((item) => normalizeCategory(item.category) === "exterior"),
          fallbackExterior
        ),
      },
    ];
  }, [data?.items, language]);

  if (blocks.length === 0) {
    return null;
  }

  const [interior, exterior] = blocks;

  return (
    <section className="relative overflow-hidden bg-[#F9EFE7] pb-20 lg:pb-24">
      <div className="absolute inset-0">
        <Image
          src="/images/hero/1.png"
          alt=""
          fill
          className="object-cover opacity-[0.035]"
          sizes="100vw"
        />
      </div>

      <div className="container relative z-10 mx-auto space-y-16 px-4 lg:space-y-20 lg:px-8">
        {/* Interior */}
        {interior ? (
          <div>
            <div className="max-w-[360px]">
              <h3 className="text-[2rem] font-light tracking-[-0.04em] text-foreground sm:text-[2.35rem]">
                {interior.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {interior.description}
              </p>
            </div>
            {/* Mobile: 2x2 grid */}
            <div className="mt-4 grid grid-cols-2 gap-3 md:hidden">
              {interior.items.slice(0, 4).map((item) => (
                <div key={`interior-mob-${item.id}`} className="relative aspect-[0.82/1] overflow-hidden rounded-[3px] bg-[#e9ddd1]">
                  <Image src={resolveImage(item.url)} alt={item.title || interior.title} fill className="object-cover" sizes="50vw" />
                </div>
              ))}
            </div>
            {/* Tablet: staircase smaller */}
            <div className="hidden md:flex md:-mt-16 md:items-end md:gap-2 lg:hidden">
              {interior.items.slice(0, 4).map((item, index) => {
                const heights = ["h-[120px]", "h-[155px]", "h-[195px]", "h-[240px]"];
                return (
                  <div key={`interior-tab-${item.id}`} className={`relative w-1/4 overflow-hidden rounded-[3px] bg-[#e9ddd1] ${heights[index]}`}>
                    <Image src={resolveImage(item.url)} alt={item.title || interior.title} fill className="object-cover" sizes="25vw" />
                  </div>
                );
              })}
            </div>
            {/* Desktop: staircase full */}
            <div className="hidden lg:flex lg:-mt-32 lg:items-end lg:gap-3">
              {interior.items.slice(0, 4).map((item, index) => {
                const heights = ["h-[160px]", "h-[210px]", "h-[270px]", "h-[340px]"];
                return (
                  <div key={`interior-${item.id}`} className={`relative w-1/4 overflow-hidden rounded-[3px] bg-[#e9ddd1] ${heights[index]}`}>
                    <Image src={resolveImage(item.url)} alt={item.title || interior.title} fill className="object-cover" sizes="25vw" />
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Exterior (mirror) */}
        {exterior ? (
          <div>
            <div className="max-w-[360px] md:ml-auto md:text-right">
              <h3 className="text-[2rem] font-light tracking-[-0.04em] text-foreground sm:text-[2.35rem]">
                {exterior.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {exterior.description}
              </p>
            </div>
            {/* Mobile: 2x2 grid */}
            <div className="mt-4 grid grid-cols-2 gap-3 md:hidden">
              {exterior.items.slice(0, 4).map((item) => (
                <div key={`exterior-mob-${item.id}`} className="relative aspect-[0.82/1] overflow-hidden rounded-[3px] bg-[#e9ddd1]">
                  <Image src={resolveImage(item.url)} alt={item.title || exterior.title} fill className="object-cover" sizes="50vw" />
                </div>
              ))}
            </div>
            {/* Tablet: staircase reversed smaller */}
            <div className="hidden md:flex md:-mt-16 md:items-end md:gap-2 lg:hidden">
              {exterior.items.slice(0, 4).map((item, index) => {
                const heights = ["h-[240px]", "h-[195px]", "h-[155px]", "h-[120px]"];
                return (
                  <div key={`exterior-tab-${item.id}`} className={`relative w-1/4 overflow-hidden rounded-[3px] bg-[#e9ddd1] ${heights[index]}`}>
                    <Image src={resolveImage(item.url)} alt={item.title || exterior.title} fill className="object-cover" sizes="25vw" />
                  </div>
                );
              })}
            </div>
            {/* Desktop: staircase reversed full */}
            <div className="hidden lg:flex lg:-mt-32 lg:items-end lg:gap-3">
              {exterior.items.slice(0, 4).map((item, index) => {
                const heights = ["h-[340px]", "h-[270px]", "h-[210px]", "h-[160px]"];
                return (
                  <div key={`exterior-${item.id}`} className={`relative w-1/4 overflow-hidden rounded-[3px] bg-[#e9ddd1] ${heights[index]}`}>
                    <Image src={resolveImage(item.url)} alt={item.title || exterior.title} fill className="object-cover" sizes="25vw" />
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
