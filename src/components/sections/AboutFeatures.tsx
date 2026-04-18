"use client";

import { useMemo, useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProjectsPublic } from "@/hooks/useProjects";
import { FeatureSkeleton } from "@/components/ui/skeleton";
import { Project } from "@/lib/api/projects";
import { sanitizeRichTextHtml } from "@/lib/rich-text";
import { useCountUp } from "@/hooks/useCountUp";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";

interface FeatureItemProps {
  project: Project;
  index: number;
  language: string;
}

const fallbackContent = {
  ru: [
    {
      title: "Архитектура и",
      subtitle: "материалы",
      description:
        "<h3>Фасады</h3><ul><li>Декоративная покраска</li><li>Фрезерованный металл</li><li>Природные оттенки</li><li>Современные формы</li></ul><h3>Общие зоны</h3><ul><li>Керамогранит</li><li>Травертин</li><li>Износостойкие материалы</li></ul>",
    },
    {
      title: "Дворовое",
      subtitle: "пространство",
      description:
        "<h3>Озеленение</h3><p>Территория наполнена деревьями, газонами и растениями, создающими ощущение свежести и приватности.</p><h3>Комфорт</h3><p>Безопасные маршруты, зоны отдыха и продуманное освещение объединены в единый семейный двор.</p><h3>Активность</h3><p>Детские и спортивные площадки расположены рядом, но не конфликтуют с тихими зонами.</p>",
    },
    {
      title: "Ваша",
      subtitle: "квартира",
      description:
        "<p>Квартиры Eman Riverside созданы с учетом семейного сценария жизни: больше света, воздуха и полезного пространства.</p><ul><li>Высота потолков 3 метра</li><li>Панорамные окна</li><li>Функциональные планировки</li><li>Просторные кухни-гостиные</li><li>Подготовка под white box</li></ul>",
    },
  ],
  uz: [
    {
      title: "Arxitektura va",
      subtitle: "materiallar",
      description:
        "<h3>Fasadlar</h3><ul><li>Dekorativ bo'yash</li><li>Frezerlangan metall</li><li>Tabiiy ranglar</li><li>Zamonaviy shakllar</li></ul><h3>Umumiy zonalar</h3><ul><li>Keramogranit</li><li>Travertin</li><li>Bardoshli materiallar</li></ul>",
    },
    {
      title: "Hovli",
      subtitle: "makoni",
      description:
        "<h3>Ko'kalamzor</h3><p>Hudud daraxtlar, maysazor va o'simliklar bilan to'ldirilib, salqin va sokin muhit yaratadi.</p><h3>Qulaylik</h3><p>Dam olish zonalari, yoritish va xavfsiz ichki yo'laklar oilaviy kundalik hayot uchun uyg'unlashtirilgan.</p><h3>Faollik</h3><p>Bolalar va sport maydonlari tinch hududlar bilan muvozanatli joylashtirilgan.</p>",
    },
    {
      title: "Sizning",
      subtitle: "kvartirangiz",
      description:
        "<p>Eman Riverside kvartiralari oilaviy yashash ssenariysi uchun loyihalangan: ko'proq yorug'lik, havo va foydali maydon.</p><ul><li>3 metr shift balandligi</li><li>Panoramali derazalar</li><li>Qulay rejalashtirish</li><li>Keng oshxona-mehmonxona</li><li>White box tayyorgarligi</li></ul>",
    },
  ],
} as const;

