"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/contexts/SettingsContext";
import { RequestModal } from "@/components/shared";
import { useMagneticCursor } from "@/hooks/useMagneticCursor";

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
    { href: "/contacts", label: t.nav.contacts },
  ];

  const headerRef = useRef<HTMLElement | null>(null);

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
    if (window.innerWidth < 1024) return;
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

  const ctaRef = useRef<HTMLDivElement>(null);
  useMagneticCursor(ctaRef, 0.25);

  const toggleLanguage = () => {
    setLanguage(language === "ru" ? "uz" : "ru");
  };

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto max-w-[1360px] px-4 lg:px-6 xl:px-8">
        <div ref={desktopHeaderRef} className="flex items-center justify-between h-[72px] lg:h-20">
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
          <nav className="hidden lg:flex items-center gap-3 xl:gap-4 2xl:gap-6 min-w-0">
            {headerNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-anim-header-seq
                className="text-sm font-medium tracking-wide text-foreground hover:text-primary/70 transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              data-anim-header-seq
              className="text-sm font-medium tracking-wide text-foreground hover:text-primary/70 transition-colors whitespace-nowrap"
            >
              {language === "ru" ? "РУС" : "UZB"}/{language === "ru" ? "УЗБ" : "RUS"}
            </button>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <div ref={ctaRef} data-anim-header-seq>
              <Button
                className="rounded-full px-6 2xl:px-8 whitespace-nowrap border-primary text-primary hover:bg-primary hover:text-white"
                variant="outline"
                asChild
              >
                <a href={phoneHref}>{t.nav.call}</a>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg transition-colors hover:bg-muted"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav
          className={`lg:hidden border-t bg-white absolute left-0 right-0 top-20 shadow-lg overflow-y-auto transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[calc(100vh-5rem)] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="container mx-auto px-4 pt-4 pb-8 flex flex-col gap-1">
            {headerNavLinks.map((link, index) => (
              <Link
                key={link.href}
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
              style={{ transitionDelay: isOpen ? `${headerNavLinks.length * 50}ms` : "0ms" }}
            >
              {language === "ru" ? "РУС" : "UZB"}/{language === "ru" ? "УЗБ" : "RUS"}
            </button>
            <div
              className={`mt-4 px-4 pb-3 flex flex-col gap-2 transition-all duration-300 ${
                isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: isOpen ? `${(headerNavLinks.length + 1) * 50}ms` : "0ms" }}
            >
              <Button
                className="w-full rounded-full bg-primary text-white hover:bg-primary/90"
                onClick={() => { setIsRequestModalOpen(true); setIsOpen(false); }}
              >
                {t.requestModal.title}
              </Button>
              {hasBrochure && (
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white rounded-full"
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
                className="w-full border-primary text-primary hover:bg-primary hover:text-white rounded-full"
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
