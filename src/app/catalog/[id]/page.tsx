"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Header, Footer } from "@/components/sections";
import { PageHero, RequestModal } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Home, Maximize, Building2, Calendar, Layers, BadgeCheck, DollarSign, Ruler, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { useEstate } from "@/hooks/useEstates";
import { Estate, EstateImage } from "@/lib/api/estates";
import { useLanguage } from "@/contexts/LanguageContext";

// Default contact info when API doesn't provide it
const DEFAULT_PHONE = "+998 78 777 77 77";
const DEFAULT_EMAIL = "info@eman.uz";
const DEFAULT_ADDRESS = "Toshkent sh., Yashnobod tumani, Qadriyat MFY";

// Helper to generate apartment info categories from API data
const getApartmentCategories = (apartment: Estate | null, t: ReturnType<typeof useLanguage>["t"]) => {
  if (!apartment) return [];

  return [
    {
      id: "details",
      title: t.catalogDetail.characteristics,
      items: [
        apartment.estate_rooms ? `${t.catalogDetail.roomsCount}: ${apartment.estate_rooms}` : null,
        apartment.estate_area ? `${t.catalogDetail.areaLabel}: ${apartment.estate_area} м²` : null,
        apartment.estate_floor ? `${t.catalogDetail.floorLabel}: ${apartment.estate_floor}${apartment.estate_floors_in_house ? ` ${t.catalogDetail.floorOf} ${apartment.estate_floors_in_house}` : ''}` : null,
        apartment.estate_price_human ? `${t.catalogDetail.priceLabel}: ${apartment.estate_price_human}` : null,
      ].filter(Boolean) as string[],
    },
    {
      id: "location",
      title: t.catalogDetail.locationTitle,
      items: [
        apartment.address || DEFAULT_ADDRESS,
        `${t.catalogDetail.developer}: ${apartment.company_name || "Eman Development"}`,
        apartment.estate_inServiceDate_human ? `${t.catalogDetail.deliveryDate}: ${apartment.estate_inServiceDate_human}` : null,
      ].filter(Boolean) as string[],
    },
    {
      id: "status",
      title: t.catalogDetail.statusTitle,
      items: [
        apartment.status_name || null,
        apartment.category_name || null,
        apartment.is_hot ? t.catalogDetail.hotOffer : null,
      ].filter(Boolean) as string[],
    },
  ].filter(cat => cat.items.length > 0);
};

// Helper to get apartment advantages from API data
const getApartmentAdvantages = (apartment: Estate | null, t: ReturnType<typeof useLanguage>["t"]): string[] => {
  if (!apartment) return [];

  const advantages: string[] = [];

  if (apartment.estate_rooms) {
    advantages.push(`${apartment.estate_rooms}${t.catalogDetail.roomApartment}`);
  }
  if (apartment.estate_area) {
    advantages.push(`${t.catalogDetail.areaLabel} ${apartment.estate_area} м²`);
  }
  if (apartment.estate_floor && apartment.estate_floors_in_house) {
    advantages.push(`${apartment.estate_floor} ${t.catalogDetail.floorOfFloors} ${apartment.estate_floors_in_house}`);
  }
  if (apartment.estate_price_human) {
    advantages.push(`${t.catalogDetail.priceLabel}: ${apartment.estate_price_human}`);
  }
  if (apartment.status_name) {
    advantages.push(apartment.status_name);
  }
  if (apartment.company_name) {
    advantages.push(apartment.company_name);
  }

  return advantages;
};

// Default fallback images
const defaultGalleryImages = [
  "/images/hero/1.png",
  "/images/hero/1.png",
  "/images/hero/1.png",
];

