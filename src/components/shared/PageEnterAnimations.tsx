"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

const MAX_TEXT_TARGETS_PER_SECTION = 60;
const MAX_UI_TARGETS_PER_SECTION = 12;
const animatedSectionRuntimeKeys = new Set<string>();
const animatedRuntimeTargets = new WeakSet<HTMLElement>();

function createWaveTargets(element: HTMLElement): HTMLElement[] | null {
  if (element.dataset.noWaveText === "true") return null;
  if (element.childElementCount > 0) return null;

  if (element.dataset.wavePrepared === "1") {
    return Array.from(
      element.querySelectorAll<HTMLElement>(':scope > span[data-wave-word="1"]')
    ).filter((word) => !animatedRuntimeTargets.has(word));
  }

  const text = element.textContent?.trim();
  if (!text) return null;

  const tag = element.tagName.toLowerCase();
  const canWave =
    tag === "h1" ||
    tag === "h2" ||
    tag === "h3" ||
    (tag === "p" && text.length <= 120) ||
    (tag === "li" && text.length <= 90);
  if (!canWave) return null;

  const words = text.split(/\s+/);
  if (words.length < 2 || words.length > 14) return null;

  element.dataset.wavePrepared = "1";
  element.setAttribute("aria-label", text);
  element.textContent = "";

  const waveWords: HTMLElement[] = [];
  words.forEach((word, index) => {
    const wordSpan = document.createElement("span");
    wordSpan.dataset.waveWord = "1";
    wordSpan.setAttribute("aria-hidden", "true");
    wordSpan.style.display = "inline-block";
    wordSpan.style.willChange = "transform, opacity";
    wordSpan.textContent = word;
    element.appendChild(wordSpan);
    waveWords.push(wordSpan);

    if (index < words.length - 1) {
      element.appendChild(document.createTextNode(" "));
    }
  });

  return waveWords;
}

function collectTextTargets(section: HTMLElement): HTMLElement[] {
  const isEligibleText = (el: HTMLElement) =>
    el.offsetParent !== null &&
    !el.closest('[data-no-page-text-anim="true"]') &&
    !animatedRuntimeTargets.has(el);

  const headingNodes = Array.from(
    section.querySelectorAll<HTMLElement>("h1, h2, h3")
  ).filter(isEligibleText);
  const sentenceNodes = Array.from(
    section.querySelectorAll<HTMLElement>("p, li")
  ).filter(isEligibleText);

  const headingTargets: HTMLElement[] = [];
  for (const node of headingNodes) {
    const waveTargets = createWaveTargets(node);
    if (waveTargets) {
      animatedRuntimeTargets.add(node);
      if (waveTargets.length > 0) {
        headingTargets.push(...waveTargets);
      }
      continue;
    }

    headingTargets.push(node);
  }

  const sentenceTargets: HTMLElement[] = [];
  for (const node of sentenceNodes) {
    const waveTargets = createWaveTargets(node);
    if (waveTargets) {
      animatedRuntimeTargets.add(node);
      if (waveTargets.length > 0) {
        sentenceTargets.push(...waveTargets);
      }
      continue;
    }

    sentenceTargets.push(node);
  }

  return [...headingTargets, ...sentenceTargets].slice(
    0,
    MAX_TEXT_TARGETS_PER_SECTION
  );
}

function collectUiTargets(section: HTMLElement): HTMLElement[] {
  return Array.from(
    section.querySelectorAll<HTMLElement>(
      "button, a, input, select, textarea, [role='button']"
    )
  )
    .filter((el) => el.offsetParent !== null)
    .filter((el) => !el.closest('[data-no-page-ui-anim="true"]'))
    .filter((el) => !animatedRuntimeTargets.has(el))
    .slice(0, MAX_UI_TARGETS_PER_SECTION);
}

export default function PageEnterAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const main = document.querySelector("main");
    if (!main) return;

    const timelines: gsap.core.Timeline[] = [];
    const observedSections = new WeakSet<HTMLElement>();
    const getSectionRuntimeKey = (section: HTMLElement, index: number) =>
      `${pathname}::${section.id || section.dataset.animKey || `idx-${index}`}`;

    const getEligibleSections = () =>
      Array.from(main.querySelectorAll<HTMLElement>("section")).filter(
        (section) =>
          section.id !== "hero" &&
          !section.closest('[data-no-page-section-anim="true"]')
      );

    const isSectionInViewNow = (section: HTMLElement) => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const triggerLine = viewportHeight * 0.88;
      return rect.bottom > 0 && rect.top < triggerLine;
    };

    const animateSection = (section: HTMLElement, sectionIndex: number) => {
      const runtimeKey = getSectionRuntimeKey(section, sectionIndex);
      if (animatedSectionRuntimeKeys.has(runtimeKey)) {
        observer.unobserve(section);
        return;
      }

      // Mark immediately to avoid duplicate triggers during fast observer callbacks.
      animatedSectionRuntimeKeys.add(runtimeKey);

      const textTargets = collectTextTargets(section);
      const uiTargets = collectUiTargets(section);
      const targetsToMark = [...textTargets, ...uiTargets];

      targetsToMark.forEach((target) => {
        animatedRuntimeTargets.add(target);
      });

      if (
        textTargets.length === 0 &&
        uiTargets.length === 0
      ) {
        observer.unobserve(section); // animate once per page load
        return;
      }

      const timeline = gsap.timeline({ defaults: { ease: "none" } });

      if (textTargets.length > 0) {
        timeline.fromTo(
          textTargets,
          { y: 18, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.62,
            stagger: 0.028,
            clearProps: "opacity,visibility,transform",
          }
        );
      }

      if (uiTargets.length > 0) {
        timeline.fromTo(
          uiTargets,
          { y: 10, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.45,
            stagger: 0.03,
            clearProps: "opacity,visibility,transform",
          },
          textTargets.length > 0 ? "-=0.3" : 0
        );
      }

      timelines.push(timeline);
      observer.unobserve(section);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const section = entry.target as HTMLElement;
          const sectionIndexAttr = section.dataset.pageAnimIndex;
          const sectionIndex = sectionIndexAttr ? Number(sectionIndexAttr) : -1;
          animateSection(section, Number.isNaN(sectionIndex) ? -1 : sectionIndex);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -12% 0px",
      }
    );

    const observeSections = () => {
      const sections = getEligibleSections();
      sections.forEach((section, index) => {
        section.dataset.pageAnimIndex = String(index);
        const runtimeKey = getSectionRuntimeKey(section, index);
        if (animatedSectionRuntimeKeys.has(runtimeKey)) return;

        if (!observedSections.has(section)) {
          observer.observe(section);
          observedSections.add(section);
        }

        // Ensure first viewport animations start immediately without requiring user input.
        if (isSectionInViewNow(section)) {
          animateSection(section, index);
        }
      });
    };

    observeSections();
    const rafId = window.requestAnimationFrame(observeSections);

    const mutationObserver = new MutationObserver(() => {
      observeSections();
    });
    mutationObserver.observe(main, { childList: true, subtree: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      mutationObserver.disconnect();
      observer.disconnect();
      timelines.forEach((tl) => tl.kill());
    };
  }, [pathname]);

  return null;
}
