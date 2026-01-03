"use client";

import Image from "next/image";
import { Header, Footer } from "@/components/sections";
import { useLanguage } from "@/contexts/LanguageContext";

export default function GalleryPage() {
  const { t } = useLanguage();

  // Gallery items with descriptions
  const galleryItems = [
    { image: "/images/hero/1.png", title: t.gallery.photo, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer." },
    { image: "/images/hero/1.png", title: t.gallery.photo, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer." },
    { image: "/images/hero/1.png", title: t.gallery.photo, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer." },
    { image: "/images/hero/1.png", title: t.gallery.photo, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer." },
    { image: "/images/hero/1.png", title: t.gallery.photo, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer." },
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-screen bg-[#F5ECE4] overflow-hidden">
          {/* Left side - Large Vertical text */}
          <div className="absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 z-10">
            <span
              className="text-[#1a1a1a] text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-[0.2em] whitespace-nowrap"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              EMAN RIVERSIDE
            </span>
          </div>

          {/* Logo - positioned right of vertical text, near top */}
          <div className="absolute left-24 sm:left-32 lg:left-44 top-28 lg:top-32 z-10">
            <Image
              src="/logo.svg"
              alt="EMAN RIVERSIDE"
              width={120}
              height={60}
              className="h-12 lg:h-14 w-auto"
            />
          </div>

          {/* Main diagonal image - right side with diagonal left edge */}
          <div
            className="absolute top-0 right-0 w-[75%] lg:w-[70%] h-full"
            style={{
              clipPath: "polygon(25% 0, 100% 0, 100% 100%, 0% 100%)"
            }}
          >
            <Image
              src="/images/hero/1.png"
              alt="EMAN RIVERSIDE Building"
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>

        {/* Construction Progress Section */}
        <section className="relative py-20 lg:py-32 bg-[#F5ECE4] overflow-hidden">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Section title - Very large */}
            <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif mb-16 lg:mb-24 leading-tight">
              {t.gallery.constructionTitle}<br />
              EMAN RIVERSIDE
            </h2>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
              {/* Left - Construction steps text (narrow) */}
              <div className="lg:col-span-3 space-y-8 lg:space-y-12">
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
                <div className="relative py-4">
                  <Image
                    src="/images/catalog/Arc 1.svg"
                    alt=""
                    width={340}
                    height={30}
                    className="w-full max-w-[280px] opacity-70"
                  />
                  <Image
                    src="/images/catalog/Arc 2.svg"
                    alt=""
                    width={340}
                    height={30}
                    className="w-full max-w-[280px] opacity-70 mt-1"
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
              <div className="lg:col-span-9 relative h-125 lg:h-150">
                {/* Image 1 - Left bottom, with green/primary border */}
                <div
                  className="absolute bottom-0 left-0 w-[40%] lg:w-[35%] z-20"
                  style={{ transform: "rotate(-2deg)" }}
                >
                  <div className="relative aspect-3/4 rounded-lg overflow-hidden shadow-2xl ring-4 ring-primary">
                    <Image
                      src="/images/hero/1.png"
                      alt="Construction 1"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Image 2 - Center top */}
                <div
                  className="absolute top-0 left-[25%] w-[40%] lg:w-[35%] z-30"
                  style={{ transform: "rotate(1deg)" }}
                >
                  <div className="relative aspect-3/4 rounded-lg overflow-hidden shadow-2xl">
                    <Image
                      src="/images/hero/1.png"
                      alt="Construction 2"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Image 3 - Right */}
                <div
                  className="absolute top-[5%] right-0 w-[40%] lg:w-[35%] z-10"
                  style={{ transform: "rotate(2deg)" }}
                >
                  <div className="relative aspect-3/4 rounded-lg overflow-hidden shadow-2xl">
                    <Image
                      src="/images/hero/1.png"
                      alt="Construction 3"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section - Green background */}
        <section className="relative py-16 lg:py-24 bg-primary overflow-hidden">
          {/* Background text */}
          <div className="absolute inset-0 flex items-start justify-center pt-8 pointer-events-none">
            <span className="text-[120px] lg:text-[200px] font-serif text-white/5 whitespace-nowrap">
              {t.gallery.galleryTitle}
            </span>
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            {/* Section title */}
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif text-white text-center mb-12 lg:mb-16">
              {t.gallery.galleryTitle}
            </h2>

            {/* Gallery grid - 5 columns */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
              {galleryItems.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="relative aspect-[3/4] rounded-sm overflow-hidden mb-4">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-white text-sm font-medium mb-2">{item.title}</h3>
                  <p className="text-white/60 text-xs leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>

            {/* Decorative ellipse */}
            <div className="flex justify-center mt-12 lg:mt-16">
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
                    style={{ borderRadius: "0 0 45% 0" }}
                  >
                    <Image
                      src="/images/hero/1.png"
                      alt={t.gallery.interiorTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Gray blob shape - behind and below image */}
                  <div
                    className="absolute -bottom-8 right-0 w-28 h-44 lg:w-36 lg:h-56 bg-[#9B8B7D] z-0"
                    style={{ borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }}
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
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src="/images/hero/1.png"
                    alt={t.gallery.interiorTitle}
                    fill
                    className="object-cover"
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
                  className="absolute left-[5%] top-[10%] w-[55%] lg:w-[50%] h-[85%] overflow-hidden"
                  style={{ borderRadius: "60% 40% 55% 45% / 55% 45% 55% 45%" }}
                >
                  <Image
                    src="/images/hero/1.png"
                    alt={t.gallery.exteriorTitle}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Decorative red ellipse outline - wrapping around images */}
                <svg
                  className="absolute right-[0%] bottom-[0%] w-64 lg:w-80 h-52 lg:h-64"
                  viewBox="0 0 320 260"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <ellipse cx="160" cy="130" rx="155" ry="125" stroke="#B91C1C" strokeWidth="1" fill="none" />
                </svg>

                {/* Small circular image - inside the ellipse */}
                <div className="absolute right-[10%] lg:right-[12%] bottom-[12%] w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden shadow-lg">
                  <Image
                    src="/images/hero/1.png"
                    alt={t.gallery.exteriorTitle}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Section - Green background */}
        <section className="relative py-16 lg:py-24 bg-primary overflow-hidden">
          {/* Decorative curved line on left */}
          <svg
            className="absolute left-8 top-24 w-8 h-32 opacity-60"
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
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-serif text-white mb-8 lg:mb-12">
              {t.gallery.videoTitle}
            </h2>

            {/* Video container */}
            <div className="relative aspect-video lg:aspect-[21/10] rounded-lg overflow-hidden">
              <Image
                src="/images/hero/1.png"
                alt={t.gallery.videoTitle}
                fill
                className="object-cover"
              />
              {/* Optional play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors cursor-pointer">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white/90 flex items-center justify-center">
                  <svg className="w-6 h-6 lg:w-8 lg:h-8 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
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
