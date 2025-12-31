"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Header, Footer } from "@/components/sections";
import { PageHero } from "@/components/shared";
import { ChevronLeft, ChevronRight, ChevronDown, Check } from "lucide-react";

// Infrastructure categories with accordion
const infrastructureCategories = [
  {
    id: "education",
    title: "ОБРАЗОВАТЕЛЬНЫЕ ОБЪЕКТЫ",
    isOpen: true,
    subcategories: [
      {
        title: "ДЕТСКИЕ САДЫ",
        count: 47,
        items: ["ДЕТСКИЙ САД № 191", "ДЕТСКИЙ САД № 183", "ДЕТСКИЙ САД № 181", "ДЕТСКИЙ САД № 181"],
      },
    ],
  },
  {
    id: "recreation",
    title: "ЗОНЫ ОТДЫХА",
    isOpen: false,
    count: 18,
    subcategories: [],
  },
  {
    id: "transport",
    title: "ТРАНСПОРТНАЯ ДОСТУПНОСТЬ",
    isOpen: false,
    count: 12,
    subcategories: [],
  },
];

// Gallery images for infrastructure
const galleryImages = [
  "/images/hero/1.png",
  "/images/hero/1.png",
  "/images/hero/1.png",
  "/images/hero/1.png",
];

// District advantages
const districtAdvantages = [
  "Удалённость района",
  "Тихий район",
  "6 км до центра",
  "Развитая инфраструктура",
  "Экологический район",
];

// Footer links
const footerLinks = {
  about: [
    { label: "О Комплексе", href: "/about" },
    { label: "Локация", href: "/location" },
    { label: "Галерея", href: "/#gallery" },
  ],
  buyers: [
    { label: "Каталог", href: "/catalog" },
    { label: "Условия покупки", href: "/payment" },
    { label: "Ход строительства", href: "/construction" },
  ],
};

