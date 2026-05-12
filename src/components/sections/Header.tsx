"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/contexts/SettingsContext";
import { RequestModal } from "@/components/shared";

let hasAnimatedHeaderInRuntime = false;

function resolveHeaderFileUrl(value: string): string {
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

function extractFileNameFromUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";

  const cleanPath = trimmed.split(/[?#]/)[0];
  const rawName = cleanPath.substring(cleanPath.lastIndexOf("/") + 1);
  if (!rawName) return "";

  try {
    return decodeURIComponent(rawName);
  } catch {
    return rawName;
  }
}

function getDownloadFileName(explicitName: string, fileUrl: string): string {
  const name = explicitName.trim();
  if (name) return name;
  return extractFileNameFromUrl(fileUrl);
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreCloseTimerRef = useRef<number | null>(null);
  const desktopHeaderRef = useRef<HTMLDivElement | null>(null);
  const { language, setLanguage, t } = useLanguage();
  const { settings, isLoading: isSettingsLoading } = useSiteSettings();

  // Format phone for tel: href
  const phoneHref = `tel:${settings.contact.phone.replace(/\s/g, "")}`;
  const brochureUrl = resolveHeaderFileUrl(settings.content.brochure_file_url || "");
  const brochureDownloadName = getDownloadFileName(
    settings.content.brochure_file_name || "",
    brochureUrl
  );
  const hasBrochure = brochureUrl.length > 0;

  const headerNavLinks = [
    { href: "/projects", label: t.nav.about },
    { href: "/catalog", label: t.nav.catalog },
    { href: "/gallery", label: t.nav.gallery },
  ];
  const moreLabel = language === "ru" ? "ЕЩЕ" : "YANA";
  const moreLinks = [
    { href: "/contacts", label: t.nav.contacts },
    { href: "/about-us", label: language === "ru" ? "О НАС" : "BIZ HAQIMIZDA" },
  ];
  const mobileNavLinks = [...headerNavLinks, ...moreLinks];

  const headerRef = useRef<HTMLElement | null>(null);

  const openMoreMenu = () => {
    if (moreCloseTimerRef.current) {
      window.clearTimeout(moreCloseTimerRef.current);
      moreCloseTimerRef.current = null;
    }
    setIsMoreOpen(true);
  };

  const closeMoreMenuWithDelay = () => {
    if (moreCloseTimerRef.current) {
      window.clearTimeout(moreCloseTimerRef.current);
    }
    moreCloseTimerRef.current = window.setTimeout(() => {
      setIsMoreOpen(false);
      moreCloseTimerRef.current = null;
    }, 160);
  };

  // Keep header style in sync with scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSettingsLoading) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 1280) return;
    if (!desktopHeaderRef.current) return;

    const headerEl = desktopHeaderRef.current;
    const logo = headerEl.querySelector<HTMLElement>("[data-anim-header-logo]");
    const sequenceItems = Array.from(
      headerEl.querySelectorAll<HTMLElement>("[data-anim-header-seq]")
    ).filter((el) => el.offsetParent !== null);
    const allTargets = [logo, ...sequenceItems].filter(
      (el): el is HTMLElement => Boolean(el)
    );

    if (allTargets.length === 0) return;
    if (hasAnimatedHeaderInRuntime) {
      gsap.set(allTargets, { clearProps: "opacity,visibility,transform" });
      return;
    }
    hasAnimatedHeaderInRuntime = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (logo) {
        tl.fromTo(
          logo,
          { y: -10, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.42,
            clearProps: "opacity,visibility,transform",
          }
        );
      }

      if (sequenceItems.length > 0) {
        tl.fromTo(
          sequenceItems,
          { y: -10, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.34,
            stagger: 0.035,
            clearProps: "opacity,visibility,transform",
          },
          logo ? "-=0.26" : 0
        );
      }
    }, desktopHeaderRef);

    return () => {
      ctx.revert();
    };
  }, [isSettingsLoading]);

  useEffect(() => {
    return () => {
      if (moreCloseTimerRef.current) {
        window.clearTimeout(moreCloseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      return;
    }

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isOpen]);

  const toggleLanguage = () => {
    setLanguage(language === "ru" ? "uz" : "ru");
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <div className="relative w-full px-0">
        <div
          ref={desktopHeaderRef}
          className={`flex items-center justify-between h-[72px] lg:h-[84px] rounded-none px-4 lg:px-14 transition-all duration-300 ${
            isScrolled
              ? "bg-white/55 backdrop-blur-2xl border-b border-white/50 shadow-[0_8px_24px_rgba(17,58,45,0.14)]"
              : "bg-white/40 backdrop-blur-2xl border-b border-white/45 shadow-[0_6px_18px_rgba(17,58,45,0.10)]"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0" data-anim-header-logo>
            <Image
              src="/logo horizontal green 1.svg"
              alt="EMAN RIVERSIDE"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-5 2xl:gap-7 min-w-0">
            {headerNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-anim-header-seq
                className="text-xs xl:text-sm font-medium tracking-[0.16em] text-foreground/85 hover:text-primary transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
            <div
              className="relative after:absolute after:left-0 after:top-full after:h-2 after:w-full after:content-['']"
              onMouseEnter={openMoreMenu}
              onMouseLeave={closeMoreMenuWithDelay}
            >
              <button
                data-anim-header-seq
                onClick={() => setIsMoreOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 text-xs xl:text-sm font-medium tracking-[0.16em] text-foreground/85 hover:text-primary transition-colors whitespace-nowrap"
              >
                <span>{moreLabel}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${isMoreOpen ? "rotate-180" : "rotate-0"}`}
                />
              </button>
              <div
                onMouseEnter={openMoreMenu}
                onMouseLeave={closeMoreMenuWithDelay}
                className={`absolute left-1/2 top-full -translate-x-1/2 w-[250px] rounded-2xl border border-white/65 bg-gradient-to-b from-white/95 via-white/90 to-[#f4f5f8]/80 shadow-[0_16px_40px_rgba(23,54,41,0.16)] backdrop-blur-xl transition-all duration-200 ${
                  isMoreOpen
                    ? "pointer-events-auto opacity-100 translate-y-0"
                    : "pointer-events-none opacity-0 translate-y-1"
                }`}
              >
                <div className="px-2.5 py-2.5">
                  {moreLinks.map((link, index) => (
                    <Link
                      key={`more-${link.href}-${link.label}`}
                      href={link.href}
                      className={`group flex items-center justify-between rounded-xl px-4 py-3 leading-none text-foreground/85 hover:bg-white/80 hover:text-primary transition-colors ${
                        index === 0 ? "bg-white/70" : ""
                      }`}
                    >
                      <span className="text-[13px] font-medium tracking-[0.18em] uppercase">{link.label}</span>
                      <ChevronRight
                        size={14}
                        className="text-primary/75 transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              data-anim-header-seq
              className="text-xs xl:text-sm font-semibold tracking-[0.12em] text-foreground/80 hover:text-primary transition-colors whitespace-nowrap"
            >
              {language === "ru" ? "РУС" : "UZB"}/{language === "ru" ? "УЗБ" : "RUS"}
            </button>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden xl:flex items-center gap-2 shrink-0">
            <div data-anim-header-seq>
              <Button
                className="h-11 rounded-[14px] px-6 text-[11px] font-medium tracking-[0.14em] uppercase whitespace-nowrap bg-primary text-white hover:bg-primary/90"
                onClick={() => setIsRequestModalOpen(true)}
              >
                {t.requestModal.title}
              </Button>
            </div>
            {hasBrochure && (
              <div data-anim-header-seq>
                <Button
                  variant="outline"
                  className="h-11 rounded-[14px] px-6 text-[11px] font-medium tracking-[0.14em] uppercase whitespace-nowrap border-primary text-primary bg-white/35 hover:bg-white/60"
                  asChild
                >
                  <a
                    href={brochureUrl}
                    download={brochureDownloadName || true}
                  >
                    {t.nav.brochure}
                  </a>
                </Button>
              </div>
            )}
            <div data-anim-header-seq>
              <Button
                className="h-11 rounded-[14px] px-6 text-[11px] font-medium tracking-[0.14em] uppercase whitespace-nowrap border-primary text-primary bg-white/35 hover:bg-white/60"
                variant="outline"
                asChild
              >
                <a href={phoneHref}>{t.nav.call}</a>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="xl:hidden p-2 rounded-lg transition-colors hover:bg-muted"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav
	          className={`xl:hidden absolute left-0 right-0 top-full border-t bg-white shadow-lg overflow-y-auto transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[calc(100vh-5rem)] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="container mx-auto px-4 pt-4 pb-8 flex flex-col gap-1">
            {mobileNavLinks.map((link, index) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className={`px-4 py-3 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-all duration-300 ${
                  isOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                }`}
                style={{ transitionDelay: isOpen ? `${index * 50}ms` : "0ms" }}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={toggleLanguage}
              className={`px-4 py-3 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-all duration-300 text-left ${
                isOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
              }`}
              style={{ transitionDelay: isOpen ? `${mobileNavLinks.length * 50}ms` : "0ms" }}
            >
              {language === "ru" ? "РУС" : "UZB"}/{language === "ru" ? "УЗБ" : "RUS"}
            </button>
            <div
              className={`mt-4 px-4 pb-3 flex flex-col gap-2 transition-all duration-300 ${
                isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: isOpen ? `${(mobileNavLinks.length + 1) * 50}ms` : "0ms" }}
            >
              <Button
                className="h-11 w-full rounded-[14px] bg-primary text-[11px] font-medium tracking-[0.14em] uppercase text-white hover:bg-primary/90"
                onClick={() => { setIsRequestModalOpen(true); setIsOpen(false); }}
              >
                {t.requestModal.title}
              </Button>
              {hasBrochure && (
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-[14px] border-primary text-[11px] font-medium tracking-[0.14em] uppercase text-primary bg-white hover:bg-primary/10"
                  asChild
                >
                  <a
                    href={brochureUrl}
                    download={brochureDownloadName || true}
                  >
                    {t.nav.brochure}
                  </a>
                </Button>
              )}
              <Button
                variant="outline"
                className="h-11 w-full rounded-[14px] border-primary text-[11px] font-medium tracking-[0.14em] uppercase text-primary bg-white hover:bg-primary/10"
                asChild
              >
                <a href={phoneHref}>{t.nav.call}</a>
              </Button>
            </div>
          </div>
        </nav>
      </div>

      <RequestModal
        open={isRequestModalOpen}
        onOpenChange={setIsRequestModalOpen}
        source="header"
      />
    </header>
  );
}