export default function ApartmentDetailPage() {
  const params = useParams();
  const apartmentId = Number(params.id);
  const { t } = useLanguage();

  // React Query with cache
  const { data: apartment, isLoading } = useEstate(apartmentId);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"plans" | "gallery">("plans");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string>("details");
  const [infrastructureIndex, setInfrastructureIndex] = useState(0);
  const [isGalleryLightboxOpen, setIsGalleryLightboxOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const getPlanImages = (): EstateImage[] => {
    if (!apartment?.images) return [];
    const planGroup = apartment.images.find(g => g.name === "Планировки");
    return planGroup?.images || [];
  };

  const getGalleryImages = (): EstateImage[] => {
    if (!apartment?.images) return [];
    const galleryGroup = apartment.images.find(g => g.name === "Галерея");
    return galleryGroup?.images || [];
  };

  const currentImages = activeTab === "plans" ? getPlanImages() : getGalleryImages();

  // Get all images for infrastructure gallery (combine all image groups)
  const getAllImages = (): string[] => {
    if (!apartment?.images || apartment.images.length === 0) {
      return defaultGalleryImages;
    }
    const allImages: string[] = [];
    apartment.images.forEach(group => {
      group.images.forEach(img => {
        if (img.file_url) {
          allImages.push(img.file_url);
        }
      });
    });
    return allImages.length > 0 ? allImages : defaultGalleryImages;
  };

  const infrastructureGallery = getAllImages();

  // Get hero image: prefer 3rd image from all images, fallback to first or title_image
  const getHeroImage = (): string => {
    if (apartment?.images) {
      const allImgs: string[] = [];
      apartment.images.forEach(group => {
        group.images.forEach(img => {
          if (img.file_url) allImgs.push(img.file_url);
        });
      });
      if (allImgs.length >= 3) return allImgs[2];
      if (allImgs.length > 0) return allImgs[0];
    }
    if (apartment?.title_image) return apartment.title_image;
    return "/images/hero/1.png";
  };

  const nextSlide = () => {
    if (currentImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % currentImages.length);
    }
  };

  const prevSlide = () => {
    if (currentImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
    }
  };

  const nextInfrastructure = () => {
    setInfrastructureIndex((prev) => (prev + 1) % infrastructureGallery.length);
  };

  const prevInfrastructure = () => {
    setInfrastructureIndex((prev) => (prev - 1 + infrastructureGallery.length) % infrastructureGallery.length);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price);
  };

  // Truncate title to max 2 commas
  const getShortTitle = (title: string | undefined): string => {
    if (!title) return t.catalogDetail.aboutApartment;
    const parts = title.split(",");
    if (parts.length <= 2) return title;
    return parts.slice(0, 2).join(",").trim();
  };

  // Skeleton Loading UI
  if (isLoading) {
    return (
      <>
        <Header />
        <main>
          {/* Hero Skeleton */}
          <div className="relative h-[300px] bg-gray-200 animate-pulse" />

          {/* Info Cards Skeleton */}
          <section className="py-10 bg-white">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="h-8 bg-gray-200 rounded w-64 mb-8 animate-pulse" />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-28 bg-gray-200 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          </section>

          {/* Infrastructure Skeleton */}
          <section className="py-12 bg-beige">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-72 animate-pulse" />
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
                <div className="lg:w-96 h-64 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  if (!apartment) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-beige flex flex-col items-center justify-center">
          <h1 className="text-2xl font-serif mb-4">{t.catalogDetail.apartmentNotFound}</h1>
          <Link href="/catalog">
            <Button>{t.catalogDetail.backToCatalog}</Button>
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <PageHero
          title={t.catalogDetail.locationInfrastructure}
          subtitle={t.catalogDetail.infrastructureSubtitle}
          image={getHeroImage()}
        />

        {/* Info + CTA Two Column Layout */}
        <section className="py-12 lg:py-16 bg-beige">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Left - Title and Accordion */}
              <div className="lg:flex-1">
                <h2 className="text-2xl lg:text-3xl font-semibold uppercase tracking-wide mb-8">
                  {getShortTitle(apartment.title)}
                </h2>

                {/* Accordion Categories */}
                <div className="space-y-0">
                  {getApartmentCategories(apartment, t).map((category) => (
                    <div key={category.id} className="border-b border-gray-300">
                      <button
                        onClick={() => setOpenCategory(openCategory === category.id ? "" : category.id)}
                        className="w-full py-4 flex items-center justify-between text-left group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm lg:text-base uppercase tracking-wide text-gray-700 group-hover:text-primary transition-colors">
                            {category.title}
                          </span>
                          <span className="text-xs text-primary align-super">{category.items.length}</span>
                        </div>
                      </button>

                      {openCategory === category.id && category.items.length > 0 && (
                        <div className="pb-6 pl-4">
                          <div className="flex flex-col gap-2">
                            {category.items.map((item, itemIdx) => (
                              <p key={itemIdx} className="text-sm text-gray-600">{item}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - CTA Contact Card */}
              <div className="lg:w-80 shrink-0">
                <div className="bg-primary rounded-xl p-6 lg:sticky lg:top-24">
                  <h3 className="text-lg font-serif text-white mb-1">
                    {t.catalogDetail.leaveRequest}
                  </h3>
                  <p className="text-xs text-white/60 mb-5">
                    {t.catalogDetail.leaveRequestDesc}
                  </p>
                  <div className="flex flex-col gap-3">
                    <Button
                      className="w-full bg-white text-primary hover:bg-gray-100 font-medium"
                      onClick={() => setIsRequestModalOpen(true)}
                    >
                      {t.catalogDetail.leaveRequest}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                      className="w-full bg-white/20 text-white border border-white/40 hover:bg-white/30 font-medium"
                      asChild
                    >
                      <a href={`tel:${DEFAULT_PHONE.replace(/\s/g, "")}`}>
                        <Phone className="w-4 h-4 mr-2" />
                        {t.catalogDetail.callUs}
                      </a>
                    </Button>
                  </div>

                  {/* Contact details */}
                  <div className="mt-5 pt-5 border-t border-white/20 space-y-3">
                    <a href={`tel:${DEFAULT_PHONE.replace(/\s/g, "")}`} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-xs">{DEFAULT_PHONE}</span>
                    </a>
                    <a href={`mailto:${DEFAULT_EMAIL}`} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-xs">{DEFAULT_EMAIL}</span>
                    </a>
                    <div className="flex items-center gap-2 text-white/80">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-xs">{apartment.address || DEFAULT_ADDRESS}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Infrastructure Gallery - moved up */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl lg:text-2xl font-serif">{t.catalogDetail.infrastructureGallery}</h2>
              <div className="flex gap-2">
                <button
                  onClick={prevInfrastructure}
                  className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextInfrastructure}
                  className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          {/* Full-width Gallery */}
          <div className="relative w-full h-[300px] lg:h-[500px] overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out h-full"
              style={{ transform: `translateX(-${infrastructureIndex * 100}%)` }}
            >
              {infrastructureGallery.map((img, idx) => (
                <div key={idx} className="shrink-0 w-full h-full">
                  <div
                    className="relative w-full h-full cursor-pointer"
                    onClick={() => {
                      setInfrastructureIndex(idx);
                      setIsGalleryLightboxOpen(true);
                    }}
                  >
                    <Image
                      src={img}
                      alt={`Инфраструктура ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Apartment Key Info */}
        <section className="py-10 lg:py-14 bg-beige">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-2xl lg:text-3xl font-serif italic text-primary mb-2">
              {getShortTitle(apartment.title)}
            </h2>
            {apartment.description && (
              <p className="text-gray-600 mb-8 max-w-2xl">{apartment.description}</p>
            )}

            {/* Info Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
              {apartment.estate_rooms > 0 && (
                <div className="bg-beige rounded-xl p-4 lg:p-6 flex flex-col gap-2">
                  <Home className="w-5 h-5 text-primary" />
                  <span className="text-xs text-gray-500 uppercase tracking-wide">{t.catalogDetail.roomsCount}</span>
                  <span className="text-xl lg:text-2xl font-semibold">{apartment.estate_rooms}</span>
                </div>
              )}
              {apartment.estate_area > 0 && (
                <div className="bg-beige rounded-xl p-4 lg:p-6 flex flex-col gap-2">
                  <Maximize className="w-5 h-5 text-primary" />
                  <span className="text-xs text-gray-500 uppercase tracking-wide">{t.catalogDetail.areaLabel}</span>
                  <span className="text-xl lg:text-2xl font-semibold">{apartment.estate_area} <span className="text-sm font-normal text-gray-500">m²</span></span>
                </div>
              )}
              {apartment.estate_floor > 0 && (
                <div className="bg-beige rounded-xl p-4 lg:p-6 flex flex-col gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span className="text-xs text-gray-500 uppercase tracking-wide">{t.catalogDetail.floorLabel}</span>
                  <span className="text-xl lg:text-2xl font-semibold">
                    {apartment.estate_floor}
                    {apartment.estate_floors_in_house ? <span className="text-sm font-normal text-gray-500"> / {apartment.estate_floors_in_house}</span> : null}
                  </span>
                </div>
              )}
              {apartment.estate_price > 0 && (
                <div className="bg-beige rounded-xl p-4 lg:p-6 flex flex-col gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="text-xs text-gray-500 uppercase tracking-wide">{t.catalogDetail.priceLabel}</span>
                  <span className="text-lg lg:text-xl font-semibold">{apartment.estate_price_human || formatPrice(apartment.estate_price)}</span>
                </div>
              )}
            </div>

            {/* Additional Info Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 mt-3 lg:mt-5">
              {apartment.estate_price_m2 > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 lg:p-6 flex flex-col gap-2">
                  <Ruler className="w-5 h-5 text-primary" />
                  <span className="text-xs text-gray-500 uppercase tracking-wide">{t.catalogDetail.pricePerM2}</span>
                  <span className="text-lg font-semibold">{formatPrice(apartment.estate_price_m2)} <span className="text-sm font-normal text-gray-500">/ m²</span></span>
                </div>
              )}
              {apartment.status_name && (
                <div className="bg-gray-50 rounded-xl p-4 lg:p-6 flex flex-col gap-2">
                  <BadgeCheck className="w-5 h-5 text-primary" />
                  <span className="text-xs text-gray-500 uppercase tracking-wide">{t.catalogDetail.statusTitle}</span>
                  <span className="text-lg font-semibold">{apartment.status_name}</span>
                </div>
              )}
              {apartment.category_name && (
                <div className="bg-gray-50 rounded-xl p-4 lg:p-6 flex flex-col gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  <span className="text-xs text-gray-500 uppercase tracking-wide">{t.catalogDetail.categoryLabel}</span>
                  <span className="text-lg font-semibold">{apartment.category_name}</span>
                </div>
              )}
              {apartment.estate_inServiceDate_human && (
                <div className="bg-gray-50 rounded-xl p-4 lg:p-6 flex flex-col gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="text-xs text-gray-500 uppercase tracking-wide">{t.catalogDetail.deliveryDate}</span>
                  <span className="text-lg font-semibold">{apartment.estate_inServiceDate_human}</span>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-5 mt-3 lg:mt-5">
              <a href={`tel:${DEFAULT_PHONE.replace(/\s/g, "")}`} className="bg-primary/5 border border-primary/20 rounded-xl p-4 lg:p-6 flex items-center gap-3 hover:bg-primary/10 transition-colors">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide block">{t.catalogDetail.phoneLabel}</span>
                  <span className="text-sm font-semibold">{DEFAULT_PHONE}</span>
                </div>
              </a>
              <a href={`mailto:${DEFAULT_EMAIL}`} className="bg-primary/5 border border-primary/20 rounded-xl p-4 lg:p-6 flex items-center gap-3 hover:bg-primary/10 transition-colors">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide block">Email</span>
                  <span className="text-sm font-semibold">{DEFAULT_EMAIL}</span>
                </div>
              </a>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 lg:p-6 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide block">{t.catalogDetail.addressLabel}</span>
                  <span className="text-sm font-semibold">{apartment.address || DEFAULT_ADDRESS}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advantages Section */}
        <section className="bg-primary text-white py-10 lg:py-14">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-xl lg:text-2xl font-serif mb-6">{t.catalogDetail.apartmentFeatures}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {getApartmentAdvantages(apartment, t).map((advantage, idx) => (
                <div key={idx} className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm lg:text-base text-white/90">{advantage}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 lg:py-16 bg-beige">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="relative w-full h-[300px] lg:h-[450px] rounded-lg overflow-hidden">
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
        </section>

        {/* Back to Catalog */}
        <section className="py-12 bg-beige">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-2xl lg:text-3xl font-serif mb-4">
              {t.catalogDetail.viewOtherApartments}
            </h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              {t.catalogDetail.findIdealApartment}
            </p>
            <Button asChild>
              <Link href="/catalog">
                {t.catalogDetail.allApartments}
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Lightbox for currentImages (plans/gallery tabs) */}
      {isLightboxOpen && currentImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); }}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
          >
            &times;
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
          <div className="relative w-full max-w-5xl h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={currentImages[currentImageIndex]?.file_url || ""}
              alt={currentImages[currentImageIndex]?.file_name || ""}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {currentImageIndex + 1} / {currentImages.length}
          </div>
        </div>
      )}

      {/* Lightbox for infrastructure gallery */}
      {isGalleryLightboxOpen && infrastructureGallery.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setIsGalleryLightboxOpen(false)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setIsGalleryLightboxOpen(false); }}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"
          >
            &times;
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prevInfrastructure(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextInfrastructure(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
          <div className="relative w-full max-w-5xl h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={infrastructureGallery[infrastructureIndex]}
              alt={`Инфраструктура ${infrastructureIndex + 1}`}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {infrastructureIndex + 1} / {infrastructureGallery.length}
          </div>
        </div>
      )}
      <RequestModal
        open={isRequestModalOpen}
        onOpenChange={setIsRequestModalOpen}
        source="catalog_detail"
        estateId={apartment?.id}
      />
      <Footer />
    </>
  );
}
