"use client";

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

// Register plugins (no ScrollSmoother instance — it wraps children in a
// transformed div which breaks position:fixed on Header and other overlays)
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

type SmoothScrollContextType = {
  smoother: null;
};

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  smoother: null,
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  // Refresh ScrollTrigger positions after every route change
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <SmoothScrollContext.Provider value={{ smoother: null }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
