"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Header, Footer } from "@/components/sections";
import { PageHero } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Phone, MapPin, Home, Maximize, Building2, Calendar } from "lucide-react";
import { useEstate } from "@/hooks/useEstates";
import { Estate, EstateImage } from "@/lib/api/estates";
import { useLanguage } from "@/contexts/LanguageContext";

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
        apartment.address || null,
        apartment.company_name ? `${t.catalogDetail.developer}: ${apartment.company_name}` : null,
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

  // Get hero image from apartment data
  const getHeroImage = (): string => {
    if (apartment?.title_image) {
      return apartment.title_image;
    }
    const galleryImages = getGalleryImages();
    if (galleryImages.length > 0) {
      return galleryImages[0].file_url;
    }
    return "/images/hero/1.png";
  };

  // Get side image for infrastructure section
  const getSideImage = (): string => {
    const galleryImages = getGalleryImages();
    if (galleryImages.length > 1) {
      return galleryImages[1].file_url;
    }
    if (apartment?.title_image) {
      return apartment.title_image;
    }
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

  // Skeleton Loading UI
  if (isLoading) {
    return (
      <>
        <Header />
        <main>
          {/* Hero Skeleton */}
          <div className="relative h-[300px] bg-gray-200 animate-pulse" />

          {/* Map Section Skeleton */}
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="h-8 bg-gray-200 rounded w-64 mb-4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-96 mb-8 animate-pulse" />
              <div className="h-[400px] bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </section>

          {/* Infrastructure Skeleton */}
          <section className="py-12 bg-beige">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex gap-12">
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-72 animate-pulse" />
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
                <div className="w-96 h-64 bg-gray-200 rounded-lg animate-pulse" />
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

        {/* Interactive Map Section */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-serif italic text-primary mb-2">
              {t.catalogDetail.interactiveMap}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md">
              {t.catalogDetail.mapDesc}
            </p>

            {/* Map */}
            <div className="relative w-full h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
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
              {/* Map Center Marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-16 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-primary">
                    <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 7L8 9.5V14.5L12 17L16 14.5V9.5L12 7Z" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Infrastructure Section */}
        <section className="py-12 lg:py-16 bg-beige">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-16">
              {/* Left - Title and Accordion */}
              <div className="lg:flex-1">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl lg:text-3xl font-semibold uppercase tracking-wide">
                    {apartment.title || t.catalogDetail.aboutApartment}
                  </h2>
                  <div className="flex items-center gap-2">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-primary">
                      <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 7L8 9.5V14.5L12 17L16 14.5V9.5L12 7Z" fill="currentColor" />
                    </svg>
                    <span className="text-lg font-semibold text-primary">EMAN<br/>RIVERSIDE</span>
                  </div>
                </div>

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

              {/* Right - Image */}
              <div className="lg:w-96">
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={getSideImage()}
                    alt="ЖК EMAN RIVERSIDE"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Infrastructure Gallery */}
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

        {/* Advantages & Map Section */}
        <section className="relative">
          <div className="flex flex-col lg:flex-row">
            {/* Left - Advantages */}
            <div className="lg:w-1/3 bg-primary text-white p-8 lg:p-12">
              <h2 className="text-xl lg:text-2xl font-serif mb-6">{t.catalogDetail.apartmentFeatures}</h2>
              <ul className="space-y-3">
                {getApartmentAdvantages(apartment, t).map((advantage, idx) => (
                  <li key={idx} className="text-sm lg:text-base text-white/90">
                    {advantage}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right - Map */}
            <div className="lg:w-2/3 relative h-[300px] lg:h-[400px]">
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
              {/* Map Marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary">
                    <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 7L8 9.5V14.5L12 17L16 14.5V9.5L12 7Z" fill="currentColor" />
                  </svg>
                </div>
              </div>
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
      <Footer />
    </>
  );
}
