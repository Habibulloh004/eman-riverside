"use client";

import { useState, useEffect } from "react";
import { settingsApi, SiteSetting } from "@/lib/api/settings";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  Settings,
  Save,
  Globe,
  Loader2,
  Check,
  AlertCircle,
  CreditCard,
  HelpCircle,
  Plus,
  Trash2,
  GripVertical,
  Layers,
} from "lucide-react";
import { useAdminLanguage } from "@/contexts/AdminLanguageContext";

interface PaymentPlan {
  title: string;
  description: string;
  price: string;
  period: string;
  features: string[];
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ProjectItemDetail {
  title: string;
  list?: string[];
  description?: string;
}

interface ProjectItem {
  number: string;
  label: string;
  title: string;
  titleLine2: string;
  image: string;
  items?: ProjectItemDetail[];
  description?: string;
  features?: string[];
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"contact" | "social" | "pricing" | "faq" | "projects">("contact");
  const [activeLang, setActiveLang] = useState<"ru" | "uz">("ru");
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const { t } = useAdminLanguage();

  // Form states
  const [contactForm, setContactForm] = useState({
    phone: "",
    email: "",
    address: "",
    address_uz: "",
    working_hours: "",
    working_hours_uz: "",
  });

  const [socialForm, setSocialForm] = useState({
    telegram: "",
    instagram: "",
    facebook: "",
    youtube: "",
    whatsapp: "",
  });

  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
  const [paymentPlansUz, setPaymentPlansUz] = useState<PaymentPlan[]>([]);

  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [faqItemsUz, setFaqItemsUz] = useState<FAQItem[]>([]);

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [projectsUz, setProjectsUz] = useState<ProjectItem[]>([]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const data = await settingsApi.list();

      const getValue = (key: string) => data.find(s => s.key === key)?.value || "";

      setContactForm({
        phone: getValue("phone"),
        email: getValue("email"),
        address: getValue("address"),
        address_uz: getValue("address_uz"),
        working_hours: getValue("working_hours"),
        working_hours_uz: getValue("working_hours_uz"),
      });

      setSocialForm({
        telegram: getValue("telegram"),
        instagram: getValue("instagram"),
        facebook: getValue("facebook"),
        youtube: getValue("youtube"),
        whatsapp: getValue("whatsapp"),
      });

      // Parse JSON fields
      try {
        const plans = getValue("payment_plans");
        setPaymentPlans(plans ? JSON.parse(plans) : []);
      } catch { setPaymentPlans([]); }

      try {
        const plansUz = getValue("payment_plans_uz");
        setPaymentPlansUz(plansUz ? JSON.parse(plansUz) : []);
      } catch { setPaymentPlansUz([]); }

      try {
        const faq = getValue("faq_items");
        setFaqItems(faq ? JSON.parse(faq) : []);
      } catch { setFaqItems([]); }

      try {
        const faqUz = getValue("faq_items_uz");
        setFaqItemsUz(faqUz ? JSON.parse(faqUz) : []);
      } catch { setFaqItemsUz([]); }

      try {
        const proj = getValue("projects");
        setProjects(proj ? JSON.parse(proj) : []);
      } catch { setProjects([]); }

      try {
        const projUz = getValue("projects_uz");
        setProjectsUz(projUz ? JSON.parse(projUz) : []);
      } catch { setProjectsUz([]); }

      } catch (err) {
      console.error("Failed to load settings:", err);
      showNotification("error", t.settings.loadError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveContact = async () => {
    try {
      setIsSaving(true);
      const updates = [
        { key: "phone", value: contactForm.phone },
        { key: "email", value: contactForm.email },
        { key: "address", value: contactForm.address },
        { key: "address_uz", value: contactForm.address_uz },
        { key: "working_hours", value: contactForm.working_hours },
        { key: "working_hours_uz", value: contactForm.working_hours_uz },
      ];
      await settingsApi.bulkUpdate(updates);
      showNotification("success", t.settings.contactSaved);
    } catch (err) {
      console.error("Failed to save:", err);
      showNotification("error", t.settings.saveError);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSocial = async () => {
    try {
      setIsSaving(true);
      const updates = [
        { key: "telegram", value: socialForm.telegram },
        { key: "instagram", value: socialForm.instagram },
        { key: "facebook", value: socialForm.facebook },
        { key: "youtube", value: socialForm.youtube },
        { key: "whatsapp", value: socialForm.whatsapp },
      ];
      await settingsApi.bulkUpdate(updates);
      showNotification("success", t.settings.socialSaved);
    } catch (err) {
      console.error("Failed to save:", err);
      showNotification("error", t.settings.saveError);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePricing = async () => {
    try {
      setIsSaving(true);
      const updates = [
        { key: "payment_plans", value: JSON.stringify(paymentPlans) },
        { key: "payment_plans_uz", value: JSON.stringify(paymentPlansUz) },
      ];
      await settingsApi.bulkUpdate(updates);
      showNotification("success", t.settings.pricingSaved);
    } catch (err) {
      console.error("Failed to save:", err);
      showNotification("error", t.settings.saveError);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveFaq = async () => {
    try {
      setIsSaving(true);
      const updates = [
        { key: "faq_items", value: JSON.stringify(faqItems) },
        { key: "faq_items_uz", value: JSON.stringify(faqItemsUz) },
      ];
      await settingsApi.bulkUpdate(updates);
      showNotification("success", t.settings.faqSaved);
    } catch (err) {
      console.error("Failed to save:", err);
      showNotification("error", t.settings.saveError);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProjects = async () => {
    try {
      setIsSaving(true);
      const updates = [
        { key: "projects", value: JSON.stringify(projects) },
        { key: "projects_uz", value: JSON.stringify(projectsUz) },
      ];
      await settingsApi.bulkUpdate(updates);
      showNotification("success", t.settings.projectsSaved);
    } catch (err) {
      console.error("Failed to save:", err);
      showNotification("error", t.settings.saveError);
    } finally {
      setIsSaving(false);
    }
  };

  
  // Payment Plans helpers
  const addPaymentPlan = () => {
    const newPlan: PaymentPlan = { title: "", description: "", price: "", period: "", features: [] };
    if (activeLang === "ru") {
      setPaymentPlans([...paymentPlans, newPlan]);
    } else {
      setPaymentPlansUz([...paymentPlansUz, newPlan]);
    }
  };

  const updatePaymentPlan = (index: number, field: keyof PaymentPlan, value: string | string[]) => {
    if (activeLang === "ru") {
      const updated = [...paymentPlans];
      updated[index] = { ...updated[index], [field]: value };
      setPaymentPlans(updated);
    } else {
      const updated = [...paymentPlansUz];
      updated[index] = { ...updated[index], [field]: value };
      setPaymentPlansUz(updated);
    }
  };

  const removePaymentPlan = (index: number) => {
    if (activeLang === "ru") {
      setPaymentPlans(paymentPlans.filter((_, i) => i !== index));
    } else {
      setPaymentPlansUz(paymentPlansUz.filter((_, i) => i !== index));
    }
  };

  // FAQ helpers
  const addFaqItem = () => {
    const newItem: FAQItem = { question: "", answer: "" };
    if (activeLang === "ru") {
      setFaqItems([...faqItems, newItem]);
    } else {
      setFaqItemsUz([...faqItemsUz, newItem]);
    }
  };

  const updateFaqItem = (index: number, field: keyof FAQItem, value: string) => {
    if (activeLang === "ru") {
      const updated = [...faqItems];
      updated[index] = { ...updated[index], [field]: value };
      setFaqItems(updated);
    } else {
      const updated = [...faqItemsUz];
      updated[index] = { ...updated[index], [field]: value };
      setFaqItemsUz(updated);
    }
  };

  const removeFaqItem = (index: number) => {
    if (activeLang === "ru") {
      setFaqItems(faqItems.filter((_, i) => i !== index));
    } else {
      setFaqItemsUz(faqItemsUz.filter((_, i) => i !== index));
    }
  };

  // Projects helpers
  const addProject = () => {
    const newProject: ProjectItem = {
      number: String((activeLang === "ru" ? projects : projectsUz).length + 1).padStart(2, "0"),
      label: "",
      title: "",
      titleLine2: "",
      image: "/images/hero/1.png",
      items: [],
      description: "",
      features: [],
    };
    if (activeLang === "ru") {
      setProjects([...projects, newProject]);
    } else {
      setProjectsUz([...projectsUz, newProject]);
    }
  };

  const updateProject = (index: number, field: keyof ProjectItem, value: unknown) => {
    if (activeLang === "ru") {
      const updated = [...projects];
      updated[index] = { ...updated[index], [field]: value };
      setProjects(updated);
    } else {
      const updated = [...projectsUz];
      updated[index] = { ...updated[index], [field]: value };
      setProjectsUz(updated);
    }
  };

  const removeProject = (index: number) => {
    if (activeLang === "ru") {
      setProjects(projects.filter((_, i) => i !== index));
    } else {
      setProjectsUz(projectsUz.filter((_, i) => i !== index));
    }
  };

  const currentPlans = activeLang === "ru" ? paymentPlans : paymentPlansUz;
  const currentFaq = activeLang === "ru" ? faqItems : faqItemsUz;
  const currentProjects = activeLang === "ru" ? projects : projectsUz;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg ${
          notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}>
          {notification.type === "success" ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Settings className="w-7 h-7" />
          {t.settings.title}
        </h1>
        <p className="text-gray-500 mt-1">{t.settings.subtitle}</p>
      </div>

      {/* Main Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-gray-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab("contact")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === "contact"
                ? "text-green-600 border-b-2 border-green-600 bg-green-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Phone className="w-4 h-4" />
            {t.settings.contacts}
          </button>
          <button
            onClick={() => setActiveTab("social")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === "social"
                ? "text-green-600 border-b-2 border-green-600 bg-green-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            {t.settings.socialNetworks}
          </button>
          <button
            onClick={() => setActiveTab("pricing")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === "pricing"
                ? "text-green-600 border-b-2 border-green-600 bg-green-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            {t.settings.paymentPlans}
          </button>
          <button
            onClick={() => setActiveTab("faq")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === "faq"
                ? "text-green-600 border-b-2 border-green-600 bg-green-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            FAQ
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === "projects"
                ? "text-green-600 border-b-2 border-green-600 bg-green-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Layers className="w-4 h-4" />
            {t.settings.projectsTab}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* ==================== CONTACT TAB ==================== */}
          {activeTab === "contact" && (
            <div>
              {/* Language Switcher */}
              <div className="flex items-center gap-2 mb-6 p-1 bg-gray-100 rounded-lg w-fit">
                <button
                  onClick={() => setActiveLang("ru")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeLang === "ru" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  Русский
                </button>
                <button
                  onClick={() => setActiveLang("uz")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeLang === "uz" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  O&apos;zbek
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {t.settings.phoneLabel}
                  </label>
                  <input
                    type="text"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    placeholder="+998 90 123 45 67"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="info@example.uz"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {t.settings.addressLabel} {activeLang === "ru" ? t.settings.addressLangRu : t.settings.addressLangUz}
                  </label>
                  <textarea
                    value={activeLang === "ru" ? contactForm.address : contactForm.address_uz}
                    onChange={(e) => setContactForm({
                      ...contactForm,
                      [activeLang === "ru" ? "address" : "address_uz"]: e.target.value
                    })}
                    placeholder={activeLang === "ru" ? "Город Ташкент, улица..." : "Toshkent shahri, ko'cha..."}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {t.settings.workingHoursLabel} {activeLang === "ru" ? t.settings.addressLangRu : t.settings.addressLangUz}
                  </label>
                  <input
                    type="text"
                    value={activeLang === "ru" ? contactForm.working_hours : contactForm.working_hours_uz}
                    onChange={(e) => setContactForm({
                      ...contactForm,
                      [activeLang === "ru" ? "working_hours" : "working_hours_uz"]: e.target.value
                    })}
                    placeholder={activeLang === "ru" ? "Пн-Пт: 9:00 - 18:00" : "Du-Ju: 9:00 - 18:00"}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={handleSaveContact}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {t.settings.save}
                </button>
              </div>
            </div>
          )}

          {/* ==================== SOCIAL TAB ==================== */}
          {activeTab === "social" && (
            <div>
              <p className="text-sm text-gray-500 mb-6">
                {t.settings.socialHint}
              </p>

              <div className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Send className="w-4 h-4 text-blue-500" />
                    Telegram
                  </label>
                  <input
                    type="url"
                    value={socialForm.telegram}
                    onChange={(e) => setSocialForm({ ...socialForm, telegram: e.target.value })}
                    placeholder="https://t.me/username"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Instagram className="w-4 h-4 text-pink-500" />
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={socialForm.instagram}
                    onChange={(e) => setSocialForm({ ...socialForm, instagram: e.target.value })}
                    placeholder="https://instagram.com/username"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Facebook className="w-4 h-4 text-blue-600" />
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={socialForm.facebook}
                    onChange={(e) => setSocialForm({ ...socialForm, facebook: e.target.value })}
                    placeholder="https://facebook.com/pagename"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Youtube className="w-4 h-4 text-red-500" />
                    YouTube
                  </label>
                  <input
                    type="url"
                    value={socialForm.youtube}
                    onChange={(e) => setSocialForm({ ...socialForm, youtube: e.target.value })}
                    placeholder="https://youtube.com/@channel"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MessageCircle className="w-4 h-4 text-green-500" />
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    value={socialForm.whatsapp}
                    onChange={(e) => setSocialForm({ ...socialForm, whatsapp: e.target.value })}
                    placeholder="+998901234567"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={handleSaveSocial}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {t.settings.save}
                </button>
              </div>
            </div>
          )}

          {/* ==================== PRICING TAB ==================== */}
          {activeTab === "pricing" && (
            <div>
              {/* Language Switcher */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setActiveLang("ru")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeLang === "ru" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    {t.settings.russian}
                  </button>
                  <button
                    onClick={() => setActiveLang("uz")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeLang === "uz" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    {t.settings.uzbek}
                  </button>
                </div>
                <button
                  onClick={addPaymentPlan}
                  className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  {t.settings.addPlan}
                </button>
              </div>

              {/* Payment Plans List */}
              <div className="space-y-4">
                {currentPlans.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">{t.settings.noPlans}</p>
                    <button
                      onClick={addPaymentPlan}
                      className="mt-3 text-green-600 text-sm font-medium hover:underline"
                    >
                      {t.settings.addFirstPlan}
                    </button>
                  </div>
                ) : (
                  currentPlans.map((plan, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                      <div className="flex items-start gap-3 mb-4">
                        <GripVertical className="w-5 h-5 text-gray-400 mt-1 cursor-grab" />
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">{t.settings.planName}</label>
                            <input
                              type="text"
                              value={plan.title}
                              onChange={(e) => updatePaymentPlan(index, "title", e.target.value)}
                              placeholder={activeLang === "ru" ? "Ипотека" : "Ipoteka"}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">{t.settings.planPrice}</label>
                            <input
                              type="text"
                              value={plan.price}
                              onChange={(e) => updatePaymentPlan(index, "price", e.target.value)}
                              placeholder="1 000 000"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">{t.settings.planPeriod}</label>
                            <input
                              type="text"
                              value={plan.period}
                              onChange={(e) => updatePaymentPlan(index, "period", e.target.value)}
                              placeholder={activeLang === "ru" ? "в месяц" : "oyiga"}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">{t.settings.planDescription}</label>
                            <input
                              type="text"
                              value={plan.description}
                              onChange={(e) => updatePaymentPlan(index, "description", e.target.value)}
                              placeholder={activeLang === "ru" ? "Описание..." : "Tavsif..."}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => removePaymentPlan(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">
                          {t.settings.planFeatures}
                        </label>
                        <textarea
                          value={plan.features.join("\n")}
                          onChange={(e) => updatePaymentPlan(index, "features", e.target.value.split("\n"))}
                          placeholder={activeLang === "ru"
                            ? "Первоначальный взнос 30%\nСрок до 15 лет\nБез комиссий"
                            : "Dastlabki to'lov 30%\nMuddat 15 yilgacha\nKomissiyasiz"}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={handleSavePricing}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {t.settings.save}
                </button>
              </div>
            </div>
          )}

          {/* ==================== FAQ TAB ==================== */}
          {activeTab === "faq" && (
            <div>
              {/* Language Switcher */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setActiveLang("ru")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeLang === "ru" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    {t.settings.russian}
                  </button>
                  <button
                    onClick={() => setActiveLang("uz")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeLang === "uz" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    {t.settings.uzbek}
                  </button>
                </div>
                <button
                  onClick={addFaqItem}
                  className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  {t.settings.addQuestion}
                </button>
              </div>

              {/* FAQ List */}
              <div className="space-y-4">
                {currentFaq.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <HelpCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">{t.settings.noFaq}</p>
                    <button
                      onClick={addFaqItem}
                      className="mt-3 text-green-600 text-sm font-medium hover:underline"
                    >
                      {t.settings.addFirstQuestion}
                    </button>
                  </div>
                ) : (
                  currentFaq.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">{t.settings.questionLabel}</label>
                            <input
                              type="text"
                              value={item.question}
                              onChange={(e) => updateFaqItem(index, "question", e.target.value)}
                              placeholder={activeLang === "ru" ? "Вопрос..." : "Savol..."}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">{t.settings.answerLabel}</label>
                            <textarea
                              value={item.answer}
                              onChange={(e) => updateFaqItem(index, "answer", e.target.value)}
                              placeholder={activeLang === "ru" ? "Ответ..." : "Javob..."}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => removeFaqItem(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={handleSaveFaq}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {t.settings.save}
                </button>
              </div>
            </div>
          )}

          {/* ==================== PROJECTS TAB ==================== */}
          {activeTab === "projects" && (
            <div>
              {/* Language Switcher */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setActiveLang("ru")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeLang === "ru" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    {t.settings.russian}
                  </button>
                  <button
                    onClick={() => setActiveLang("uz")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeLang === "uz" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    {t.settings.uzbek}
                  </button>
                </div>
                <button
                  onClick={addProject}
                  className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  {t.settings.addProjectSetting}
                </button>
              </div>

              {/* Projects List */}
              <div className="space-y-6">
                {currentProjects.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <Layers className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">{t.settings.noProjectsSetting}</p>
                    <button
                      onClick={addProject}
                      className="mt-3 text-green-600 text-sm font-medium hover:underline"
                    >
                      {t.settings.addFirstProject}
                    </button>
                  </div>
                ) : (
                  currentProjects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                            {project.number}
                          </span>
                          <div>
                            <h4 className="font-medium text-gray-900">{project.title || t.settings.newProject}</h4>
                            <p className="text-sm text-gray-500">{project.label || t.settings.noLabel}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeProject(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">{t.settings.numberLabel}</label>
                          <input
                            type="text"
                            value={project.number}
                            onChange={(e) => updateProject(index, "number", e.target.value)}
                            placeholder="01"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">{t.settings.labelField}</label>
                          <input
                            type="text"
                            value={project.label}
                            onChange={(e) => updateProject(index, "label", e.target.value)}
                            placeholder={activeLang === "ru" ? "Современный Дизайн" : "Zamonaviy Dizayn"}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">{t.settings.titleLine1}</label>
                          <input
                            type="text"
                            value={project.title}
                            onChange={(e) => updateProject(index, "title", e.target.value)}
                            placeholder={activeLang === "ru" ? "Комфортное" : "Qulay"}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">{t.settings.titleLine2}</label>
                          <input
                            type="text"
                            value={project.titleLine2}
                            onChange={(e) => updateProject(index, "titleLine2", e.target.value)}
                            placeholder={activeLang === "ru" ? "жилье" : "turar-joy"}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs font-medium text-gray-500 mb-1 block">{t.settings.imageUrl}</label>
                          <input
                            type="text"
                            value={project.image}
                            onChange={(e) => updateProject(index, "image", e.target.value)}
                            placeholder="/images/hero/1.png"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="text-xs font-medium text-gray-500 mb-1 block">{t.settings.descriptionOptional}</label>
                        <textarea
                          value={project.description || ""}
                          onChange={(e) => updateProject(index, "description", e.target.value)}
                          placeholder={activeLang === "ru" ? "Описание проекта..." : "Loyiha tavsifi..."}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">
                          {t.settings.featuresOptional}
                        </label>
                        <textarea
                          value={(project.features || []).join("\n")}
                          onChange={(e) => updateProject(index, "features", e.target.value.split("\n").filter(f => f.trim()))}
                          placeholder={activeLang === "ru"
                            ? "Центральное кондиционирование\nПриточно-вытяжная вентиляция\nСистема умный дом"
                            : "Markaziy konditsioner\nKirish-chiqish ventilyatsiyasi\nAqlli uy tizimi"}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={handleSaveProjects}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {t.settings.save}
                </button>
              </div>
            </div>
          )}

                  </div>
      </div>
    </div>
  );
}
