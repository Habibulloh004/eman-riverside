"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/contexts/SettingsContext";
import { useEstates } from "@/hooks/useEstates";

let hasAnimatedHeroInRuntime = false;

export default function Hero() {
  const { t, language } = useLanguage();
  const { settings } = useSiteSettings();
  const router = useRouter();
  const heroRef = useRef<HTMLElement | null>(null);
  const { data: estates = [] } = useEstates({ type: "living" });
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedApartment, setSelectedApartment] = useState("");

  const buildingOptions = useMemo(() => {
    const unique = Array.from(
      new Set(
        estates
          .map((estate) => Number(estate.parent_id))
          .filter((id) => Number.isFinite(id) && id > 0)
      )
    ).sort((a, b) => a - b);

    return unique.map((id) => ({
      value: String(id),
      label: language === "ru" ? `Дом ${id}` : `${id}-uy`,
    }));
  }, [estates, language]);

  const floorOptions = useMemo(() => {
    const unique = Array.from(
      new Set(
        estates
          .map((estate) => Number(estate.estate_floor))
          .filter((floor) => Number.isFinite(floor) && floor > 0)
      )
    ).sort((a, b) => a - b);

    return unique;
  }, [estates]);

  const apartmentOptions = useMemo(() => {
    const filteredByBuilding = selectedBuilding
      ? estates.filter((estate) => String(estate.parent_id) === selectedBuilding)
      : estates;
    const filteredByFloor = selectedFloor
      ? filteredByBuilding.filter(
          (estate) => String(estate.estate_floor) === selectedFloor
        )
      : filteredByBuilding;

    return filteredByFloor.slice(0, 80).map((estate) => ({
      value: String(estate.id),
      label:
        estate.title?.trim() ||
        (language === "ru"
          ? `Квартира ${estate.id}`
          : `Kvartira ${estate.id}`),
    }));
  }, [estates, selectedBuilding, selectedFloor, language]);

  const socialItems = [
    settings.social.instagram && {
      name: "Instagram",
      href: settings.social.instagram,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    settings.social.telegram && {
      name: "Telegram",
      href: settings.social.telegram,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.78 18.65 9.97 14l8.47-7.65c.37-.33-.08-.49-.57-.16L7.4 12.8l-4.52-1.41c-.98-.3-.99-.98.22-1.46L20.8 3.1c.82-.3 1.53.2 1.26 1.46l-3 14.16c-.22 1-.85 1.24-1.72.77l-4.58-3.37-2.2 2.12c-.24.24-.45.44-.78.44Z" />
        </svg>
      ),
    },
  ].filter(Boolean) as { name: string; href: string; icon: React.ReactNode }[];

  const handleSearch = () => {
    if (selectedApartment) {
      router.push(`/catalog/${selectedApartment}`);
      return;
    }

    const params = new URLSearchParams();
    if (selectedFloor) params.set("floor", selectedFloor);
    if (selectedBuilding) params.set("building", selectedBuilding);
    const query = params.toString();
    router.push(`/catalog${query ? `?${query}` : ""}`);
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!heroRef.current) return;

    const root = heroRef.current;
    const social = root.querySelector<HTMLElement>("[data-hero-social]");
    const card = root.querySelector<HTMLElement>("[data-hero-card]");
    const textTargets = Array.from(
      root.querySelectorAll<HTMLElement>("[data-hero-text]")
    ).filter((el) => el.offsetParent !== null);
    const form = root.querySelector<HTMLElement>("[data-hero-form]");

    const allTargets = [social, card, ...textTargets, form].filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (allTargets.length === 0) return;
    if (hasAnimatedHeroInRuntime) {
      gsap.set(allTargets, { clearProps: "opacity,visibility,transform" });
      return;
    }
    hasAnimatedHeroInRuntime = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "none" } });

      if (social && social.offsetParent !== null) {
        tl.fromTo(
          social,
          { x: -18, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.5,
            clearProps: "opacity,visibility,transform",
          }
        );
      }

      if (card) {
        tl.fromTo(
          card,
          { y: 26, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.82,
            clearProps: "opacity,visibility,transform",
          },
          social ? "-=0.08" : 0
        );
      }

      if (textTargets.length > 0) {
        tl.fromTo(
          textTargets,
          { y: 18, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.58,
            stagger: 0.085,
            clearProps: "opacity,visibility,transform",
          },
          card ? "-=0.48" : 0
        );
      }

      if (form) {
        tl.fromTo(
          form,
          { y: 18, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.55,
            clearProps: "opacity,visibility,transform",
          },
          "-=0.22"
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pt-20 lg:h-[100svh] lg:min-h-[100svh] lg:pt-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_rgba(249,239,231,0.25)_48%,_rgba(249,239,231,0.92)_100%)]" />

      <div
        data-hero-social
        className="absolute left-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-5 text-primary/85 lg:flex"
      >
        <span
          className="text-[11px] uppercase tracking-[0.35em] text-primary/65"
          style={{ writingMode: "vertical-rl" }}
        >
          {t.hero.socialLinks}
        </span>
        <div className="h-12 w-px bg-primary/20" />
        <div className="flex flex-col gap-3">
          {socialItems.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="transition-colors hover:text-primary/60"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>

      <div className="container relative z-10 mx-auto flex h-full items-center px-4 py-4 lg:px-8 lg:py-6">
        <div className="mx-auto w-11/12 min-[1440px]:w-full">
          <div
            data-hero-card
            className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/18 shadow-[0_24px_80px_rgba(63,112,77,0.12)] backdrop-blur-[2px] lg:h-[min(720px,calc(100svh-128px))]"
          >
            <div className="grid lg:h-full lg:grid-cols-[0.46fr_0.54fr]">
              <div className="relative flex min-h-[320px] flex-col justify-between overflow-hidden bg-primary px-7 py-8 text-white sm:px-9 sm:py-10 lg:h-full lg:min-h-0 lg:px-12 lg:py-12 lg:pb-24">
                <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_40%)]" />
                <div className="absolute left-5 top-6 text-[100px] font-semibold leading-none text-white/8 sm:text-[132px] lg:left-7 lg:top-7 lg:text-[180px]">
                  EM
                </div>

                <div className="relative z-10 max-w-[360px] pt-8 lg:pt-16">
                  <h1
                    data-hero-text
                    className="font-sans text-[clamp(3rem,6.5vw,5.25rem)] font-light leading-[0.95] tracking-[-0.04em] whitespace-pre-line"
                  >
                    {t.hero.comingSoon}
                  </h1>
                  <p
                    data-hero-text
                    className="mt-6 max-w-[260px] text-lg leading-[1.2] text-white/88 sm:text-xl"
                  >
                    {t.hero.subtitle}
                  </p>
                </div>

                <div className="pointer-events-none relative z-10 mt-10 hidden lg:block">
                  <div className="h-px w-14 bg-white/30" />
                </div>
              </div>

              <div className="relative min-h-[280px] lg:h-full lg:min-h-0">
                <Image
                  src="/images/hero.webp"
                  alt="EMAN RIVERSIDE"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 54vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(63,112,77,0.14),rgba(255,255,255,0)_25%,rgba(255,244,232,0.1)_100%)]" />
              </div>
            </div>

            <div
              data-hero-form
              className="relative z-20 mx-4 -mt-6 overflow-hidden rounded-[20px] border border-[#E7DED2] bg-white shadow-[0_18px_48px_rgba(57,76,61,0.14)] sm:mx-6 lg:absolute lg:bottom-6 lg:left-8 lg:mx-0 lg:mt-0 lg:w-[calc(100%-13rem)] lg:max-w-[660px]"
            >
              <div className="border-b border-[#E8E1D7] bg-white px-4 py-2.5 sm:px-5">
                <p className="text-[10px] uppercase tracking-[0.34em] text-primary/70 sm:text-[11px]">
                  {t.hero.selectApartment}
                </p>
              </div>

              <div className="bg-[linear-gradient(90deg,rgba(227,235,228,0.92),rgba(245,242,238,0.96))] px-4 py-3.5 sm:px-5 sm:py-4">
                <div className="grid gap-3 md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_auto_1fr_auto_1.15fr_auto] lg:items-center lg:gap-3">
                  <div className="min-w-0">
                    <label className="mb-1 block text-[clamp(1rem,1.45vw,1.28rem)] font-light leading-none tracking-[-0.03em] text-primary/88">
                      {t.hero.building}
                    </label>
                    <select
                      value={selectedBuilding}
                      onChange={(e) => {
                        setSelectedBuilding(e.target.value);
                        setSelectedApartment("");
                      }}
                      className="w-full appearance-none bg-transparent text-sm text-primary/58 focus:outline-none"
                    >
                      <option value="">{language === "ru" ? "Выбрать дом" : "Uyni tanlash"}</option>
                      {buildingOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="hidden h-12 w-px bg-primary/40 lg:block" />

                  <div className="min-w-0">
                    <label className="mb-1 block text-[clamp(1rem,1.45vw,1.28rem)] font-light leading-none tracking-[-0.03em] text-primary/88">
                      {t.hero.floor}
                    </label>
                    <select
                      value={selectedFloor}
                      onChange={(e) => {
                        setSelectedFloor(e.target.value);
                        setSelectedApartment("");
                      }}
                      className="w-full appearance-none bg-transparent text-sm text-primary/58 focus:outline-none"
                    >
                      <option value="">{language === "ru" ? "Выбрать этаж" : "Qavatni tanlash"}</option>
                      {floorOptions.map((floor) => (
                        <option key={floor} value={floor}>
                          {floor}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="hidden h-12 w-px bg-primary/40 lg:block" />

                  <div className="min-w-0">
                    <label className="mb-1 block text-[clamp(1rem,1.45vw,1.28rem)] font-light leading-none tracking-[-0.03em] text-primary/88">
                      {t.hero.apartment}
                    </label>
                    <select
                      value={selectedApartment}
                      onChange={(e) => setSelectedApartment(e.target.value)}
                      className="w-full appearance-none bg-transparent text-sm text-primary/58 focus:outline-none"
                    >
                      <option value="">{language === "ru" ? "Выбрать квартиру" : "Kvartirani tanlash"}</option>
                      {apartmentOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleSearch}
                    className="flex h-14 w-14 items-center justify-center self-center rounded-[16px] bg-white text-primary shadow-[0_8px_24px_rgba(63,112,77,0.12)] transition-colors hover:bg-[#f5efe8]"
                    aria-label={t.hero.selectApartment}
                  >
                    <Search className="h-6 w-6" strokeWidth={2.2} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
