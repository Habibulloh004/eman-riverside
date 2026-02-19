"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGalleryPublic } from "@/hooks/useGallery";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";
const DEFAULT_IMAGE = "/images/hero/1.png";

interface LightboxProps {
  images: { url: string; title: string }[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

function Lightbox({ images, currentIndex, onClose, onNavigate }: LightboxProps) {
  const handlePrev = useCallback(() => {
    onNavigate(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    onNavigate(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, handlePrev, handleNext]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const image = images[currentIndex];
  if (!image) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="absolute right-4 top-4 z-50 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        onClick={onClose}
      >
        <X className="size-5" />
      </motion.button>

      {/* Prev button */}
      {images.length > 1 && (
        <button
          className="absolute left-4 z-50 flex size-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
        >
          <ChevronLeft className="size-6" />
        </button>
      )}

      {/* Next button */}
      {images.length > 1 && (
        <button
          className="absolute right-4 z-50 flex size-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
        >
          <ChevronRight className="size-6" />
        </button>
      )}

      {/* Image */}
      <motion.div
        key={currentIndex}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative mx-16 max-h-[85vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={image.url}
          alt={image.title}
          width={1200}
          height={800}
          className="max-h-[85vh] w-auto rounded-lg object-contain"
          sizes="90vw"
          priority
        />
        {image.title && (
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent px-4 py-3 rounded-b-lg">
            <p className="text-white text-sm">{image.title}</p>
          </div>
        )}
      </motion.div>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </motion.div>
  );
}

export default function Gallery() {
  const { t, language } = useLanguage();
  const { data, isLoading } = useGalleryPublic({ type: "image" });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = (data?.items || []).map((item) => ({
    url: item.url.startsWith("http") ? item.url : `${API_URL}${item.url}`,
    title: language === "uz" ? (item.title_uz || item.title) : item.title,
    redirectUrl: item.redirect_url || null,
  }));

  const getImageUrl = (index: number) => images[index]?.url || DEFAULT_IMAGE;
  const getImageTitle = (index: number) => images[index]?.title || t.gallerySection.title;
  const getRedirectUrl = (index: number) => images[index]?.redirectUrl || null;

  const handleTileClick = (index: number) => {
    const redirectUrl = getRedirectUrl(index);
    if (redirectUrl) {
      window.open(redirectUrl, "_blank", "noopener,noreferrer");
    } else {
      setLightboxIndex(index);
    }
  };

  if (isLoading) {
    return (
      <section id="gallery" className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#F9EFE7]" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="gallery-grid">
            <div className="gallery-title">
              <div className="h-10 w-56 bg-muted animate-pulse rounded mb-3" />
              <div className="h-4 w-72 bg-muted animate-pulse rounded" />
            </div>
            {[
              "tile-a",
              "tile-b",
              "tile-c",
              "tile-d",
              "tile-e",
              "tile-f",
              "tile-g",
              "tile-h",
              "tile-i",
            ].map((tile) => (
              <div
                key={tile}
                className={`gallery-tile ${tile} bg-muted animate-pulse`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const tileIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const tileClasses = ["tile-a", "tile-b", "tile-c", "tile-d", "tile-e", "tile-f", "tile-g", "tile-h", "tile-i"];

  return (
    <section id="gallery" className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background image with low opacity */}
      <div className="absolute inset-0 z-0 bg-[#F9EFE7]">
        <Image
          src="/images/hero/1.png"
          alt=""
          fill
          className="object-cover opacity-[0.04]"
          sizes="100vw"
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="gallery-grid">
          <div className="gallery-tile gallery-title">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4">
              {t.gallerySection.title}
            </h2>
            <p className="text-muted-foreground text-sm uppercase tracking-wider max-w-xs">
              {t.gallerySection.description}
            </p>
          </div>

          {tileIndices.map((i) => (
            <div
              key={tileClasses[i]}
              className={`gallery-tile ${tileClasses[i]}`}
              onClick={() => handleTileClick(i)}
            >
              <Image
                src={getImageUrl(i)}
                alt={getImageTitle(i)}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes={i === 0 ? "(max-width: 1024px) 100vw, 25vw" : "(max-width: 1024px) 50vw, 25vw"}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && images.length > 0 && (
          <Lightbox
            images={images}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .gallery-tile {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          border-radius: 2px;
        }

        .gallery-tile :global(img) {
          transition: transform 0.5s ease;
        }

        .gallery-tile:hover :global(img) {
          transform: scale(1.05);
        }

        .gallery-title {
          background: rgba(249, 239, 231, 0.85);
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 180px;
        }

        .tile-a,
        .tile-b,
        .tile-c,
        .tile-d,
        .tile-e,
        .tile-f,
        .tile-g,
        .tile-h,
        .tile-i {
          min-height: 180px;
        }

        @media (min-width: 1024px) {
          .gallery-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            grid-template-rows: repeat(3, 220px);
            grid-template-areas:
              "title title a b"
              "c d a e"
              "f g h i";
            gap: 16px;
          }

          .gallery-title {
            grid-area: title;
            min-height: auto;
          }

          .tile-a {
            grid-area: a;
          }
          .tile-b {
            grid-area: b;
          }
          .tile-c {
            grid-area: c;
          }
          .tile-d {
            grid-area: d;
          }
          .tile-e {
            grid-area: e;
          }
          .tile-f {
            grid-area: f;
          }
          .tile-g {
            grid-area: g;
          }
          .tile-h {
            grid-area: h;
          }
          .tile-i {
            grid-area: i;
          }
        }
      `}</style>
    </section>
  );
}
