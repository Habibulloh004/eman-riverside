"use client";

import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { settingsApi } from "@/lib/api/settings";
import { useAdminLanguage } from "@/contexts/AdminLanguageContext";
import RichTextEditor from "@/components/ui/rich-text-editor";
import {
  AlertCircle,
  Check,
  FileText,
  Globe,
  Image as ImageIcon,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

interface AboutCertificateItem {
  image: string;
  title_ru: string;
  title_uz: string;
  title_en: string;
  description_ru: string;
  description_uz: string;
  description_en: string;
}

export default function AboutUsAdminPage() {
  const { t } = useAdminLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingCertImage, setIsUploadingCertImage] = useState(false);
  const [activeLang, setActiveLang] = useState<"ru" | "uz" | "en">("ru");
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [form, setForm] = useState({
    about_us_title: "",
    about_us_title_uz: "",
    about_us_title_en: "",
    about_us_content: "",
    about_us_content_uz: "",
    about_us_content_en: "",
    about_us_right_image: "",
  });
  const [certificates, setCertificates] = useState<AboutCertificateItem[]>([]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await settingsApi.list("content");
      const getValue = (key: string) => data.find((s) => s.key === key)?.value || "";

      setForm({
        about_us_title: getValue("about_us_title"),
        about_us_title_uz: getValue("about_us_title_uz"),
        about_us_title_en: getValue("about_us_title_en"),
        about_us_content: getValue("about_us_content"),
        about_us_content_uz: getValue("about_us_content_uz"),
        about_us_content_en: getValue("about_us_content_en"),
        about_us_right_image: getValue("about_us_right_image"),
      });

      try {
        const raw = getValue("about_us_certificates");
        const parsed = raw ? JSON.parse(raw) : [];
        if (Array.isArray(parsed)) {
          setCertificates(
            parsed.map((item) => ({
              image: String(item?.image || ""),
              title_ru: String(item?.title_ru || ""),
              title_uz: String(item?.title_uz || ""),
              title_en: String(item?.title_en || ""),
              description_ru: String(item?.description_ru || ""),
              description_uz: String(item?.description_uz || ""),
              description_en: String(item?.description_en || ""),
            }))
          );
        } else {
          setCertificates([]);
        }
      } catch {
        setCertificates([]);
      }
    } catch (err) {
      console.error("Failed to load about us settings:", err);
      showNotification("error", t.settings.loadError);
    } finally {
      setIsLoading(false);
    }
  }, [t.settings.loadError]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const cleaned = certificates.filter(
        (item) =>
          item.image.trim() ||
          item.title_ru.trim() ||
          item.title_uz.trim() ||
          item.title_en.trim() ||
          item.description_ru.trim() ||
          item.description_uz.trim() ||
          item.description_en.trim()
      );
      await settingsApi.bulkUpdate([
        { key: "about_us_title", value: form.about_us_title },
        { key: "about_us_title_uz", value: form.about_us_title_uz },
        { key: "about_us_title_en", value: form.about_us_title_en },
        { key: "about_us_content", value: form.about_us_content },
        { key: "about_us_content_uz", value: form.about_us_content_uz },
        { key: "about_us_content_en", value: form.about_us_content_en },
        { key: "about_us_right_image", value: form.about_us_right_image },
        { key: "about_us_certificates", value: JSON.stringify(cleaned) },
      ]);
      setCertificates(cleaned);
      showNotification("success", t.settings.contactSaved);
    } catch (err) {
      console.error("Failed to save about us settings:", err);
      showNotification("error", t.settings.saveError);
    } finally {
      setIsSaving(false);
    }
  };

  const uploadRightImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const result = await apiClient.upload("/api/admin/upload", file);
      setForm((prev) => ({ ...prev, about_us_right_image: result.url }));
      showNotification("success", t.settings.brochureUploaded);
    } catch (err) {
      console.error("Failed to upload about us image:", err);
      showNotification("error", t.settings.saveError);
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const addCertificate = () => {
    setCertificates((prev) => [
      ...prev,
      { image: "", title_ru: "", title_uz: "", title_en: "", description_ru: "", description_uz: "", description_en: "" },
    ]);
  };

  const updateCertificate = (index: number, field: keyof AboutCertificateItem, value: string) => {
    setCertificates((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeCertificate = (index: number) => {
    setCertificates((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadCertImage = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCertImage(true);
    try {
      const result = await apiClient.upload("/api/admin/upload", file);
      updateCertificate(index, "image", result.url);
      showNotification("success", t.settings.brochureUploaded);
    } catch (err) {
      console.error("Failed to upload certificate image:", err);
      showNotification("error", t.settings.saveError);
    } finally {
      setIsUploadingCertImage(false);
      e.target.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      {notification && (
        <div
          className={`fixed right-4 top-4 z-50 flex items-center gap-3 rounded-xl px-5 py-4 text-white shadow-lg ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.type === "success" ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t.sidebar.aboutUs}</h1>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-gray-100 p-1 w-fit">
          <button
            onClick={() => setActiveLang("ru")}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeLang === "ru" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
            }`}
          >
            <Globe className="h-4 w-4" />
            {t.settings.russian}
          </button>
          <button
            onClick={() => setActiveLang("uz")}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeLang === "uz" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
            }`}
          >
            <Globe className="h-4 w-4" />
            {t.settings.uzbek}
          </button>
          <button
            onClick={() => setActiveLang("en")}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeLang === "en" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
            }`}
          >
            <Globe className="h-4 w-4" />
            EN
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText className="h-4 w-4 text-gray-400" />
              {t.settings.aboutUsTitleLabel}
            </label>
            <input
              type="text"
              value={
                activeLang === "ru"
                  ? form.about_us_title
                  : activeLang === "uz"
                    ? form.about_us_title_uz
                    : form.about_us_title_en
              }
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  [activeLang === "ru"
                    ? "about_us_title"
                    : activeLang === "uz"
                      ? "about_us_title_uz"
                      : "about_us_title_en"]: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText className="h-4 w-4 text-gray-400" />
              {t.settings.aboutUsContentLabel}
            </label>
            <RichTextEditor
              value={
                activeLang === "ru"
                  ? form.about_us_content
                  : activeLang === "uz"
                    ? form.about_us_content_uz
                    : form.about_us_content_en
              }
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  [activeLang === "ru"
                    ? "about_us_content"
                    : activeLang === "uz"
                      ? "about_us_content_uz"
                      : "about_us_content_en"]: value,
                }))
              }
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
              <ImageIcon className="h-4 w-4 text-gray-400" />
              {t.settings.aboutUsRightImageLabel}
            </label>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              {isUploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {isUploadingImage ? t.settings.aboutUsRightImageUploading : t.settings.aboutUsRightImageUpload}
              <input type="file" accept="image/*" onChange={uploadRightImage} className="hidden" />
            </label>
            {form.about_us_right_image ? (
              <p className="mt-2 text-xs text-gray-500">{form.about_us_right_image}</p>
            ) : (
              <p className="mt-2 text-xs text-gray-500">{t.settings.aboutUsRightImageNone}</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">{t.settings.aboutUsCertificatesLabel}</label>
              <button
                type="button"
                onClick={addCertificate}
                className="inline-flex items-center gap-2 rounded-lg border border-green-200 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50"
              >
                <Plus className="h-4 w-4" />
                {t.settings.aboutUsCertificatesAdd}
              </button>
            </div>

            {certificates.length === 0 ? (
              <p className="text-xs text-gray-500">{t.settings.aboutUsCertificatesEmpty}</p>
            ) : (
              certificates.map((item, index) => (
                <div key={index} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-medium text-gray-600">
                      {t.settings.aboutUsCertificatesCard} #{index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeCertificate(index)}
                      className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <label className="mb-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100">
                    {isUploadingCertImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {isUploadingCertImage ? t.settings.aboutUsCertificatesUploading : t.settings.aboutUsCertificatesUpload}
                    <input type="file" accept="image/*" onChange={(e) => uploadCertImage(index, e)} className="hidden" />
                  </label>
                  {item.image && <p className="mb-3 truncate text-xs text-gray-500">{item.image}</p>}

                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      type="text"
                      value={item.title_ru}
                      onChange={(e) => updateCertificate(index, "title_ru", e.target.value)}
                      placeholder={t.settings.aboutUsCertificatesTitleRu}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      value={item.title_uz}
                      onChange={(e) => updateCertificate(index, "title_uz", e.target.value)}
                      placeholder={t.settings.aboutUsCertificatesTitleUz}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      value={item.title_en}
                      onChange={(e) => updateCertificate(index, "title_en", e.target.value)}
                      placeholder={t.settings.aboutUsCertificatesTitleEn}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm md:col-span-2"
                    />
                    <textarea
                      value={item.description_ru}
                      onChange={(e) => updateCertificate(index, "description_ru", e.target.value)}
                      placeholder={t.settings.aboutUsCertificatesDescriptionRu}
                      rows={2}
                      className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                    <textarea
                      value={item.description_uz}
                      onChange={(e) => updateCertificate(index, "description_uz", e.target.value)}
                      placeholder={t.settings.aboutUsCertificatesDescriptionUz}
                      rows={2}
                      className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                    <textarea
                      value={item.description_en}
                      onChange={(e) => updateCertificate(index, "description_en", e.target.value)}
                      placeholder={t.settings.aboutUsCertificatesDescriptionEn}
                      rows={2}
                      className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm md:col-span-2"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {t.settings.save}
          </button>
        </div>
      </div>
    </div>
  );
}
