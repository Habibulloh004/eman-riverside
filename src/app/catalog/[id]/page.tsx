"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header, Footer } from "@/components/sections";
import { PageHero } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useState } from "react";

// Apartment data (same as catalog)
const apartments = [
  {
    id: 1,
    name: "Люкс Экстра",
    rooms: 3,
    area: 150,
    floor: 2,
    price: 45545,
    type: "Люкс",
    image: "/images/hero/planirovka1.png",
    images: ["/images/hero/planirovka1.png", "/images/hero/1.png"],
    description: "Просторная 3-комнатная квартира класса Люкс с панорамными окнами и высокими потолками. Идеально подходит для большой семьи."
  },
  {
    id: 2,
    name: "Люкс Экстра",
    rooms: 3,
    area: 150,
    floor: 3,
    price: 46500,
    type: "Люкс",
    image: "/images/hero/planirovka1.png",
    images: ["/images/hero/planirovka1.png", "/images/hero/1.png"],
    description: "Просторная 3-комнатная квартира класса Люкс с панорамными окнами и высокими потолками."
  },
  {
    id: 3,
    name: "Стандарт Плюс",
    rooms: 2,
    area: 85,
    floor: 4,
    price: 32000,
    type: "Стандарт",
    image: "/images/hero/planirovka1.png",
    images: ["/images/hero/planirovka1.png", "/images/hero/1.png"],
    description: "Уютная 2-комнатная квартира с продуманной планировкой и качественной отделкой."
  },
  {
    id: 4,
    name: "Эконом",
    rooms: 1,
    area: 45,
    floor: 5,
    price: 22000,
    type: "Эконом",
    image: "/images/hero/planirovka1.png",
    images: ["/images/hero/planirovka1.png", "/images/hero/1.png"],
    description: "Компактная 1-комнатная квартира - отличный выбор для молодой семьи или инвестиции."
  },
  {
    id: 5,
    name: "Люкс Экстра",
    rooms: 4,
    area: 180,
    floor: 6,
    price: 58000,
    type: "Люкс",
    image: "/images/hero/planirovka1.png",
    images: ["/images/hero/planirovka1.png", "/images/hero/1.png"],
    description: "Роскошная 4-комнатная квартира с террасой и видом на реку."
  },
  {
    id: 6,
    name: "Стандарт",
    rooms: 2,
    area: 75,
    floor: 2,
    price: 28000,
    type: "Стандарт",
    image: "/images/hero/planirovka1.png",
    images: ["/images/hero/planirovka1.png", "/images/hero/1.png"],
    description: "Удобная 2-комнатная квартира с балконом и современной планировкой."
  },
];

// Features list
const features = [
  "Панорамные окна",
  "Высокие потолки 3.2м",
  "Качественная отделка",
  "Современная планировка",
  "Балкон/лоджия",
  "Подземная парковка",
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

export default function ApartmentDetailPage() {
  const params = useParams();
  const apartmentId = Number(params.id);
  const apartment = apartments.find((a) => a.id === apartmentId);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!apartment) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-serif mb-4">Квартира не найдена</h1>
            <Button asChild>
              <Link href="/catalog">Вернуться в каталог</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const images = apartment.images || [apartment.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <Header />
      <main>
        <PageHero
          title={apartment.name}
          subtitle={`${apartment.rooms}-КОМНАТНАЯ КВАРТИРА`}
          image="/images/hero/1.png"
        />

        {/* Apartment Details */}
        <section className="py-10 lg:py-14">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left - Image Gallery */}
              <div>
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={images[currentImageIndex]}
                    alt={apartment.name}
                    fill
                    className="object-contain p-4"
                  />

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          idx === currentImageIndex ? "border-primary" : "border-transparent"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${apartment.name} ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right - Details */}
              <div>
                <div className="mb-2">
                  <span className="text-xs text-primary font-medium uppercase tracking-wide">
                    {apartment.type}
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-serif italic mb-4">
                  {apartment.name}
                </h1>

                <p className="text-gray-600 mb-6">
                  {apartment.description}
                </p>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-4 mb-6 p-5 bg-beige rounded-lg">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{apartment.rooms}</p>
                    <p className="text-xs text-gray-500">Комнат</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{apartment.area}</p>
                    <p className="text-xs text-gray-500">м²</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{apartment.floor}</p>
                    <p className="text-xs text-gray-500">Этаж</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-1">Стоимость от</p>
                  <p className="text-4xl font-bold text-primary">
                    ${apartment.price.toLocaleString()}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <h3 className="font-semibold mb-3">Особенности:</h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90"
                    asChild
                  >
                    <Link href={`/catalog/${apartment.id}/request`}>
                      Оставить заявку
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-primary text-primary hover:bg-primary hover:text-white"
                    asChild
                  >
                    <a href="tel:+998901234567">
                      Позвонить
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Back to catalog */}
        <section className="py-6 border-t">
          <div className="container mx-auto px-4 lg:px-8">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Вернуться в каталог
            </Link>
          </div>
        </section>

        {/* Footer Info */}
        <section className="py-10 lg:py-14 bg-beige">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div>
                <Image
                  src="/logo.svg"
                  alt="EMAN RIVERSIDE"
                  width={100}
                  height={50}
                  className="h-10 w-auto mb-4"
                />
              </div>
              <div className="grid grid-cols-2 gap-8">
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
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
