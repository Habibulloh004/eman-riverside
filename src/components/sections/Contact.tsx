"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Form submission logic here
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    alert(t.contactSection.successMessage);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="py-16 lg:py-24 bg-[#F9EFE7]">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-px bg-primary" />
            <span className="text-xs text-primary font-medium uppercase tracking-[0.2em]">
              {t.contactSection.label}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-primary">
            {t.contactSection.title}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Side - Contact Info */}
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-8">
              {t.contactSection.description}
            </p>

            {/* Contact Details */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground">{t.contactSection.address}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <a href="tel:+998909999999" className="text-foreground hover:text-primary transition-colors">
                  +998 90 999-99-99
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <a href="mailto:Emanriverside@gmail.com" className="text-foreground hover:text-primary transition-colors">
                  Emanriverside@gmail.com
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              {/* Grayscale Map iframe - Tashkent center */}
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

          {/* Right Side - Form */}
          <div>
            <h3 className="text-2xl lg:text-3xl font-serif mb-2">
              {t.contactSection.findApartment}<br />{t.contactSection.dream}
            </h3>
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-8">
              {t.contactSection.formDesc}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  name="name"
                  type="text"
                  placeholder={t.contactSection.name}
                  required
                  className="w-full px-0 py-3 text-sm bg-transparent border-b border-border placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <input
                  name="phone"
                  type="tel"
                  placeholder={t.contactSection.phone}
                  required
                  className="w-full px-0 py-3 text-sm bg-transparent border-b border-border placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <textarea
                  name="comment"
                  placeholder={t.contactSection.comments}
                  rows={3}
                  className="w-full px-0 py-3 text-sm bg-transparent border-b border-border placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-sm font-medium text-foreground border-b-2 border-primary pb-1 hover:text-primary transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? t.contactSection.sending : t.contactSection.send}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
