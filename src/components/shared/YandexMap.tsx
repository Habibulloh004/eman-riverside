"use client";

import dynamic from "next/dynamic";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";

interface YandexMapProps {
  coordinates?: [number, number];
  zoom?: number;
  className?: string;
  markerHint?: string;
  grayscale?: boolean;
}

function YandexMapInner({
  coordinates = [41.3111, 69.2401],
  zoom = 14,
  className,
  markerHint = "Eman Riverside",
  grayscale = true,
}: YandexMapProps) {
  return (
    <div
      className={className}
      style={grayscale ? { filter: "grayscale(100%)" } : undefined}
    >
      <YMaps query={{ apikey: process.env.NEXT_PUBLIC_YANDEX_API_KEY, lang: "ru_RU" }}>
        <Map
          defaultState={{ center: coordinates, zoom }}
          width="100%"
          height="100%"
        >
          <Placemark
            geometry={coordinates}
            properties={{ hintContent: markerHint }}
          />
        </Map>
      </YMaps>
    </div>
  );
}

const YandexMap = dynamic(() => Promise.resolve(YandexMapInner), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted animate-pulse rounded-lg" />
  ),
});

export default YandexMap;
