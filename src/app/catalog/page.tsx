"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
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
  ChevronUp,
  ChevronDown,
  SlidersHorizontal,
  FileDown
} from "lucide-react";
import * as XLSX from "xlsx";
import { useEstates } from "@/hooks/useEstates";
import { Estate } from "@/lib/api/estates";
import { useLanguage } from "@/contexts/LanguageContext";

// Filter options
const floorOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const roomOptions = [1, 2, 3, 4, 5];
const areaOptions = [
  { label: "< 50", min: 0, max: 50 },
  { label: "50-80", min: 50, max: 80 },
  { label: "80-100", min: 80, max: 100 },
  { label: "> 100", min: 100, max: 999 },
];
const typeOptions = ["Все", "Эконом", "Стандарт"];

const ITEMS_PER_PAGE = 10;
const USD_RATE = 12950; // UZS per 1 USD (approximate)

interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({ title, isOpen, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border-b border-gray-200 py-3">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-sm font-medium text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default function CatalogPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  // React Query - get all data once with caching
  const { data: allApartments = [], isLoading } = useEstates({ type: "living" });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Read URL search params for initial filter values
  const initialFloor = searchParams.get("floor");
  const initialRooms = searchParams.get("rooms");
  const initialArea = searchParams.get("area");

  // Map area param (e.g. "0-50") to areaOptions label (e.g. "< 50")
  const getInitialArea = (): string[] => {
    if (!initialArea) return [];
    const [min, max] = initialArea.split("-").map(Number);
    const match = areaOptions.find(o => o.min === min && o.max === max);
    return match ? [match.label] : [];
  };

  // Compute price range from data
  const priceRange = useMemo(() => {
    if (allApartments.length === 0) return { min: 0, max: 1000000000 };
    const prices = allApartments.map(a => a.estate_price).filter(p => p > 0);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [allApartments]);

  // Filter states
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [selectedFloors, setSelectedFloors] = useState<number[]>(
    initialFloor ? [parseInt(initialFloor)] : []
  );
  const [selectedRooms, setSelectedRooms] = useState<number[]>(
    initialRooms ? [parseInt(initialRooms)] : []
  );
  const [selectedAreas, setSelectedAreas] = useState<string[]>(getInitialArea);
  const [selectedType, setSelectedType] = useState("Все");

  // Section states
  const [openSections, setOpenSections] = useState({
    price: true,
    floor: true,
    rooms: true,
    area: true,
    type: true,
  });

  const [currency, setCurrency] = useState<"uzs" | "usd">("uzs");

  // Memoized filtered apartments (frontend filtering)
  const filteredApartments = useMemo(() => {
    if (allApartments.length === 0) return [];

    let filtered = [...allApartments];

    // Room filter
    if (selectedRooms.length > 0) {
      filtered = filtered.filter(a => selectedRooms.includes(a.estate_rooms));
    }

    // Price filter
    if (priceFrom) {
      const min = parseInt(priceFrom.replace(/\D/g, "")) || 0;
      filtered = filtered.filter(a => a.estate_price >= min);
    }
    if (priceTo) {
      const max = parseInt(priceTo.replace(/\D/g, "")) || Infinity;
      filtered = filtered.filter(a => a.estate_price <= max);
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

    return filtered;
  }, [allApartments, selectedRooms, priceFrom, priceTo, selectedAreas, selectedFloors]);

  const resetFilters = () => {
    setPriceFrom("");
    setPriceTo("");
    setSelectedFloors([]);
    setSelectedRooms([]);
    setSelectedAreas([]);
    setSelectedType("Все");
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

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleFilter = <T,>(value: T, selected: T[], setSelected: React.Dispatch<React.SetStateAction<T[]>>) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(v => v !== value));
    } else {
      setSelected([...selected, value]);
    }
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const formatPrice = (price: number) => {
    const value = currency === "usd" ? Math.round(price / USD_RATE) : price;
    const suffix = currency === "usd" ? "$" : "сум";
    if (currency === "usd") {
      return `${new Intl.NumberFormat("ru-RU").format(value)} ${suffix}`;
    }
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)} млрд ${suffix}`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)} млн ${suffix}`;
    }
    return `${new Intl.NumberFormat("ru-RU").format(value)} ${suffix}`;
  };

  const getApartmentImage = (apartment: Estate): string => {
    if (apartment.plan_image) return apartment.plan_image;
    if (apartment.title_image) return apartment.title_image;
    return "/images/hero/planirovka1.png";
  };

  const exportToExcel = () => {
    const data = filteredApartments.map((a) => ({
      "Название": a.title || "",
      "Комнаты": a.estate_rooms,
      "Площадь (м²)": a.estate_area,
      "Этаж": a.estate_floor,
      "Цена": a.estate_price,
      "Цена (сум)": a.estate_price_human || "",
      "Адрес": a.address || "",
      "Статус": a.status_name || "",
      "Категория": a.category_name || "",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Apartments");
    XLSX.writeFile(wb, "eman_apartments.xlsx");
  };

  const filterContent = (
    <>
      {/* Currency Toggle */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
        <span className="text-xs font-medium text-gray-700">Валюта</span>
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setCurrency("uzs")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${currency === "uzs" ? "bg-primary text-white" : "text-gray-500 hover:text-gray-700"}`}
          >
            UZS
          </button>
          <button
            onClick={() => setCurrency("usd")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${currency === "usd" ? "bg-primary text-white" : "text-gray-500 hover:text-gray-700"}`}
          >
            USD
          </button>
        </div>
      </div>

      {/* Price Filter */}
      <FilterSection
        title={t.catalog.price}
        isOpen={openSections.price}
        onToggle={() => toggleSection("price")}
      >
        <div className="space-y-3">
          <Slider
            min={priceRange.min}
            max={priceRange.max}
            step={1000000}
            value={[Number(priceFrom) || priceRange.min, Number(priceTo) || priceRange.max]}
            onValueChange={([min, max]) => {
              setPriceFrom(min <= priceRange.min ? "" : String(min));
              setPriceTo(max >= priceRange.max ? "" : String(max));
              setCurrentPage(1);
            }}
          />
          <div className="flex items-center justify-between text-[10px] text-gray-500">
            <span>{formatPrice(Number(priceFrom) || priceRange.min)}</span>
            <span>{formatPrice(Number(priceTo) || priceRange.max)}</span>
          </div>
        </div>
      </FilterSection>

      {/* Floor Filter */}
      <FilterSection
        title={t.catalog.floorFilter}
        isOpen={openSections.floor}
        onToggle={() => toggleSection("floor")}
      >
        <div className="grid grid-cols-4 gap-1">
          {floorOptions.map((floor) => (
            <label key={floor} className="flex items-center gap-1.5 cursor-pointer">
              <Checkbox
                checked={selectedFloors.includes(floor)}
                onCheckedChange={() => toggleFilter(floor, selectedFloors, setSelectedFloors)}
                className="w-4 h-4"
              />
              <span className="text-xs text-gray-700">{floor}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Rooms Filter */}
      <FilterSection
        title={t.catalog.roomsFilter}
        isOpen={openSections.rooms}
        onToggle={() => toggleSection("rooms")}
      >
        <div className="space-y-1">
          {roomOptions.map((room) => (
            <label key={room} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedRooms.includes(room)}
                onCheckedChange={() => toggleFilter(room, selectedRooms, setSelectedRooms)}
                className="w-4 h-4"
              />
              <span className="text-xs text-gray-700">{room}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Area Filter */}
      <FilterSection
        title={t.catalog.areaFilter}
        isOpen={openSections.area}
        onToggle={() => toggleSection("area")}
      >
        <div className="space-y-1">
          {areaOptions.map((option) => (
            <label key={option.label} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedAreas.includes(option.label)}
                onCheckedChange={() => toggleFilter(option.label, selectedAreas, setSelectedAreas)}
                className="w-4 h-4"
              />
              <span className="text-xs text-gray-700">{option.label} {t.catalog.sqm}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Type Filter */}
      <FilterSection
        title={t.catalog.typeFilter}
        isOpen={openSections.type}
        onToggle={() => toggleSection("type")}
      >
        <div className="space-y-1">
          {typeOptions.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedType === type}
                onCheckedChange={() => setSelectedType(type)}
                className="w-4 h-4"
              />
              <span className="text-xs text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Reset Filters */}
      <div className="pt-4 space-y-2">
        <Button variant="outline" className="w-full text-xs" onClick={resetFilters}>
          {t.catalog.resetFilters}
        </Button>
        <Button variant="outline" className="w-full text-xs" onClick={exportToExcel}>
          <FileDown className="w-4 h-4 mr-2" />
          Excel
        </Button>
      </div>
    </>
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
            <div className="flex gap-6">
              {/* Desktop Sidebar Filters */}
              <aside className="hidden lg:block w-64 shrink-0">
                <div className="bg-white rounded-lg p-5 sticky top-24">
                  {filterContent}
                </div>
              </aside>

              {/* Mobile Filter Drawer */}
              <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
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
                        {filterContent}
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>

              {/* Apartments List */}
              <div className="flex-1 min-w-0">
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
                  <div className="space-y-4">
                    {paginatedApartments.map((apartment, index) => (
                      <div
                        key={`${apartment.id}-${index}`}
                        className="bg-white rounded-lg p-3 sm:p-4 overflow-hidden"
                      >
                        <div className="flex gap-3 sm:gap-4">
                          {/* Image */}
                          <Link
                            href={`/catalog/${apartment.id}`}
                            className="relative w-24 h-20 sm:w-36 sm:h-24 md:w-40 md:h-28 shrink-0 rounded-lg overflow-hidden bg-gray-100"
                          >
                            <Image
                              src={getApartmentImage(apartment)}
                              alt={`${apartment.estate_rooms}-комнатная квартира`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </Link>

                          {/* Right content */}
                          <div className="flex-1 min-w-0 flex flex-col gap-2">
                            {/* Title + info row */}
                            <div className="min-w-0">
                              <Link href={`/catalog/${apartment.id}`}>
                                <h3 className="text-sm sm:text-base font-semibold text-gray-900 hover:text-primary transition-colors truncate">
                                  {apartment.title || "Люкс Экстра"}
                                </h3>
                              </Link>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs sm:text-sm text-gray-500">
                                <span>{apartment.estate_rooms}-{t.catalog.rooms}</span>
                                <span>{apartment.estate_area} {t.catalog.sqm}</span>
                                <span>{apartment.estate_floor} {t.catalog.floor}</span>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                {t.catalog.from} {formatPrice(apartment.estate_price)}
                              </p>
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
