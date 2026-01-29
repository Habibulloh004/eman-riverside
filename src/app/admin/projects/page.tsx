"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { projectsApi, Project, CreateProjectRequest } from "@/lib/api/projects";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Project | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<CreateProjectRequest>({
    type_ru: "",
    type_uz: "",
    area_ru: "",
    area_uz: "",
    description_ru: "",
    description_uz: "",
    image: "",
    sort_order: 0,
    is_published: true,
  });

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await projectsApi.list();
      setItems(data.items || []);
    } catch {
      // API not available yet
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await projectsApi.upload(file);
      setFormData({ ...formData, image: result.url });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.type_ru.trim()) {
      alert("Iltimos turi (RU) kiriting");
      return;
    }

    if (!formData.type_uz.trim()) {
      alert("Iltimos turi (UZ) kiriting");
      return;
    }

    if (!formData.area_ru.trim()) {
      alert("Iltimos maydoni (RU) kiriting");
      return;
    }

    if (!formData.area_uz.trim()) {
      alert("Iltimos maydoni (UZ) kiriting");
      return;
    }

    if (!formData.description_ru.trim()) {
      alert("Iltimos tavsif (RU) kiriting");
      return;
    }

    if (!formData.description_uz.trim()) {
      alert("Iltimos tavsif (UZ) kiriting");
      return;
    }

    setIsSaving(true);
    try {
      if (editingItem) {
        await projectsApi.update(editingItem.id, formData);
      } else {
        await projectsApi.create(formData);
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

  const handleEdit = (item: Project) => {
    setEditingItem(item);
    setFormData({
      type_ru: item.type_ru,
      type_uz: item.type_uz,
      area_ru: item.area_ru,
      area_uz: item.area_uz,
      description_ru: item.description_ru,
      description_uz: item.description_uz,
      image: item.image,
      sort_order: item.sort_order,
      is_published: item.is_published,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Rostdan o'chirmoqchimisiz?")) return;

    try {
      await projectsApi.delete(id);
      loadItems();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete");
    }
  };

  const resetForm = () => {
    setFormData({
      type_ru: "",
      type_uz: "",
      area_ru: "",
      area_uz: "",
      description_ru: "",
      description_uz: "",
      image: "",
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

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loyihalar (Planlar)</h1>
          <p className="text-gray-500 text-sm mt-1">Bu bo&apos;lim saytdagi &quot;Planlar&quot; bo&apos;limida ko&apos;rsatiladi</p>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Loyiha qo&apos;shish
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-gray-500 mb-4">Hozircha loyihalar yo&apos;q</p>
          <button
            onClick={openNewModal}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Birinchi loyihani qo&apos;shing
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">Jami: {items.length} ta loyiha</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                {item.image && (
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={item.image.startsWith("http") ? item.image : `${API_URL}${item.image}`}
                      alt={item.type_ru}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {!item.is_published && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                        Draft
                      </div>
                    )}
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900">{item.type_ru}</h3>
                  <p className="text-sm text-gray-500 mb-1">{item.type_uz}</p>
                  <p className="text-sm text-primary font-medium mb-2">{item.area_ru}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description_ru}</p>
                  <div className="flex gap-2 mt-4">
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
                {editingItem ? "Loyihani tahrirlash" : "Yangi loyiha qo'shish"}
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
              {/* Preview Box */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-xs text-amber-700 font-medium mb-2">SAYTDA KO&apos;RINISHI:</p>
                <div className="flex gap-4 items-start">
                  <div className="w-24 h-20 bg-white rounded flex items-center justify-center text-gray-400 text-xs shrink-0">
                    {formData.image ? (
                      <Image
                        src={formData.image.startsWith("http") ? formData.image : `${API_URL}${formData.image}`}
                        alt="Preview"
                        width={96}
                        height={80}
                        className="object-contain"
                        unoptimized
                      />
                    ) : (
                      "Rasm"
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-lg text-gray-900">{formData.type_ru || "3-комнатные"}</h4>
                    <p className="text-xs text-gray-500">{formData.area_ru || "от 56.79 до 61 м²"}</p>
                    <p className="text-xs text-gray-600 italic mt-1">{formData.description_ru || "Tavsif..."}</p>
                  </div>
                </div>
              </div>

              {/* Type - Xona turi */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xona turi (RU) *
                  </label>
                  <input
                    type="text"
                    value={formData.type_ru}
                    onChange={(e) => setFormData({ ...formData, type_ru: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="3-комнатные"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">Saytda katta sarlavha sifatida chiqadi</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xona turi (UZ) *
                  </label>
                  <input
                    type="text"
                    value={formData.type_uz}
                    onChange={(e) => setFormData({ ...formData, type_uz: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="3-xonali"
                    required
                  />
                </div>
              </div>

              {/* Area - Maydon */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maydon (RU) *
                  </label>
                  <input
                    type="text"
                    value={formData.area_ru}
                    onChange={(e) => setFormData({ ...formData, area_ru: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="от 56.79 до 61 м²"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">Kvartira maydoni diapazoni</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maydon (UZ) *
                  </label>
                  <input
                    type="text"
                    value={formData.area_uz}
                    onChange={(e) => setFormData({ ...formData, area_uz: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="56.79 dan 61 m² gacha"
                    required
                  />
                </div>
              </div>

              {/* Descriptions - Tavsif */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tavsif (RU) *
                  </label>
                  <textarea
                    value={formData.description_ru}
                    onChange={(e) => setFormData({ ...formData, description_ru: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Оптимально для семьи с двумя детьми"
                    rows={2}
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">Qisqa tavsif (kursiv bilan chiqadi)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tavsif (UZ) *
                  </label>
                  <textarea
                    value={formData.description_uz}
                    onChange={(e) => setFormData({ ...formData, description_uz: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ikki bolali oila uchun optimal"
                    rows={2}
                    required
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rasm (planirovka)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
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
                    ) : formData.image ? (
                      <div className="text-green-600">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p>Rasm yuklandi</p>
                        <p className="text-sm text-gray-500 mt-1">Boshqa rasm tanlash uchun bosing</p>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p>Rasm yuklash uchun bosing</p>
                        <p className="text-sm mt-1">PNG, JPG, WEBP</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

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
    </div>
  );
}
