"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PageHero } from "@/components/shared";
import { Header, Footer } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronUp, ChevronDown, SlidersHorizontal, X, Download } from "lucide-react";

// Apartment type
interface Apartment {
  id: number;
  name: string;
  rooms: number;
  area: number;
  floor: number;
  price: number;
  type: string;
  image: string;
  images?: string[];
  description?: string;
}

// Apartment data
const apartments: Apartment[] = [
  {
    id: 1,
    name: "Люкс Экстра",
    rooms: 3,
    area: 150,
    floor: 2,
    price: 45545,
    type: "Люкс",
    image: "/images/hero/planirovka1.png",
    images: ["/images/hero/planirovka1.png", "/images/hero/1.png"],
    description: "Просторная 3-комнатная квартира класса Люкс с панорамными окнами и высокими потолками. Идеально подходит для большой семьи."
  },
  {
    id: 2,
    name: "Люкс Экстра",
    rooms: 3,
    area: 150,
    floor: 3,
    price: 46500,
    type: "Люкс",
    image: "/images/hero/planirovka1.png",
    images: ["/images/hero/planirovka1.png", "/images/hero/1.png"],
    description: "Просторная 3-комнатная квартира класса Люкс с панорамными окнами и высокими потолками."
  },
  {
    id: 3,
    name: "Стандарт Плюс",
    rooms: 2,
    area: 85,
    floor: 4,
    price: 32000,
    type: "Стандарт",
    image: "/images/hero/planirovka1.png",
    images: ["/images/hero/planirovka1.png", "/images/hero/1.png"],
    description: "Уютная 2-комнатная квартира с продуманной планировкой и качественной отделкой."
  },
  {
    id: 4,
    name: "Эконом",
    rooms: 1,
    area: 45,
    floor: 5,
    price: 22000,
    type: "Эконом",
    image: "/images/hero/planirovka1.png",
    images: ["/images/hero/planirovka1.png", "/images/hero/1.png"],
    description: "Компактная 1-комнатная квартира - отличный выбор для молодой семьи или инвестиции."
  },
  {
    id: 5,
    name: "Люкс Экстра",
    rooms: 4,
    area: 180,
    floor: 6,
    price: 58000,
    type: "Люкс",
    image: "/images/hero/planirovka1.png",
    images: ["/images/hero/planirovka1.png", "/images/hero/1.png"],
    description: "Роскошная 4-комнатная квартира с террасой и видом на реку."
  },
  {
    id: 6,
    name: "Стандарт",
    rooms: 2,
    area: 75,
    floor: 2,
    price: 28000,
    type: "Стандарт",
    image: "/images/hero/planirovka1.png",
    images: ["/images/hero/planirovka1.png", "/images/hero/1.png"],
    description: "Удобная 2-комнатная квартира с балконом и современной планировкой."
  },
];

// Filter options
const floorOptions = [1, 2, 3, 4, 5, 6];
const roomOptions = [1, 2, 3, 4, 5];
const areaOptions = [50, 100, 150, 200];
const typeOptions = ["Люкс", "Эконом", "Стандарт"];

interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({ title, isOpen, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border-b border-gray-200 py-4">
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
      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );
}

