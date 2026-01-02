"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header, Footer } from "@/components/sections";
import { PageHero } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Check, Plus, Minus } from "lucide-react";

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

// Purchase steps with icons
const purchaseSteps = [
  {
    icon: "building",
    title: "Процесс Покупки 1",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer.",
  },
  {
    icon: "grid",
    title: "Процесс Покупки 2",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer.",
  },
  {
    icon: "document",
    title: "Процесс Покупки 3",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer.",
  },
];

// Payment options
const paymentOptions = [
  {
    title: "Ипотека",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer.",
    price: "1 млн сум",
    priceNote: "в Месяц.",
    color: "primary",
    buttonText: "Узнать подробнее",
    buttonFilled: true,
    features: [
      "Lorem ipsum dolor sit amet,",
      "Lorem ipsum dolor sit amet,",
      "Lorem ipsum dolor sit amet,",
      "Lorem ipsum dolor sit amet,",
      "Lorem ipsum dolor sit amet,",
      "Lorem ipsum dolor sit amet,",
      "Lorem ipsum dolor sit amet,",
      "Lorem ipsum dolor sit amet,",
    ],
  },
  {
    title: "Рассрочка",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer.",
    price: "2 млн сум",
    priceNote: "в Месяц.",
    color: "white",
    buttonText: "Узнать подробнее",
    buttonFilled: false,
    features: [
      "Lorem ipsum dolor sit amet,",
      "Lorem ipsum dolor sit amet,",
      "Lorem ipsum dolor sit amet,",
      "Lorem ipsum dolor sit amet,",
      "Lorem ipsum dolor sit amet,",
      "Lorem ipsum dolor sit amet,",
      "Lorem ipsum dolor sit amet,",
      "Lorem ipsum dolor sit amet,",
    ],
  },
];

