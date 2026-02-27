"use client";

import { useMemo } from "react";
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

function sanitizeRichTextHtml(html: string): string {
  if (!html) return "";

  const allowedTags = new Set([
    "p",
    "br",
    "b",
    "strong",
    "i",
    "em",
    "u",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "a",
    "span",
    "div",
  ]);

  const sanitizeInlineStyle = (rawStyle: string): string => {
    const declarations = rawStyle.split(";");
    const safe: string[] = [];

    declarations.forEach((declaration) => {
      const parts = declaration.split(":");
      if (parts.length < 2) return;

      const property = parts[0].trim().toLowerCase();
      const value = parts.slice(1).join(":").trim();
      if (!property || !value) return;

      const loweredValue = value.toLowerCase();
      if (
        loweredValue.includes("url(") ||
        loweredValue.includes("expression") ||
        loweredValue.includes("@import") ||
        loweredValue.includes("javascript:") ||
        loweredValue.includes("var(") ||
        loweredValue.includes("calc(")
      ) {
        return;
      }

      const isColor = /^(#[0-9a-f]{3,8}|[a-z]+|rgba?\(\s*[\d.\s,]+\))$/i.test(value);
      const isFontSize =
        /^(\d+(\.\d+)?(px|rem|em|%)|xx-small|x-small|small|medium|large|x-large|xx-large|smaller|larger)$/i.test(
          value
        );

      const validators: Record<string, boolean> = {
        color: isColor,
        "background-color": isColor,
        "font-weight": /^(normal|bold|bolder|lighter|[1-9]00)$/i.test(value),
        "font-style": /^(normal|italic|oblique)$/i.test(value),
        "text-decoration": /^(none|underline|line-through|overline)(\s+(underline|line-through|overline))*$/i.test(
          value
        ),
        "text-align": /^(left|right|center|justify|start|end)$/i.test(value),
        "font-size": isFontSize,
        "list-style-type": /^(disc|circle|square|decimal|lower-alpha|upper-alpha|lower-roman|upper-roman)$/i.test(
          value
        ),
      };

      if (validators[property]) {
        safe.push(`${property}:${value}`);
      }
    });

    return safe.join("; ");
  };

  const escapeAttribute = (value: string): string =>
    value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const getAttributeValue = (attrs: string, attrName: string): string => {
    const regex = new RegExp(`${attrName}\\s*=\\s*(\"([^\"]*)\"|'([^']*)'|([^\\s>]+))`, "i");
    const match = attrs.match(regex);
    return (match?.[2] || match?.[3] || match?.[4] || "").trim();
  };

  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (fullTag, rawTagName: string, rawAttrs: string) => {
      const tagName = rawTagName.toLowerCase();
      if (!allowedTags.has(tagName)) return "";

      const isClosingTag = /^<\s*\//.test(fullTag);
      if (isClosingTag) return `</${tagName}>`;

      if (tagName === "br") return "<br>";

      if (tagName === "a") {
        const href = getAttributeValue(rawAttrs, "href");
        const isSafeHref = /^(https?:|mailto:|tel:|\/|#)/i.test(href);
        return isSafeHref
          ? `<a href="${escapeAttribute(href)}" rel="noopener noreferrer">`
          : "<a>";
      }

      const style = sanitizeInlineStyle(getAttributeValue(rawAttrs, "style"));
      return style ? `<${tagName} style="${escapeAttribute(style)}">` : `<${tagName}>`;
    })
    .trim();
}

function FeatureItem({ project, index, language, t }: FeatureItemProps) {
  const number = String(index + 1).padStart(2, "0");
  const isEven = index % 2 === 1;

  const title = language === "uz" ? project.type_uz : project.type_ru;
  const titleLine2 = language === "uz" ? project.area_uz : project.area_ru;
  const rawDescription = language === "uz" ? project.description_uz : project.description_ru;
  const descriptionHtml = useMemo(() => sanitizeRichTextHtml(rawDescription || ""), [rawDescription]);
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

              {descriptionHtml && (
                <div
                  className="text-sm text-muted-foreground leading-relaxed [&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
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
