"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/contexts/SettingsContext";
import { pickLocalizedString } from "@/lib/i18n/localized";
import { sanitizeRichTextHtml } from "@/lib/rich-text";

function resolveMediaUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("/api/proxy/")) {
    return trimmed;
  }

  if (trimmed.startsWith("/uploads/")) {
    return `/api/proxy${trimmed}`;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  return trimmed;
}

function EmanRiversideLogo() {
  return (
    <div className="relative h-[82px] w-[300px] md:h-[96px] md:w-[350px] lg:h-[118px] lg:w-[430px]">
      <Image
        src="/logo horizontal green 1.svg"
        alt="Eman Riverside"
        fill
        className="object-contain object-left"
        sizes="(max-width: 768px) 300px, (max-width: 1024px) 350px, 430px"
      />
    </div>
  );
}

export default function AboutCompanySection() {
  const { language } = useLanguage();
  const { settings, isLoading } = useSiteSettings();

  const titleRaw = pickLocalizedString(language, {
    ru: settings.content.about_us_title,
    uz: settings.content.about_us_title_uz,
    en: settings.content.about_us_title_en,
  });

  const contentRawFromSettings = pickLocalizedString(language, {
    ru: settings.content.about_us_content,
    uz: settings.content.about_us_content_uz,
    en: settings.content.about_us_content_en,
  });

  const brandTitle = settings.content.hero_title?.trim() || "EMAN RIVERSIDE";
  const title = titleRaw?.trim() || "";
  const content = sanitizeRichTextHtml(contentRawFromSettings || "");

  const configuredRightImage = resolveMediaUrl(
    settings.content.about_us_right_image || ""
  );

  const rightImage = configuredRightImage || "/images/01.webp";

  const certificates = (settings.content.about_us_certificates || []).filter(
    (item) => Boolean(item.image?.trim())
  );
  const certificatesTrackRef = useRef<HTMLDivElement | null>(null);

  const scrollCertificates = (direction: "prev" | "next") => {
    const track = certificatesTrackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-cert-card]");
    const step = card ? card.offsetWidth + 20 : 320;
    const delta = direction === "next" ? step : -step;
    track.scrollBy({ left: delta, behavior: "smooth" });
  };

  if (isLoading) return null;

  return (
    <section className="relative w-full overflow-x-clip py-4 lg:py-6">
      <div className="mx-auto w-full max-w-[1440px] overflow-visible px-4 lg:px-8">
        <div className="relative min-h-[660px] w-full overflow-visible ">
          {/* Top background image */}
          {/* <div className="pointer-events-none absolute inset-x-0 top-0 h-[190px] overflow-hidden opacity-25">
            <Image
              src="/images/hero/background.png"
              alt=""
              fill
              className="object-cover object-center grayscale"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#F8F0E7]/40 to-[#F8F0E7]" />
          </div> */}

          {/* Right image - desktop only */}
          <div className="absolute right-[calc(50%-50vw)] top-[200px] z-20 hidden h-[455px] w-[560px] overflow-hidden rounded-l-[190px] rounded-tl-none bg-[#F8F0E7] lg:block">
            
            <Image
              src={rightImage}
              alt="Eman Riverside"
              fill
              className="object-cover object-right-bottom"
              sizes="560px"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F8F0E7]/25 via-transparent to-transparent" />
          </div>

          {/* Main content */}
          <div className="relative z-10 pb-10 lg:pb-[410px]">
            {/* Header */}
            <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
              <div>
                <h2 className="max-w-[620px] text-[42px] font-normal uppercase leading-none tracking-[-0.035em] text-black md:text-[58px] lg:text-[64px]">
                  {brandTitle}
                </h2>
                {title ? (
                  <p className="mt-8 max-w-[560px] text-[24px] font-light leading-[1.12] tracking-[-0.02em] text-[#1E1A17] md:text-[28px] lg:text-[31px]">
                    {title}
                  </p>
                ) : null}
              </div>

              <div className="flex justify-start lg:justify-center">
                <EmanRiversideLogo />
              </div>
            </div>

            {/* Text */}
            <div className="relative mt-10 lg:mt-12 lg:pr-[610px]">
              {content ? (
                <div
                  className="max-w-[720px] text-[#24201C]
                  [&_h1]:mb-4 [&_h1]:text-4xl [&_h1]:font-medium
                  [&_h2]:mb-4 [&_h2]:text-3xl [&_h2]:font-medium
                  [&_h3]:mb-3 [&_h3]:text-[34px] [&_h3]:font-medium [&_h3]:leading-tight
                  [&_p]:mb-8 [&_p]:text-[20px] [&_p]:font-light [&_p]:leading-[1.22]
                  [&_p]:tracking-[-0.025em] [&_p:last-child]:mb-0
                  [&_strong]:font-normal
                  [&_ul]:mb-6 [&_ul]:space-y-2 [&_ul]:pl-6
                  [&_li]:list-disc [&_li]:text-[20px] [&_li]:leading-[1.25]"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : null}

              {/* Right image - mobile/tablet */}
              <div className="relative mt-10 w-full overflow-hidden rounded-[28px] border border-[#E7DED2] bg-[#F8F0E7] shadow-[0_14px_34px_rgba(56,47,37,0.12)] lg:hidden">
                <div className="relative aspect-[16/10] w-full">
                <Image
                  src={rightImage}
                  alt="Eman Riverside"
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                  priority={false}
                />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-transparent" />
              </div>
            </div>
          </div>

          {/* Certificates */}
          {certificates.length > 0 && (
            <div className="relative z-40 mt-0 pb-8 pt-8 lg:pb-12 lg:pt-9">
              <div className="pointer-events-none absolute right-10 top-8 text-5xl font-medium tracking-[-0.02em] text-[#D9D1C4]/35 lg:text-7xl">
                {language === "uz" ? "Sertifikatlar" : language === "ru" ? "Сертификаты" : "Certificates"}
              </div>

              <h3 className="relative z-10 text-5xl font-medium tracking-[-0.02em] text-[#141311] lg:text-6xl">
                {language === "uz" ? "Hujjatlar" : language === "ru" ? "Документы" : "Documents"}
              </h3>

              <div className="relative z-10 mt-6">
                <div className="mb-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => scrollCertificates("prev")}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#D8CCBD] bg-[#F8F0E7] text-[#1F1A17] transition-colors hover:bg-[#EFE3D4]"
                    aria-label={language === "uz" ? "Oldingi sertifikatlar" : language === "ru" ? "Предыдущие сертификаты" : "Previous certificates"}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollCertificates("next")}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#D8CCBD] bg-[#F8F0E7] text-[#1F1A17] transition-colors hover:bg-[#EFE3D4]"
                    aria-label={language === "uz" ? "Keyingi sertifikatlar" : language === "ru" ? "Следующие сертификаты" : "Next certificates"}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div
                  ref={certificatesTrackRef}
                  className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                {certificates.map((item, index) => {
                  const certTitle = pickLocalizedString(language, {
                    ru: item.title_ru,
                    uz: item.title_uz,
                    en: item.title_en,
                  });

                  const certDescription = pickLocalizedString(language, {
                    ru: item.description_ru,
                    uz: item.description_uz,
                    en: item.description_en,
                  });

                  const certImage = resolveMediaUrl(item.image || "");

                  return (
                    <article
                      key={`${item.image}-${index}`}
                      data-cert-card
                      className="min-w-0 shrink-0 snap-start basis-[85%] sm:basis-[48%] lg:basis-[31%] xl:basis-[20%]"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden rounded-[14px] border border-[#E1DACF] bg-[#F3F0EA]">
                        <Image
                          src={certImage}
                          alt={certTitle || `Certificate ${index + 1}`}
                          fill
                          className="object-cover object-top"
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 20vw"
                        />
                      </div>

                      {(certTitle || certDescription) && (
                        <div className="space-y-1.5 px-1 pt-3">
                          {certTitle ? (
                            <h4 className="truncate text-[12px] font-medium text-[#1C1A17]">
                              {certTitle}
                            </h4>
                          ) : null}

                          {certDescription ? (
                            <p className="line-clamp-4 text-[11px] leading-4 text-[#4A453F]">
                              {certDescription}
                            </p>
                          ) : null}
                        </div>
                      )}
                    </article>
                  );
                })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
