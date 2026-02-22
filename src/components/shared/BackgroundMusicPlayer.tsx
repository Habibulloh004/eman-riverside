"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSiteSettings } from "@/contexts/SettingsContext";

const INTERACTION_EVENTS: (keyof WindowEventMap)[] = [
  "scroll",
  "pointerdown",
  "touchstart",
  "keydown",
  "click",
  "wheel",
];

function resolveMusicUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("/uploads/")) {
    return `/api/proxy${trimmed}`;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  return trimmed;
}

export function BackgroundMusicPlayer() {
  const { settings } = useSiteSettings();
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const musicUrl = useMemo(
    () => resolveMusicUrl(settings.content.background_music_url || ""),
    [settings.content.background_music_url]
  );
  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    const audio = audioRef.current ?? new Audio();
    audioRef.current = audio;

    if (isAdminRoute || !musicUrl) {
      audio.pause();
      audio.currentTime = 0;
      return;
    }

    audio.src = musicUrl;
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.5;

    let cancelled = false;

    const removeListeners = () => {
      INTERACTION_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, onInteraction);
      });
    };

    const tryPlay = async () => {
      if (cancelled) return;
      try {
        await audio.play();
        removeListeners();
      } catch {
        // Autoplay is often blocked; wait for a user interaction.
      }
    };

    function onInteraction() {
      void tryPlay();
    }

    const onAudioError = () => {
      removeListeners();
      audio.pause();
    };
    const onAudioEnded = () => {
      audio.currentTime = 0;
      void tryPlay();
    };

    audio.addEventListener("error", onAudioError);
    audio.addEventListener("ended", onAudioEnded);
    INTERACTION_EVENTS.forEach((eventName) => {
      const passive = eventName === "scroll" || eventName === "touchstart" || eventName === "wheel";
      window.addEventListener(eventName, onInteraction, passive ? { passive: true } : undefined);
    });

    void tryPlay();

    return () => {
      cancelled = true;
      audio.pause();
      removeListeners();
      audio.removeEventListener("error", onAudioError);
      audio.removeEventListener("ended", onAudioEnded);
    };
  }, [isAdminRoute, musicUrl]);

  return null;
}
