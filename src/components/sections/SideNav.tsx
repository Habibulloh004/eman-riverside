"use client";

import { useState, useEffect, useMemo } from "react";
import { useProjectsPublic } from "@/hooks/useProjects";

const DEFAULT_PROJECT_COUNT = 3;

export default function SideNav() {
  const { data, isLoading } = useProjectsPublic();
  const [activeSection, setActiveSection] = useState("feature-01");
  const [isVisible, setIsVisible] = useState(true);

  const projectCount = data?.items?.length ?? (isLoading ? 0 : DEFAULT_PROJECT_COUNT);

  const sideNavItems = useMemo(() => {
    const items: { label: string; id: string }[] = [];
    for (let i = 0; i < projectCount; i++) {
      const num = String(i + 1).padStart(2, "0");
      items.push({ label: num, id: `feature-${num}` });
    }
    return items;
  }, [projectCount]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = sideNavItems.map((item) => ({
        id: item.id,
        element: document.getElementById(item.id),
      }));

      const scrollPosition = window.scrollY + window.innerHeight / 3;

      // Check if we're past the last feature section
      const lastItem = sideNavItems[sideNavItems.length - 1];
      const lastElement = lastItem ? document.getElementById(lastItem.id) : null;
      if (lastElement) {
        const lastBottom = lastElement.offsetTop + lastElement.offsetHeight;
        setIsVisible(scrollPosition < lastBottom);
      }

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element) {
          const offsetTop = section.element.offsetTop;
          if (scrollPosition >= offsetTop) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sideNavItems]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Hide while loading or if no projects
  if (isLoading || sideNavItems.length === 0) {
    return null;
  }

  return (
    <nav
      className={`fixed right-2 lg:right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex items-end gap-2 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"
      }`}
    >
      {/* Labels column */}
      <div className="flex flex-col items-end gap-4">
        {sideNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="text-xs font-semibold text-primary hover:opacity-70 transition-opacity"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Vertical line with active indicator */}
      <div className="relative h-[100px] w-[2px] bg-primary/20 rounded-full">
        {/* Active indicator - moves based on active section */}
        <div
          className="absolute left-0 w-full bg-primary rounded-full transition-all duration-300"
          style={{
            height: `${100 / sideNavItems.length}%`,
            top: `${(sideNavItems.findIndex(item => item.id === activeSection) / sideNavItems.length) * 100}%`,
          }}
        />
      </div>
    </nav>
  );
}
