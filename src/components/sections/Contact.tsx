"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, AtSign } from "lucide-react";
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
  const workingHours = language === "uz" ? settings.contact.working_hours_uz : settings.contact.working_hours;
  const phoneHref = `tel:${settings.contact.phone.replace(/\s/g, "")}`;
  const emailHref = `mailto:${settings.contact.email}`;
  const whatsappHref = `https://wa.me/${settings.social.whatsapp.replace(/\D/g, "")}`;

  // Dynamic social links — only show what admin has configured
  const socialLinks = [
    settings.social.whatsapp && {
      key: "whatsapp",
      href: whatsappHref,
      label: "WhatsApp",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
    },
    settings.social.telegram && {
      key: "telegram",
      href: settings.social.telegram,
      label: "Telegram",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
        </svg>
      ),
    },
    settings.social.instagram && {
      key: "instagram",
      href: settings.social.instagram,
      label: "Instagram",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
    },
    settings.social.facebook && {
      key: "facebook",
      href: settings.social.facebook,
      label: "Facebook",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    settings.social.youtube && {
      key: "youtube",
      href: settings.social.youtube,
      label: "YouTube",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    },
    settings.social.threads && {
      key: "threads",
      href: settings.social.threads,
      label: "Threads",
      icon: <AtSign className="w-4 h-4" />,
    },
  ].filter(Boolean) as { key: string; href: string; label: string; icon: React.ReactNode }[];

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
            <div className="space-y-4 mb-6">
              {address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground">{address}</span>
                </div>
              )}
              {settings.contact.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <a href={phoneHref} className="text-foreground hover:text-primary transition-colors">
                    {settings.contact.phone}
                  </a>
                </div>
              )}
              {settings.contact.email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <a href={emailHref} className="text-foreground hover:text-primary transition-colors">
                    {settings.contact.email}
                  </a>
                </div>
              )}
              {workingHours && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground">{workingHours}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {socialLinks.map((social) => (
                  <a
                    key={social.key}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-md border border-border text-sm text-foreground hover:text-primary hover:border-primary transition-colors"
                  >
                    {social.icon}
                    <span>{social.label}</span>
                  </a>
                ))}
              </div>
            )}

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
