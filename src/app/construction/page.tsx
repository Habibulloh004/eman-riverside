"use client";

import Image from "next/image";
import { useState } from "react";
import { Header, Footer } from "@/components/sections";
import { PageHero } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Play, Calendar, Building, Camera } from "lucide-react";

const constructionTimeline = [
  {
    date: "Январь 2024",
    title: "Начало строительства",
    description: "Заложен фундамент, начаты земляные работы",
    completed: true,
    image: "/images/construction/jan-2024.jpg",
  },
  {
    date: "Апрель 2024",
    title: "Возведение каркаса",
    description: "Завершены работы по каркасу 1-5 этажей",
    completed: true,
    image: "/images/construction/apr-2024.jpg",
  },
  {
    date: "Август 2024",
    title: "Фасадные работы",
    description: "Начаты работы по утеплению и облицовке фасада",
    completed: true,
    image: "/images/construction/aug-2024.jpg",
  },
  {
    date: "Декабрь 2024",
    title: "Внутренняя отделка",
    description: "Отделочные работы в квартирах, установка окон",
    completed: false,
    current: true,
    image: "/images/construction/dec-2024.jpg",
  },
  {
    date: "Июнь 2025",
    title: "Благоустройство",
    description: "Озеленение и благоустройство территории",
    completed: false,
    image: "/images/construction/jun-2025.jpg",
  },
  {
    date: "Декабрь 2025",
    title: "Сдача объекта",
    description: "Ввод в эксплуатацию, передача ключей",
    completed: false,
    image: "/images/construction/dec-2025.jpg",
  },
];

const constructionStats = [
  { label: "Готовность объекта", value: "65%" },
  { label: "Этажей построено", value: "12/15" },
  { label: "До сдачи осталось", value: "12 мес" },
];

const galleryImages = [
  { src: "/images/construction/gallery/1.jpg", alt: "Строительство - вид 1" },
  { src: "/images/construction/gallery/2.jpg", alt: "Строительство - вид 2" },
  { src: "/images/construction/gallery/3.jpg", alt: "Строительство - вид 3" },
  { src: "/images/construction/gallery/4.jpg", alt: "Строительство - вид 4" },
  { src: "/images/construction/gallery/5.jpg", alt: "Строительство - вид 5" },
  { src: "/images/construction/gallery/6.jpg", alt: "Строительство - вид 6" },
];

export default function ConstructionPage() {
  const [activePhase, setActivePhase] = useState(3); // Current phase index

  return (
    <>
      <Header />
      <main>
        <PageHero
          title="Строительство"
          subtitle="ХОД СТРОИТЕЛЬСТВА"
          image="/images/hero/1.png"
        />

        {/* Progress Stats */}
        <section className="py-12 bg-cream">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
              {constructionStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm text-primary font-medium uppercase tracking-wider mb-2">
                Этапы строительства
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold">
                График работ
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Timeline */}
              <div className="space-y-0">
                {constructionTimeline.map((phase, index) => (
                  <div
                    key={index}
                    className={`relative pl-8 pb-8 border-l-2 ${
                      phase.completed
                        ? "border-primary"
                        : phase.current
                        ? "border-primary"
                        : "border-muted"
                    } last:pb-0 cursor-pointer`}
                    onClick={() => setActivePhase(index)}
                  >
                    {/* Dot */}
                    <div
                      className={`absolute left-0 top-0 w-4 h-4 rounded-full -translate-x-[9px] ${
                        phase.completed
                          ? "bg-primary"
                          : phase.current
                          ? "bg-primary ring-4 ring-primary/20"
                          : "bg-muted"
                      }`}
                    >
                      {phase.completed && (
                        <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                      )}
                    </div>

                    {/* Content */}
                    <div
                      className={`p-4 rounded-lg transition-colors ${
                        activePhase === index
                          ? "bg-cream"
                          : "hover:bg-cream/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {phase.date}
                        </span>
                        {phase.current && (
                          <Badge className="bg-primary text-xs">Текущий этап</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg">{phase.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Phase Image */}
              <div className="sticky top-24">
                <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={constructionTimeline[activePhase].image}
                    alt={constructionTimeline[activePhase].title}
                    fill
                    className="object-cover"
                  />
                  {/* Placeholder overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-12 h-12 mx-auto mb-2 text-primary/30" />
                      <p className="text-primary/50 font-medium">
                        {constructionTimeline[activePhase].title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {constructionTimeline[activePhase].date}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-cream rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Последнее обновление: Декабрь 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-16 bg-beige">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm text-primary font-medium uppercase tracking-wider mb-2">
                Фото со стройки
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold">
                Галерея строительства
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square bg-muted rounded-lg overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {/* Placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-primary/30" />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm text-primary font-medium uppercase tracking-wider mb-2">
                Видео
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold">
                Облёт с дрона
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                {/* Video Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <button className="w-20 h-20 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors group">
                    <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-cream">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <Building className="w-12 h-12 mx-auto mb-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
              Хотите посетить стройку?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Запишитесь на экскурсию и посмотрите ход строительства своими глазами
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Записаться на экскурсию
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
