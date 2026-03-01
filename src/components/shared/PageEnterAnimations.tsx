"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

const MAX_TEXT_TARGETS_PER_SECTION = 60;
const MAX_MEDIA_TARGETS_PER_SECTION = 18;
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

function collectTitleAndTextTargets(section: HTMLElement): {
  titleTargets: HTMLElement[];
  textTargets: HTMLElement[];
} {
  const isEligibleText = (el: HTMLElement) =>
    el.offsetParent !== null &&
    !el.closest('[data-no-page-text-anim="true"]') &&
    !animatedRuntimeTargets.has(el);

  const headingNodes = Array.from(
    section.querySelectorAll<HTMLElement>("h1, h2, h3")
  ).filter(isEligibleText);
  const sentenceNodes = Array.from(
    section.querySelectorAll<HTMLElement>("p, li, [data-page-body-anim='true']")
  ).filter(isEligibleText);

  const [titleNode, ...otherHeadingNodes] = headingNodes;
  const titleTargets: HTMLElement[] = [];
  const textTargets: HTMLElement[] = [];

  if (titleNode) {
    const waveTargets = createWaveTargets(titleNode);
    if (waveTargets) {
      animatedRuntimeTargets.add(titleNode);
      if (waveTargets.length > 0) {
        titleTargets.push(...waveTargets);
      }
    } else {
      titleTargets.push(titleNode);
    }
  }

  const processAsText = (node: HTMLElement) => {
    const waveTargets = createWaveTargets(node);
    if (waveTargets) {
      animatedRuntimeTargets.add(node);
      if (waveTargets.length > 0) {
        textTargets.push(...waveTargets);
      }
      return;
    }

    textTargets.push(node);
  };

  otherHeadingNodes.forEach(processAsText);
  sentenceNodes.forEach(processAsText);

  return {
    titleTargets: titleTargets.slice(0, 18),
    textTargets: textTargets.slice(0, MAX_TEXT_TARGETS_PER_SECTION),
  };
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
    // Gallery sections manage their own reveal timeline/classes.
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

    type SectionTargets = {
      titleTargets: HTMLElement[];
      textTargets: HTMLElement[];
      mediaTargets: HTMLElement[];
      uiTargets: HTMLElement[];
      hidden: boolean;
    };

    const timelines: gsap.core.Timeline[] = [];
    const observedSections = new WeakSet<HTMLElement>();
    const preparedSectionTargets = new WeakMap<HTMLElement, SectionTargets>();
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

    const isSectionInViewNow = (section: HTMLElement) => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const triggerLine = viewportHeight * 0.88;
      return rect.bottom > 0 && rect.top < triggerLine;
    };

    const mergeTargets = (
      existing: HTMLElement[],
      incoming: HTMLElement[],
      max: number
    ) => {
      if (incoming.length === 0 || existing.length >= max) return;

      const seen = new Set(existing);
      incoming.forEach((target) => {
        if (seen.has(target) || existing.length >= max) return;
        existing.push(target);
        seen.add(target);
      });
    };

    const prepareSectionTargets = (section: HTMLElement, hideTargets: boolean) => {
      let prepared = preparedSectionTargets.get(section);
      if (!prepared) {
        prepared = { titleTargets: [], textTargets: [], mediaTargets: [], uiTargets: [], hidden: false };
        preparedSectionTargets.set(section, prepared);
      }

      const { titleTargets: newTitleTargets, textTargets: newTextTargets } =
        collectTitleAndTextTargets(section);
      const newMediaTargets = collectMediaTargets(section);
      const newUiTargets = collectUiTargets(section);
      const newTargets = [...newTitleTargets, ...newTextTargets, ...newMediaTargets, ...newUiTargets];

      if (newTargets.length > 0) {
        newTargets.forEach((target) => {
          animatedRuntimeTargets.add(target);
        });
      }

      mergeTargets(prepared.titleTargets, newTitleTargets, 18);
      mergeTargets(prepared.textTargets, newTextTargets, MAX_TEXT_TARGETS_PER_SECTION);
      mergeTargets(prepared.mediaTargets, newMediaTargets, MAX_MEDIA_TARGETS_PER_SECTION);
      mergeTargets(prepared.uiTargets, newUiTargets, MAX_UI_TARGETS_PER_SECTION);

      const shouldHide = hideTargets || prepared.hidden;
      if (shouldHide) {
        const titleToHide = prepared.hidden ? newTitleTargets : prepared.titleTargets;
        const textToHide = prepared.hidden ? newTextTargets : prepared.textTargets;
        const mediaToHide = prepared.hidden ? newMediaTargets : prepared.mediaTargets;
        const uiToHide = prepared.hidden ? newUiTargets : prepared.uiTargets;

        if (titleToHide.length > 0) {
          gsap.set(titleToHide, { y: 16, autoAlpha: 0 });
        }
        if (textToHide.length > 0) {
          gsap.set(textToHide, { y: 18, autoAlpha: 0 });
        }
        if (mediaToHide.length > 0) {
          gsap.set(mediaToHide, { autoAlpha: 0 });
        }
        if (uiToHide.length > 0) {
          gsap.set(uiToHide, { y: 10, autoAlpha: 0 });
        }

        prepared.hidden = true;
      }

      return prepared;
    };

    const animateSection = (section: HTMLElement, sectionIndex: number) => {
      const runtimeKey = getSectionRuntimeKey(section, sectionIndex);
      if (animatedSectionRuntimeKeys.has(runtimeKey)) {
        observer.unobserve(section);
        return;
      }

      // Mark immediately to avoid duplicate triggers during fast observer callbacks.
      animatedSectionRuntimeKeys.add(runtimeKey);

      const preparedTargets = prepareSectionTargets(section, false);
      const titleTargets = preparedTargets.titleTargets;
      const textTargets = preparedTargets.textTargets;
      const mediaTargets = preparedTargets.mediaTargets;
      const uiTargets = preparedTargets.uiTargets;

      if (
        titleTargets.length === 0 &&
        textTargets.length === 0 &&
        mediaTargets.length === 0 &&
        uiTargets.length === 0
      ) {
        observer.unobserve(section); // animate once per page load
        return;
      }

      const timeline = gsap.timeline({ defaults: { ease: "none" } });

      if (titleTargets.length > 0) {
        if (preparedTargets.hidden) {
          timeline.to(titleTargets, {
            y: 0,
            autoAlpha: 1,
            duration: 0.58,
            stagger: 0.026,
            clearProps: "opacity,visibility,transform",
          });
        } else {
          timeline.fromTo(
            titleTargets,
            { y: 16, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.58,
              stagger: 0.026,
              clearProps: "opacity,visibility,transform",
            }
          );
        }
      }

      const contentStart = titleTargets.length > 0 ? 0.18 : 0;

      if (textTargets.length > 0) {
        if (preparedTargets.hidden) {
          timeline.to(textTargets, {
            y: 0,
            autoAlpha: 1,
            duration: 0.62,
            stagger: 0.028,
            clearProps: "opacity,visibility,transform",
          }, contentStart);
        } else {
          timeline.fromTo(
            textTargets,
            { y: 18, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.62,
              stagger: 0.028,
              clearProps: "opacity,visibility,transform",
            },
            contentStart
          );
        }
      }

      if (mediaTargets.length > 0) {
        if (preparedTargets.hidden) {
          timeline.to(
            mediaTargets,
            {
              autoAlpha: 1,
              duration: 0.56,
              stagger: 0.05,
              clearProps: "opacity,visibility",
            },
            titleTargets.length > 0 ? 0.22 : 0.04
          );
        } else {
          timeline.fromTo(
            mediaTargets,
            { autoAlpha: 0 },
            {
              autoAlpha: 1,
              duration: 0.56,
              stagger: 0.05,
              clearProps: "opacity,visibility",
            },
            titleTargets.length > 0 ? 0.22 : 0.04
          );
        }
      }

      if (uiTargets.length > 0) {
        if (preparedTargets.hidden) {
          timeline.to(
            uiTargets,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.45,
              stagger: 0.03,
              clearProps: "opacity,visibility,transform",
            },
            titleTargets.length > 0 ? 0.26 : textTargets.length > 0 ? "-=0.3" : 0
          );
        } else {
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
            titleTargets.length > 0 ? 0.26 : textTargets.length > 0 ? "-=0.3" : 0
          );
        }
      }

      preparedTargets.hidden = false;
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

        prepareSectionTargets(section, !isSectionInViewNow(section));

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
