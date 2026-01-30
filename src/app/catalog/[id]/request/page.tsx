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
import { submissionsApi } from "@/lib/api/submissions";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/contexts/SettingsContext";

export default function ApartmentRequestPage() {
  const params = useParams();
  const apartmentId = Number(params.id);
  const { t, language } = useLanguage();
  const { settings } = useSiteSettings();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    comment: "",
  });
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Dynamic contact info from settings
  const address = language === "uz" ? settings.contact.address_uz : settings.contact.address;
  const phoneHref = `tel:${settings.contact.phone.replace(/\s/g, "")}`;
  const emailHref = `mailto:${settings.contact.email}`;

  // Dynamic data based on translations
  const purchaseSteps = [
    {
      icon: "building",
      title: t.request.purchaseStep1Title,
      description: t.request.purchaseStep1Desc,
    },
    {
      icon: "grid",
      title: t.request.purchaseStep2Title,
      description: t.request.purchaseStep2Desc,
    },
    {
      icon: "document",
      title: t.request.purchaseStep3Title,
      description: t.request.purchaseStep3Desc,
    },
  ];

  // Dynamic payment plans from settings
  const paymentPlans = language === "uz" ? settings.payment_plans_uz : settings.payment_plans;
  const paymentOptions = paymentPlans.length > 0
    ? paymentPlans.map((plan, idx) => ({
        title: plan.title,
        description: plan.description,
        price: plan.price,
        priceNote: plan.period,
        color: idx === 0 ? "primary" : "white",
        buttonText: t.request.learnMore,
        buttonFilled: idx === 0,
        features: plan.features,
      }))
    : [
        {
          title: t.request.mortgage,
          description: t.request.mortgageDesc,
          price: language === "uz" ? "1 mln so'm" : "1 млн сум",
          priceNote: t.request.perMonth,
          color: "primary",
          buttonText: t.request.learnMore,
          buttonFilled: true,
          features: [
            language === "uz" ? "Boshlang'ich to'lov 30% dan" : "Первоначальный взнос от 30%",
            language === "uz" ? "Muddat 36 oygacha" : "Срок до 36 месяцев",
            language === "uz" ? "Foizsiz" : "Без процентов",
          ],
        },
        {
          title: t.request.installment,
          description: t.request.installmentDesc,
          price: language === "uz" ? "2 mln so'm" : "2 млн сум",
          priceNote: t.request.perMonth,
          color: "white",
          buttonText: t.request.learnMore,
          buttonFilled: false,
          features: [
            language === "uz" ? "Boshlang'ich to'lov 20% dan" : "Первоначальный взнос от 20%",
            language === "uz" ? "Muddat 24 oygacha" : "Срок до 24 месяцев",
            language === "uz" ? "5% chegirma" : "Скидка 5%",
          ],
        },
      ];

  // Dynamic FAQ from settings
  const faqData = language === "uz" ? settings.faq_items_uz : settings.faq_items;
  const faqItems = faqData.length > 0
    ? faqData
    : [
        { question: t.request.question1, answer: t.request.answer1 },
        { question: t.request.question2, answer: t.request.answer2 },
        { question: t.request.question3, answer: t.request.answer3 },
        { question: t.request.question4, answer: t.request.answer4 },
        { question: t.request.question5, answer: t.request.answer5 },
      ];

  // Get selected plan title for submission
  const getSelectedPlanTitle = () => {
    if (selectedPlan === null) return "";
    return paymentOptions[selectedPlan]?.title || "";
  };

  const handleSelectPlan = (idx: number) => {
    setSelectedPlan(idx);
    // Scroll to form section
    document.getElementById("contact-form-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedPlanTitle = getSelectedPlanTitle();
    const messageText = formData.comment
      ? formData.comment
      : `${language === "uz" ? "Kvartira ID" : "Квартира ID"}: ${apartmentId}`;

    try {
      await submissionsApi.create({
        name: formData.name,
        phone: formData.phone,
        message: messageText,
        source: "catalog_request",
        estate_id: apartmentId,
        payment_plan: selectedPlanTitle,
      });
      setIsSuccess(true);
    } catch (error) {
      console.error("Failed to submit:", error);
      alert(t.request.submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <>
        <Header />
        <main>
          <PageHero
            title={t.request.successTitle}
            subtitle={t.request.successSubtitle}
            image="/images/hero/1.png"
          />
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-md mx-auto text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-serif mb-4">{t.request.successMessage}</h2>
                <p className="text-gray-600 mb-8">
                  {t.request.successDesc}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button asChild>
                    <Link href="/catalog">{t.request.toCatalog}</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/">{t.request.toHome}</Link>
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
          title={t.request.heroTitle}
          subtitle={t.request.heroSubtitle}
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
            <h2 className="text-2xl lg:text-3xl font-serif text-center mb-12">{t.request.conditions}</h2>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {paymentOptions.map((option, idx) => {
                const isSelected = selectedPlan === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-xl p-8 transition-all ${
                      isSelected
                        ? "ring-4 ring-green-500 ring-offset-2"
                        : ""
                    } ${
                      option.color === "primary" ? "bg-primary text-white" : "bg-white border border-gray-200"
                    }`}
                  >
                    {/* Selected badge */}
                    {isSelected && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <span className={`text-sm font-medium ${option.color === "primary" ? "text-green-300" : "text-green-600"}`}>
                          {language === "uz" ? "Tanlangan" : "Выбрано"}
                        </span>
                      </div>
                    )}

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

                    {/* Select Button */}
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(idx)}
                      className={`w-full py-3 px-4 rounded-lg text-sm font-medium mb-6 transition-colors ${
                        isSelected
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : option.buttonFilled
                            ? "bg-white text-primary hover:bg-gray-100"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {isSelected
                        ? (language === "uz" ? "Tanlangan" : "Выбрано")
                        : (language === "uz" ? "Tanlash" : "Выбрать")}
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
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-24 bg-[#F5ECE4]">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-2xl lg:text-3xl font-serif text-center mb-12">{t.request.faq}</h2>

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
        <section id="contact-form-section" className="py-16 lg:py-24 bg-[#F5ECE4]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Left - Contact Info & Map */}
              <div>
                <p className="text-xs text-gray-500 mb-6 uppercase tracking-wide leading-relaxed">
                  {t.request.formQuestions}<br />
                  {t.request.formFill}
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm text-gray-700 underline">{address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-primary" />
                    <a href={phoneHref} className="text-sm text-gray-700 underline hover:text-primary transition-colors">
                      {settings.contact.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-primary" />
                    <a href={emailHref} className="text-sm text-gray-700 underline hover:text-primary transition-colors">
                      {settings.contact.email}
                    </a>
                  </div>
                </div>

                {/* Map */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted shadow-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47980.98675893856!2d69.21992457431642!3d41.31147339999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sTashkent%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1703955000000!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: "grayscale(100%)" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  />
                </div>
              </div>

              {/* Right - Contact Form */}
              <div>
                <h3 className="text-2xl lg:text-3xl font-serif mb-2">
                  {t.request.formTitle}
                </h3>
                <p className="text-xs text-gray-500 mb-4 uppercase tracking-wide">
                  {t.request.formSubtitle}
                </p>

                {/* Selected info summary */}
                <div className="bg-white rounded-lg p-4 mb-6 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {language === "uz" ? "Kvartira ID:" : "ID квартиры:"}
                    </span>
                    <span className="font-medium text-gray-900">#{apartmentId}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {language === "uz" ? "To'lov rejasi:" : "План оплаты:"}
                    </span>
                    {selectedPlan !== null ? (
                      <span className="font-medium text-primary">
                        {paymentOptions[selectedPlan]?.title}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">
                        {language === "uz" ? "Tanlanmagan" : "Не выбран"}
                      </span>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="text"
                        placeholder={t.request.name}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-transparent border-0 border-b border-gray-300 rounded-none px-0 h-12 placeholder:text-gray-400 placeholder:text-xs focus-visible:ring-0 focus-visible:border-primary"
                      />
                    </div>
                    <div>
                      <Input
                        type="tel"
                        placeholder={t.request.phone}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="bg-transparent border-0 border-b border-gray-300 rounded-none px-0 h-12 placeholder:text-gray-400 placeholder:text-xs focus-visible:ring-0 focus-visible:border-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <Textarea
                      placeholder={t.request.comments}
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
                      {isSubmitting ? t.request.sending : t.request.send}
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
