"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { mapIconsApi, MapIcon } from "@/lib/api/map-icons";
import { settingsApi } from "@/lib/api/settings";
import { useLanguage } from "@/contexts/LanguageContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";

export interface YandexMapProps {
  coordinates?: [number, number];
  zoom?: number;
  className?: string;
  grayscale?: boolean;
}

type YandexMapInnerProps = Omit<YandexMapProps, "className" | "grayscale">;

function YandexMapInner({ coordinates, zoom }: YandexMapInnerProps) {
  const [markers, setMarkers] = useState<MapIcon[]>([]);
  const [defaultCenter, setDefaultCenter] = useState<[number, number] | null>(null);
  const [defaultZoom, setDefaultZoom] = useState<number | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    let isMounted = true;
    mapIconsApi
      .listPublic()
      .then((data) => {
        if (!isMounted) return;
        setMarkers(data.items || []);
      })
      .catch(() => {
        if (!isMounted) return;
        setMarkers([]);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    settingsApi
      .getByCategory("content")
      .then((data) => {
        if (!isMounted) return;
        const coords = data.map_coordinates || "";
        const zoomValue = data.map_zoom || "";
        const [latRaw, lngRaw] = coords.split(",").map((value) => value.trim());
        const lat = Number.parseFloat(latRaw);
        const lng = Number.parseFloat(lngRaw);
        const zoomParsed = Number.parseInt(zoomValue, 10);

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          setDefaultCenter([lat, lng]);
        }
        if (Number.isFinite(zoomParsed)) {
          setDefaultZoom(zoomParsed);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setDefaultCenter(null);
        setDefaultZoom(null);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const effectiveCenter = coordinates || defaultCenter || [41.3111, 69.2401];
  const effectiveZoom = zoom ?? defaultZoom ?? 14;
  const mapKey = `${effectiveCenter[0]}-${effectiveCenter[1]}-${effectiveZoom}`;

  const resolvedMarkers = useMemo(() => {
    return markers.map((marker) => {
      const icon = marker.type?.icon || "";
      const iconUrl = icon.startsWith("http") ? icon : `${API_URL}${icon}`;
      const markerName =
        (language === "ru" ? marker.name_ru : marker.name_uz) ||
        marker.name ||
        marker.name_ru ||
        marker.name_uz;
      return {
        id: marker.id,
        name: markerName,
        coords: [marker.lat, marker.lng] as [number, number],
        iconUrl: icon ? iconUrl : "",
      };
    });
  }, [language, markers]);

  return (
    <YMaps query={{ apikey: process.env.NEXT_PUBLIC_YANDEX_API_KEY, lang: "ru_RU" }}>
      <Map
        key={mapKey}
        defaultState={{ center: effectiveCenter, zoom: effectiveZoom }}
        width="100%"
        height="100%"
      >
        {resolvedMarkers.map((marker) => (
          <Placemark
            key={marker.id}
            geometry={marker.coords}
            properties={{
              hintContent: marker.name,
              balloonContent: marker.name,
            }}
            modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}
            options={
              marker.iconUrl
                ? {
                    iconLayout: "default#image",
                    iconImageHref: marker.iconUrl,
                    iconImageSize: [32, 32],
                    iconImageOffset: [-16, -32],
                    openBalloonOnClick: true,
                  }
                : { preset: "islands#blueDotIcon", openBalloonOnClick: true }
            }
          />
        ))}
      </Map>
    </YMaps>
  );
}

const DynamicYandexMap = dynamic(() => Promise.resolve(YandexMapInner), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted animate-pulse rounded-lg" />
  ),
});

export default function YandexMap({
  className,
  grayscale = true,
  coordinates,
  zoom,
}: YandexMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) return;
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={grayscale ? { filter: "grayscale(100%)" } : undefined}
    >
      {isVisible ? (
        <DynamicYandexMap coordinates={coordinates} zoom={zoom} />
      ) : (
        <div className="w-full h-full bg-muted animate-pulse rounded-lg" />
      )}
    </div>
  );
}
