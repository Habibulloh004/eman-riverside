"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { pickLocalizedString } from "@/lib/i18n/localized";
import { useGalleryPublic } from "@/hooks/useGallery";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
  const sectionRef = useRef<HTMLElement | null>(null);

  const galleryData = useMemo(() => {
    const sourceItems = (data?.items || [])
      .filter((item) => {
        const cat = (item.category || "").toLowerCase();
        return cat !== "interior" && cat !== "exterior";
      })
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

    const filledSlots = Array.from({ length: 9 }, () => null as typeof sourceItems[number] | null);

    sourceItems.forEach((item) => {
      const preferredSlot = Math.min(
        Math.max(item.sort_order ?? 0, 0),
        filledSlots.length - 1
      );

      let targetSlot = preferredSlot;
      while (targetSlot < filledSlots.length && filledSlots[targetSlot] !== null) {
        targetSlot += 1;
      }

      if (targetSlot >= filledSlots.length) {
        targetSlot = filledSlots.findIndex((slot) => slot === null);
      }

      if (targetSlot >= 0) {
        filledSlots[targetSlot] = item;
      }
    });

    const actualItems = filledSlots.filter((item): item is typeof sourceItems[number] => item !== null);
    const actualIndexById = new Map(actualItems.map((item, index) => [item.id, index]));

    return {
      lightboxItems: actualItems.map((item) => ({
        url: item.url.startsWith("http") ? item.url : `${API_URL}${item.url}`,
        title: pickLocalizedString(language, {
          ru: item.title,
          uz: item.title_uz,
          en: item.title_en,
        }),
      })),
      slots: filledSlots.map((item) => ({
        url: item ? (item.url.startsWith("http") ? item.url : `${API_URL}${item.url}`) : DEFAULT_IMAGE,
        title: item
          ? pickLocalizedString(language, {
              ru: item.title,
              uz: item.title_uz,
              en: item.title_en,
            })
          : t.gallerySection.title,
        redirectUrl: item?.redirect_url || null,
        lightboxIndex: item ? actualIndexById.get(item.id) ?? null : null,
      })),
    };
  }, [data?.items, language, t.gallerySection.title]);

  const handleTileClick = (index: number) => {
    const tile = galleryData.slots[index];
    if (!tile || tile.lightboxIndex === null) return;

    const redirectUrl = tile.redirectUrl;
    if (redirectUrl) {
      window.open(redirectUrl, "_blank", "noopener,noreferrer");
    } else {
      setLightboxIndex(tile.lightboxIndex);
    }
  };

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tiles = Array.from(root.querySelectorAll<HTMLElement>(".gallery-reveal"));
    if (tiles.length === 0) return;

    // Wipe direction based on tile position in grid
    const wipeDirections: Record<string, { prop: string; origin: string }> = {
      "tile-a": { prop: "scaleY", origin: "top center" },
      "tile-b": { prop: "scaleX", origin: "left center" },
      "tile-c": { prop: "scaleX", origin: "right center" },
      "tile-d": { prop: "scaleX", origin: "left center" },
      "tile-e": { prop: "scaleX", origin: "left center" },
      "tile-f": { prop: "scaleY", origin: "center top" },
      "tile-g": { prop: "scaleX", origin: "right center" },
      "tile-h": { prop: "scaleY", origin: "center top" },
      "tile-i": { prop: "scaleX", origin: "left center" },
    };

    const overlays: HTMLDivElement[] = [];
    const triggers: ScrollTrigger[] = [];

    tiles.forEach((tile, i) => {
      // Find which tile class this has
      const tileClass = Array.from(tile.classList).find((c) => c.startsWith("tile-")) || "tile-a";
      const dir = wipeDirections[tileClass] || { prop: "scaleX", origin: "right center" };

      // Create wipe overlay
      const overlay = document.createElement("div");
      overlay.style.cssText = `
        position: absolute;
        inset: 0;
        z-index: 2;
        background: #3F704D;
        transform-origin: ${dir.origin};
        pointer-events: none;
      `;
      tile.appendChild(overlay);
      overlays.push(overlay);

      // Hide the image initially
      const img = tile.querySelector("img");
      if (img) gsap.set(img, { scale: 1.15 });

      const st = ScrollTrigger.create({
        trigger: tile,
        start: "top 88%",
        once: true,
        onEnter: () => {
          const delay = i * 0.07;
          const tl = gsap.timeline({ delay });

          // Wipe overlay away
          tl.fromTo(
            overlay,
            { [dir.prop]: 1 },
            {
              [dir.prop]: 0,
              duration: 0.8,
              ease: "power4.inOut",
              onComplete: () => overlay.remove(),
            }
          );

          // Image scale settles
          if (img) {
            tl.to(
              img,
              { scale: 1, duration: 1.2, ease: "power2.out" },
              0.1
            );
          }
        },
      });
      triggers.push(st);
    });

    return () => {
      triggers.forEach((st) => st.kill());
      overlays.forEach((o) => { try { o.remove(); } catch { /* noop */ } });
    };
  }, [galleryData.slots.length, isLoading]);

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
    <section ref={sectionRef} id="gallery" className="relative py-16 lg:py-24 overflow-hidden">
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
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              {t.gallerySection.description}
            </p>
          </div>

          {tileIndices.map((i) => (
            <div
              key={tileClasses[i]}
              className={`gallery-tile gallery-reveal ${tileClasses[i]}`}
              onClick={() => handleTileClick(i)}
            >
              <Image
                src={galleryData.slots[i]?.url || DEFAULT_IMAGE}
                alt={galleryData.slots[i]?.title || t.gallerySection.title}
                fill
                className="object-cover"
                data-no-hover-scale="true"
                data-no-reveal="true"
                sizes={i === 0 ? "(max-width: 1024px) 100vw, 25vw" : "(max-width: 1024px) 50vw, 25vw"}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && galleryData.lightboxItems.length > 0 && (
          <Lightbox
            images={galleryData.lightboxItems}
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
          transition:
            transform 780ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 780ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, filter;
        }

        .gallery-tile:hover :global(img) {
          transform: scale(1.028);
          filter: saturate(1.04) contrast(1.02);
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