function FeatureItem({ project, index, language }: FeatureItemProps) {
  const number = String(index + 1).padStart(2, "0");
  const isTextFirst = index % 2 === 0;
  const fallback = fallbackContent[language === "uz" ? "uz" : "ru"][
    index % fallbackContent.ru.length
  ];

  const title = (language === "uz" ? project.type_uz : project.type_ru)?.trim();
  const subtitle = (language === "uz" ? project.area_uz : project.area_ru)?.trim();
  const rawDescription =
    language === "uz" ? project.description_uz : project.description_ru;
  const resolvedDescription =
    rawDescription && rawDescription.replace(/<[^>]+>/g, "").trim().length > 24
      ? rawDescription
      : fallback.description;
  const descriptionHtml = useMemo(
    () => sanitizeRichTextHtml(resolvedDescription || ""),
    [resolvedDescription]
  );
  const image = project.image
    ? project.image.startsWith("http")
      ? project.image
      : `${API_URL}${project.image}`
    : "/images/hero/1.png";

  return (
    <article
      id={`feature-${number}`}
      data-page-section-anim="true"
      className="scroll-mt-20"
    >
      <div className="overflow-hidden rounded-[18px] bg-white/55 shadow-[0_18px_44px_rgba(86,83,75,0.08)] ring-1 ring-[#EFE4D9]">
        <div className="grid lg:grid-cols-2">
          {isTextFirst ? (
            <>
              <FeatureCopy
                number={number}
                title={title || fallback.title}
                subtitle={subtitle || fallback.subtitle}
                descriptionHtml={descriptionHtml}
              />
              <FeatureImage image={image} title={title || fallback.title} />
            </>
          ) : (
            <>
              <FeatureImage image={image} title={title || fallback.title} />
              <FeatureCopy
                number={number}
                title={title || fallback.title}
                subtitle={subtitle || fallback.subtitle}
                descriptionHtml={descriptionHtml}
              />
            </>
          )}
        </div>
      </div>
    </article>
  );
}

function FeatureCopy({
  number,
  title,
  subtitle,
  descriptionHtml,
}: {
  number: string;
  title: string;
  subtitle: string;
  descriptionHtml: string;
}) {
  const numberRef = useRef<HTMLDivElement>(null);
  useCountUp(numberRef, number);

  return (
    <div className="relative flex min-h-[220px] flex-col justify-center overflow-hidden bg-primary px-5 py-5 text-white sm:px-6 sm:py-6 lg:min-h-[390px] lg:px-7 lg:py-7">
      <div ref={numberRef} className="absolute left-4 top-3 text-[68px] font-semibold leading-none text-white/10 sm:text-[80px] lg:left-5 lg:top-4 lg:text-[92px]">
        {number}
      </div>

      <div className="relative z-10 max-w-[320px] pt-10 lg:pt-12">
        <h3 className="max-w-[250px] text-[1.75rem] font-light leading-[0.98] tracking-[-0.04em] sm:text-[2rem] lg:text-[2.35rem]">
          {title}
          {subtitle ? <span className="block">{subtitle}</span> : null}
        </h3>

        {descriptionHtml ? (
          <div
            data-page-body-anim="true"
            className="mt-3 text-[11px] leading-4.5 text-white/76 lg:text-[12px] lg:leading-5 [&_h1]:mb-2 [&_h1]:text-base [&_h1]:font-medium [&_h2]:mb-2 [&_h2]:text-sm [&_h2]:font-medium [&_h3]:mb-1 [&_h3]:text-[10px] [&_h3]:font-semibold [&_h3]:uppercase [&_h3]:tracking-[0.2em] [&_p]:mb-2.5 [&_p:last-child]:mb-0 [&_ul]:grid [&_ul]:gap-y-1 [&_ul]:pl-0 [&_li]:list-none [&_li]:pl-3 [&_li]:relative [&_li]:text-white/72 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.42rem] [&_li]:before:h-1 [&_li]:before:w-1 [&_li]:before:rounded-full [&_li]:before:bg-white/60"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        ) : null}
      </div>
    </div>
  );
}

function FeatureImage({ image, title }: { image: string; title: string }) {
  return (
    <div className="relative min-h-[220px] lg:min-h-[390px] overflow-hidden">
      <Image
        src={image}
        alt={title || "Feature"}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
        data-speed="0.9"
      />
    </div>
  );
}

export default function AboutFeatures() {
  const { language } = useLanguage();
  const { data, isLoading } = useProjectsPublic();

  const projects = data?.items || [];

  if (isLoading) {
    return (
      <div className="py-5">
        <div className="container mx-auto space-y-4 px-4 lg:px-8">
          <FeatureSkeleton />
          <FeatureSkeleton />
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="py-5 lg:pb-20">
      <div className="container mx-auto space-y-3 px-4 lg:space-y-4 lg:px-8">
        {projects.slice(0, 3).map((project, index) => (
          <FeatureItem
            key={project.id}
            project={project}
            index={index}
            language={language}
          />
        ))}
      </div>
    </section>
  );
}
