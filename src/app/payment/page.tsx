"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header, Footer } from "@/components/sections";
import { PageHero } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PhoneNumberInput from "@/components/ui/phone-input";
import { Check, Plus, Minus, MapPin, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/contexts/SettingsContext";
import { pickLocalizedString } from "@/lib/i18n/localized";

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

function getPaymentCopy(language: "ru" | "uz" | "en") {
  return language === "uz"
    ? {
        successAlert: "Rahmat! Tez orada siz bilan bog'lanamiz.",
        heroTitle: "Xarid sxemasi",
        heroSubtitle: "EMAN RIVERSIDE XONADONINI XARID QILISH BOSQICHLARI",
        purchaseSteps: [
          {
            number: 1,
            title: "Rejani tanlang",
            description: "Saytdagi mavjud rejalashtirish variantlarini ko'ring yoki savdo ofisimizga tashrif buyuring.",
          },
          {
            number: 2,
            title: "Shartnoma tuzing",
            description: "Bron qilish shartnomasini imzolang va boshlang'ich to'lovni amalga oshiring.",
          },
          {
            number: 3,
            title: "Kalitlarni oling",
            description: "Qurilish yakunlangach yangi xonadoningiz kalitlarini qabul qilib oling.",
          },
        ],
        conditionsTitle: "Shartlar:",
        cashTitle: "Naqd to'lov",
        installmentTitle: "Bo'lib to'lash",
        details: "Batafsil",
        perSquareMeter: "= kv.m",
        installmentPlaceholder: "Bo'lib to'lash muddati",
        installmentOptions: ["12 oy", "24 oy", "36 oy"],
        faqItems: Array.from({ length: 6 }, (_, index) => ({
          question: `Savol ${index + 1}`,
          answer: "Bu bo'lim uchun savol-javoblar keyinroq to'ldiriladi.",
        })),
        contactLead: "BARCHA SAVOLLAR BO'YICHA BATAFSIL MA'LUMOT OLISH UCHUN SO'ROV QOLDIRING. SAVDO BO'LIMIMIZ MENEJERI SIZ BILAN BOG'LANADI.",
        mapAlt: "Xarita",
        formTitle: "ORZUINGIZDAGI XONADONNI TOPING",
        formDescription: "Formani to'ldiring va menejerimiz siz bilan bog'lanadi",
        namePlaceholder: "Ismingiz",
        phonePlaceholder: "Telefon raqami",
        submit: "YUBORISH",
        aboutHeading: "Loyiha haqida",
        buyersHeading: "Xaridorlar uchun",
        footerLinks: {
          about: [
            { label: "Loyiha haqida", href: "/projects" },
            { label: "Galereya", href: "/#gallery" },
          ],
          buyers: [
            { label: "Katalog", href: "/catalog" },
            { label: "Xarid shartlari", href: "/payment" },
          ],
        },
      }
    : language === "ru"
      ? {
          successAlert: "Спасибо! Мы свяжемся с вами в ближайшее время.",
          heroTitle: "Схема покупки",
          heroSubtitle: "ЭТАПЫ ПОКУПКИ КВАРТИРЫ EMAN RIVERSIDE",
          purchaseSteps: [
            {
              number: 1,
              title: "Выберите планировку",
              description: "Ознакомьтесь с доступными планировками на сайте или посетите наш офис продаж.",
            },
            {
              number: 2,
              title: "Заключите договор",
              description: "Подпишите договор бронирования и внесите первоначальный взнос.",
            },
            {
              number: 3,
              title: "Получите ключи",
              description: "После завершения строительства получите ключи от вашей новой квартиры.",
            },
          ],
          conditionsTitle: "Условия:",
          cashTitle: "Наличные",
          installmentTitle: "Рассрочка",
          details: "Подробнее",
          perSquareMeter: "= м.кв.",
          installmentPlaceholder: "Срок рассрочки",
          installmentOptions: ["12 месяцев", "24 месяца", "36 месяцев"],
          faqItems: Array.from({ length: 6 }, (_, index) => ({
            question: `Вопрос ${index + 1}`,
            answer: "Этот раздел FAQ будет заполнен позже.",
          })),
          contactLead: "ОСТАВЬТЕ ЗАЯВКУ, ЧТОБЫ ПОЛУЧИТЬ ПОДРОБНУЮ ИНФОРМАЦИЮ ПО ВСЕМ ВОПРОСАМ. МЕНЕДЖЕР НАШЕГО ОТДЕЛА ПРОДАЖ СВЯЖЕТСЯ С ВАМИ.",
          mapAlt: "Карта",
          formTitle: "НАЙДИТЕ КВАРТИРУ МЕЧТЫ",
          formDescription: "Заполните форму, и наш менеджер свяжется с вами",
          namePlaceholder: "Ваше имя",
          phonePlaceholder: "Номер телефона",
          submit: "ОТПРАВИТЬ",
          aboutHeading: "О проекте",
          buyersHeading: "Покупателям",
          footerLinks: {
            about: [
              { label: "О проекте", href: "/projects" },
              { label: "Галерея", href: "/#gallery" },
            ],
            buyers: [
              { label: "Каталог", href: "/catalog" },
              { label: "Условия покупки", href: "/payment" },
            ],
          },
        }
      : {
        successAlert: "Thank you! We will contact you shortly.",
        heroTitle: "Purchase plan",
        heroSubtitle: "EMAN RIVERSIDE APARTMENT PURCHASE STAGES",
        purchaseSteps: [
          {
            number: 1,
            title: "Choose a layout",
            description: "Review the available layouts on the website or visit our sales office.",
          },
          {
            number: 2,
            title: "Sign the agreement",
            description: "Sign the reservation agreement and make the initial payment.",
          },
          {
            number: 3,
            title: "Receive the keys",
            description: "After construction is complete, receive the keys to your new apartment.",
          },
        ],
        conditionsTitle: "Conditions:",
        cashTitle: "Cash payment",
        installmentTitle: "Installment plan",
        details: "Details",
        perSquareMeter: "= sq.m",
        installmentPlaceholder: "Installment term",
        installmentOptions: ["12 months", "24 months", "36 months"],
        faqItems: Array.from({ length: 6 }, (_, index) => ({
          question: `Question ${index + 1}`,
          answer: "This FAQ content will be filled in later.",
        })),
        contactLead: "LEAVE A REQUEST TO RECEIVE DETAILED INFORMATION ON ALL QUESTIONS. A MEMBER OF OUR SALES TEAM WILL CONTACT YOU.",
        mapAlt: "Map",
        formTitle: "FIND YOUR DREAM APARTMENT",
        formDescription: "Fill out the form and our manager will contact you",
        namePlaceholder: "Your name",
        phonePlaceholder: "Phone number",
        submit: "SEND",
        aboutHeading: "About the project",
        buyersHeading: "For buyers",
        footerLinks: {
          about: [
            { label: "About the project", href: "/projects" },
            { label: "Gallery", href: "/#gallery" },
          ],
          buyers: [
            { label: "Catalog", href: "/catalog" },
            { label: "Purchase conditions", href: "/payment" },
          ],
        },
      };
}

export default function PaymentPage() {
  const { language } = useLanguage();
  const { settings } = useSiteSettings();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const copy = getPaymentCopy(language);
  const address = settings
    ? pickLocalizedString(language, {
        ru: settings.contact.address,
        uz: settings.contact.address_uz,
        en: settings.contact.address_en,
      })
    : language === "uz"
      ? "Toshkent shahri"
      : language === "ru"
        ? "Город Ташкент"
        : "Tashkent city";

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(copy.successAlert);
    setFormData({ name: "", phone: "" });
  };

  return (
    <>
      <Header />
      <main>
        <PageHero
          title={copy.heroTitle}
          subtitle={copy.heroSubtitle}
          image="/images/hero/1.png"
        />

        {/* Purchase Steps */}
        <section className="py-10 lg:py-14">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6 lg:gap-10 max-w-4xl mx-auto">
              {copy.purchaseSteps.map((step) => (
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
            <h2 className="text-2xl font-serif text-center mb-8">{copy.conditionsTitle}</h2>

            <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
              {/* Наличные Card */}
              <div className="bg-primary text-white rounded-xl p-5 lg:p-6">
                <h3 className="text-base font-semibold mb-1">{copy.cashTitle}</h3>
                <p className="text-xs text-white/60 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor
                </p>
                <div className="text-2xl lg:text-3xl font-bold mb-4">
                  1 mln so'm <span className="text-sm font-normal text-white/60">{copy.perSquareMeter}</span>
                </div>
                <Button variant="secondary" size="sm" className="w-full bg-white text-primary hover:bg-white/90 mb-5 h-9">
                  {copy.details}
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
                <h3 className="text-base font-semibold mb-1">{copy.installmentTitle}</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor
                </p>
                <div className="text-2xl lg:text-3xl font-bold text-primary mb-4">
                  2 mln so'm <span className="text-sm font-normal text-muted-foreground">{copy.perSquareMeter}</span>
                </div>
                <div className="mb-5">
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-gray-50">
                    <option>{copy.installmentPlaceholder}</option>
                    {copy.installmentOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
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
              {copy.faqItems.map((item, idx) => (
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
                  {copy.contactLead}
                </p>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm">{address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="text-sm">{settings?.contact.phone || "+998 90 070 09 98"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-sm">{settings?.contact.email || "info@emanriverside.uz"}</span>
                  </div>
                </div>

                {/* Map */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200">
                  <Image
                    src="/images/hero/1.png"
                    alt={copy.mapAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Right - Contact Form */}
              <div>
                <h3 className="text-xl font-serif mb-1 uppercase">
                  {copy.formTitle}
                </h3>
                <p className="text-xs text-muted-foreground mb-5">
                  {copy.formDescription}
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <Input
                    type="text"
                    placeholder={copy.namePlaceholder}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-white border-gray-200 h-10"
                  />
                  <PhoneNumberInput
                    value={formData.phone}
                    onChange={(value) => setFormData({ ...formData, phone: value })}
                    placeholder={copy.phonePlaceholder}
                    required
                    className="bg-white border border-gray-200 rounded-md h-10 px-3"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white h-10"
                  >
                    {copy.submit}
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
                  src="/logo horizontal green 1.svg"
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
                    {copy.aboutHeading}
                  </h4>
                  <ul className="space-y-2">
                    {copy.footerLinks.about.map((link, idx) => (
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
                    {copy.buyersHeading}
                  </h4>
                  <ul className="space-y-2">
                    {copy.footerLinks.buyers.map((link, idx) => (
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
