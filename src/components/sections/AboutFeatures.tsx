"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProjectsPublic } from "@/hooks/useProjects";
import { FeatureSkeleton } from "@/components/ui/skeleton";
import { Project } from "@/lib/api/projects";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";

interface FeatureItemProps {
  project: Project;
  index: number;
  language: string;
  t: Record<string, unknown>;
}

function FeatureItem({ project, index, language, t }: FeatureItemProps) {
  const number = String(index + 1).padStart(2, "0");
  const isEven = index % 2 === 1;

  const title = language === "uz" ? project.type_uz : project.type_ru;
  const titleLine2 = language === "uz" ? project.area_uz : project.area_ru;
  const description = language === "uz" ? project.description_uz : project.description_ru;
  const image = project.image
    ? (project.image.startsWith("http") ? project.image : `${API_URL}${project.image}`)
    : "/images/hero/1.png";

  const featureKey = `feature0${index + 1}` as keyof typeof t;
  const featureT = (t[featureKey] || {}) as Record<string, unknown>;
  const label = (featureT.label as string) || `Feature ${number}`;

  return (
    <div
      id={`feature-${number}`}
      className={`scroll-mt-20 ${index === 0 ? "pb-24 lg:pb-32 pt-20" : "py-24 lg:py-32"} bg-[#F9EFE7] relative overflow-hidden`}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/1.png"
          alt=""
          fill
          className="object-cover opacity-[0.04]"
          sizes="100vw"
        />
      </div>
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Content */}
          <div className={`relative ${isEven ? "lg:order-2" : ""}`}>
            <span className="absolute -top-8 -left-4 text-[120px] lg:text-[180px] font-serif font-bold text-primary/10 leading-none select-none pointer-events-none">
              {number}
            </span>

            <div className="relative z-10 pt-16 lg:pt-24">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-px bg-primary" />
                <span className="text-xs text-primary font-medium uppercase tracking-[0.2em]">
                  {label}
                </span>
              </div>

              <h3 className="text-2xl lg:text-4xl font-serif mb-8">
                {titleLine2}
              </h3>

              {description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Image */}
          <div className={`relative aspect-4/3 rounded-lg overflow-hidden bg-muted ${isEven ? "lg:order-1" : ""}`}>
            <Image
              src={image}
              alt={title || "Feature"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AboutFeatures() {
  const { t, language } = useLanguage();
  const { data, isLoading } = useProjectsPublic();

  const projects = data?.items || [];

  if (isLoading) {
    return (
      <>
        <FeatureSkeleton />
        <FeatureSkeleton />
      </>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <>
      {projects.map((project, index) => (
        <FeatureItem
          key={project.id}
          project={project}
          index={index}
          language={language}
          t={t as Record<string, unknown>}
        />
      ))}
    </>
  );
}
