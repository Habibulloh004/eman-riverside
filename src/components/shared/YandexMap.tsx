"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Globe, X } from "lucide-react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { mapIconsApi, MapIcon } from "@/lib/api/map-icons";
import { settingsApi } from "@/lib/api/settings";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { pickLocalizedString } from "@/lib/i18n/localized";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";
const TASHKENT_CENTER: [number, number] = [41.3111, 69.2401];
const DEFAULT_MAP_ZOOM = 14;
const PANORAMA_URL = "https://uzbekistan360.uz/ru/location/zhk-eman-riversideWwl";

export interface YandexMapProps {
  coordinates?: [number, number];
  zoom?: number;
  className?: string;
  grayscale?: boolean;
  showPanoramaButton?: boolean;
  openPanoramaSignal?: number;
}

type YandexMapInnerProps = Omit<YandexMapProps, "className" | "grayscale">;

const buildYandexMapUrl = (center: [number, number], zoom: number) => {
  const lat = center[0];
  const lng = center[1];
  return `https://yandex.ru/maps/?ll=${lng},${lat}&z=${zoom}&pt=${lng},${lat},pm2rdm`;
};

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

  const effectiveCenter = coordinates || defaultCenter || TASHKENT_CENTER;
  const effectiveZoom = zoom ?? defaultZoom ?? DEFAULT_MAP_ZOOM;
  const mapKey = `${effectiveCenter[0]}-${effectiveCenter[1]}-${effectiveZoom}`;
  const yandexMapUrl = useMemo(
    () => buildYandexMapUrl(effectiveCenter, effectiveZoom),
    [effectiveCenter, effectiveZoom]
  );

  const resolvedMarkers = useMemo(() => {
    return markers.map((marker) => {
      const icon = marker.type?.icon || "";
      const iconUrl = icon.startsWith("http") ? icon : `${API_URL}${icon}`;
      const markerName =
        pickLocalizedString(language, {
          ru: marker.name_ru || marker.name,
          uz: marker.name_uz,
          en: marker.name_en,
        }) || marker.name;
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
        onClick={() => {
          window.open(yandexMapUrl, "_blank", "noopener,noreferrer");
        }}
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

function YandexMap({
  className,
  grayscale = true,
  coordinates,
  zoom,
  showPanoramaButton = true,
  openPanoramaSignal,
}: YandexMapProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPanoramaOpen, setIsPanoramaOpen] = useState(false);

  useEffect(() => {
    if (isVisible) return;
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setIsVisible(true));
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

  const prevSignalRef = useRef(openPanoramaSignal);
  useEffect(() => {
    if (openPanoramaSignal === undefined || openPanoramaSignal === 0) return;
    if (openPanoramaSignal === prevSignalRef.current) return;
    prevSignalRef.current = openPanoramaSignal;
    const timeoutId = window.setTimeout(() => {
      setIsPanoramaOpen(true);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [openPanoramaSignal]);

  return (
    <>
      <div ref={containerRef} className={className}>
        <div className="w-full h-full" style={grayscale ? { filter: "grayscale(100%)" } : undefined}>
          {isVisible ? (
            <DynamicYandexMap coordinates={coordinates} zoom={zoom} />
          ) : (
            <div className="w-full h-full bg-muted animate-pulse rounded-lg" />
          )}
        </div>
        {showPanoramaButton ? (
          <Button
            size="sm"
            className="absolute bottom-4 right-4 z-10 rounded-full shadow-lg px-4"
            onClick={() => setIsPanoramaOpen(true)}
          >
            <Globe className="w-4 h-4" />
            {t.location.panoramaButton}
          </Button>
        ) : null}
      </div>

      <Dialog open={isPanoramaOpen} onOpenChange={setIsPanoramaOpen}>
        <DialogContent className="w-[95vw] max-w-[1200px] h-[85vh] sm:h-[90vh] p-0 sm:rounded-2xl overflow-hidden flex flex-col [&>button]:hidden">
          <DialogHeader className="flex-row items-center justify-between text-left gap-0 px-5 sm:px-6 py-4 border-b">
            <DialogTitle className="text-lg sm:text-xl font-serif">
              {t.location.panoramaTitle}
            </DialogTitle>
            <DialogClose
              className="inline-flex items-center justify-center rounded-full border border-border bg-white size-9 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
              aria-label={t.common.close}
            >
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>
          <div className="flex-1 p-4 sm:p-5">
            <div className="relative h-full w-full rounded-2xl overflow-hidden bg-muted border">
              <iframe
                src={PANORAMA_URL}
                title={t.location.panoramaTitle}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(YandexMap);
