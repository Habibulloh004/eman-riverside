"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";

type AnimationStyle = "from-bottom" | "from-center" | "from-top" | "from-left" | "from-right" | "fade" | "top-in-bottom-out" | "left-in-right-out";

interface HeroVideoDialogProps {
  animationStyle?: AnimationStyle;
  videoSrc: string;
  thumbnailSrc: string;
  thumbnailAlt?: string;
  className?: string;
}

const animationVariants = {
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "from-center": {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "top-in-bottom-out": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "left-in-right-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
};

const getYouTubeEmbedUrl = (input: string): string | null => {
  if (!input) return null;
  try {
    const url = new URL(input);
    const host = url.hostname.replace(/^www\./, "");
    let videoId = "";

    if (host === "youtu.be") {
      videoId = url.pathname.replace("/", "").split("/")[0] || "";
    } else if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v") || "";
      } else if (url.pathname.startsWith("/embed/")) {
        videoId = url.pathname.split("/")[2] || "";
      } else if (url.pathname.startsWith("/shorts/")) {
        videoId = url.pathname.split("/")[2] || "";
      } else if (url.pathname.startsWith("/live/")) {
        videoId = url.pathname.split("/")[2] || "";
      }
    }

    if (!videoId) return null;

    const startParam = url.searchParams.get("t") || url.searchParams.get("start");
    const start = startParam ? `&start=${parseYouTubeStart(startParam)}` : "";
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0${start}`;
  } catch {
    return null;
  }
};

const parseYouTubeStart = (value: string): number => {
  if (!value) return 0;
  if (/^\d+$/.test(value)) return Number(value);
  // Support formats like 1h2m3s, 2m10s, 45s
  const match = value.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/i);
  if (!match) return 0;
  const hours = match[1] ? Number(match[1]) : 0;
  const minutes = match[2] ? Number(match[2]) : 0;
  const seconds = match[3] ? Number(match[3]) : 0;
  return hours * 3600 + minutes * 60 + seconds;
};

// Standalone video modal component for external control
interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  animationStyle?: AnimationStyle;
}

export function VideoModal({
  isOpen,
  onClose,
  videoSrc,
  animationStyle = "from-center",
}: VideoModalProps) {
  const selectedAnimation = animationVariants[animationStyle];
  const youTubeEmbedUrl = getYouTubeEmbedUrl(videoSrc);
  const isYouTube = !!youTubeEmbedUrl;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
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

          {/* Video container */}
          <motion.div
            {...selectedAnimation}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative mx-4 aspect-video w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {isYouTube ? (
              <iframe
                src={youTubeEmbedUrl || videoSrc}
                className="size-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                title="YouTube video player"
              />
            ) : (
              <video
                src={videoSrc}
                className="size-full"
                controls
                autoPlay
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function HeroVideoDialog({
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  className,
}: HeroVideoDialogProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const selectedAnimation = animationVariants[animationStyle];

  // Check if it's a YouTube URL
  const youTubeEmbedUrl = getYouTubeEmbedUrl(videoSrc);
  const isYouTube = !!youTubeEmbedUrl;

  return (
    <div className={className}>
      {/* Thumbnail with play button */}
      <div
        className="group relative w-full h-[60vh] cursor-pointer"
        onClick={() => setIsVideoOpen(true)}
      >
        <Image
          src={thumbnailSrc}
          alt={thumbnailAlt}
          fill
          sizes="100vw"
          className="rounded-lg border shadow-lg transition-all duration-300 group-hover:brightness-90 object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex size-16 lg:size-24 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            <Play className="size-6 lg:size-10 text-primary fill-primary" />
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVideoOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute right-4 top-4 z-50 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              onClick={() => setIsVideoOpen(false)}
            >
              <X className="size-5" />
            </motion.button>

            {/* Video container */}
            <motion.div
              {...selectedAnimation}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative mx-4 aspect-video w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {isYouTube ? (
              <iframe
                src={youTubeEmbedUrl || videoSrc}
                className="size-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                title="YouTube video player"
              />
            ) : (
              <video
                src={videoSrc}
                className="size-full"
                  controls
                  autoPlay
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
