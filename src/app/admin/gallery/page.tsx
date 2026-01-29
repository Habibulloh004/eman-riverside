"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { galleryApi, GalleryItem, CreateGalleryRequest } from "@/lib/api/gallery";
import { VideoModal } from "@/components/ui/hero-video-dialog";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const categories = [
  { value: "", label: "Barchasi" },
  { value: "construction", label: "Qurilish jarayoni" },
  { value: "interior", label: "Interyer" },
  { value: "exterior", label: "Eksteryer" },
  { value: "infrastructure", label: "Infrastruktura" },
];

const tabs = [
  { value: "image", label: "Rasmlar", icon: "image" },
  { value: "video", label: "Videolar", icon: "video" },
];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<GalleryItem | null>(null);

  // Active tab and filters
  const [activeTab, setActiveTab] = useState<"image" | "video">("image");
  const [filterCategory, setFilterCategory] = useState("");

  const [formData, setFormData] = useState<CreateGalleryRequest>({
    title: "",
    title_uz: "",
    description: "",
    description_uz: "",
    type: "image",
    url: "",
    thumbnail: "",
    category: "construction",
    sort_order: 0,
    is_published: true,
  });

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: { category?: string; type?: string } = { type: activeTab };
      if (filterCategory) params.category = filterCategory;

      const data = await galleryApi.list(params);
      setItems(data.items || []);
    } catch (error) {
      console.error("Failed to load gallery:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filterCategory, activeTab]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await galleryApi.upload(file);
      setFormData({ ...formData, url: result.url });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Upload failed");
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
      setFormData({ ...formData, thumbnail: result.url });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Iltimos sarlavha (RU) kiriting");
      return;
    }

    if (!formData.title_uz.trim()) {
      alert("Iltimos sarlavha (UZ) kiriting");
      return;
    }

    if (!formData.description.trim()) {
      alert("Iltimos tavsif (RU) kiriting");
      return;
    }

    if (!formData.description_uz.trim()) {
      alert("Iltimos tavsif (UZ) kiriting");
      return;
    }

    if (!formData.url) {
      alert("Iltimos fayl yuklang yoki URL kiriting");
      return;
    }

    setIsSaving(true);
    try {
      if (editingItem) {
        await galleryApi.update(editingItem.id, formData);
      } else {
        await galleryApi.create(formData);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      resetForm();
      loadItems();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      title_uz: item.title_uz,
      description: item.description,
      description_uz: item.description_uz,
      type: item.type,
      url: item.url,
      thumbnail: item.thumbnail,
      category: item.category,
      sort_order: item.sort_order,
      is_published: item.is_published,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Rostdan o'chirmoqchimisiz?")) return;

    try {
      await galleryApi.delete(id);
      loadItems();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      title_uz: "",
      description: "",
      description_uz: "",
      type: activeTab,
      url: "",
      thumbnail: "",
      category: "construction",
      sort_order: 0,
      is_published: true,
    });
  };

  const openNewModal = () => {
    setEditingItem(null);
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const getCategoryLabel = (value: string) => {
    return categories.find(c => c.value === value)?.label || value;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {activeTab === "image" ? "Rasm qo'shish" : "Video qo'shish"}
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

        {/* Category filter - only for images */}
        {activeTab === "image" && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">Kategoriya:</span>
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
          <p className="text-gray-500 mb-4">Hozircha elementlar yo&apos;q</p>
          <button
            onClick={openNewModal}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Birinchi elementni qo&apos;shing
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">Jami: {items.length} ta element</p>
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
                      unoptimized
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
                            unoptimized
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
                          <p className="text-gray-400 text-sm mt-2">Video</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Status badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className={`text-xs px-2 py-1 rounded ${item.type === 'video' ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'}`}>
                      {item.type === 'video' ? 'Video' : 'Rasm'}
                    </span>
                  </div>
                  {!item.is_published && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                      Draft
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 truncate">{item.title || "Nomsiz"}</h3>
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
                      Tahrirlash
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1.5 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Modal Content */}
          <div
            className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editingItem ? "Tahrirlash" : "Yangi element qo'shish"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Type badge */}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                  formData.type === "video" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                }`}>
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
                  {formData.type === "video" ? "Video" : "Rasm"}
                </span>
              </div>

              {/* Category - only for images */}
              {formData.type === "image" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategoriya *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {categories.filter(c => c.value).map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Titles */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sarlavha (RU) *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Sarlavha kiriting..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sarlavha (UZ) *
                  </label>
                  <input
                    type="text"
                    value={formData.title_uz}
                    onChange={(e) => setFormData({ ...formData, title_uz: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Sarlavha kiriting..."
                    required
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tavsif (RU) *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tavsif kiriting..."
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tavsif (UZ) *
                  </label>
                  <textarea
                    value={formData.description_uz}
                    onChange={(e) => setFormData({ ...formData, description_uz: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tavsif kiriting..."
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.type === "image" ? "Rasm yuklash *" : "Video yuklash *"}
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
                        <span>Yuklanmoqda...</span>
                      </div>
                    ) : formData.url ? (
                      <div className="text-green-600">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p>Fayl yuklandi</p>
                        <p className="text-sm text-gray-500 mt-1">Boshqa fayl tanlash uchun bosing</p>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p>Fayl yuklash uchun bosing</p>
                        <p className="text-sm mt-1">PNG, JPG, GIF, MP4, WEBM</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* URL input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL (yoki tashqi link)
                </label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>

              {/* Thumbnail for videos */}
              {formData.type === "video" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video uchun rasm (thumbnail)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      disabled={isUploading}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label htmlFor="thumbnail-upload" className="cursor-pointer">
                      {formData.thumbnail ? (
                        <div className="text-green-600">
                          <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <p className="text-sm">Thumbnail yuklandi</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Thumbnail rasm yuklang</p>
                      )}
                    </label>
                  </div>
                </div>
              )}

              {/* Published checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4 rounded text-green-600 focus:ring-green-500"
                />
                <label htmlFor="is_published" className="text-sm text-gray-700">
                  Saytda ko&apos;rsatish (nashr qilish)
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? "Saqlanmoqda..." : "Saqlash"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Bekor qilish
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
