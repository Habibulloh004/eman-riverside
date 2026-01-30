"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { submissionsApi, Submission } from "@/lib/api/submissions";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { useAdminLanguage } from "@/contexts/AdminLanguageContext";

export default function SubmissionsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    }>
      <SubmissionsContent />
    </Suspense>
  );
}

function SubmissionsContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "";
  const { lastSubmission, clearNewSubmissionsCount } = useWebSocket();
  const { t } = useAdminLanguage();

  const statusLabels: Record<string, { label: string; color: string }> = {
    new: { label: t.submissions.new, color: "bg-green-100 text-green-800" },
    contacted: { label: t.submissions.contactedStatus, color: "bg-yellow-100 text-yellow-800" },
    closed: { label: t.submissions.closed, color: "bg-gray-100 text-gray-800" },
  };

  const sourceLabels: Record<string, string> = {
    contact_page: t.submissions.sources.contact_page,
    catalog_request: t.submissions.sources.catalog_request,
    callback: t.submissions.sources.callback,
  };

  const [items, setItems] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [selectedItem, setSelectedItem] = useState<Submission | null>(null);
  const [notes, setNotes] = useState("");

  // Clear notification count when viewing this page
  useEffect(() => {
    clearNewSubmissionsCount();
  }, [clearNewSubmissionsCount]);

  // Reload when new submission arrives via WebSocket
  useEffect(() => {
    if (lastSubmission && page === 1 && !statusFilter) {
      // Reload the list to show the new submission
      loadItems();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastSubmission]);

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await submissionsApi.list({
        status: statusFilter || undefined,
        page,
        limit: 20,
      });
      setItems(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error("Failed to load submissions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await submissionsApi.update(id, { status: newStatus });
      loadItems();
      if (selectedItem?.id === id) {
        setSelectedItem({ ...selectedItem, status: newStatus as Submission["status"] });
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update");
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedItem) return;

    try {
      await submissionsApi.update(selectedItem.id, { notes });
      loadItems();
      setSelectedItem({ ...selectedItem, notes });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save notes");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t.submissions.confirmDelete)) return;

    try {
      await submissionsApi.delete(id);
      loadItems();
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete");
    }
  };

  const openDetail = (item: Submission) => {
    setSelectedItem(item);
    setNotes(item.notes || "");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("uz-UZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex gap-6">
      {/* List */}
      <div className={`flex-1 ${selectedItem ? "hidden lg:block" : ""}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t.submissions.title}</h1>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">{t.submissions.all}</option>
            <option value="new">{t.submissions.new}</option>
            <option value="contacted">{t.submissions.contactedStatus}</option>
            <option value="closed">{t.submissions.closed}</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">{t.submissions.notFound}</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t.submissions.name}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t.submissions.phone}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t.submissions.source}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t.submissions.status}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t.submissions.date}</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedItem?.id === item.id ? "bg-green-50" : ""
                      }`}
                      onClick={() => openDetail(item)}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.phone}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {sourceLabels[item.source] || item.source}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${statusLabels[item.status]?.color}`}>
                          {statusLabels[item.status]?.label || item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(item.created_at)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-500">
                {t.submissions.total}: {total} {t.submissions.items}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  {t.submissions.previous}
                </button>
                <span className="px-3 py-1">{page}</span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={items.length < 20}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  {t.submissions.next}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detail Panel */}
      {selectedItem && (
        <div className="w-full lg:w-96 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-lg font-semibold">{t.submissions.submission} #{selectedItem.id}</h2>
            <button
              onClick={() => setSelectedItem(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">{t.submissions.name}</p>
              <p className="font-medium">{selectedItem.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">{t.submissions.phone}</p>
              <a href={`tel:${selectedItem.phone}`} className="font-medium text-green-600 hover:underline">
                {selectedItem.phone}
              </a>
            </div>

            {selectedItem.email && (
              <div>
                <p className="text-sm text-gray-500">{t.submissions.email}</p>
                <a href={`mailto:${selectedItem.email}`} className="font-medium text-green-600 hover:underline">
                  {selectedItem.email}
                </a>
              </div>
            )}

            {selectedItem.estate_id && (
              <div>
                <p className="text-sm text-gray-500">{t.submissions.apartmentId}</p>
                <a
                  href={`/catalog/${selectedItem.estate_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-green-600 hover:underline"
                >
                  #{selectedItem.estate_id}
                </a>
              </div>
            )}

            {selectedItem.payment_plan && (
              <div>
                <p className="text-sm text-gray-500">{t.submissions.paymentPlan}</p>
                <span className="inline-block px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                  {selectedItem.payment_plan}
                </span>
              </div>
            )}

            {selectedItem.message && (
              <div>
                <p className="text-sm text-gray-500">{t.submissions.message}</p>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedItem.message}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500">{t.submissions.source}</p>
              <p>{sourceLabels[selectedItem.source] || selectedItem.source}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">{t.submissions.date}</p>
              <p>{formatDate(selectedItem.created_at)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">{t.submissions.status}</p>
              <div className="flex gap-2">
                {Object.entries(statusLabels).map(([value, { label, color }]) => (
                  <button
                    key={value}
                    onClick={() => handleStatusChange(selectedItem.id, value)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedItem.status === value
                        ? color
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">{t.submissions.notes}</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.submissions.notesPlaceholder}
                className="w-full px-3 py-2 border rounded-md h-24 resize-none"
              />
              <button
                onClick={handleSaveNotes}
                className="mt-2 px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
              >
                {t.submissions.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
