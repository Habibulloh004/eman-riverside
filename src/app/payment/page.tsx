"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header, Footer } from "@/components/sections";
import { PageHero } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Plus, Minus, MapPin, Phone, Mail } from "lucide-react";

// Purchase steps
const purchaseSteps = [
  {
    number: 1,
    title: "Выберите Планировку",
    description: "Ознакомьтесь с доступными планировками на сайте или посетите наш офис продаж.",
  },
  {
    number: 2,
    title: "Заключите Договор",
    description: "Подпишите договор бронирования и внесите первоначальный взнос.",
  },
  {
    number: 3,
    title: "Получите ключи",
    description: "После завершения строительства получите ключи от вашей новой квартиры.",
  },
];

// Payment conditions - Наличные
const cashFeatures = [
  "Lorem ipsum dolor sit amet",
  "Lorem ipsum dolor sit amet",
  "Lorem ipsum dolor sit amet",
  "Lorem ipsum dolor sit amet",
  "Lorem ipsum dolor sit amet",
];

// Payment conditions - Рассрочка
const installmentFeatures = [
  "Lorem ipsum dolor sit amet",
  "Lorem ipsum dolor sit amet",
  "Lorem ipsum dolor sit amet",
  "Lorem ipsum dolor sit amet",
  "Lorem ipsum dolor sit amet",
  "Lorem ipsum dolor sit amet",
  "Lorem ipsum dolor sit amet",
  "Lorem ipsum dolor sit amet",
];

// FAQ items
const faqItems = [
  { question: "Вопрос 1", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  { question: "Вопрос 2", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { question: "Вопрос 3", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { question: "Вопрос 4", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { question: "Вопрос 5", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { question: "Вопрос 6", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
];

// Footer links
const footerLinks = {
  about: [
    { label: "О Комплексе", href: "/projects" },
    { label: "Локация", href: "/location" },
    { label: "Галерея", href: "/#gallery" },
  ],
  buyers: [
    { label: "Каталог", href: "/catalog" },
    { label: "Условия покупки", href: "/payment" },
    { label: "Ход строительства", href: "/construction" },
  ],
};

export default function PaymentPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Спасибо! Мы свяжемся с вами в ближайшее время.");
    setFormData({ name: "", phone: "" });
  };

  return (
    <>
      <Header />
      <main>
        <PageHero
          title="Схема покупки"
          subtitle="ЭТАПЫ ПОКУПКИ КВАРТИРЫ ОТ ЗАСТРОЙЩИКА"
          image="/images/hero/1.png"
        />

        {/* Purchase Steps */}
        <section className="py-10 lg:py-14">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6 lg:gap-10 max-w-4xl mx-auto">
              {purchaseSteps.map((step) => (
                <div key={step.number} className="text-center">
                  <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">{step.number}</span>
                    </div>
                  </div>
                  <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Conditions Section */}
        <section className="py-10 lg:py-14 bg-beige">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-2xl font-serif text-center mb-8">Условия:</h2>

            <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
              {/* Наличные Card */}
              <div className="bg-primary text-white rounded-xl p-5 lg:p-6">
                <h3 className="text-base font-semibold mb-1">Наличные</h3>
                <p className="text-xs text-white/60 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor
                </p>
                <div className="text-2xl lg:text-3xl font-bold mb-4">
                  1 млн сум <span className="text-sm font-normal text-white/60">= м.кв.</span>
                </div>
                <Button variant="secondary" size="sm" className="w-full bg-white text-primary hover:bg-white/90 mb-5 h-9">
                  Подробнее
                </Button>
                <ul className="space-y-2">
                  {cashFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs">
                      <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Рассрочка Card */}
              <div className="bg-white rounded-xl p-5 lg:p-6 border border-gray-200">
                <h3 className="text-base font-semibold mb-1">Рассрочка</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor
                </p>
                <div className="text-2xl lg:text-3xl font-bold text-primary mb-4">
                  2 млн сум <span className="text-sm font-normal text-muted-foreground">= м.кв.</span>
                </div>
                <div className="mb-5">
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-gray-50">
                    <option>Место загрузки рассрочка</option>
                    <option>12 месяцев</option>
                    <option>24 месяца</option>
                    <option>36 месяцев</option>
                  </select>
                </div>
                <ul className="space-y-2">
                  {installmentFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs">
                      <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-primary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-10 lg:py-14">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-2xl font-serif text-center mb-8">FAQ</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
              {faqItems.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-sm">{item.question}</span>
                    {openFaq === idx ? (
                      <Minus className="w-4 h-4 text-gray-400 shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-3">
                      <p className="text-xs text-muted-foreground">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section with Map */}
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
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
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
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white h-10"
                  >
                    ОТПРАВИТЬ
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Info Section */}
        <section className="py-10 lg:py-14 bg-beige border-t border-gray-200">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Logo */}
              <div>
                <Image
                  src="/logo.svg"
                  alt="EMAN RIVERSIDE"
                  width={100}
                  height={50}
                  className="h-10 w-auto mb-4"
                />
                <div className="flex gap-3 mt-4">
                  {/* Social icons */}
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

              {/* Links */}
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
