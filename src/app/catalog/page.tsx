"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { gsap } from "gsap";
import { PageHero } from "@/components/shared";
import { Header, Footer } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { useEstates } from "@/hooks/useEstates";
import { Estate } from "@/lib/api/estates";
import { useLanguage } from "@/contexts/LanguageContext";

// Filter options
const areaOptions = [
  { label: "< 50", min: 0, max: 50 },
  { label: "50-80", min: 50, max: 80 },
  { label: "80-100", min: 80, max: 100 },
  { label: "> 100", min: 100, max: 999 },
];

const ITEMS_PER_PAGE = 10;
const DEFAULT_PRICE_MAX = 500_000_000;
const DEFAULT_AREA_MAX = 400;

function interleaveByRoomCount(apartments: Estate[]): Estate[] {
  if (apartments.length <= 1) return apartments;

  const buckets = new Map<number, Estate[]>();
  for (const apartment of apartments) {
    const room = Number(apartment.estate_rooms);
    if (!Number.isFinite(room) || room <= 0) continue;
    if (!buckets.has(room)) buckets.set(room, []);
    buckets.get(room)!.push(apartment);
  }

  const roomKeys = Array.from(buckets.keys()).sort((a, b) => a - b);
  if (roomKeys.length <= 1) return apartments;

  // Alternate low/high room groups to avoid long single-room blocks (e.g. 1,3,2,...).
  const cycle: number[] = [];
  let left = 0;
  let right = roomKeys.length - 1;
  while (left <= right) {
    cycle.push(roomKeys[left]);
    if (left !== right) cycle.push(roomKeys[right]);
    left += 1;
    right -= 1;
  }

  const result: Estate[] = [];
  let hasRemaining = true;
  while (hasRemaining) {
    hasRemaining = false;
    for (const room of cycle) {
      const bucket = buckets.get(room);
      if (!bucket || bucket.length === 0) continue;
      result.push(bucket.shift()!);
      hasRemaining = true;
    }
  }

  return result.length > 0 ? result : apartments;
}