export default function LocationPage() {
  const [openCategory, setOpenCategory] = useState<string>("education");
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);

  const nextSlide = () => {
    setCurrentGalleryIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <>
      <Header />
      <main>
        <PageHero
          title="Локация и инфраструктура"
          subtitle="ИДЕАЛЬНОЕ РАСПОЛОЖЕНИЕ ДЛЯ ЖИЗНИ"
          image="/images/hero/1.png"
        />

        {/* Interactive Map Section */}
        <section className="py-10 lg:py-14">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-6">
              <h2 className="text-2xl lg:text-3xl font-serif mb-2">Интерактивная карта</h2>
              <p className="text-sm text-muted-foreground max-w-lg">
                Найдите ближние школы, а также ближние инфраструктурные развязки и заведения вокруг нашего комплекса
              </p>
            </div>

            {/* Map */}
            <div className="relative aspect-[16/9] lg:aspect-[21/9] bg-[#e8e4df] rounded-lg overflow-hidden">
              {/* Map placeholder with streets pattern */}
              <div className="absolute inset-0 opacity-60">
                <svg className="w-full h-full" viewBox="0 0 800 400" fill="none">
                  {/* Horizontal streets */}
                  <path d="M0 100 L800 100" stroke="#ccc" strokeWidth="2" />
                  <path d="M0 200 L800 200" stroke="#ccc" strokeWidth="3" />
                  <path d="M0 300 L800 300" stroke="#ccc" strokeWidth="2" />
                  {/* Vertical streets */}
                  <path d="M200 0 L200 400" stroke="#ccc" strokeWidth="2" />
                  <path d="M400 0 L400 400" stroke="#ccc" strokeWidth="3" />
                  <path d="M600 0 L600 400" stroke="#ccc" strokeWidth="2" />
                  {/* Diagonal */}
                  <path d="M100 0 L500 400" stroke="#ccc" strokeWidth="2" />
                </svg>
              </div>
              {/* Location marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Environment Section - ОКРУЖЕНИЕ НАШЕГО ЖК */}
        <section className="py-10 lg:py-14 bg-beige">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-16">
              {/* Left side - Title and Accordion */}
              <div className="lg:w-1/2">
                <h2 className="text-lg lg:text-xl font-medium uppercase tracking-wide mb-6">
                  ОКРУЖЕНИЕ НАШЕГО ЖК
                </h2>

                {/* Accordion */}
                <div className="border-t border-gray-300">
                  {infrastructureCategories.map((category) => (
                    <div key={category.id} className="border-b border-gray-300">
                      <button
                        onClick={() => setOpenCategory(openCategory === category.id ? "" : category.id)}
                        className="w-full py-3 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {category.title}
                          </span>
                          {category.count && (
                            <span className="text-xs text-gray-400">{category.count}</span>
                          )}
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform ${
                            openCategory === category.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Subcategories */}
                      {openCategory === category.id && category.subcategories.length > 0 && (
                        <div className="pb-4 pl-4">
                          {category.subcategories.map((sub, idx) => (
                            <div key={idx}>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-800">{sub.title}</span>
                                <span className="text-xs text-primary">{sub.count}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-x-8 gap-y-1 pl-2">
                                {sub.items.map((item, itemIdx) => (
                                  <p key={itemIdx} className="text-xs text-gray-500">
                                    {item}
                                  </p>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side - Logo and Image */}
              <div className="lg:w-1/2 flex flex-col items-end gap-6">
                <div className="flex items-center gap-3">
                  <Image
                    src="/logo.svg"
                    alt="EMAN RIVERSIDE"
                    width={100}
                    height={60}
                    className="h-12 w-auto"
                  />
                </div>
                {/* Small gallery preview */}
                <div className="relative w-full max-w-sm aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src="/images/hero/1.png"
                    alt="Инфраструктура"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Infrastructure Gallery */}
        <section className="py-10 lg:py-14">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl lg:text-2xl font-serif">
                Галерея инфраструктурных объектов
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={prevSlide}
                  className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Gallery Slider */}
            <div className="relative overflow-hidden">
              <div
                className="flex gap-4 transition-transform duration-300"
                style={{ transform: `translateX(-${currentGalleryIndex * 33.333}%)` }}
              >
                {galleryImages.concat(galleryImages).map((img, idx) => (
                  <div
                    key={idx}
                    className="shrink-0 w-full sm:w-1/2 lg:w-1/3"
                  >
                    <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={img}
                        alt={`Инфраструктура ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* District Advantages */}
        <section className="relative py-14 lg:py-20">
          {/* Background */}
          <div className="absolute inset-0 z-0 bg-primary">
            <Image
              src="/images/hero/1.png"
              alt=""
              fill
              className="object-cover opacity-30"
            />
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16">
              {/* Left - Title and List */}
              <div className="lg:w-1/2 text-white">
                <h2 className="text-2xl lg:text-3xl font-serif mb-6">
                  Преимущества района
                </h2>
                <ul className="space-y-3">
                  {districtAdvantages.map((advantage, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-white/70" />
                      <span className="text-white/90 text-sm">{advantage}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right - Logo */}
              <div className="lg:w-1/2 flex justify-center lg:justify-end">
                <Image
                  src="/logo.svg"
                  alt="EMAN RIVERSIDE"
                  width={120}
                  height={80}
                  className="h-20 w-auto brightness-0 invert opacity-80"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Map with Footer Info */}
        <section className="py-10 lg:py-14 bg-beige">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Map */}
              <div className="relative aspect-square lg:aspect-auto lg:h-80 rounded-lg overflow-hidden bg-gray-200">
                <Image
                  src="/images/hero/1.png"
                  alt="Карта расположения"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col justify-center">
                {/* Logo */}
                <div className="mb-6">
                  <Image
                    src="/logo.svg"
                    alt="EMAN RIVERSIDE"
                    width={100}
                    height={50}
                    className="h-10 w-auto"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8 mb-6">
                  <div>
                    <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                      О проекте
                    </h4>
                    <ul className="space-y-2">
                      {footerLinks.about.map((link, idx) => (
                        <li key={idx}>
                          <Link href={link.href} className="text-sm text-gray-600 hover:text-primary transition-colors">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                      Покупателям
                    </h4>
                    <ul className="space-y-2">
                      {footerLinks.buyers.map((link, idx) => (
                        <li key={idx}>
                          <Link href={link.href} className="text-sm text-gray-600 hover:text-primary transition-colors">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-400 mb-1">Офис продаж</p>
                  <p className="text-sm text-gray-700 mb-2">г. Ташкент, Сергелийский р-н</p>
                  <p className="text-primary font-semibold">+998 90 123 45 67</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