// FAQ items
const faqItems = [
  {
    question: "Вопрос 1",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer.",
  },
  { question: "Вопрос 2", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { question: "Вопрос 3", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { question: "Вопрос 4", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { question: "Вопрос 5", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
];

export default function ApartmentRequestPage() {
  const params = useParams();
  const apartmentId = Number(params.id);
  const apartment = apartments.find((a) => a.id === apartmentId);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-serif mb-4">Ваша заявка принята!</h2>
                <p className="text-gray-600 mb-8">
                  Наш менеджер свяжется с вами в ближайшее время для уточнения деталей по квартире &quot;{apartment.name}&quot;
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
          title="Схема покупки"
          subtitle="СХЕМА ПОКУПКИ КВАРТИРЫ EMAN RIVERSIDE"
          image="/images/hero/1.png"
        />

        {/* Purchase Steps */}
        <section className="relative py-16 lg:py-24 bg-[#F5ECE4] overflow-hidden">
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
            <div className="grid md:grid-cols-3 gap-8 lg:gap-16 relative">
              {purchaseSteps.map((step, idx) => (
                <div key={idx} className="text-center relative">
                  {/* Icon */}
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-6">
                    {step.icon === "building" && (
                      <svg className="w-8 h-8 lg:w-10 lg:h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    )}
                    {step.icon === "grid" && (
                      <svg className="w-8 h-8 lg:w-10 lg:h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    )}
                    {step.icon === "document" && (
                      <svg className="w-8 h-8 lg:w-10 lg:h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">{step.description}</p>
                </div>
              ))}

              {/* First curved arrow - between step 1 and 2 */}
              <div className="hidden md:block absolute top-6 lg:top-8 left-[22%] w-[22%] pointer-events-none">
                <Image
                  src="/images/catalog/Arc 1.svg"
                  alt=""
                  width={340}
                  height={30}
                  className="w-full h-auto"
                />
              </div>

              {/* Second curved arrow - between step 2 and 3 */}
              <div className="hidden md:block absolute top-6 lg:top-8 right-[22%] w-[22%] pointer-events-none">
                <Image
                  src="/images/catalog/Arc 2.svg"
                  alt=""
                  width={340}
                  height={30}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Payment Conditions */}
        <section className="relative py-16 lg:py-24 bg-[#F5ECE4] overflow-hidden">
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
            <h2 className="text-2xl lg:text-3xl font-serif text-center mb-12">Условия:</h2>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {paymentOptions.map((option, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-8 ${
                    option.color === "primary" ? "bg-primary text-white" : "bg-white border border-gray-200"
                  }`}
                >
                  {/* Title and Description */}
                  <div className="mb-6">
                    <h3 className={`font-semibold text-lg mb-2 ${option.color === "primary" ? "text-yellow-300" : "text-yellow-600"}`}>
                      {option.title}
                    </h3>
                    <p className={`text-xs leading-relaxed ${option.color === "primary" ? "text-white/70" : "text-gray-500"}`}>
                      {option.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-3xl lg:text-4xl font-bold">{option.price}</span>
                    <span className={`text-sm ml-2 ${option.color === "primary" ? "text-white/70" : "text-gray-500"}`}>
                      {option.priceNote}
                    </span>
                  </div>

                  {/* Button */}
                  <button
                    className={`w-full py-3 px-4 rounded-lg text-sm font-medium mb-6 transition-colors ${
                      option.buttonFilled
                        ? "bg-white text-primary hover:bg-gray-100"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {option.buttonText}
                  </button>

                  {/* Features */}
                  <ul className="space-y-3">
                    {option.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-sm">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          option.color === "primary" ? "bg-white/20" : "bg-primary/10"
                        }`}>
                          <Check className={`w-3 h-3 ${option.color === "primary" ? "text-white" : "text-primary"}`} />
                        </div>
                        <span className={option.color === "primary" ? "text-white/90" : "text-gray-600"}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-24 bg-[#F5ECE4]">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-2xl lg:text-3xl font-serif text-center mb-12">FAQ</h2>

            <div className="flex flex-col md:flex-row gap-4 max-w-5xl mx-auto">
              {/* Left column */}
              <div className="flex-1 flex flex-col gap-4">
                {faqItems.filter((_, idx) => idx % 2 === 0).map((item) => {
                  const idx = faqItems.indexOf(item);
                  return (
                    <div
                      key={idx}
                      className={`bg-white rounded-2xl transition-all shadow-sm ${
                        openFaq === idx ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full p-5 flex items-start gap-4 text-left"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          openFaq === idx ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                        }`}>
                          {openFaq === idx ? (
                            <Minus className="w-4 h-4" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 pt-1">
                          <span className="font-medium text-gray-900">{item.question}</span>
                          {openFaq === idx && (
                            <p className="text-sm text-gray-500 mt-4 leading-relaxed">{item.answer}</p>
                          )}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
              {/* Right column */}
              <div className="flex-1 flex flex-col gap-4">
                {faqItems.filter((_, idx) => idx % 2 === 1).map((item) => {
                  const idx = faqItems.indexOf(item);
                  return (
                    <div
                      key={idx}
                      className={`bg-white rounded-2xl transition-all shadow-sm ${
                        openFaq === idx ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full p-5 flex items-start gap-4 text-left"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          openFaq === idx ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                        }`}>
                          {openFaq === idx ? (
                            <Minus className="w-4 h-4" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 pt-1">
                          <span className="font-medium text-gray-900">{item.question}</span>
                          {openFaq === idx && (
                            <p className="text-sm text-gray-500 mt-4 leading-relaxed">{item.answer}</p>
                          )}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 lg:py-24 bg-[#F5ECE4]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Left - Contact Info & Map */}
              <div>
                <p className="text-xs text-gray-500 mb-6 uppercase tracking-wide leading-relaxed">
                  ВОПРОСЫ, КОММЕНТАРИИ ИЛИ ПРЕДЛОЖЕНИЯ?<br />
                  ПРОСТО ЗАПОЛНИТЕ ФОРМУ, И МЫ СКОРО С ВАМИ СВЯЖЕМСЯ.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm text-gray-700 underline">Город Ташкент, Улица Богича, Дом №1</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="text-sm text-gray-700 underline">+998 99 999-99-99</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-sm text-gray-700 underline">Emanriverside@gmail.com</span>
                  </div>
                </div>

                {/* Map */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted shadow-lg">
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

              {/* Right - Contact Form */}
              <div>
                <h3 className="text-2xl lg:text-3xl font-serif mb-2">
                  НАЙДИТЕ СЕБЕ КВАРТИРУ МЕЧТЫ!
                </h3>
                <p className="text-xs text-gray-500 mb-8 uppercase tracking-wide">
                  ЗАПОЛНИТЕ ФОРМУ И НАШИ МЕНЕДЖЕРЫ СВЯЖУТСЯ С ВАМИ
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="text"
                        placeholder="ИМЯ"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-transparent border-0 border-b border-gray-300 rounded-none px-0 h-12 placeholder:text-gray-400 placeholder:text-xs focus-visible:ring-0 focus-visible:border-primary"
                      />
                    </div>
                    <div>
                      <Input
                        type="tel"
                        placeholder="НОМЕР ТЕЛЕФОНА"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="bg-transparent border-0 border-b border-gray-300 rounded-none px-0 h-12 placeholder:text-gray-400 placeholder:text-xs focus-visible:ring-0 focus-visible:border-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <Textarea
                      placeholder="КОММЕНТАРИИ"
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      className="bg-transparent border-0 border-b border-gray-300 rounded-none px-0 min-h-[80px] placeholder:text-gray-400 placeholder:text-xs focus-visible:ring-0 focus-visible:border-primary resize-none"
                    />
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="text-sm font-medium text-gray-900 underline underline-offset-4 hover:text-primary transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? "ОТПРАВКА..." : "ОТПРАВИТЬ"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
