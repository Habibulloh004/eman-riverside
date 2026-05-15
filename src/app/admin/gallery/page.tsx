"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import { galleryApi, GalleryItem, CreateGalleryRequest } from "@/lib/api/gallery";
import { VideoModal } from "@/components/ui/hero-video-dialog";
import { useAdminLanguage } from "@/contexts/AdminLanguageContext";
import RichTextEditor from "@/components/ui/rich-text-editor";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";

function resolveImageUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `${API_URL}${url}`;
  return `${API_URL}/${url}`;
}

function normalizeGalleryCategory(value: string) {
  if (value === "construction" || value === "infrastructure") return "gallery";
  return value;
}

/* ================================================================
   Layout Editor — drag-and-drop visual ordering for a category
   ================================================================ */
function CategoryLayoutEditor({
  category,
  items,
  onReorder,
  t,
}: {
  category: string;
  items: GalleryItem[];
  onReorder: (reordered: { id: number; sort_order: number }[]) => void;
  t: ReturnType<typeof import("@/contexts/AdminLanguageContext").useAdminLanguage>["t"];
}) {
  const sorted = useMemo(
    () => [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [items],
  );

  const [orderedItems, setOrderedItems] = useState(sorted);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOrderedItems(sorted), [sorted]);

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }

    const reordered = [...orderedItems];
    const [moved] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOverItem.current, 0, moved);

    setOrderedItems(reordered);

    const payload = reordered.map((item, i) => ({ id: item.id, sort_order: i }));
    onReorder(payload);

    dragItem.current = null;
    dragOverItem.current = null;
  };

  const isInterior = category === "interior";
  const isExterior = category === "exterior";

  const title = isInterior
    ? t.gallery.interiorLayout
    : isExterior
      ? t.gallery.exteriorLayout
      : t.gallery.galleryLayout;

  /* Interior: ascending staircase  |  Exterior: descending  |  Gallery: equal row */
  const getHeight = (index: number) => {
    if (isInterior) {
      const steps = [80, 100, 130, 160];
      return steps[index] ?? 160;
    }
    if (isExterior) {
      const steps = [160, 130, 100, 80];
      return steps[index] ?? 80;
    }
    return 100;
  };

  if (orderedItems.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <p className="text-xs text-gray-400">{t.gallery.layoutPositionHint}</p>
      </div>

      <div className={`flex items-end gap-2 ${!isInterior && !isExterior ? "overflow-x-auto pb-2" : ""}`}>
        {orderedItems.map((item, index) => {
          const h = getHeight(index);
          return (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`relative rounded overflow-hidden border-2 border-transparent hover:border-green-400 cursor-grab active:cursor-grabbing transition-all group ${
                isInterior || isExterior ? "flex-1" : "flex-shrink-0 w-24"
              }`}
              style={{ height: `${h}px`, minWidth: isInterior || isExterior ? undefined : "96px" }}
            >
              {item.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolveImageUrl(item.url)}
                  alt={item.title || ""}
                  className="w-full h-full object-cover pointer-events-none"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-400">{t.gallery.emptySlot}</span>
                </div>
              )}

              {/* Position badge */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-center py-0.5">
                <span className="text-[10px] text-white font-medium">{index + 1}</span>
              </div>

              {/* Drag overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <svg className="w-5 h-5 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
              </div>

              {/* Title tooltip */}
              {item.title && (
                <div className="absolute top-0 left-0 right-0 bg-black/50 px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] text-white truncate block">{item.title}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================
   Layout Preview (static) — shown inside the modal for the item
   ================================================================ */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LayoutPreview({
  category,
  currentImageUrl,
  sortOrder,
  allItems,
  t,
}: {
  category: string;
  currentImageUrl: string;
  sortOrder: number;
  allItems: GalleryItem[];
  t: ReturnType<typeof import("@/contexts/AdminLanguageContext").useAdminLanguage>["t"];
}) {
  const slots = useMemo(() => {
    const others = allItems
      .filter((item) => item.category === category && item.type === "image")
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((item) => ({ url: resolveImageUrl(item.url), isCurrent: false, order: item.sort_order }));

    const currentUrl = resolveImageUrl(currentImageUrl);
    if (currentUrl) {
      others.push({ url: currentUrl, isCurrent: true, order: sortOrder });
    }
    others.sort((a, b) => a.order - b.order);

    const isStaircase = category === "interior" || category === "exterior";
    const maxSlots = isStaircase ? 4 : others.length;
    const result: typeof others = [];
    for (let i = 0; i < maxSlots; i++) {
      result.push(others[i] || { url: "", isCurrent: false, order: i });
    }
    return result;
  }, [allItems, category, currentImageUrl, sortOrder]);

  const isInterior = category === "interior";
  const isExterior = category === "exterior";
  const title = isInterior
    ? t.gallery.interiorLayout
    : isExterior
      ? t.gallery.exteriorLayout
      : t.gallery.galleryLayout;

  const interiorHeights = [40, 55, 70, 85];
  const exteriorHeights = [85, 70, 55, 40];

  return (
    <div className="border rounded-lg p-5 bg-gray-50">
      <h4 className="text-sm font-medium text-gray-700 mb-3">{title}</h4>
      <div className={`flex items-end gap-1.5 ${!isInterior && !isExterior ? "overflow-x-auto pb-1" : ""}`}>
        {slots.map((slot, i) => {
          const h =
            isInterior ? interiorHeights[i] ?? 85 : isExterior ? exteriorHeights[i] ?? 40 : 60;
          return (
            <div
              key={i}
              className={`relative rounded overflow-hidden border-2 transition-colors ${
                slot.isCurrent ? "border-green-500 ring-2 ring-green-200" : "border-gray-200"
              } ${isInterior || isExterior ? "flex-1" : "flex-shrink-0 w-16"}`}
              style={{ height: `${h}px` }}
            >
              {slot.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={slot.url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-[10px] text-gray-400">{i + 1}</span>
                </div>
              )}
              {slot.isCurrent && (
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                  <span className="bg-green-600 text-white text-[8px] px-1 py-0.5 rounded font-medium">
                    {t.gallery.currentImage}
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-center">
                <span className="text-[9px] text-white">{i + 1}</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 mt-2">{t.gallery.layoutPositionHint}</p>
    </div>
  );
}

type ModalLayoutItem = {
  id: number | string;
  url: string;
  title: string;
  sort_order: number;
  isCurrent: boolean;
  isPlaceholder: boolean;
};

const DEFAULT_LAYOUT_IMAGES = {
  gallery: [
    "/images/04.webp",
    "/images/05.jpg",
    "/images/04.webp",
    "/images/05.jpg",
    "/images/04.webp",
    "/images/05.jpg",
    "/images/04.webp",
    "/images/05.jpg",
    "/images/04.webp",
  ],
  interior: [
    "/images/04.webp",
    "/images/02.2.webp",
    "/images/05.jpg",
    "/images/03.webp",
  ],
  exterior: [
    "/images/03.webp",
    "/images/05.jpg",
    "/images/02.2.webp",
    "/images/04.webp",
  ],
} as const;

function buildModalLayoutItems({
  category,
  currentImageUrl,
  currentTitle,
  currentSortOrder,
  editingItem,
  allItems,
}: {
  category: string;
  currentImageUrl: string;
  currentTitle: string;
  currentSortOrder: number;
  editingItem: GalleryItem | null;
  allItems: GalleryItem[];
}): ModalLayoutItem[] {
  if (!category) return [];

  const normalizedCategory = normalizeGalleryCategory(category);
  const currentId = editingItem?.id ?? "__current__";
  const minCount = normalizedCategory === "gallery" ? 9 : 4;
  const defaults =
    normalizedCategory === "gallery"
      ? DEFAULT_LAYOUT_IMAGES.gallery
      : normalizedCategory === "interior"
        ? DEFAULT_LAYOUT_IMAGES.interior
        : DEFAULT_LAYOUT_IMAGES.exterior;

  const visualSlots: ModalLayoutItem[] = Array.from({ length: minCount }, (_, index) => ({
    id: `placeholder-${normalizedCategory}-${index}`,
    url: defaults[index % defaults.length],
    title: "",
    sort_order: index,
    isCurrent: false,
    isPlaceholder: true,
  }));

  const existing: ModalLayoutItem[] = allItems
    .filter((item) => normalizeGalleryCategory(item.category) === normalizedCategory)
    .filter((item) => item.type === "image")
    .filter((item) => item.id !== editingItem?.id)
    .map((item) => ({
      id: item.id,
      url: resolveImageUrl(item.url),
      title: item.title || "",
      sort_order: item.sort_order ?? 0,
      isCurrent: false,
      isPlaceholder: false,
    }));

  const currentUrl = resolveImageUrl(currentImageUrl);
  const actualItems: ModalLayoutItem[] = [
    ...(currentUrl
      ? [{
          id: currentId,
          url: currentUrl,
          title: currentTitle,
          sort_order: currentSortOrder,
          isCurrent: true,
          isPlaceholder: false,
        }]
      : []),
    ...existing,
  ].sort((a, b) => {
    const orderDiff = (a.sort_order ?? 0) - (b.sort_order ?? 0);
    if (orderDiff !== 0) return orderDiff;
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;
    return 0;
  });

  actualItems.forEach((item) => {
    const preferredSlot = Math.min(
      Math.max(item.sort_order ?? 0, 0),
      visualSlots.length - 1
    );

    let targetSlot = preferredSlot;
    while (targetSlot < visualSlots.length && !visualSlots[targetSlot].isPlaceholder) {
      targetSlot += 1;
    }

    if (targetSlot >= visualSlots.length) {
      targetSlot = visualSlots.findIndex((slot) => slot.isPlaceholder);
    }

    if (targetSlot >= 0) {
      visualSlots[targetSlot] = { ...item, sort_order: targetSlot };
    }
  });

  return visualSlots;
}

function ModalLayoutEditor({
  category,
  items,
  onChange,
  t,
}: {
  category: string;
  items: ModalLayoutItem[];
  onChange: (items: ModalLayoutItem[]) => void;
  t: ReturnType<typeof import("@/contexts/AdminLanguageContext").useAdminLanguage>["t"];
}) {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const isInterior = category === "interior";
  const isExterior = category === "exterior";

  const getHeight = (index: number) => {
    if (isInterior) {
      const steps = [96, 124, 156, 188];
      return steps[index] ?? 188;
    }
    if (isExterior) {
      const steps = [188, 156, 124, 96];
      return steps[index] ?? 96;
    }
    return 112;
  };

  const filledItems = useMemo(() => items, [items]);
  const gallerySlots = useMemo(() => {
    const slots = [...filledItems];
    while (slots.length < 9) {
      slots.push({
        id: `gallery-fallback-${slots.length}`,
        url: "",
        title: "",
        sort_order: slots.length,
        isCurrent: false,
        isPlaceholder: true,
      });
    }
    return slots;
  }, [filledItems]);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  // Use onDragEnd (fires on the SOURCE element always, even if dropped outside a
  // valid target) instead of onDrop (only fires when released on a droppable tile).
  // This is the same reliable pattern used by CategoryLayoutEditor.
  // Uses INSERT semantics: the dragged item slides into the target position and
  // everything in between shifts — consistent with CategoryLayoutEditor behaviour.
  const handleDragEnd = () => {
    const src = dragItem.current;
    const dst = dragOverItem.current;

    dragItem.current = null;
    dragOverItem.current = null;

    if (src === null || dst === null || src === dst) return;

    const sourceItem = filledItems[src];
    if (!sourceItem || sourceItem.isPlaceholder) return;

    const reordered = [...filledItems];
    const [moved] = reordered.splice(src, 1);
    reordered.splice(dst, 0, moved);

    // Re-assign sequential sort_orders so slot N always has sort_order N,
    // matching the public page's images[N] → tile-N mapping.
    onChange(reordered.map((item, i) => ({ ...item, sort_order: i })));
  };

  if (filledItems.length === 0) return null;

  const renderTile = (item: ModalLayoutItem, index: number, className: string, forcedHeight?: number) => (
    <div
      key={`${item.id}-${index}`}
      draggable={!item.isPlaceholder}
      onDragStart={() => !item.isPlaceholder && handleDragStart(index)}
      onDragEnter={() => handleDragEnter(index)}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className={`relative overflow-hidden rounded-[10px] transition-all group ${
        item.isPlaceholder ? "cursor-default" : "cursor-grab active:cursor-grabbing"
      } ${item.isCurrent ? "ring-2 ring-green-400 shadow-[0_0_0_4px_rgba(34,197,94,0.18)]" : "ring-1 ring-black/5"} ${className}`}
      style={forcedHeight ? { minHeight: `${forcedHeight}px` } : undefined}
    >
      {item.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.url}
          alt={item.title}
          className={`h-full w-full object-cover ${item.isPlaceholder ? "opacity-35 saturate-50" : ""}`}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#efe5da] text-[10px] text-gray-400">
          {t.gallery.emptySlot}
        </div>
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/0 to-transparent" />

      <div className="absolute left-2 top-2 flex items-center gap-1">
        <span className="rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white">
          {index + 1}
        </span>
        {item.isCurrent && (
          <span className="rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-medium text-white">
            {t.gallery.currentImage}
          </span>
        )}
      </div>

      {!item.isPlaceholder && (
        <div className="absolute right-2 top-2 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-medium text-gray-700 opacity-0 transition-opacity group-hover:opacity-100">
          DnD
        </div>
      )}

      {item.isPlaceholder && (
        <div className="absolute right-2 top-2 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-medium text-gray-700">
          Default
        </div>
      )}
    </div>
  );

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      {category === "gallery" ? (
        <div className="overflow-x-auto px-1 py-1">
          <div className="grid min-w-[640px] grid-cols-4 gap-2 auto-rows-[88px]">
            <div className="col-span-2 rounded-[10px] bg-[#efe5da]/55" />
            <div className="col-start-3 row-span-2">
              {renderTile(gallerySlots[0], 0, "h-full", 184)}
            </div>
            <div className="col-start-4">
              {renderTile(gallerySlots[1], 1, "h-full", 88)}
            </div>
            <div className="col-start-1 row-start-2">
              {renderTile(gallerySlots[2], 2, "h-full", 88)}
            </div>
            <div className="col-start-2 row-start-2">
              {renderTile(gallerySlots[3], 3, "h-full", 88)}
            </div>
            <div className="col-start-4 row-start-2">
              {renderTile(gallerySlots[4], 4, "h-full", 88)}
            </div>
            <div className="col-start-1 row-start-3">
              {renderTile(gallerySlots[5], 5, "h-full", 88)}
            </div>
            <div className="col-start-2 row-start-3">
              {renderTile(gallerySlots[6], 6, "h-full", 88)}
            </div>
            <div className="col-start-3 row-start-3">
              {renderTile(gallerySlots[7], 7, "h-full", 88)}
            </div>
            <div className="col-start-4 row-start-3">
              {renderTile(gallerySlots[8], 8, "h-full", 88)}
            </div>
          </div>
        </div>
      ) : (
        <div className="px-1 py-1">
          <div className="grid gap-2 grid-cols-4 items-end">
            {filledItems.map((item, index) => (
              // onDragEnter on the outer wrapper captures hover over the empty space
              // above shorter staircase tiles (flex items-end alignment) so that
              // handleDragEnd always has a valid dragOverItem.current.
              <div
                key={`${item.id}-stage-${index}`}
                className="flex items-end"
                onDragEnter={() => handleDragEnter(index)}
                onDragOver={(e) => e.preventDefault()}
              >
                {renderTile(item, index, "w-full", Math.max(70, getHeight(index) - 48))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   Main Page
   ================================================================ */
export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [allImageItems, setAllImageItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<GalleryItem | null>(null);
  const [modalLayoutItems, setModalLayoutItems] = useState<ModalLayoutItem[]>([]);
  const { t } = useAdminLanguage();

  const categories = [
    { value: "", label: t.gallery.allCategories },
    { value: "gallery", label: t.gallery.galleryCategory },
    { value: "interior", label: t.gallery.interior },
    { value: "exterior", label: t.gallery.exterior },
  ];

  const tabs = [
    { value: "image", label: t.gallery.images, icon: "image" },
    { value: "video", label: t.gallery.videos, icon: "video" },
  ];

  const [activeTab, setActiveTab] = useState<"image" | "video">("image");
  const [filterCategory, setFilterCategory] = useState("");
  const [modalLangTab, setModalLangTab] = useState<"ru" | "uz" | "en">("ru");

  const [formData, setFormData] = useState<CreateGalleryRequest>({
    title: "",
    title_uz: "",
    title_en: "",
    description: "",
    description_uz: "",
    description_en: "",
    type: "image",
    url: "",
    redirect_url: "",
    thumbnail: "",
    category: "gallery",
    home_section: "",
    home_section_uz: "",
    home_section_en: "",
    home_desc: "",
    home_desc_uz: "",
    home_desc_en: "",
    home_order: 0,
    sort_order: 0,
    is_published: true,
  });

  const isYouTubeUrl = (value: string) =>
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(value);

  const isUploadedMediaUrl = (value: string) => {
    if (!value) return false;
    if (value.startsWith("/uploads/") || value.startsWith("uploads/")) return true;
    if (value.startsWith("http")) return value.includes("/uploads/");
    return false;
  };

  const isVideoUrlValid = () => {
    if (formData.type !== "video") return true;
    const url = formData.url.trim();
    if (!url) return false;
    return isYouTubeUrl(url) || isUploadedMediaUrl(url);
  };

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: { category?: string; type?: string } = { type: activeTab };
      if (filterCategory) params.category = filterCategory;

      const data = await galleryApi.list(params);
      setItems(data.items || []);

      if (activeTab === "image") {
        const allImages = await galleryApi.list({ type: "image" });
        setAllImageItems(allImages.items || []);
      }
    } catch (error) {
      console.error("Failed to load gallery:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filterCategory, activeTab]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  useEffect(() => {
    if (!isModalOpen || formData.type !== "image") {
      setModalLayoutItems([]);
      return;
    }

    setModalLayoutItems(
      buildModalLayoutItems({
        category: formData.category,
        currentImageUrl: formData.url,
        currentTitle: formData.title || formData.title_uz || "",
        currentSortOrder: formData.sort_order,
        editingItem,
        allItems: allImageItems,
      })
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allImageItems, editingItem, formData.category, formData.type, formData.url, isModalOpen]);
  // NOTE: formData.sort_order, formData.title, formData.title_uz are intentionally excluded.
  // Including sort_order would cause the layout to reset every time the user drags an item
  // (handleModalLayoutChange updates sort_order → triggers this effect → destroys the drag).
  // Title changes should never reset the visual ordering either.

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const result = await galleryApi.upload(file);
      setFormData((prev) => ({ ...prev, url: result.url }));
    } catch (error) {
      alert(error instanceof Error ? error.message : t.settings.saveError);
    } finally {
      setIsUploading(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const result = await galleryApi.upload(file);
      setFormData((prev) => ({ ...prev, thumbnail: result.url }));
    } catch (error) {
      alert(error instanceof Error ? error.message : t.settings.saveError);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { alert(t.gallery.titleRuRequired); return; }
    if (!formData.title_uz.trim()) { alert(t.gallery.titleUzRequired); return; }
    if (!formData.title_en.trim()) { alert(t.gallery.titleEnRequired); return; }
    if (!formData.description.trim()) { alert(t.gallery.descRuRequired); return; }
    if (!formData.description_uz.trim()) { alert(t.gallery.descUzRequired); return; }
    if (!formData.description_en.trim()) { alert(t.gallery.descEnRequired); return; }
    if (!formData.url) { alert(t.gallery.fileRequired); return; }
    if (!isVideoUrlValid()) { alert(t.gallery.videoUrlInvalid); return; }

    setIsSaving(true);
    try {
      const reorderState =
        formData.type === "image" ? modalLayoutItems.map((item) => ({ ...item })) : [];

      let savedItem: GalleryItem;
      if (editingItem) {
        savedItem = await galleryApi.update(editingItem.id, formData);
      } else {
        savedItem = await galleryApi.create(formData);
      }

      if (formData.type === "image" && reorderState.length > 0) {
        const reorderPayload = reorderState
          .filter((item) => !item.isPlaceholder)
          .map((item) => ({
            id: Number(item.isCurrent ? savedItem.id : item.id),
            sort_order: item.sort_order,
          }));
        await galleryApi.reorder(reorderPayload);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      resetForm();
      await loadItems();
    } catch (error) {
      alert(error instanceof Error ? error.message : t.settings.saveError);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      title_uz: item.title_uz,
      title_en: item.title_en,
      description: item.description,
      description_uz: item.description_uz,
      description_en: item.description_en,
      type: item.type,
      url: item.url,
      redirect_url: item.redirect_url || "",
      thumbnail: item.thumbnail,
      category: item.category,
      home_section: item.home_section || "",
      home_section_uz: item.home_section_uz || "",
      home_section_en: item.home_section_en || "",
      home_desc: item.home_desc || "",
      home_desc_uz: item.home_desc_uz || "",
      home_desc_en: item.home_desc_en || "",
      home_order: item.home_order || 0,
      sort_order: item.sort_order,
      is_published: item.is_published,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t.gallery.confirmDelete)) return;
    try {
      await galleryApi.delete(id);
      loadItems();
    } catch (error) {
      alert(error instanceof Error ? error.message : t.settings.saveError);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      title_uz: "",
      title_en: "",
      description: "",
      description_uz: "",
      description_en: "",
      type: activeTab,
      url: "",
      redirect_url: "",
      thumbnail: "",
      category: filterCategory || "gallery",
      home_section: "",
      home_section_uz: "",
      home_section_en: "",
      home_desc: "",
      home_desc_uz: "",
      home_desc_en: "",
      home_order: 0,
      sort_order: 0,
      is_published: true,
    });
  };

  const openNewModal = () => {
    setEditingItem(null);
    resetForm();
    setModalLangTab("ru");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setModalLangTab("ru");
  };

  const getCategoryLabel = (value: string) => {
    // backward compat for old "construction"/"infrastructure" values
    if (value === "construction" || value === "infrastructure") {
      return categories.find((c) => c.value === "gallery")?.label || "Gallery";
    }
    return categories.find((c) => c.value === value)?.label || value;
  };

  const handleLayoutReorder = async (payload: { id: number; sort_order: number }[]) => {
    try {
      await galleryApi.reorder(payload);
      loadItems();
    } catch (error) {
      console.error("Reorder failed:", error);
      loadItems();
    }
  };

  // Items for the layout editor (filtered by current category)
  const layoutItems = useMemo(() => {
    if (!filterCategory || activeTab !== "image") return [];
    return allImageItems.filter((item) => {
      if (filterCategory === "gallery") {
        return item.category === "gallery" || item.category === "construction" || item.category === "infrastructure";
      }
      return item.category === filterCategory;
    });
  }, [allImageItems, filterCategory, activeTab]);

  const uploadPreviewUrl = useMemo(() => {
    if (!formData.url) return "";
    return resolveImageUrl(formData.url);
  }, [formData.url]);

  const handleModalLayoutChange = (items: ModalLayoutItem[]) => {
    setModalLayoutItems(items);
    const currentIndex = items.findIndex((item) => item.isCurrent);
    if (currentIndex >= 0) {
      setFormData((prev) => ({ ...prev, sort_order: currentIndex }));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.gallery.title}</h1>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {activeTab === "image" ? t.gallery.addImage : t.gallery.addVideo}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setActiveTab(tab.value as "image" | "video");
                setFilterCategory("");
              }}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.value
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.icon === "image" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category filter */}
        {activeTab === "image" && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">{t.gallery.category}:</span>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setFilterCategory(cat.value)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    filterCategory === cat.value
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-600 border hover:bg-gray-100"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Layout Editor — shown when a specific category is selected */}
      {filterCategory && layoutItems.length > 0 && (
        <CategoryLayoutEditor
          category={filterCategory}
          items={layoutItems}
          onReorder={handleLayoutReorder}
          t={t}
        />
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 mb-4">{t.gallery.noItems}</p>
          <button onClick={openNewModal} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            {t.gallery.addFirst}
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {t.gallery.total}: {items.length} {t.gallery.elements}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden group">
                <div className="relative h-48 bg-gray-100">
                  {item.type === "image" ? (
                    <Image
                      src={item.url.startsWith("http") ? item.url : `${API_URL}${item.url}`}
                      alt={item.title || "Gallery image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-800">
                      {item.thumbnail ? (
                        <>
                          <Image
                            src={item.thumbnail.startsWith("http") ? item.thumbnail : `${API_URL}${item.thumbnail}`}
                            alt={item.title || "Video thumbnail"}
                            fill
                            className="object-cover opacity-70"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                          <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-gray-400 text-sm mt-2">{t.gallery.video}</p>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        item.type === "video" ? "bg-purple-500 text-white" : "bg-blue-500 text-white"
                      }`}
                    >
                      {item.type === "video" ? t.gallery.video : t.gallery.image}
                    </span>
                  </div>
                  {!item.is_published && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                      {t.gallery.draft}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 truncate">{item.title || t.gallery.noName}</h3>
                  <p className="text-sm text-gray-500">{getCategoryLabel(item.category)}</p>
                  <div className="flex gap-2 mt-3">
                    {item.type === "video" && (
                      <button
                        onClick={() => setPreviewVideo(item)}
                        className="px-3 py-1.5 text-sm bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      {t.gallery.edit}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1.5 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onMouseDown={closeModal} />
          <div
            className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-semibold">{editingItem ? t.gallery.editTitle : t.gallery.addNew}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Type badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                    formData.type === "video" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {formData.type === "video" ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  {formData.type === "video" ? t.gallery.video : t.gallery.image}
                </span>
              </div>

              {/* Category + sort order */}
              {formData.type === "image" && (
                <>
                  <div className="grid gap-4 md:grid-cols-1">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.gallery.category} *</label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            category: e.target.value,
                            sort_order: 0,
                          }))
                        }
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {categories
                          .filter((c) => c.value)
                          .map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <ModalLayoutEditor
                    category={normalizeGalleryCategory(formData.category)}
                    items={modalLayoutItems}
                    onChange={handleModalLayoutChange}
                    t={t}
                  />
                </>
              )}

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.type === "image" ? t.gallery.uploadImage : t.gallery.uploadVideo}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
                  <input
                    type="file"
                    accept={formData.type === "image" ? "image/*" : "video/*"}
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {isUploading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                        <span>{t.gallery.uploading}</span>
                      </div>
                    ) : formData.url && formData.type === "image" ? (
                      <div className="space-y-2">
                        <div className="relative w-full h-32 rounded overflow-hidden bg-gray-100 mx-auto max-w-xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={uploadPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-green-600 text-sm">{t.gallery.fileUploaded}</p>
                        <p className="text-xs text-gray-500">{t.gallery.selectAnother}</p>
                      </div>
                    ) : isUploadedMediaUrl(formData.url) ? (
                      <div className="text-green-600">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p>{t.gallery.fileUploaded}</p>
                        <p className="text-sm text-gray-500 mt-1">{t.gallery.selectAnother}</p>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p>{t.gallery.clickToUpload}</p>
                        <p className="text-sm mt-1">PNG, JPG, GIF, MP4, WEBM</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Language Tabs */}
              <div className="border rounded-lg overflow-hidden">
                <div className="flex border-b bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setModalLangTab("ru")}
                    className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                      modalLangTab === "ru"
                        ? "bg-white text-green-600 border-b-2 border-green-600 -mb-px"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {t.settings.russian}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalLangTab("uz")}
                    className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                      modalLangTab === "uz"
                        ? "bg-white text-green-600 border-b-2 border-green-600 -mb-px"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {t.settings.uzbek}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalLangTab("en")}
                    className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                      modalLangTab === "en"
                        ? "bg-white text-green-600 border-b-2 border-green-600 -mb-px"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    EN
                  </button>
                </div>
                <div className="p-4 space-y-4">
                  {modalLangTab === "ru" ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.gallery.titleRu}</label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder={t.gallery.titlePlaceholder}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.gallery.descriptionRu}</label>
                        <RichTextEditor
                          value={formData.description}
                          onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                          placeholder={t.gallery.descriptionPlaceholder}
                        />
                      </div>
                      {formData.type === "image" && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.gallery.homeSectionRu}</label>
                            <input
                              type="text"
                              value={formData.home_section}
                              onChange={(e) => setFormData((prev) => ({ ...prev, home_section: e.target.value }))}
                              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder={t.gallery.homeSectionPlaceholder}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.gallery.homeDescRu}</label>
                            <textarea
                              value={formData.home_desc}
                              onChange={(e) => setFormData((prev) => ({ ...prev, home_desc: e.target.value }))}
                              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-24"
                              placeholder={t.gallery.homeDescPlaceholder}
                            />
                          </div>
                        </>
                      )}
                    </>
                  ) : modalLangTab === "uz" ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.gallery.titleUz}</label>
                        <input
                          type="text"
                          value={formData.title_uz}
                          onChange={(e) => setFormData((prev) => ({ ...prev, title_uz: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder={t.gallery.titlePlaceholder}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.gallery.descriptionUz}</label>
                        <RichTextEditor
                          value={formData.description_uz}
                          onChange={(value) => setFormData((prev) => ({ ...prev, description_uz: value }))}
                          placeholder={t.gallery.descriptionPlaceholder}
                        />
                      </div>
                      {formData.type === "image" && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.gallery.homeSectionUz}</label>
                            <input
                              type="text"
                              value={formData.home_section_uz}
                              onChange={(e) => setFormData((prev) => ({ ...prev, home_section_uz: e.target.value }))}
                              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder={t.gallery.homeSectionPlaceholder}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.gallery.homeDescUz}</label>
                            <textarea
                              value={formData.home_desc_uz}
                              onChange={(e) => setFormData((prev) => ({ ...prev, home_desc_uz: e.target.value }))}
                              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-24"
                              placeholder={t.gallery.homeDescPlaceholder}
                            />
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.gallery.titleEn}</label>
                        <input
                          type="text"
                          value={formData.title_en}
                          onChange={(e) => setFormData((prev) => ({ ...prev, title_en: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder={t.gallery.titlePlaceholderEn}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.gallery.descriptionEn}</label>
                        <RichTextEditor
                          value={formData.description_en}
                          onChange={(value) => setFormData((prev) => ({ ...prev, description_en: value }))}
                          placeholder={t.gallery.descriptionPlaceholderEn}
                        />
                      </div>
                      {formData.type === "image" && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.gallery.homeSectionEn}</label>
                            <input
                              type="text"
                              value={formData.home_section_en}
                              onChange={(e) => setFormData((prev) => ({ ...prev, home_section_en: e.target.value }))}
                              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder={t.gallery.homeSectionPlaceholderEn}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.gallery.homeDescEn}</label>
                            <textarea
                              value={formData.home_desc_en}
                              onChange={(e) => setFormData((prev) => ({ ...prev, home_desc_en: e.target.value }))}
                              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-24"
                              placeholder={t.gallery.homeDescPlaceholderEn}
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* URL input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.gallery.urlLabel}</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://..."
                />
                {formData.type === "video" && (
                  <p className={`mt-1 text-xs ${isVideoUrlValid() ? "text-gray-500" : "text-red-600"}`}>
                    {isVideoUrlValid() ? t.gallery.videoUrlHint : t.gallery.videoUrlInvalid}
                  </p>
                )}
              </div>

              {/* Redirect URL */}
              {formData.type === "image" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.gallery.redirectUrlLabel}</label>
                  <input
                    type="text"
                    value={formData.redirect_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, redirect_url: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
              )}

              {/* Thumbnail for videos */}
              {formData.type === "video" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.gallery.thumbnailLabel}</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
                    <input type="file" accept="image/*" onChange={handleThumbnailUpload} disabled={isUploading} className="hidden" id="thumbnail-upload" />
                    <label htmlFor="thumbnail-upload" className="cursor-pointer">
                      {formData.thumbnail ? (
                        <div className="text-green-600">
                          <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <p className="text-sm">{t.gallery.thumbnailUploaded}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">{t.gallery.thumbnailUpload}</p>
                      )}
                    </label>
                  </div>
                </div>
              )}

              {/* Published */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData((prev) => ({ ...prev, is_published: e.target.checked }))}
                  className="w-4 h-4 rounded text-green-600 focus:ring-green-500"
                />
                <label htmlFor="is_published" className="text-sm text-gray-700">
                  {t.gallery.publishLabel}
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  disabled={isSaving || isUploading || (formData.type === "video" && !isVideoUrlValid())}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? t.gallery.saving : t.gallery.saveBtn}
                </button>
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                  {t.gallery.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      <VideoModal
        isOpen={!!previewVideo}
        onClose={() => setPreviewVideo(null)}
        videoSrc={previewVideo ? (previewVideo.url.startsWith("http") ? previewVideo.url : `${API_URL}${previewVideo.url}`) : ""}
        animationStyle="from-center"
      />
    </div>
  );
}
