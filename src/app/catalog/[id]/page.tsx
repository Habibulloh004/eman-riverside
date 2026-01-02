"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Header, Footer } from "@/components/sections";
import { PageHero } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

// Infrastructure categories
const infrastructureCategories = [
  {
    id: "education",
    title: "ОБРАЗОВАТЕЛЬНЫЕ ОБЪЕКТЫ",
    count: 12,
    isOpen: true,
    subcategories: [
      {
        title: "ДЕТСКИЕ САДЫ",
        count: 47,
        items: ["ДЕТСКИЙ САД № 161", "ДЕТСКИЙ САД № 161", "ДЕТСКИЙ САД № 161", "ДЕТСКИЙ САД № 161"],
      },
    ],
  },
  {
    id: "recreation",
    title: "ЗОНЫ ОТДЫХА",
    count: 18,
    isOpen: false,
    subcategories: [],
  },
  {
    id: "transport",
    title: "ТРАНСПОРТНАЯ ДОСТУПНОСТЬ",
    count: 24,
    isOpen: false,
    subcategories: [],
  },
];

// Gallery images for infrastructure
const galleryImages = [
  "/images/hero/1.png",
  "/images/hero/1.png",
  "/images/hero/1.png",
  "/images/hero/1.png",
  "/images/hero/1.png",
  "/images/hero/1.png",
];

// District advantages
const districtAdvantages = [
  "Супермаркет Korzinka",
  "Team University",
  "Парк Дустлик",
  "Национальный детский медицинский центр",
  "Городская клиническая больница №4",
  "Школы и детские сады",
];

// Footer links
const footerLinks = {
  about: [
    { label: "О нас", href: "/about" },
    { label: "Агенты", href: "/agents" },
    { label: "Блог", href: "/blog" },
    { label: "Медиа", href: "/media" },
    { label: "Связаться с нами", href: "/contacts" },
  ],
};

export default function CatalogDetailPage() {
  const [openCategory, setOpenCategory] = useState<string>("education");
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [email, setEmail] = useState("");

  const nextSlide = () => {
    setCurrentGalleryIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <>
      <Header />
      <main>
        <PageHero
          title="Локация и инфраструктура"
          subtitle="ИНФРАСТРУКТУРА EMAN RIVERSIDE"
          image="/images/hero/1.png"
        />

        {/* Interactive Map Section */}
        <section className="relative py-12 lg:py-20 overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero/1.png"
              alt=""
              fill
              className="object-cover opacity-[0.03]"
            />
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="mb-8">
              <h2 className="text-3xl lg:text-4xl font-serif text-primary mb-3">
                Интерактивная карта
              </h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Локация сочетает природу и городскую инфраструктуру — идеальный баланс
              </p>
            </div>

            {/* Real Map with Google Maps */}
            <div className="relative aspect-video lg:aspect-[21/9] rounded-lg overflow-hidden bg-muted">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47980.98675893856!2d69.21992457431642!3d41.31147339999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sTashkent%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1703955000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
              {/* Map Pin Overlay with Logo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-primary p-3 rounded-lg shadow-lg">
                  <Image
                    src="/logo.svg"
                    alt="EMAN RIVERSIDE"
                    width={60}
                    height={30}
                    className="h-8 w-auto brightness-0 invert"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Environment Section - ОКРУЖЕНИЕ НАШЕГО ЖК */}
        <section className="relative py-12 lg:py-20 bg-beige overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero/1.png"
              alt=""
              fill
              className="object-cover opacity-[0.03]"
            />
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 lg:gap-20">
              {/* Left side - Title and Accordion */}
              <div className="lg:w-1/2">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-xl lg:text-2xl font-semibold uppercase tracking-wide">
                    ОКРУЖЕНИЕ НАШЕГО ЖК
                  </h2>
                  <div className="flex items-center gap-2">
                    <Image
                      src="/logo.svg"
                      alt="EMAN RIVERSIDE"
                      width={120}
                      height={60}
                      className="h-14 w-auto"
                    />
                  </div>
                </div>

                {/* Accordion Categories */}
                <div className="space-y-0">
                  {infrastructureCategories.map((category) => (
                    <div key={category.id} className="border-b border-gray-300 last:border-b-0">
                      <button
                        onClick={() => setOpenCategory(openCategory === category.id ? "" : category.id)}
                        className="w-full py-4 flex items-center justify-between text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm uppercase tracking-wide text-gray-700 group-hover:text-primary transition-colors">
                            {category.title}
                          </span>
                          <span className="text-xs text-primary align-super">{category.count}</span>
                        </div>
                      </button>

                      {/* Subcategories */}
                      {openCategory === category.id && category.subcategories.length > 0 && (
                        <div className="pb-6">
                          {category.subcategories.map((sub, idx) => (
                            <div key={idx} className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-12">
                              <div className="flex items-center gap-2 border-b-2 border-primary pb-1">
                                <span className="text-sm font-medium text-gray-900 uppercase">{sub.title}</span>
                                <span className="text-xs text-primary align-super">{sub.count}</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                {sub.items.map((item, itemIdx) => (
                                  <p key={itemIdx} className="text-sm text-gray-600">
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

              {/* Right side - Image */}
              <div className="lg:w-1/2">
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
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

        {/* Infrastructure Gallery - Full Width */}
        <section className="relative overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero/1.png"
              alt=""
              fill
              className="object-cover opacity-[0.03]"
            />
          </div>

          {/* Title bar */}
          <div className="relative z-10 bg-beige/80 py-6">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl lg:text-2xl font-serif">
                  Галерея инфраструктурных объектов
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={prevSlide}
                    className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:bg-white hover:border-primary transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:bg-white hover:border-primary transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Full width gallery slider */}
          <div className="relative z-10 overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentGalleryIndex * 100}%)` }}
            >
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className="shrink-0 w-full"
                >
                  <div className="relative aspect-[21/9] bg-gray-100">
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
        </section>

        {/* District Advantages with Map */}
        <section className="relative py-12 lg:py-20 bg-beige overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero/1.png"
              alt=""
              fill
              className="object-cover opacity-[0.03]"
            />
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
              {/* Left - Title and List */}
              <div>
                <h2 className="text-2xl lg:text-3xl font-serif mb-8">
                  Преимущества района
                </h2>
                <ul className="space-y-4">
                  {districtAdvantages.map((advantage, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-gray-700">{advantage}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right - Map */}
              <div className="relative aspect-square lg:aspect-[4/3] rounded-lg overflow-hidden bg-muted shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47980.98675893856!2d69.21992457431642!3d41.31147339999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sTashkent%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1703955000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
                {/* Map Pin Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-primary p-3 rounded-lg shadow-lg">
                    <Image
                      src="/logo.svg"
                      alt="EMAN RIVERSIDE"
                      width={60}
                      height={30}
                      className="h-6 w-auto brightness-0 invert"
                    />
                  </div>
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