export default function CatalogPage() {
  // Filter states
  const [priceFrom, setPriceFrom] = useState("20,000");
  const [priceTo, setPriceTo] = useState("60,000");
  const [selectedFloors, setSelectedFloors] = useState<number[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Section open states
  const [openSections, setOpenSections] = useState({
    price: true,
    floor: true,
    rooms: true,
    area: true,
    type: true,
  });

  // Mobile filter drawer
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleFilter = <T,>(
    value: T,
    selected: T[],
    setSelected: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  // Filter apartments
  const filteredApartments = apartments.filter((apt) => {
    // Filter by type
    if (selectedTypes.length > 0 && !selectedTypes.includes(apt.type)) {
      return false;
    }
    // Filter by rooms
    if (selectedRooms.length > 0 && !selectedRooms.includes(apt.rooms)) {
      return false;
    }
    // Filter by floor
    if (selectedFloors.length > 0 && !selectedFloors.includes(apt.floor)) {
      return false;
    }
    // Filter by area
    if (selectedAreas.length > 0) {
      const matchesArea = selectedAreas.some((maxArea) => apt.area <= maxArea);
      if (!matchesArea) return false;
    }
    return true;
  });

  const filterContent = (
    <>
      {/* Price Filter */}
      <FilterSection
        title="Цена"
        isOpen={openSections.price}
        onToggle={() => toggleSection("price")}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 flex-1">
            <span className="text-xs text-gray-500">$</span>
            <Input
              type="text"
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
              className="h-8 text-xs bg-white border-gray-300"
            />
          </div>
          <span className="text-gray-400 text-xs">To</span>
          <div className="flex items-center gap-1 flex-1">
            <span className="text-xs text-gray-500">$</span>
            <Input
              type="text"
              value={priceTo}
              onChange={(e) => setPriceTo(e.target.value)}
              className="h-8 text-xs bg-white border-gray-300"
            />
          </div>
        </div>
        <div className="mt-3">
          <input
            type="range"
            min="0"
            max="100000"
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </FilterSection>

      {/* Floor Filter */}
      <FilterSection
        title="Этаж"
        isOpen={openSections.floor}
        onToggle={() => toggleSection("floor")}
      >
        <div className="space-y-2">
          {floorOptions.map((floor) => (
            <label key={floor} className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={selectedFloors.includes(floor)}
                onCheckedChange={() =>
                  toggleFilter(floor, selectedFloors, setSelectedFloors)
                }
              />
              <span className="text-sm text-gray-700">{floor}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Rooms Filter */}
      <FilterSection
        title="Количество комнат"
        isOpen={openSections.rooms}
        onToggle={() => toggleSection("rooms")}
      >
        <div className="space-y-2">
          {roomOptions.map((room) => (
            <label key={room} className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={selectedRooms.includes(room)}
                onCheckedChange={() =>
                  toggleFilter(room, selectedRooms, setSelectedRooms)
                }
              />
              <span className="text-sm text-gray-700">{room}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Area Filter */}
      <FilterSection
        title="Площадь"
        isOpen={openSections.area}
        onToggle={() => toggleSection("area")}
      >
        <div className="space-y-2">
          {areaOptions.map((area) => (
            <label key={area} className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={selectedAreas.includes(area)}
                onCheckedChange={() =>
                  toggleFilter(area, selectedAreas, setSelectedAreas)
                }
              />
              <span className="text-sm text-gray-700">до {area} м²</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Type Filter */}
      <FilterSection
        title="Тип"
        isOpen={openSections.type}
        onToggle={() => toggleSection("type")}
      >
        <div className="space-y-2">
          {typeOptions.map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={selectedTypes.includes(type)}
                onCheckedChange={() =>
                  toggleFilter(type, selectedTypes, setSelectedTypes)
                }
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Download PDF Button */}
      <div className="pt-6">
        <Button
          variant="outline"
          className="w-full border-primary text-primary hover:bg-primary hover:text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Скачать PDF-каталог
        </Button>
      </div>
    </>
  );

  return (
    <>
      <Header />
      <main>
        <PageHero
          title="Каталог"
          subtitle="ВЫБЕРИТЕ СВОЮ КВАРТИРУ"
          image="/images/hero/1.png"
        />

        <section className="py-8 lg:py-12 bg-beige min-h-screen">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex gap-8">
              {/* Desktop Sidebar Filters */}
              <aside className="hidden lg:block w-60 shrink-0">
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
                  Фильтры
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
                      <h3 className="font-semibold">Фильтры</h3>
                      <button
                        onClick={() => setIsMobileFilterOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-4">
                      {filterContent}
                    </div>
                    <div className="sticky bottom-0 bg-white border-t p-4">
                      <Button
                        className="w-full"
                        onClick={() => setIsMobileFilterOpen(false)}
                      >
                        Показать {filteredApartments.length} квартир
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Apartment Cards */}
              <div className="flex-1">
                {/* Results count */}
                <p className="text-sm text-gray-500 mb-4">
                  Найдено: {filteredApartments.length} квартир
                </p>

                <div className="space-y-4">
                  {filteredApartments.map((apt) => (
                    <div
                      key={apt.id}
                      className="bg-white rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6"
                    >
                      {/* Image */}
                      <Link
                        href={`/catalog/${apt.id}`}
                        className="relative w-full sm:w-50 h-45 sm:h-35 shrink-0 rounded-lg overflow-hidden bg-gray-100 cursor-pointer block"
                      >
                        <Image
                          src={apt.image}
                          alt={apt.name}
                          fill
                          className="object-contain p-2"
                        />
                      </Link>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between">
                        {/* Title */}
                        <Link href={`/catalog/${apt.id}`}>
                          <h3 className="text-xl sm:text-2xl font-serif italic text-gray-900 mb-3 cursor-pointer hover:text-primary transition-colors">
                            {apt.name}
                          </h3>
                        </Link>

                        {/* Info Grid */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500">{apt.rooms} комнатная</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">{apt.area} м²</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">{apt.floor} Этаж</p>
                          </div>
                        </div>

                        {/* Price and Buttons */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                          <p className="text-sm text-gray-600">
                            от <span className="font-semibold">${apt.price.toLocaleString()}</span>
                          </p>
                          <div className="flex gap-3 flex-1 sm:justify-end">
                            <Button
                              size="sm"
                              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white px-6"
                              asChild
                            >
                              <Link href={`/catalog/${apt.id}/request`}>
                                Заявка
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 sm:flex-none border-gray-300 text-gray-700 hover:bg-gray-50 px-6"
                              asChild
                            >
                              <Link href={`/catalog/${apt.id}`}>
                                Подробнее
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredApartments.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">По вашим критериям квартиры не найдены</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedFloors([]);
                        setSelectedRooms([]);
                        setSelectedAreas([]);
                        setSelectedTypes([]);
                      }}
                    >
                      Сбросить фильтры
                    </Button>
                  </div>
                )}

                {/* Load More */}
                {filteredApartments.length > 0 && (
                  <div className="mt-8 text-center">
                    <Button variant="outline" className="px-8">
                      Показать ещё
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
