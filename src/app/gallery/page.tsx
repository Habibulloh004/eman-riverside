"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Header, Footer } from "@/components/sections";
import { useLanguage } from "@/contexts/LanguageContext";
import { galleryApi, GalleryItem } from "@/lib/api/gallery";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";

// Default gallery items if API returns empty
const defaultGalleryItems = {
  ru: [
    { image: "/images/hero/1.png", title: "Фасад здания", description: "Современный дизайн фасада с использованием премиальных материалов" },
    { image: "/images/hero/1.png", title: "Входная группа", description: "Просторный холл с дизайнерской отделкой" },
    { image: "/images/hero/1.png", title: "Территория", description: "Благоустроенная территория с зонами отдыха" },
    { image: "/images/hero/1.png", title: "Детская площадка", description: "Безопасная игровая зона для детей" },
    { image: "/images/hero/1.png", title: "Паркинг", description: "Подземный паркинг с видеонаблюдением" },
  ],
  uz: [
    { image: "/images/hero/1.png", title: "Bino fasadi", description: "Premium materiallar bilan zamonaviy fasad dizayni" },
    { image: "/images/hero/1.png", title: "Kirish guruhi", description: "Dizayner pardozli keng zal" },
    { image: "/images/hero/1.png", title: "Hudud", description: "Dam olish zonalari bilan obodonlashtirilgan hudud" },
    { image: "/images/hero/1.png", title: "Bolalar maydoni", description: "Bolalar uchun xavfsiz o'yin zonasi" },
    { image: "/images/hero/1.png", title: "Avtoturargoh", description: "Videokuzatuvli yer osti avtoturargoh" },
  ],
};

