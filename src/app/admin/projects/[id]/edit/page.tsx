"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { projectsApi, CreateProjectRequest } from "@/lib/api/projects";
import { useAdminLanguage } from "@/contexts/AdminLanguageContext";
import RichTextEditor from "@/components/ui/rich-text-editor";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useAdminLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [langTab, setLangTab] = useState<"ru" | "uz">("ru");

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

  const loadProject = useCallback(async () => {
    try {
      const project = await projectsApi.get(Number(id));
      setFormData({
        type_ru: project.type_ru,
        type_uz: project.type_uz,
        area_ru: project.area_ru,
        area_uz: project.area_uz,
        description_ru: project.description_ru,
        description_uz: project.description_uz,
        image: project.image,
        sort_order: project.sort_order,
        is_published: project.is_published,
      });
    } catch {
      alert("Failed to load project");
      router.push("/admin/projects");
    } finally {
      setIsLoading(false);
    }
  }, [id, router]);

  useEffect(() => { loadProject(); }, [loadProject]);

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
    if (!formData.type_ru.trim()) { alert(t.projects.typeRuRequired); return; }
    if (!formData.type_uz.trim()) { alert(t.projects.typeUzRequired); return; }
    if (!formData.area_ru.trim()) { alert(t.projects.areaRuRequired); return; }
    if (!formData.area_uz.trim()) { alert(t.projects.areaUzRequired); return; }
    if (!formData.description_ru.trim()) { alert(t.projects.descRuRequired); return; }
    if (!formData.description_uz.trim()) { alert(t.projects.descUzRequired); return; }

    setIsSaving(true);
    try {
      await projectsApi.update(Number(id), formData);
      router.push("/admin/projects");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  const imageUrl = formData.image
    ? formData.image.startsWith("http") ? formData.image : `${API_URL}${formData.image}`
    : "";

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/admin/projects")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{t.projects.editProject}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="bg-white rounded-lg shadow p-5">
          <label className="block text-sm font-medium text-gray-700 mb-3">{t.projects.imageUpload}</label>
          {imageUrl ? (
            <div className="relative h-56 rounded-lg overflow-hidden bg-gray-100 mb-3">
              <Image src={imageUrl} alt="Preview" fill className="object-cover" sizes="640px" />
              <button type="button" onClick={() => setFormData({ ...formData, image: "" })}
                className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
              <input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} className="hidden" id="file-upload-edit" />
              <label htmlFor="file-upload-edit" className="cursor-pointer">
                {isUploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600" />
                    <span>{t.projects.uploading}</span>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="font-medium">{t.projects.clickToUpload}</p>
                    <p className="text-sm mt-1">PNG, JPG, WEBP</p>
                  </div>
                )}
              </label>
            </div>
          )}
        </div>

        {/* Language Tabs + Fields */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex border-b bg-gray-50">
            <button type="button" onClick={() => setLangTab("ru")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${langTab === "ru" ? "bg-white text-green-600 border-b-2 border-green-600 -mb-px" : "text-gray-500 hover:text-gray-700"}`}
            >{t.settings.russian}</button>
            <button type="button" onClick={() => setLangTab("uz")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${langTab === "uz" ? "bg-white text-green-600 border-b-2 border-green-600 -mb-px" : "text-gray-500 hover:text-gray-700"}`}
            >{t.settings.uzbek}</button>
          </div>

          <div className="p-5 space-y-4">
            {langTab === "ru" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.projects.roomTypeRu}</label>
                  <input type="text" value={formData.type_ru} onChange={(e) => setFormData({ ...formData, type_ru: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.projects.areaRu}</label>
                  <input type="text" value={formData.area_ru} onChange={(e) => setFormData({ ...formData, area_ru: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.projects.descriptionRu}</label>
                  <RichTextEditor value={formData.description_ru} onChange={(value) => setFormData({ ...formData, description_ru: value })} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.projects.roomTypeUz}</label>
                  <input type="text" value={formData.type_uz} onChange={(e) => setFormData({ ...formData, type_uz: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.projects.areaUz}</label>
                  <input type="text" value={formData.area_uz} onChange={(e) => setFormData({ ...formData, area_uz: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.projects.descriptionUz}</label>
                  <RichTextEditor value={formData.description_uz} onChange={(value) => setFormData({ ...formData, description_uz: value })} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Published */}
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_published_edit" checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="w-4 h-4 rounded text-green-600 focus:ring-green-500" />
            <label htmlFor="is_published_edit" className="text-sm text-gray-700">{t.projects.publishLabel}</label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button type="submit" disabled={isSaving || isUploading}
            className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors font-medium">
            {isSaving ? t.projects.saving : t.projects.saveBtn}
          </button>
          <button type="button" onClick={() => router.push("/admin/projects")}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
            {t.projects.cancel}
          </button>
        </div>
      </form>
    </div>
  );
}
