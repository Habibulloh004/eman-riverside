"use client";

import { Header, Footer } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { language } = useLanguage();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F9EFE7] flex items-center justify-center">
        <div className="text-center px-4">
          <span className="text-[120px] lg:text-[180px] font-serif font-bold text-primary/10 leading-none select-none block">
            500
          </span>
          <h1 className="text-2xl lg:text-4xl font-serif text-primary -mt-6 mb-3">
            {language === "uz" ? "Xatolik yuz berdi" : "Произошла ошибка"}
          </h1>
          <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
            {language === "uz"
              ? "Kutilmagan xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring"
              : "Произошла непредвиденная ошибка. Пожалуйста, попробуйте ещё раз"}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={reset}>
              {language === "uz" ? "Qaytadan urinish" : "Попробовать снова"}
            </Button>
            <Button variant="outline" asChild>
              <a href="/">
                {language === "uz" ? "Bosh sahifa" : "На главную"}
              </a>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
