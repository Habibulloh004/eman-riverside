"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Header, Footer } from "@/components/sections";
import { PageHero } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Mail, ChevronLeft } from "lucide-react";

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
  },
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

export default function ApartmentRequestPage() {
  const params = useParams();
  const router = useRouter();
  const apartmentId = Number(params.id);
  const apartment = apartments.find((a) => a.id === apartmentId);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <>
        <Header />
        <main>
          <PageHero
            title="Заявка отправлена"
            subtitle="СПАСИБО ЗА ОБРАЩЕНИЕ"
            image="/images/hero/1.png"
          />

          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-md mx-auto text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-serif mb-4">Ваша заявка принята!</h2>
                <p className="text-gray-600 mb-8">
                  Наш менеджер свяжется с вами в ближайшее время для уточнения деталей по квартире "{apartment.name}"
                </p>
                <div className="flex gap-4 justify-center">
                  <Button asChild>
                    <Link href="/catalog">В каталог</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/">На главную</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <PageHero
          title="Оставить заявку"
          subtitle={`ЗАЯВКА НА КВАРТИРУ ${apartment.name.toUpperCase()}`}
          image="/images/hero/1.png"
        />

        {/* Request Form Section */}
        <section className="py-10 lg:py-14 bg-beige">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Left - Contact Info & Map */}
              <div>
                <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wide">
                  ЗАПИШИТЕ ЗВОНОК ЧТОБЫ УЗНАТЬ ПОДРОБНУЮ ИНФОРМАЦИЮ ПО ВСЕМ ВОПРОСАМ.
                  МЕНЕДЖЕР НАШЕГО ОТДЕЛА ПРОДАЖ СВЯЖЕТСЯ С ВАМИ.
                </p>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm">Город Ташкент Мирзо Улугбек район</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="text-sm">+998 90 070 09 98</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-sm">info@emanriverside.uz</span>
                  </div>
                </div>

                {/* Map */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200">
                  <Image
                    src="/images/hero/1.png"
                    alt="Карта"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Apartment Info Card */}
                <div className="mt-6 p-4 bg-white rounded-lg border">
                  <p className="text-xs text-gray-500 mb-2">Выбранная квартира:</p>
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 bg-gray-100 rounded overflow-hidden shrink-0">
                      <Image
                        src={apartment.image}
                        alt={apartment.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">{apartment.name}</h4>
                      <p className="text-xs text-gray-500">
                        {apartment.rooms} комн. • {apartment.area} м² • {apartment.floor} этаж
                      </p>
                      <p className="text-primary font-bold mt-1">
                        ${apartment.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Contact Form */}
              <div>
                <h3 className="text-xl font-serif mb-1 uppercase">
                  НАЙДИТЕ СЕБЕ КВАРТИРУ МЕЧТЫ
                </h3>
                <p className="text-xs text-muted-foreground mb-5">
                  Заполните форму и наш менеджер свяжется с вами
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Ваше Имя"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-white border-gray-200 h-10"
                  />
                  <Input
                    type="tel"
                    placeholder="Номер телефона"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="bg-white border-gray-200 h-10"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 h-10"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Отправка..." : "ОТПРАВИТЬ"}
                  </Button>
                </form>

                <div className="mt-6">
                  <Link
                    href={`/catalog/${apartment.id}`}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Вернуться к квартире
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Info */}
        <section className="py-10 lg:py-14 bg-beige border-t border-gray-200">
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
                <div className="flex gap-3 mt-4">
                  <a href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
                  </a>
                  <a href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                  <a href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                </div>
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
