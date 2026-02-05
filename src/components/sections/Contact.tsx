"use client";

import { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { YandexMap } from "@/components/shared";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/contexts/SettingsContext";
import { submissionsApi } from "@/lib/api/submissions";
import { toast } from "sonner";

export default function Contact() {
  const { t, language } = useLanguage();
  const { settings } = useSiteSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  // Get address based on current language
  const address = language === "uz" ? settings.contact.address_uz : settings.contact.address;
  const phoneHref = `tel:${settings.contact.phone.replace(/\s/g, "")}`;
  const emailHref = `mailto:${settings.contact.email}`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submissionsApi.create({
        name: formData.name,
        phone: formData.phone,
        message: formData.message,
        source: "home_page",
      });
      toast.success(t.contactSection.successMessage);
      setFormData({ name: "", phone: "", message: "" });
    } catch (error) {
      console.error("Failed to submit:", error);
      toast.error("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
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
                <span className="text-foreground">{address || t.contactSection.address}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <a href={phoneHref} className="text-foreground hover:text-primary transition-colors">
                  {settings.contact.phone}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <a href={emailHref} className="text-foreground hover:text-primary transition-colors">
                  {settings.contact.email}
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <YandexMap className="absolute inset-0" />
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
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-0 py-3 text-sm bg-transparent border-b border-border placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <input
                  name="phone"
                  type="tel"
                  placeholder={t.contactSection.phone}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full px-0 py-3 text-sm bg-transparent border-b border-border placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <textarea
                  name="comment"
                  placeholder={t.contactSection.comments}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
