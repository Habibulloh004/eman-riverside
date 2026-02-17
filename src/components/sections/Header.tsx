"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/contexts/SettingsContext";
import { RequestModal } from "@/components/shared";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { settings } = useSiteSettings();

  // Format phone for tel: href
  const phoneHref = `tel:${settings.contact.phone.replace(/\s/g, "")}`;

  const headerNavLinks = [
    { href: "/projects", label: t.nav.about },
    { href: "/catalog", label: t.nav.catalog },
    { href: "/gallery", label: t.nav.gallery },
    { href: "/contacts", label: t.nav.contacts },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "ru" ? "uz" : "ru");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="EMAN RIVERSIDE"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {headerNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium tracking-wide text-foreground hover:text-primary/70 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="text-sm font-medium tracking-wide text-foreground hover:text-primary/70 transition-colors"
            >
              {language === "ru" ? "РУС" : "UZB"}/{language === "ru" ? "УЗБ" : "RUS"}
            </button>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              className="rounded-full px-6 bg-primary text-white hover:bg-primary/90"
              onClick={() => setIsRequestModalOpen(true)}
            >
              {t.requestModal.title}
            </Button>
            <Button
              className="rounded-full px-6"
              variant="outline"
              asChild
            >
              <a href={phoneHref}>{t.nav.call}</a>
            </Button>
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
          className={`lg:hidden border-t bg-white absolute left-0 right-0 top-20 shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
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
              className={`mt-4 px-4 flex flex-col gap-2 transition-all duration-300 ${
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
