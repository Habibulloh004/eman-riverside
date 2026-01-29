"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { PageHero } from "@/components/shared";
import { Header, Footer } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  SlidersHorizontal,
  X,
  FileDown
} from "lucide-react";
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

  // React Query - get all data once with caching
  const { data: allApartments = [], isLoading } = useEstates({ type: "living" });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [selectedFloors, setSelectedFloors] = useState<number[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState("Все");

  // Section states
  const [openSections, setOpenSections] = useState({
    price: true,
    floor: true,
    rooms: true,
    area: true,
    type: true,
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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
    if (price >= 1000000000) {
      return `${(price / 1000000000).toFixed(1)} млрд`;
    }
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(0)} млн`;
    }
    return new Intl.NumberFormat("ru-RU").format(price);
  };

  const getApartmentImage = (apartment: Estate): string => {
    if (apartment.plan_image) return apartment.plan_image;
    if (apartment.title_image) return apartment.title_image;
    return "/images/hero/planirovka1.png";
  };

  const filterContent = (
    <>
      {/* Price Filter */}
      <FilterSection
        title={t.catalog.price}
        isOpen={openSections.price}
        onToggle={() => toggleSection("price")}
      >
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={priceFrom}
            onChange={(e) => { setPriceFrom(e.target.value); setCurrentPage(1); }}
            placeholder={t.catalog.from}
            className="h-8 text-xs bg-white border-gray-300"
          />
          <span className="text-gray-400 text-xs">—</span>
          <Input
            type="text"
            value={priceTo}
            onChange={(e) => { setPriceTo(e.target.value); setCurrentPage(1); }}
            placeholder={t.catalog.priceTo}
            className="h-8 text-xs bg-white border-gray-300"
          />
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
        <Button variant="outline" className="w-full text-xs" onClick={() => {}}>
          <FileDown className="w-4 h-4 mr-2" />
          PDF
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

              {/* Mobile Filter Button */}
              <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
                <Button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="rounded-full shadow-lg px-6"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  {t.catalog.filter}
                </Button>
              </div>

              {/* Mobile Filter Drawer */}
              {isMobileFilterOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                  <div
                    className="absolute inset-0 bg-black/50"
                    onClick={() => setIsMobileFilterOpen(false)}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
                      <h3 className="font-semibold">{t.catalog.filter}</h3>
                      <button
                        onClick={() => setIsMobileFilterOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-4">{filterContent}</div>
                  </div>
                </div>
              )}

              {/* Apartments List */}
              <div className="flex-1">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white rounded-lg p-4 flex items-center gap-5 animate-pulse">
                        <div className="w-40 h-28 shrink-0 rounded-lg bg-gray-200" />
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-32" />
                          <div className="h-3 bg-gray-200 rounded w-24" />
                          <div className="h-3 bg-gray-200 rounded w-28" />
                        </div>
                        <div className="hidden sm:block">
                          <div className="h-4 bg-gray-200 rounded w-16" />
                        </div>
                        <div className="hidden sm:block">
                          <div className="h-4 bg-gray-200 rounded w-16" />
                        </div>
                        <div className="flex gap-3 shrink-0">
                          <div className="h-10 bg-gray-200 rounded w-20" />
                          <div className="h-10 bg-gray-200 rounded w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paginatedApartments.map((apartment, index) => (
                      <div
                        key={`${apartment.id}-${index}`}
                        className="bg-white rounded-lg p-4 flex items-center gap-5"
                      >
                        {/* Image */}
                        <Link
                          href={`/catalog/${apartment.id}`}
                          className="relative w-40 h-28 shrink-0 rounded-lg overflow-hidden bg-gray-100"
                        >
                          <Image
                            src={getApartmentImage(apartment)}
                            alt={`${apartment.estate_rooms}-комнатная квартира`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <Link href={`/catalog/${apartment.id}`}>
                            <h3 className="text-base font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2">
                              {apartment.title || "Люкс Экстра"}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            {apartment.estate_rooms}-{t.catalog.rooms}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {t.catalog.from} {formatPrice(apartment.estate_price)}
                          </p>
                        </div>

                        {/* Area */}
                        <div className="hidden sm:block text-center px-6">
                          <p className="text-base font-medium">{apartment.estate_area} {t.catalog.sqm}</p>
                        </div>

                        {/* Floor */}
                        <div className="hidden sm:block text-center px-6">
                          <p className="text-base font-medium">{apartment.estate_floor} {t.catalog.floor}</p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 shrink-0">
                          <Button className="px-5 bg-primary hover:bg-primary/90" asChild>
                            <Link href={`/catalog/${apartment.id}/request`}>
                              {t.catalog.request}
                            </Link>
                          </Button>
                          <Button variant="outline" className="px-5" asChild>
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
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 text-xs"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      {t.common.back}
                    </Button>
                    <div className="flex items-center gap-1">
                      {getPageNumbers().map((page, index) =>
                        page === '...' ? (
                          <span key={`ellipsis-${index}`} className="px-2 text-gray-400 text-xs">...</span>
                        ) : (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(page as number)}
                            className={`w-8 h-8 text-xs ${currentPage === page ? 'bg-primary text-white' : ''}`}
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
                      className="px-3 text-xs"
                    >
                      {t.common.next}
                      <ChevronRight className="w-4 h-4 ml-1" />
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
