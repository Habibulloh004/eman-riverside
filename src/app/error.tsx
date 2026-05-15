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
            {language === "uz" ? "Xatolik yuz berdi" : language === "ru" ? "Произошла ошибка" : "Something went wrong"}
          </h1>
          <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
            {language === "uz"
              ? "Kutilmagan xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring"
              : language === "ru"
                ? "Произошла непредвиденная ошибка. Пожалуйста, попробуйте снова."
                : "An unexpected error occurred. Please try again."}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={reset}>
              {language === "uz" ? "Qaytadan urinish" : language === "ru" ? "Повторить" : "Try again"}
            </Button>
            <Button variant="outline" asChild>
              <a href="/">
                {language === "uz" ? "Bosh sahifa" : language === "ru" ? "Главная" : "Home"}
              </a>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
