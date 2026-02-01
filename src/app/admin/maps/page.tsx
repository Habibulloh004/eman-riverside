"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import MapPicker from "@/components/admin/MapPicker";
import { mapIconsApi, MapIcon, MapIconType } from "@/lib/api/map-icons";
import { settingsApi } from "@/lib/api/settings";
import { useAdminLanguage } from "@/contexts/AdminLanguageContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const resolveUrl = (url: string) => (url.startsWith("http") ? url : `${API_URL}${url}`);

export default function AdminMapsPage() {
  const { t, lang } = useAdminLanguage();
  const [types, setTypes] = useState<MapIconType[]>([]);
  const [markers, setMarkers] = useState<MapIcon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingTypeIcon, setIsUploadingTypeIcon] = useState(false);
  const [isSavingType, setIsSavingType] = useState(false);
  const [isSavingMarker, setIsSavingMarker] = useState(false);

  const [typeForm, setTypeForm] = useState({ name_ru: "", name_uz: "", icon: "" });
  const [markerForm, setMarkerForm] = useState({ name_ru: "", name_uz: "", type_id: 0 });
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);
  const [mapDefaults, setMapDefaults] = useState({ lat: "", lng: "", zoom: "" });
  const [isSavingDefaults, setIsSavingDefaults] = useState(false);

  const loadTypes = useCallback(async () => {
    const data = await mapIconsApi.listTypes();
    setTypes(data.items || []);
  }, []);

  const loadMarkers = useCallback(async () => {
    const data = await mapIconsApi.list();
    setMarkers(data.items || []);
  }, []);

  const loadDefaults = useCallback(async () => {
    const data = await settingsApi.list("content");
    const getValue = (key: string) => data.find((s) => s.key === key)?.value || "";
    const coords = getValue("map_coordinates");
    const zoom = getValue("map_zoom");
    const [lat, lng] = coords.split(",").map((value) => value.trim());

    setMapDefaults({
      lat: lat || "",
      lng: lng || "",
      zoom: zoom || "",
    });
  }, []);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([loadTypes(), loadMarkers(), loadDefaults()]);
    } catch (error) {
      console.error("Failed to load map data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [loadDefaults, loadMarkers, loadTypes]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const mapMarkers = useMemo(
    () =>
      markers.map((marker) => ({
        id: marker.id,
        name:
          (lang === "ru" ? marker.name_ru : marker.name_uz) ||
          marker.name ||
          marker.name_ru ||
          marker.name_uz,
        lat: marker.lat,
        lng: marker.lng,
        iconUrl: marker.type?.icon ? resolveUrl(marker.type.icon) : undefined,
      })),
    [lang, markers]
  );

  const handleTypeIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingTypeIcon(true);
    try {
      const result = await mapIconsApi.uploadTypeIcon(file);
      setTypeForm((prev) => ({ ...prev, icon: result.url }));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploadingTypeIcon(false);
    }
  };

  const handleCreateType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeForm.name_ru.trim()) {
      alert(t.maps.typeNameRuRequired);
      return;
    }
    if (!typeForm.name_uz.trim()) {
      alert(t.maps.typeNameUzRequired);
      return;
    }
    if (!typeForm.icon) {
      alert(t.maps.iconRequired);
      return;
    }

    setIsSavingType(true);
    try {
      await mapIconsApi.createType({
        name: typeForm.name_ru.trim(),
        name_ru: typeForm.name_ru.trim(),
        name_uz: typeForm.name_uz.trim(),
        icon: typeForm.icon,
      });
      setTypeForm({ name_ru: "", name_uz: "", icon: "" });
      loadTypes();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setIsSavingType(false);
    }
  };

  const handleDeleteType = async (id: number) => {
    if (!confirm(t.maps.confirmDelete)) return;
    try {
      await mapIconsApi.deleteType(id);
      loadTypes();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete");
    }
  };

  const handleCreateMarker = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!markerForm.name_ru.trim()) {
      alert(t.maps.markerNameRuRequired);
      return;
    }
    if (!markerForm.name_uz.trim()) {
      alert(t.maps.markerNameUzRequired);
      return;
    }
    if (!markerForm.type_id) {
      alert(t.maps.markerTypeRequired);
      return;
    }
    if (!selectedCoords) {
      alert(t.maps.coordsRequired);
      return;
    }

    setIsSavingMarker(true);
    try {
      await mapIconsApi.create({
        name: markerForm.name_ru.trim(),
        name_ru: markerForm.name_ru.trim(),
        name_uz: markerForm.name_uz.trim(),
        type_id: markerForm.type_id,
        lat: selectedCoords[0],
        lng: selectedCoords[1],
      });
      setMarkerForm({ name_ru: "", name_uz: "", type_id: 0 });
      setSelectedCoords(null);
      loadMarkers();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setIsSavingMarker(false);
    }
  };

  const handleDeleteMarker = async (id: number) => {
    if (!confirm(t.maps.confirmDelete)) return;
    try {
      await mapIconsApi.delete(id);
      loadMarkers();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete");
    }
  };

  const handleSaveDefaults = async (e: React.FormEvent) => {
    e.preventDefault();
    const lat = Number.parseFloat(mapDefaults.lat);
    const lng = Number.parseFloat(mapDefaults.lng);
    const zoom = Number.parseInt(mapDefaults.zoom, 10);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      alert(t.maps.defaultCenterRequired);
      return;
    }

    if (!Number.isFinite(zoom)) {
      alert(t.maps.defaultZoomRequired);
      return;
    }

    setIsSavingDefaults(true);
    try {
      await settingsApi.bulkUpdate([
        { key: "map_coordinates", value: `${lat},${lng}` },
        { key: "map_zoom", value: `${zoom}` },
      ]);
      alert(t.maps.defaultsSaved);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setIsSavingDefaults(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t.maps.title}</h1>
        <p className="text-gray-500 text-sm mt-1">{t.maps.subtitle}</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.maps.defaultsTitle}</h2>
              <form onSubmit={handleSaveDefaults} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.maps.defaultCenterLat}
                  </label>
                  <input
                    type="text"
                    value={mapDefaults.lat}
                    onChange={(e) => setMapDefaults({ ...mapDefaults, lat: e.target.value })}
                    placeholder="41.3111"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.maps.defaultCenterLng}
                  </label>
                  <input
                    type="text"
                    value={mapDefaults.lng}
                    onChange={(e) => setMapDefaults({ ...mapDefaults, lng: e.target.value })}
                    placeholder="69.2401"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.maps.defaultZoom}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={mapDefaults.zoom}
                    onChange={(e) => setMapDefaults({ ...mapDefaults, zoom: e.target.value })}
                    placeholder="14"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="md:col-span-3 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedCoords) {
                        alert(t.maps.coordsRequired);
                        return;
                      }
                      setMapDefaults({
                        ...mapDefaults,
                        lat: selectedCoords[0].toFixed(6),
                        lng: selectedCoords[1].toFixed(6),
                      });
                    }}
                    className="text-sm text-gray-600 hover:underline"
                  >
                    {t.maps.useSelectedCenter}
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingDefaults}
                    className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-black transition-colors disabled:opacity-60"
                  >
                    {isSavingDefaults ? t.maps.saving : t.maps.saveDefaults}
                  </button>
                </div>
              </form>
            </section>

            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.maps.markersTitle}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="h-80 rounded-lg overflow-hidden border border-gray-200">
                    <MapPicker
                      className="w-full h-full"
                      markers={mapMarkers}
                      selected={selectedCoords}
                      onSelect={(coords) => setSelectedCoords(coords)}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{t.maps.pickOnMap}</p>
                </div>
                <form onSubmit={handleCreateMarker} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.maps.markerNameRu}
                    </label>
                    <input
                      type="text"
                      value={markerForm.name_ru}
                      onChange={(e) => setMarkerForm({ ...markerForm, name_ru: e.target.value })}
                      placeholder={t.maps.markerNamePlaceholderRu}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.maps.markerNameUz}
                    </label>
                    <input
                      type="text"
                      value={markerForm.name_uz}
                      onChange={(e) => setMarkerForm({ ...markerForm, name_uz: e.target.value })}
                      placeholder={t.maps.markerNamePlaceholderUz}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.maps.markerType}
                    </label>
                    <select
                      value={markerForm.type_id || ""}
                      onChange={(e) => setMarkerForm({ ...markerForm, type_id: Number(e.target.value) })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">{t.maps.selectType}</option>
                      {types.map((type) => (
                        <option key={type.id} value={type.id}>
                          {(lang === "ru" ? type.name_ru : type.name_uz) ||
                            type.name ||
                            type.name_ru ||
                            type.name_uz}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.maps.markerLat}
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={selectedCoords ? selectedCoords[0].toFixed(6) : ""}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.maps.markerLng}
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={selectedCoords ? selectedCoords[1].toFixed(6) : ""}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSavingMarker}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-60"
                  >
                    {isSavingMarker ? t.maps.saving : t.maps.addMarker}
                  </button>
                </form>
              </div>

              <div className="mt-6 border-t pt-4">
                {markers.length === 0 ? (
                  <p className="text-sm text-gray-500">{t.maps.noMarkers}</p>
                ) : (
                  <div className="space-y-3">
                    {markers.map((marker) => {
                      const markerNameRu = marker.name_ru || marker.name || marker.name_uz;
                      const markerNameUz = marker.name_uz || marker.name || marker.name_ru;
                      const typeNameRu = marker.type?.name_ru || marker.type?.name || marker.type?.name_uz || "-";
                      const typeNameUz = marker.type?.name_uz || marker.type?.name || marker.type?.name_ru || "-";
                      return (
                        <div
                          key={marker.id}
                          className="flex items-center justify-between border border-gray-200 rounded-md px-3 py-2"
                        >
                          <div>
                            <div className="font-medium text-gray-900">
                              {markerNameRu} / {markerNameUz}
                            </div>
                            <div className="text-xs text-gray-500">
                              {typeNameRu} / {typeNameUz} • {marker.lat.toFixed(5)}, {marker.lng.toFixed(5)}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteMarker(marker.id)}
                            className="text-sm text-red-600 hover:underline"
                          >
                            {t.maps.delete}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </div>

          <section className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.maps.typesTitle}</h2>
            <form onSubmit={handleCreateType} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.maps.typeNameRu}
                </label>
                <input
                  type="text"
                  value={typeForm.name_ru}
                  onChange={(e) => setTypeForm({ ...typeForm, name_ru: e.target.value })}
                  placeholder={t.maps.typeNamePlaceholderRu}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.maps.typeNameUz}
                </label>
                <input
                  type="text"
                  value={typeForm.name_uz}
                  onChange={(e) => setTypeForm({ ...typeForm, name_uz: e.target.value })}
                  placeholder={t.maps.typeNamePlaceholderUz}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.maps.typeIcon}
                </label>
                <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                  <input
                    id="type-icon-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleTypeIconUpload}
                    className="hidden"
                  />
                  <label htmlFor="type-icon-upload" className="cursor-pointer text-sm text-gray-600">
                    {isUploadingTypeIcon ? t.maps.uploading : t.maps.uploadIcon}
                  </label>
                  {typeForm.icon && (
                    <div className="mt-3 flex items-center justify-center">
                      <img
                        src={resolveUrl(typeForm.icon)}
                        alt={typeForm.name_ru || typeForm.name_uz}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    value={typeForm.icon}
                    onChange={(e) => setTypeForm({ ...typeForm, icon: e.target.value })}
                    placeholder={t.maps.iconUrlPlaceholder}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t.maps.iconUrlHint}</p>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSavingType}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-black transition-colors disabled:opacity-60"
              >
                {isSavingType ? t.maps.saving : t.maps.addType}
              </button>
            </form>

            <div className="mt-6 border-t pt-4">
              {types.length === 0 ? (
                <p className="text-sm text-gray-500">{t.maps.noTypes}</p>
              ) : (
                <div className="space-y-3">
                  {types.map((type) => {
                    const typeNameRu = type.name_ru || type.name || type.name_uz;
                    const typeNameUz = type.name_uz || type.name || type.name_ru;
                    return (
                      <div
                        key={type.id}
                        className="flex items-center justify-between border border-gray-200 rounded-md px-3 py-2"
                      >
                        <div className="flex items-center gap-3">
                          {type.icon && (
                            <img
                              src={resolveUrl(type.icon)}
                              alt={typeNameRu || typeNameUz || type.name}
                              className="w-8 h-8 object-contain"
                            />
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {typeNameRu} / {typeNameUz}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteType(type.id)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          {t.maps.delete}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
