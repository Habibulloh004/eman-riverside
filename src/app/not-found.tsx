"use client";

import Link from "next/link";
import { Header, Footer } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { t, language } = useLanguage();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F9EFE7] flex items-center justify-center">
        <div className="text-center px-4">
          <span className="text-[120px] lg:text-[180px] font-serif font-bold text-primary/10 leading-none select-none block">
            404
          </span>
          <h1 className="text-2xl lg:text-4xl font-serif text-primary -mt-6 mb-3">
            {language === "uz" ? "Sahifa topilmadi" : language === "ru" ? "Страница не найдена" : "Page not found"}
          </h1>
          <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
            {language === "uz"
              ? "Siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan"
              : language === "ru"
                ? "Страница, которую вы ищете, не существует или была перемещена"
                : "The page you are looking for does not exist or has been moved"}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button asChild>
              <Link href="/">
                {language === "uz" ? "Bosh sahifa" : language === "ru" ? "Главная" : "Home"}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/catalog">
                {t.nav.catalog}
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