function FilterDropdown({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-2 w-full rounded-full border border-gray-100 bg-white shadow-sm px-4 py-2.5 text-sm text-gray-700 hover:border-gray-200 transition-colors"
      >
        <span className="truncate">{label}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-full min-w-[180px] bg-white rounded-xl border border-gray-100 shadow-lg z-50 p-3">
          {children}
        </div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}

function CatalogContent() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const catalogListRef = useRef<HTMLDivElement | null>(null);
  const desktopFilterRef = useRef<HTMLDivElement | null>(null);
  const apartmentAltSuffix =
    language === "uz" ? "-xonali kvartira" : language === "ru" ? "-комнатная квартира" : "-room apartment";
  const apartmentFallbackTitle =
    language === "uz" ? "Lyuks Ekstra" : language === "ru" ? "Люкс Экстра" : "Lux Extra";

  // React Query - get all data once with caching
  const { data: allApartments = [], isLoading } = useEstates({ type: "living", limit: 5000 });

  // Use only valid apartments for deriving filter values and rendering list.
  const validApartments = useMemo(
    () =>
      allApartments.filter((a) => {
        const floor = Number(a.estate_floor);
        const area = Number(a.estate_area);
        const rooms = Number(a.estate_rooms);
        const price = Number(a.estate_price);
        return (
          Number.isFinite(floor) &&
          floor > 0 &&
          Number.isFinite(area) &&
          area >= 35 &&
          Number.isFinite(rooms) &&
          rooms > 0 &&
          Number.isFinite(price) &&
          price > 0
        );
      }),
    [allApartments]
  );

  const floorOptions = useMemo(() => {
    const uniqueFloors = Array.from(
      new Set(
        validApartments
          .map((a) => Number(a.estate_floor))
          .filter((floor) => Number.isFinite(floor) && floor > 0)
      )
    ).sort((a, b) => a - b);
    return uniqueFloors;
  }, [validApartments]);

  const roomOptions = useMemo(() => {
    const uniqueRooms = Array.from(
      new Set(
        validApartments
          .map((a) => Number(a.estate_rooms))
          .filter((rooms) => Number.isFinite(rooms) && rooms > 0)
      )
    ).sort((a, b) => a - b);
    return uniqueRooms;
  }, [validApartments]);

  const maxPrice = useMemo(() => {
    const prices = validApartments
      .map((a) => Number(a.estate_price) || 0)
      .filter((price) => price > 0);

    if (prices.length === 0) return DEFAULT_PRICE_MAX;
    const rawMax = Math.max(...prices);
    const step = rawMax >= 1_000_000_000 ? 25_000_000 : 10_000_000;
    return Math.ceil(rawMax / step) * step;
  }, [validApartments]);

  const maxArea = useMemo(() => {
    const areas = validApartments
      .map((a) => Number(a.estate_area) || 0)
      .filter((area) => area > 0);

    if (areas.length === 0) return DEFAULT_AREA_MAX;
    return Math.ceil(Math.max(...areas) / 10) * 10;
  }, [validApartments]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Read URL search params for initial filter values
  const initialFloor = searchParams.get("floor");
  const initialRooms = searchParams.get("rooms");
  const initialArea = searchParams.get("area");
  const initialBuilding = searchParams.get("building");
  const initialApartment = searchParams.get("apartment");

  // Map area param (e.g. "0-50") to areaOptions label (e.g. "< 50")
  const getInitialArea = (): string[] => {
    if (!initialArea) return [];
    const [min, max] = initialArea.split("-").map(Number);
    const match = areaOptions.find(o => o.min === min && o.max === max);
    return match ? [match.label] : [];
  };

  // Filter states
  const [selectedFloors, setSelectedFloors] = useState<number[]>(
    initialFloor ? [parseInt(initialFloor)] : []
  );
  const [selectedRooms, setSelectedRooms] = useState<number[]>(
    initialRooms ? [parseInt(initialRooms)] : []
  );
  const [selectedAreas, setSelectedAreas] = useState<string[]>(getInitialArea);

  // Range sliders
  const [priceRange, setPriceRange] = useState([0, DEFAULT_PRICE_MAX]);
  const [areaRange, setAreaRange] = useState([0, DEFAULT_AREA_MAX]);
  const [priceManuallyChanged, setPriceManuallyChanged] = useState(false);
  const [areaManuallyChanged, setAreaManuallyChanged] = useState(false);

  const effectivePriceRange = useMemo<[number, number]>(() => {
    if (!priceManuallyChanged) return [0, maxPrice];
    const min = Math.max(0, Math.min(priceRange[0], maxPrice));
    const max = Math.max(min, Math.min(priceRange[1], maxPrice));
    return [min, max];
  }, [priceManuallyChanged, priceRange, maxPrice]);

  const effectiveAreaRange = useMemo<[number, number]>(() => {
    if (!areaManuallyChanged) return [0, maxArea];
    const min = Math.max(0, Math.min(areaRange[0], maxArea));
    const max = Math.max(min, Math.min(areaRange[1], maxArea));
    return [min, max];
  }, [areaManuallyChanged, areaRange, maxArea]);

  // Memoized filtered apartments (frontend filtering)
  const filteredApartments = useMemo(() => {
    if (validApartments.length === 0) return [];

    let filtered = [...validApartments];

    // Room filter
    if (selectedRooms.length > 0) {
      filtered = filtered.filter(a => selectedRooms.includes(a.estate_rooms));
    }

    // Area filter
    if (selectedAreas.length > 0) {
      filtered = filtered.filter(a => {
        return selectedAreas.some(areaLabel => {
          const option = areaOptions.find(o => o.label === areaLabel);
          if (!option) return false;
          return a.estate_area >= option.min && a.estate_area < option.max;
        });
      });
    }

    // Floor filter
    if (selectedFloors.length > 0) {
      filtered = filtered.filter(a => selectedFloors.includes(a.estate_floor));
    }

    if (initialBuilding) {
      filtered = filtered.filter(
        a => String(a.parent_id) === String(initialBuilding)
      );
    }

    if (initialApartment) {
      filtered = filtered.filter(
        a =>
          String(a.id) === String(initialApartment) ||
          a.title?.toLowerCase().includes(initialApartment.toLowerCase())
      );
    }

    // Price filter
    if (effectivePriceRange[0] > 0) {
      filtered = filtered.filter(a => (a.estate_price || 0) >= effectivePriceRange[0]);
    }
    if (effectivePriceRange[1] < maxPrice) {
      filtered = filtered.filter(a => (a.estate_price || 0) <= effectivePriceRange[1]);
    }

    // Area range filter
    if (effectiveAreaRange[0] > 0 || effectiveAreaRange[1] < maxArea) {
      filtered = filtered.filter(
        a => a.estate_area >= effectiveAreaRange[0] && a.estate_area <= effectiveAreaRange[1]
      );
    }

    return interleaveByRoomCount(filtered);
  }, [validApartments, selectedRooms, selectedAreas, selectedFloors, effectivePriceRange, effectiveAreaRange, maxPrice, maxArea, initialBuilding, initialApartment]);

  const resetFilters = () => {
    setSelectedFloors([]);
    setSelectedRooms([]);
    setSelectedAreas([]);
    setPriceManuallyChanged(false);
    setAreaManuallyChanged(false);
    setPriceRange([0, maxPrice]);
    setAreaRange([0, maxArea]);
    setCurrentPage(1);
  };

  // Pagination - slice from filtered results
  const totalPages = Math.ceil(filteredApartments.length / ITEMS_PER_PAGE);
  const paginatedApartments = filteredApartments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const toggleFilter = <T,>(value: T, selected: T[], setSelected: React.Dispatch<React.SetStateAction<T[]>>) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(v => v !== value));
    } else {
      setSelected([...selected, value]);
    }
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const getApartmentImage = (apartment: Estate): string => {
    if (apartment.plan_image) return apartment.plan_image;
    if (apartment.title_image) return apartment.title_image;
    return "/images/hero/planirovka1.png";
  };

  useEffect(() => {
    if (isLoading) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!catalogListRef.current) return;

    const root = catalogListRef.current;
    const cards = Array.from(
      root.querySelectorAll<HTMLElement>("[data-catalog-item]")
    );
    const titles = Array.from(
      root.querySelectorAll<HTMLElement>("[data-catalog-item-title]")
    );

    if (cards.length === 0) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.set(titles, { autoAlpha: 0 });

    tl.fromTo(
      cards,
      { y: 20, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.58,
        stagger: 0.07,
        clearProps: "opacity,visibility,transform",
      }
    ).fromTo(
      titles,
      { y: 8, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.34,
        stagger: 0.07,
        clearProps: "opacity,visibility,transform",
      },
      0.12
    );

    return () => {
      tl.kill();
    };
  }, [isLoading, paginatedApartments.length]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!desktopFilterRef.current) return;

    const fade = gsap.fromTo(
      desktopFilterRef.current,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 0.45,
        clearProps: "opacity,visibility",
      }
    );

    return () => {
      fade.kill();
    };
  }, []);

  const filterBar = (
    <div data-no-page-text-anim="true" data-no-page-ui-anim="true" ref={desktopFilterRef}>
      {isLoading && allApartments.length === 0 ? (
        <div className="flex flex-wrap items-center gap-3">
          <div className="h-10 rounded-full bg-gray-200 animate-pulse w-[130px]" />
          <div className="h-10 rounded-full bg-gray-200 animate-pulse w-[180px]" />
          <div className="h-14 rounded-2xl bg-gray-200 animate-pulse w-full sm:w-auto sm:flex-1 lg:max-w-[380px]" />
          <div className="h-14 rounded-2xl bg-gray-200 animate-pulse w-[calc(50%-6px)] sm:w-[180px]" />
          <div className="ml-auto flex items-center gap-2">
            <div className="h-10 rounded-full bg-gray-200 animate-pulse w-[180px]" />
            <div className="h-10 rounded-full bg-gray-200 animate-pulse w-[180px]" />
          </div>
        </div>
      ) : (
      <div className="flex flex-wrap items-center gap-3">
        <FilterDropdown
          label={`${t.catalog.floorFilter}${selectedFloors.length > 0 ? `  ${selectedFloors.join(", ")}` : ""}`}
          className="w-[calc(50%-6px)] sm:w-auto sm:min-w-[130px]"
        >
          <div className="grid grid-cols-4 gap-1">
            {floorOptions.map((floor) => (
              <label key={floor} className="flex items-center gap-1.5 cursor-pointer py-0.5">
                <Checkbox checked={selectedFloors.includes(floor)} onCheckedChange={() => toggleFilter(floor, selectedFloors, setSelectedFloors)} className="w-4 h-4" />
                <span className="text-xs text-gray-700">{floor}</span>
              </label>
            ))}
          </div>
        </FilterDropdown>

        <FilterDropdown
          label={`${t.catalog.roomsFilter}${selectedRooms.length > 0 ? `  ${selectedRooms.join(", ")}` : ""}`}
          className="w-[calc(50%-6px)] sm:w-auto sm:min-w-[180px]"
        >
          <div className="space-y-1">
            {roomOptions.map((room) => (
              <label key={room} className="flex items-center gap-2 cursor-pointer py-0.5">
                <Checkbox checked={selectedRooms.includes(room)} onCheckedChange={() => toggleFilter(room, selectedRooms, setSelectedRooms)} className="w-4 h-4" />
                <span className="text-xs text-gray-700">{room}</span>
              </label>
            ))}
          </div>
        </FilterDropdown>

        {/* Price range slider */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 px-4 py-2 w-full sm:w-auto sm:flex-1 lg:max-w-[380px]">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span>{t.catalog.from} {effectivePriceRange[0].toLocaleString()} {language === "uz" ? "so'm" : language === "ru" ? "сум" : "UZS"}</span>
            <span>{t.catalog.priceTo} {effectivePriceRange[1].toLocaleString()} {language === "uz" ? "so'm" : language === "ru" ? "сум" : "UZS"}</span>
          </div>
          <Slider
            min={0}
            max={maxPrice}
            step={maxPrice <= 200_000_000 ? 1_000_000 : maxPrice <= 700_000_000 ? 5_000_000 : 10_000_000}
            value={effectivePriceRange}
            onValueChange={(val) => { setPriceRange(val); setPriceManuallyChanged(true); setCurrentPage(1); }}
          />
        </div>

        {/* Area range slider */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 px-4 py-2 w-[calc(50%-6px)] sm:w-auto sm:min-w-[180px]">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span>{t.catalog.areaFilter}</span>
            <span>{effectiveAreaRange[1]}{t.catalog.sqm}</span>
          </div>
          <Slider
            min={0}
            max={maxArea}
            step={5}
            value={effectiveAreaRange}
            onValueChange={(val) => { setAreaRange(val); setAreaManuallyChanged(true); setCurrentPage(1); }}
          />
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={resetFilters}
            className="rounded-full px-5 py-2 text-xs font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors uppercase tracking-wider"
          >
            {t.catalog.resetFilters}
          </button>
          <button
            onClick={() => setCurrentPage(1)}
            className="rounded-full px-5 py-2 text-xs font-medium bg-primary text-white hover:bg-primary/90 transition-colors uppercase tracking-wider"
          >
            {language === "uz" ? "Filtr bo'yicha qidirish" : language === "ru" ? "Поиск по фильтрам" : "Search by filters"}
          </button>
        </div>
      </div>
      )}
    </div>
  );

  return (
    <>
      <Header />
      <main>
        <PageHero
          title={t.catalog.heroTitle}
          subtitle={t.catalog.heroSubtitle}
          image="/images/hero/1.png"
        />

        <section className="py-6 lg:py-10 bg-beige min-h-screen">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Horizontal Filter Bar */}
            <div className="hidden md:block mb-6">
              {filterBar}
            </div>

            {/* Mobile Filter Drawer */}
            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button className="rounded-full shadow-lg px-6">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    {t.catalog.filter}
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-lg">
                    <div className="p-4 overflow-y-auto max-h-[70vh]">
                      {filterBar}
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>

            {/* Apartments List */}
            <div>
                {isLoading ? (
                  <div className="space-y-3 sm:space-y-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white rounded-lg p-3 sm:p-4 animate-pulse">
                        <div className="flex gap-3 mb-3 sm:mb-0">
                          <div className="w-24 h-20 sm:w-40 sm:h-28 shrink-0 rounded-lg bg-gray-200" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                            <div className="h-3 bg-gray-200 rounded w-2/3" />
                          </div>
                        </div>
                        <div className="flex gap-2 sm:hidden">
                          <div className="h-9 bg-gray-200 rounded flex-1" />
                          <div className="h-9 bg-gray-200 rounded flex-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    ref={catalogListRef}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    data-no-page-text-anim="true"
                    data-no-page-media-anim="true"
                  >
                    {paginatedApartments.map((apartment) => (
                      <div
                        key={apartment.id}
                        className="bg-white rounded-lg p-3 sm:p-4 overflow-hidden"
                        data-catalog-item
                      >
                        <div className="flex gap-3 sm:gap-4">
                          {/* Image */}
                          <Link
                            href={`/catalog/${apartment.id}`}
                            className="relative w-24 h-20 sm:w-36 sm:h-24 md:w-40 md:h-28 shrink-0 rounded-lg overflow-hidden bg-gray-100"
                          >
                            <Image
                              src={getApartmentImage(apartment)}
                              alt={`${apartment.estate_rooms}${apartmentAltSuffix}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 96px, (max-width: 768px) 144px, 160px"
                            />
                          </Link>

                          {/* Right content */}
                          <div className="flex-1 min-w-0 flex flex-col gap-2">
                            {/* Title + info row */}
                            <div className="min-w-0">
                              <Link href={`/catalog/${apartment.id}`}>
                                <h3
                                  className="text-sm sm:text-base font-semibold text-gray-900 hover:text-primary transition-colors truncate"
                                  data-catalog-item-title
                                >
                                  {apartment.title || apartmentFallbackTitle}
                                </h3>
                              </Link>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs sm:text-sm text-gray-500">
                                <span>{apartment.estate_rooms}-{t.catalog.rooms}</span>
                                <span>{apartment.estate_area} {t.catalog.sqm}</span>
                                <span>{apartment.estate_floor} {t.catalog.floor}</span>
                              </div>
                            </div>

                            {/* Buttons - hidden on mobile, shown inline on sm+ */}
                            <div className="hidden sm:flex gap-2 mt-auto">
                              <Button className="px-4 text-xs sm:text-sm bg-primary hover:bg-primary/90" asChild>
                                <Link href={`/catalog/${apartment.id}/request`}>
                                  {t.catalog.request}
                                </Link>
                              </Button>
                              <Button variant="outline" className="px-4 text-xs sm:text-sm" asChild>
                                <Link href={`/catalog/${apartment.id}`}>
                                  {t.catalog.details}
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Buttons - mobile only, right-aligned */}
                        <div className="flex gap-2 mt-2 justify-end sm:hidden">
                          <Button className="px-3 h-8 text-xs bg-primary hover:bg-primary/90" asChild>
                            <Link href={`/catalog/${apartment.id}/request`}>
                              {t.catalog.request}
                            </Link>
                          </Button>
                          <Button variant="outline" className="px-3 h-8 text-xs" asChild>
                            <Link href={`/catalog/${apartment.id}`}>
                              {t.catalog.details}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {paginatedApartments.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">{t.catalog.noResults}</p>
                    <Button variant="outline" onClick={resetFilters}>
                      {t.catalog.resetFilters}
                    </Button>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-1 lg:gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-1.5 h-7 lg:px-3 lg:h-9 text-[10px] lg:text-xs"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                      <span className="hidden lg:inline ml-1">{t.common.back}</span>
                    </Button>
                    <div className="flex items-center gap-1 lg:gap-1.5">
                      {getPageNumbers().map((page, index) =>
                        page === '...' ? (
                          <span key={`ellipsis-${index}`} className="px-1 lg:px-2 text-gray-400 text-[10px] lg:text-xs">...</span>
                        ) : (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(page as number)}
                            className={`w-6 h-6 lg:w-8 lg:h-8 text-[10px] lg:text-xs p-0 ${currentPage === page ? 'bg-primary text-white' : ''}`}
                          >
                            {page}
                          </Button>
                        )
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-1.5 h-7 lg:px-3 lg:h-9 text-[10px] lg:text-xs"
                    >
                      <span className="hidden lg:inline mr-1">{t.common.next}</span>
                      <ChevronRight className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    </Button>
                  </div>
                )}
              </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
