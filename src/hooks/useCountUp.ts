"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useCountUp(
  ref: RefObject<HTMLElement | null>,
  targetText: string
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Extract numeric part and non-numeric parts
    const match = targetText.match(/^(\d+)(.*)$/);
    if (!match) return;

    const targetNum = parseInt(match[1], 10);
    const suffix = match[2] || "";

    // Store original text and show "00" initially
    const padLength = match[1].length;
    el.textContent = "0".repeat(padLength) + suffix;

    const counter = { value: 0 };

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          value: targetNum,
          duration: 1.2,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent =
              String(Math.round(counter.value)).padStart(padLength, "0") +
              suffix;
          },
        });
      },
    });

    return () => {
      st.kill();
      el.textContent = targetText;
    };
  }, [ref, targetText]);
}
