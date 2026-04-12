"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { projectsApi, Project } from "@/lib/api/projects";
import { useAdminLanguage } from "@/contexts/AdminLanguageContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";

export default function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useAdminLanguage();

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

  const handleDelete = async (id: number) => {
    if (!confirm(t.projects.confirmDelete)) return;
    try {
      await projectsApi.delete(id);
      loadItems();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.projects.title}</h1>
          <p className="text-gray-500 text-sm mt-1">{t.projects.subtitle}</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t.projects.addProject}
        </Link>
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
          <p className="text-gray-500 mb-4">{t.projects.noProjects}</p>
          <Link
            href="/admin/projects/new"
            className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            {t.projects.addFirst}
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{t.projects.total}: {items.length} {t.projects.projectCount}</p>
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
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {!item.is_published && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                        {t.projects.draft}
                      </div>
                    )}
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900">{item.type_ru}</h3>
                  <p className="text-sm text-gray-500 mb-1">{item.type_uz}</p>
                  <p className="text-sm text-primary font-medium mb-2">{item.area_ru}</p>
                  <div
                    className="text-sm text-gray-600 line-clamp-2 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: item.description_ru || "" }}
                  />
                  <div className="flex gap-2 mt-4">
                    <Link
                      href={`/admin/projects/${item.id}/edit`}
                      className="flex-1 px-3 py-1.5 text-sm text-center bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      {t.projects.edit}
                    </Link>
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
    </div>
  );
}