export default function GalleryPage() {
  const { t, language } = useLanguage();
  const [galleryItems, setGalleryItems] = useState<
    Array<{ id: number | string; image: string; title: string; description: string; redirect_url?: string }>
  >([]);
  const [videoItems, setVideoItems] = useState<Array<{ url: string; thumbnail: string; title: string; redirect_url?: string }>>([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const renderVideoThumbnail = (item: { url: string; thumbnail: string; title: string; redirect_url?: string }) => {
    const thumbnailSrc = item.thumbnail || "/images/hero/1.png";

    return (
      <div className="relative">
        <HeroVideoDialog
          animationStyle="from-center"
          videoSrc={item.url}
          thumbnailSrc={thumbnailSrc}
          thumbnailAlt={item.title || t.gallery.videoTitle}
        />
        {item.redirect_url && (
          <a
            href={item.redirect_url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-4 top-4 z-20 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-primary shadow-lg backdrop-blur-sm transition-colors hover:bg-white"
          >
            {t.gallery.seeMore}
          </a>
        )}
      </div>
    );
  };

  useEffect(() => {
    const loadGallery = async () => {
      try {
        // Load images
        const imageData = await galleryApi.listPublic({ type: "image" });
        if (imageData.items && imageData.items.length > 0) {
          const items = imageData.items.map((item: GalleryItem) => ({
            id: item.id,
            image: item.url.startsWith("http") ? item.url : `${API_URL}${item.url}`,
            title: language === "uz" ? (item.title_uz || item.title) : item.title,
            description: language === "uz" ? (item.description_uz || item.description) : item.description,
            redirect_url: item.redirect_url,
          }));
          setGalleryItems(items);
        } else {
          const defaults = (language === "uz" ? defaultGalleryItems.uz : defaultGalleryItems.ru).map((item) => ({
            id: `${item.title}-${item.image}`,
            ...item,
          }));
          setGalleryItems(defaults);
        }

        // Load all videos
        const videoData = await galleryApi.listPublic({ type: "video" });
        if (videoData.items && videoData.items.length > 0) {
          const videos = videoData.items.map((video: GalleryItem) => ({
            url: video.url.startsWith("http") ? video.url : `${API_URL}${video.url}`,
            thumbnail: video.thumbnail ? (video.thumbnail.startsWith("http") ? video.thumbnail : `${API_URL}${video.thumbnail}`) : "",
            title: language === "uz" ? (video.title_uz || video.title) : video.title,
            redirect_url: video.redirect_url,
          }));
          setVideoItems(videos);
        }
      } catch (error) {
        console.error("Failed to load gallery:", error);
        const defaults = (language === "uz" ? defaultGalleryItems.uz : defaultGalleryItems.ru).map((item) => ({
          id: `${item.title}-${item.image}`,
          ...item,
        }));
        setGalleryItems(defaults);
      } finally {
        setIsLoading(false);
      }
    };

    loadGallery();
  }, [language]);

  return (
    <>
      <Header />
      <main className="pt-20 lg:pt-24 bg-[#F5ECE4]">
        {/* Hero Section */}
        <section className="relative bg-[#F5ECE4] overflow-hidden">
          <div className="relative h-screen max-h-[900px] max-w-[1920px] mx-auto">
            {/* Left side - Large Vertical text */}
            <div className="absolute left-6 lg:left-18 top-[40%] -translate-y-1/2 z-10">
              <span
                className="text-[#1a1a1a] text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-medium tracking-[0.2em] whitespace-nowrap"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                EMAN RIVERSIDE
              </span>
            </div>

            {/* Logo - positioned right of vertical text, near top */}
            <div className="absolute max-md:hidden left-24 sm:left-32 lg:left-44 top-28 lg:top-32 z-10">
              <Image
                src="/darklogo.png"
                alt="EMAN RIVERSIDE"
                width={120}
                height={60}
                className="h-10 lg:h-12 w-auto"
              />
            </div>

            {/* Main diagonal image - right side with diagonal left edge */}
            <div className="absolute top-0 right-0 w-[75%] lg:w-[70%] h-full">
              <Image
                src="/images/03.webp"
                alt="EMAN RIVERSIDE Building"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 75vw, 70vw"
              />
            </div>
          </div>
        </section>

        {/* Construction Progress Section */}
        <section className="relative py-12 lg:py-32 bg-[#F5ECE4] overflow-hidden">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Section title - Very large */}
            <h2 className="text-3xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif mb-8 lg:mb-24 leading-tight">
              {t.gallery.constructionTitle}<br />
              EMAN RIVERSIDE
            </h2>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
              {/* Left - Construction steps text (narrow) */}
              <div className="lg:col-span-3 space-y-6 lg:space-y-12">
                {/* First step */}
                <div className="relative">
                  <h3 className="text-base lg:text-lg font-medium mb-3 text-[#1a1a1a]">
                    {t.gallery.step1Title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
                    {t.gallery.step1Desc}
                  </p>
                </div>

                {/* Decorative Arc lines between steps */}
                <div className="hidden lg:block absolute top-[40%] left-1/5 py-4">
                  <Image
                    src="/images/galeryCrcle.svg"
                    alt=""
                    width={340}
                    height={30}
                    className="w-full max-w-[400px] opacity-70"
                  />
                </div>

                {/* Second step */}
                <div>
                  <h3 className="text-base lg:text-lg font-medium mb-3 text-[#1a1a1a]">
                    {t.gallery.step2Title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
                    {t.gallery.step2Desc}
                  </p>
                </div>
              </div>

              {/* Right - 3 overlapping tilted images */}
              <div className="lg:col-span-9 relative h-80 lg:h-150">
                {/* Image 1 - Left bottom, with green/primary border */}
                <div
                  className="absolute bottom-[25%] left-0 w-[45%] lg:w-[35%] z-30"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl">
                    <Image
                      src="/images/02.3.webp"
                      alt="Construction 1"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 45vw, 26vw"
                    />
                  </div>
                </div>

                {/* Image 2 - Center top */}
                <div
                  className="absolute top-0 left-[30%] lg:left-[25%] w-[45%] lg:w-[35%] z-20"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl">
                    <Image
                      src="/images/02.2.webp"
                      alt="Construction 2"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 45vw, 26vw"
                    />
                  </div>
                </div>

                {/* Image 3 - Right */}
                <div
                  className="absolute top-[-20%] right-0 lg:right-20 w-[45%] lg:w-[35%] z-30"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl">
                    <Image
                      src="/images/02.1.webp"
                      alt="Construction 3"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 45vw, 26vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section - Green background */}
        <section className="relative py-12 lg:py-24 bg-primary overflow-hidden">
          {/* Background text */}
          <div className="absolute inset-0 flex items-start justify-center pt-8 pointer-events-none">
            <span className="text-[80px] lg:text-[200px] font-serif text-white/5 whitespace-nowrap">
              {t.gallery.galleryTitle}
            </span>
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            {/* Section title */}
            <h2 className="text-2xl lg:text-4xl xl:text-5xl font-serif text-white text-center mb-8 lg:mb-16">
              {t.gallery.galleryTitle}
            </h2>

            {/* Gallery carousel */}
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : (
              <div>
                <div
                  className="flex gap-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4 lg:-mx-8 lg:px-8"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {galleryItems.map((item) => {
                    const tileClassName = "flex-shrink-0 w-[70%] sm:w-[45%] lg:w-[280px] snap-center flex flex-col";
                    const content = (
                      <>
                        <div className="relative aspect-[3/4] rounded-sm overflow-hidden mb-3 lg:mb-4">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 70vw, (max-width: 1024px) 45vw, 280px"
                          />
                        </div>
                        <h3 className="text-white text-sm font-medium mb-1 lg:mb-2 line-clamp-1">{item.title}</h3>
                        <div
                          className="text-white/60 text-xs leading-relaxed line-clamp-3 prose prose-invert prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        />
                      </>
                    );

                    if (item.redirect_url) {
                      return (
                        <a
                          key={item.id}
                          href={item.redirect_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${tileClassName} cursor-pointer hover:opacity-95 transition-opacity`}
                        >
                          {content}
                        </a>
                      );
                    }

                    return (
                      <div
                        key={item.id}
                        className={tileClassName}
                      >
                        {content}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Decorative ellipse */}
            <div className="flex justify-center mt-8 lg:mt-16">
              <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
                <ellipse cx="60" cy="20" rx="58" ry="18" stroke="white" strokeWidth="1" fill="none" opacity="0.3" />
              </svg>
            </div>
          </div>
        </section>

        {/* Interior & Exterior Section */}
        <section className="relative py-16 lg:py-24 bg-[#F5ECE4] overflow-hidden">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Interior part */}
            <div className="relative grid lg:grid-cols-12 gap-8 lg:gap-12 mb-20 lg:mb-32 items-start">
              {/* Left - Image with blob shape */}
              <div className="lg:col-span-4 relative pb-8">
                <div className="relative">
                  {/* Image with rounded corner */}
                  <div
                    className="relative w-full aspect-4/3 overflow-hidden z-10"
                    style={{ borderRadius: "0 0 396px 0" }}
                  >
                    <Image
                      src="/images/05.jpg"
                      alt={t.gallery.interiorTitle}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                  {/* Gray blob shape - behind and below image */}
                  <div
                    className="absolute -bottom-8 right-0 w-28 h-52 lg:w-36 lg:h-64 bg-[#B2A298] z-0"
                    style={{ rotate: "45deg", borderRadius: "50% 50% 50% 50% / 50% 50% 50% 50%" }}
                  />
                </div>
              </div>

              {/* Center - Content */}
              <div className="lg:col-span-4 flex flex-col justify-start pt-4">
                <div className="lg:pl-8 lg:pr-4">
                  <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif italic mb-6">
                    {t.gallery.interiorTitle}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {t.gallery.interiorDesc}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t.gallery.interiorDesc}
                  </p>
                </div>
              </div>

              {/* Right side image */}
              <div className="lg:col-span-4 relative h-72 lg:h-80">
                <div className="absolute inset-0 overflow-hidden"
                  style={{ borderRadius: "0 0 0 396px" }}

                >
                  <Image
                    src="/images/01.webp"
                    alt={t.gallery.interiorTitle}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
              </div>
            </div>

            {/* Exterior part */}
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left - Content */}
              <div className="lg:col-span-3">
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif mb-6">
                  {t.gallery.exteriorTitle}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t.gallery.exteriorDesc}
                </p>
              </div>

              {/* Right - Organic shaped images */}
              <div className="lg:col-span-9 relative h-80 lg:h-96">
                {/* Main organic/bean shape image */}
                <div
                  className="z-20 absolute left-[5%] top-[10%] w-[55%] lg:w-[50%] h-[85%] overflow-hidden"
                  style={{ rotate: "-45deg", borderRadius: "50% 50% 50% 50% / 50% 50% 50% 50%" }}
                >
                  <Image
                    src="/images/02.2.webp"
                    alt={t.gallery.exteriorTitle}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />

                </div>
                {/* Decorative red ellipse outline - wrapping around images */}
                <svg
                  className="z-10 absolute left-[0%] top-[10%] w-[55%] lg:w-[50%] h-[85%] overflow-hidden -rotate-45"
                  viewBox="0 0 320 260"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <ellipse cx="160" cy="130" rx="155" ry="125" stroke="#B91C1C" strokeWidth="1" fill="none" />
                </svg>
                <svg
                  className="rotate-45 absolute left-[20%] top-[20%] w-[55%] lg:w-[50%] h-[85%] overflow-hidden"
                  viewBox="0 0 320 260"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <ellipse cx="160" cy="130" rx="155" ry="125" stroke="#B91C1C" strokeWidth="1" fill="none" />
                </svg>
                {/* Small circular image - inside the ellipse */}
                <div className="rotate-45 absolute left-[50%] top-[60%] w-50 h-50 rounded-full overflow-hidden">
                  <Image
                    src="/images/04.webp"
                    alt={t.gallery.exteriorTitle}
                    fill
                    className="object-cover -rotate-45"
                    sizes="200px"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Section - Green background */}
        <section className="relative py-12 lg:py-16 bg-primary overflow-hidden">
          {/* Decorative curved line on left */}
          <svg
            className="absolute left-8 top-24 w-8 h-32 opacity-60 hidden lg:block"
            viewBox="0 0 30 100"
            fill="none"
          >
            <path
              d="M15,0 Q0,50 15,100"
              stroke="white"
              strokeWidth="1"
              fill="none"
            />
          </svg>

          <div className="container mx-auto px-4 lg:px-8">
            {/* Section title */}
            <h2 className="text-2xl lg:text-4xl xl:text-5xl font-serif text-white mb-6 lg:mb-8">
              {t.gallery.videoTitle}
            </h2>

            {/* Video carousel */}
            {videoItems.length > 0 ? (
              <div className="relative">
                {/* Single video or carousel */}
                {videoItems.length === 1 ? (
                  <div>
                    {renderVideoThumbnail(videoItems[0])}
                    {videoItems[0].title && (
                      <p className="text-white/80 text-sm lg:text-base mt-4 text-center">
                        {videoItems[0].title}
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Video carousel container */}
                    <div className="relative">
                      {renderVideoThumbnail(videoItems[activeVideoIndex])}
                    </div>
                    {/* Navigation arrows */}
                    <button
                      onClick={() => setActiveVideoIndex((prev) => (prev === 0 ? videoItems.length - 1 : prev - 1))}
                      className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
                    >
                      <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setActiveVideoIndex((prev) => (prev === videoItems.length - 1 ? 0 : prev + 1))}
                      className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
                    >
                      <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Dots indicator */}
                    <div className="flex justify-center gap-2 mt-4">
                      {videoItems.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveVideoIndex(idx)}
                          className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === activeVideoIndex ? "bg-white" : "bg-white/30 hover:bg-white/50"
                            }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src="/images/hero/1.png"
                  alt={t.gallery.videoTitle}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white/90 flex items-center justify-center">
                    <svg className="w-6 h-6 lg:w-8 lg:h-8 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
