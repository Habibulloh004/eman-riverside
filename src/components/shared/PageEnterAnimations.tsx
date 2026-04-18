"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const MAX_TEXT_TARGETS_PER_SECTION = 40;
const MAX_MEDIA_TARGETS_PER_SECTION = 12;
const animatedSectionRuntimeKeys = new Set<string>();
const animatedRuntimeTargets = new WeakSet<HTMLElement>();
const splitInstances: SplitText[] = [];

/* ------------------------------------------------------------------ */
/*  Phase 2A: SplitText Line Reveals for Headings                     */
/* ------------------------------------------------------------------ */

function createLineRevealTargets(element: HTMLElement): HTMLElement[] | null {
  if (element.dataset.noWaveText === "true") return null;
  if (element.childElementCount > 0) return null;
  if (animatedRuntimeTargets.has(element)) return null;

  const text = element.textContent?.trim();
  if (!text || text.length < 2) return null;

  const tag = element.tagName.toLowerCase();
  const canSplit = tag === "h1" || tag === "h2" || tag === "h3";
  if (!canSplit) return null;

  // SplitText needs the element to be visible to measure lines
  if (element.offsetParent === null) return null;

  try {
    const split = new SplitText(element, {
      type: "lines",
      linesClass: "split-line",
      aria: "auto",
    });

    if (!split.lines || split.lines.length === 0) {
      split.revert();
      return null;
    }

    splitInstances.push(split);
    animatedRuntimeTargets.add(element);

    return split.lines as HTMLElement[];
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Target Collection                                                  */
/* ------------------------------------------------------------------ */

function collectTitleTargets(section: HTMLElement): {
  lineTargets: HTMLElement[];
  fallbackTitleTargets: HTMLElement[];
} {
  const isEligible = (el: HTMLElement) =>
    el.offsetParent !== null &&
    !el.closest('[data-no-page-text-anim="true"]') &&
    !animatedRuntimeTargets.has(el);

  const headings = Array.from(
    section.querySelectorAll<HTMLElement>("h1, h2, h3")
  ).filter(isEligible);

  const lineTargets: HTMLElement[] = [];
  const fallbackTitleTargets: HTMLElement[] = [];

  for (const heading of headings) {
    const lines = createLineRevealTargets(heading);
    if (lines && lines.length > 0) {
      lineTargets.push(...lines);
    } else if (!animatedRuntimeTargets.has(heading)) {
      fallbackTitleTargets.push(heading);
    }
  }

  return {
    lineTargets: lineTargets.slice(0, 18),
    fallbackTitleTargets: fallbackTitleTargets.slice(0, 8),
  };
}

function collectTextTargets(section: HTMLElement): HTMLElement[] {
  // Body text is opt-in only via data-page-body-anim="true"
  const isEligible = (el: HTMLElement) =>
    el.offsetParent !== null &&
    !el.closest('[data-no-page-text-anim="true"]') &&
    !animatedRuntimeTargets.has(el);

  // Only animate p/li that are explicitly opted in, or direct children of the section
  const explicitTargets = Array.from(
    section.querySelectorAll<HTMLElement>("[data-page-body-anim='true']")
  ).filter(isEligible);

  // Also include p tags that are direct children of the section (not deeply nested)
  const directParagraphs = Array.from(
    section.querySelectorAll<HTMLElement>(":scope > p, :scope > div > p, :scope > div > div > p")
  ).filter(isEligible);

  const allTargets = [...explicitTargets];
  const seen = new Set<HTMLElement>(allTargets);

  for (const p of directParagraphs) {
    if (!seen.has(p) && allTargets.length < MAX_TEXT_TARGETS_PER_SECTION) {
      allTargets.push(p);
      seen.add(p);
    }
  }

  return allTargets.slice(0, MAX_TEXT_TARGETS_PER_SECTION);
}

function collectMediaTargets(section: HTMLElement): HTMLElement[] {
  const mediaCandidates = Array.from(
    section.querySelectorAll<HTMLElement>(
      "img:not([alt='']), video, iframe, [data-page-media-anim='true']"
    )
  );

  const uniqueTargets: HTMLElement[] = [];
  const seen = new Set<HTMLElement>();

  mediaCandidates.forEach((el) => {
    if (el.offsetParent === null) return;
    if (el.closest('[data-no-page-media-anim="true"]')) return;
    if (el.classList.contains("gallery-reveal") || el.closest(".gallery-reveal")) return;
    if (animatedRuntimeTargets.has(el)) return;
    if (seen.has(el)) return;

    const rect = el.getBoundingClientRect();
    if (rect.width < 48 || rect.height < 48) return;

    uniqueTargets.push(el);
    seen.add(el);
  });

  return uniqueTargets.slice(0, MAX_MEDIA_TARGETS_PER_SECTION);
}

/* ------------------------------------------------------------------ */
/*  Phase 3A: Image Overlay Wipe Reveal                                */
/* ------------------------------------------------------------------ */

function createImageWipeOverlay(
  target: HTMLElement
): HTMLElement | null {
  // Find the closest positioned parent to place the overlay
  const container = target.parentElement;
  if (!container) return null;

  // Ensure the container has relative positioning for overlay placement
  const computedPos = window.getComputedStyle(container).position;
  if (computedPos === "static") {
    container.style.position = "relative";
  }
  container.style.overflow = "hidden";

  const overlay = document.createElement("div");
  overlay.className = "anim-wipe-overlay";
  overlay.style.cssText = `
    position: absolute;
    inset: 0;
    z-index: 2;
    background: #3F704D;
    transform-origin: right center;
    pointer-events: none;
  `;
  container.appendChild(overlay);
  return overlay;
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function PageEnterAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const main = document.querySelector("main");
    if (!main) return;

    type SectionTargets = {
      lineTargets: HTMLElement[];
      fallbackTitleTargets: HTMLElement[];
      textTargets: HTMLElement[];
      mediaTargets: HTMLElement[];
      hidden: boolean;
    };

    const triggers: ScrollTrigger[] = [];
    const timelines: gsap.core.Timeline[] = [];
    const preparedSectionTargets = new WeakMap<HTMLElement, SectionTargets>();
    const sectionIndexMap = new WeakMap<HTMLElement, number>();

    const getSectionRuntimeKey = (section: HTMLElement, index: number) =>
      `${pathname}::${section.id || section.dataset.animKey || `idx-${index}`}`;

    const getEligibleSections = () => {
      const explicitSections = Array.from(
        main.querySelectorAll<HTMLElement>('[data-page-section-anim="true"]')
      );
      const explicitSet = new Set(explicitSections);

      const structuralSections = Array.from(
        main.querySelectorAll<HTMLElement>("section")
      ).filter(
        (section) => !section.querySelector('[data-page-section-anim="true"]')
      );
      const structuralSet = new Set(structuralSections);

      return Array.from(
        main.querySelectorAll<HTMLElement>('section, [data-page-section-anim="true"]')
      ).filter(
        (section) =>
          (explicitSet.has(section) || structuralSet.has(section)) &&
          section.id !== "hero" &&
          !section.closest('[data-no-page-section-anim="true"]')
      );
    };

    const prepareSectionTargets = (
      section: HTMLElement,
      hideTargets: boolean
    ) => {
      let prepared = preparedSectionTargets.get(section);
      if (prepared) return prepared;

      const { lineTargets, fallbackTitleTargets } = collectTitleTargets(section);
      const textTargets = collectTextTargets(section);
      const mediaTargets = collectMediaTargets(section);

      prepared = {
        lineTargets,
        fallbackTitleTargets,
        textTargets,
        mediaTargets,
        hidden: false,
      };

      const allTargets = [
        ...lineTargets,
        ...fallbackTitleTargets,
        ...textTargets,
        ...mediaTargets,
      ];

      allTargets.forEach((t) => animatedRuntimeTargets.add(t));
      preparedSectionTargets.set(section, prepared);

      if (hideTargets) {
        // Line reveal targets: subtle slide up per split line
        if (lineTargets.length > 0) {
          gsap.set(lineTargets, { y: 18, autoAlpha: 0 });
        }
        // Fallback headings (not split): subtle slide
        if (fallbackTitleTargets.length > 0) {
          gsap.set(fallbackTitleTargets, { y: 10, autoAlpha: 0 });
        }
        // Body text: very subtle
        if (textTargets.length > 0) {
          gsap.set(textTargets, { y: 8, autoAlpha: 0 });
        }
        // Media: hidden (will use wipe overlay)
        if (mediaTargets.length > 0) {
          gsap.set(mediaTargets, { autoAlpha: 0 });
        }

        prepared.hidden = true;
      }

      return prepared;
    };

    const animateSection = (section: HTMLElement, sectionIndex: number) => {
      const runtimeKey = getSectionRuntimeKey(section, sectionIndex);
      if (animatedSectionRuntimeKeys.has(runtimeKey)) return;
      animatedSectionRuntimeKeys.add(runtimeKey);

      const targets = prepareSectionTargets(section, false);
      const {
        lineTargets,
        fallbackTitleTargets,
        textTargets,
        mediaTargets,
      } = targets;

      const hasContent =
        lineTargets.length > 0 ||
        fallbackTitleTargets.length > 0 ||
        textTargets.length > 0 ||
        mediaTargets.length > 0;

      if (!hasContent) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // --- Headings: SplitText per-line stagger reveal ---
      if (lineTargets.length > 0) {
        if (targets.hidden) {
          tl.to(lineTargets, {
            y: 0,
            autoAlpha: 1,
            duration: 0.65,
            stagger: 0.07,
            clearProps: "opacity,visibility,transform",
          });
        } else {
          tl.fromTo(
            lineTargets,
            { y: 18, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.65,
              stagger: 0.07,
              clearProps: "opacity,visibility,transform",
            }
          );
        }
      }

      // --- Fallback headings (not split): subtle slide up ---
      if (fallbackTitleTargets.length > 0) {
        const pos = lineTargets.length > 0 ? "-=0.4" : 0;
        if (targets.hidden) {
          tl.to(
            fallbackTitleTargets,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.6,
              stagger: 0.04,
              clearProps: "opacity,visibility,transform",
            },
            pos
          );
        } else {
          tl.fromTo(
            fallbackTitleTargets,
            { y: 10, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.6,
              stagger: 0.04,
              clearProps: "opacity,visibility,transform",
            },
            pos
          );
        }
      }

      // --- Body text: quiet fade + minimal slide ---
      const textStart =
        lineTargets.length > 0 || fallbackTitleTargets.length > 0
          ? "-=0.3"
          : 0;

      if (textTargets.length > 0) {
        if (targets.hidden) {
          tl.to(
            textTargets,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.5,
              stagger: 0.025,
              ease: "power2.out",
              clearProps: "opacity,visibility,transform",
            },
            textStart
          );
        } else {
          tl.fromTo(
            textTargets,
            { y: 8, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.5,
              stagger: 0.025,
              ease: "power2.out",
              clearProps: "opacity,visibility,transform",
            },
            textStart
          );
        }
      }

      // --- Media: overlay wipe reveal ---
      const mediaStart =
        lineTargets.length > 0 || fallbackTitleTargets.length > 0
          ? "-=0.25"
          : textTargets.length > 0
            ? "-=0.2"
            : 0;

      if (mediaTargets.length > 0) {
        mediaTargets.forEach((target, i) => {
          const overlay = createImageWipeOverlay(target);
          const delay = i * 0.08;

          // First make the image visible (behind the overlay)
          gsap.set(target, { autoAlpha: 1 });

          if (overlay) {
            // Wipe the overlay away from left to right
            tl.fromTo(
              overlay,
              { scaleX: 1 },
              {
                scaleX: 0,
                duration: 0.8,
                ease: "power4.inOut",
                onComplete: () => overlay.remove(),
              },
              typeof mediaStart === "string"
                ? mediaStart
                : (mediaStart as number) + delay
            );
          } else {
            // Fallback: simple fade
            tl.to(
              target,
              {
                autoAlpha: 1,
                duration: 0.5,
                clearProps: "opacity,visibility",
              },
              typeof mediaStart === "string"
                ? mediaStart
                : (mediaStart as number) + delay
            );
          }
        });
      }

      targets.hidden = false;
      timelines.push(tl);
    };

    /* ---------------------------------------------------------------- */
    /*  Phase 4B: Scroll-linked image scale                             */
    /* ---------------------------------------------------------------- */

    const createScrollScale = (targets: HTMLElement[]) => {
      targets.forEach((target) => {
        const st = ScrollTrigger.create({
          trigger: target,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          animation: gsap.fromTo(
            target,
            { scale: 1 },
            { scale: 1.04, ease: "none" }
          ),
        });
        triggers.push(st);
      });
    };

    /* ---------------------------------------------------------------- */
    /*  ScrollTrigger-based section observation                         */
    /* ---------------------------------------------------------------- */

    const setupSections = () => {
      const sections = getEligibleSections();

      sections.forEach((section, index) => {
        sectionIndexMap.set(section, index);
        const runtimeKey = getSectionRuntimeKey(section, index);
        if (animatedSectionRuntimeKeys.has(runtimeKey)) return;

        // Pre-hide targets that are below the fold
        const rect = section.getBoundingClientRect();
        const isBelowFold = rect.top > window.innerHeight * 0.88;
        prepareSectionTargets(section, isBelowFold);

        const st = ScrollTrigger.create({
          trigger: section,
          start: "top 85%",
          once: true,
          onEnter: () => {
            animateSection(section, index);

            // Set up scroll-linked scale on media targets after they've been revealed
            const prepared = preparedSectionTargets.get(section);
            if (prepared && prepared.mediaTargets.length > 0) {
              // Slight delay to let reveal animation start
              gsap.delayedCall(0.4, () => {
                createScrollScale(prepared.mediaTargets);
              });
            }
          },
        });
        triggers.push(st);
      });
    };

    // Initial setup with a frame delay to let ScrollSmoother initialize
    const rafId = requestAnimationFrame(() => {
      setupSections();
      // Re-scan once more after a short delay for dynamically rendered content
      const rafId2 = requestAnimationFrame(() => {
        setupSections();
        ScrollTrigger.refresh();
      });
      // Store for cleanup
      (window as unknown as Record<string, number>).__pageAnimRaf2 = rafId2;
    });

    return () => {
      cancelAnimationFrame(rafId);
      const raf2 = (window as unknown as Record<string, number>).__pageAnimRaf2;
      if (raf2) cancelAnimationFrame(raf2);
      triggers.forEach((st) => st.kill());
      timelines.forEach((tl) => tl.kill());
      // Revert SplitText instances
      splitInstances.forEach((s) => {
        try { s.revert(); } catch { /* already reverted */ }
      });
      splitInstances.length = 0;
    };
  }, [pathname]);

  return null;
}
