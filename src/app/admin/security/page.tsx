"use client";

import { useState } from "react";
import { authApi } from "@/lib/api/auth";
import { useAdminLanguage } from "@/contexts/AdminLanguageContext";
import { AlertCircle, CheckCircle, Lock } from "lucide-react";

type Notice = { type: "success" | "error"; message: string };

export default function SecurityPage() {
  const { t } = useAdminLanguage();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<Notice | null>(null);

  const showNotification = (type: Notice["type"], message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const validate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return t.security.validationRequired;
    }
    if (newPassword.length < 8) {
      return t.security.validationMinLength;
    }
    if (newPassword !== confirmPassword) {
      return t.security.validationMismatch;
    }
    if (newPassword === currentPassword) {
      return t.security.validationSame;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      showNotification("error", error);
      return;
    }

    try {
      setIsSaving(true);
      await authApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      showNotification("success", t.security.success);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const message = err instanceof Error ? err.message : t.security.error;
      showNotification("error", message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t.security.title}</h1>
        <p className="text-gray-600 mt-1">{t.security.subtitle}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {notification && (
          <div
            className={`mb-5 flex items-center gap-2 rounded-md border px-4 py-3 text-sm ${
              notification.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {notification.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.security.currentPassword}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.security.newPassword}
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.security.confirmPassword}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
            {t.security.hint}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? t.security.saving : t.security.save}
          </button>
        </form>
      </div>
    </div>
  );
}
