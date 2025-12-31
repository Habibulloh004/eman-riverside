"use client";

import { useState, useEffect } from "react";

const sideNavItems = [
  { label: "Старт", id: "hero" },
  { label: "01", id: "feature-01" },
  { label: "02", id: "feature-02" },
  { label: "03", id: "feature-03" },
];

export default function SideNav() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const sections = sideNavItems.map((item) => ({
        id: item.id,
        element: document.getElementById(item.id),
      }));

      const scrollPosition = window.scrollY + window.innerHeight / 3;

      // Check if we're past the about sections (feature-03)
      const feature03Element = document.getElementById("feature-03");
      if (feature03Element) {
        const feature03Bottom = feature03Element.offsetTop + feature03Element.offsetHeight;
        setIsVisible(scrollPosition < feature03Bottom);
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
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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
