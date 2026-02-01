"use client";

import dynamic from "next/dynamic";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";

interface MapMarker {
  id: number | string;
  name: string;
  lat: number;
  lng: number;
  iconUrl?: string;
}

interface MapPickerProps {
  className?: string;
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  selected?: [number, number] | null;
  onSelect?: (coords: [number, number]) => void;
}

function MapPickerInner({
  className,
  center = [41.3111, 69.2401],
  zoom = 14,
  markers = [],
  selected,
  onSelect,
}: MapPickerProps) {
  return (
    <div className={className}>
      <YMaps query={{ apikey: process.env.NEXT_PUBLIC_YANDEX_API_KEY, lang: "ru_RU" }}>
        <Map
          defaultState={{ center, zoom }}
          width="100%"
          height="100%"
          onClick={(e: any) => {
            const coords = e.get("coords") as [number, number];
            onSelect?.(coords);
          }}
        >
          {markers.map((marker) => (
            <Placemark
              key={marker.id}
              geometry={[marker.lat, marker.lng]}
              properties={{
                hintContent: marker.name,
                balloonContent: marker.name,
              }}
              options={
                marker.iconUrl
                  ? {
                      iconLayout: "default#image",
                      iconImageHref: marker.iconUrl,
                      iconImageSize: [32, 32],
                      iconImageOffset: [-16, -32],
                    }
                  : { preset: "islands#blueDotIcon" }
              }
            />
          ))}
          {selected && (
            <Placemark
              geometry={selected}
              properties={{ hintContent: "Selected location" }}
              options={{ preset: "islands#redCircleDotIcon" }}
            />
          )}
        </Map>
      </YMaps>
    </div>
  );
}

const MapPicker = dynamic(() => Promise.resolve(MapPickerInner), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted animate-pulse rounded-lg" />
  ),
});

export default MapPicker;
