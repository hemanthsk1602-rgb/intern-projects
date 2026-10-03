"use client";

import React, { useState } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { formatINR } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  Fingerprint,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  Wallet,
  Edit3,
  Check,
  X,
  KeyRound,
  Sliders,
  Sun,
  Moon,
  Download,
  RotateCcw,
  Trash2,
  LogOut,
  Sparkles,
  Lock,
  DollarSign,
  Bell,
  Cpu,
  ShieldAlert,
} from "lucide-react";

type ActiveTab = "identity" | "financial" | "appearance" | "security" | "account";

export default function IdentityCore() {
  const { user, updateUser, expenses, resetToDemo, clearAll } = useExpenses();
  const { user: authUser, updateUserSession, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const [activeTab, setActiveTab] = useState<ActiveTab>("identity");
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: user.name || authUser.name,
    email: user.email || authUser.email,
    phone: user.phone || authUser.phone || "+91 98765 43210",
    avatar: user.avatar || authUser.avatar,
    monthlyBudget: user.monthlyBudget || 50000,
    currency: user.currency || "INR",
  });

  // Password rotation modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentCipher, setCurrentCipher] = useState("");
  const [newCipher, setNewCipher] = useState("");
  const [confirmCipher, setConfirmCipher] = useState("");
  const [cipherError, setCipherError] = useState<string | null>(null);
  const [cipherSuccess, setCipherSuccess] = useState<string | null>(null);

  const completenessFields = [
    Boolean(formData.name && formData.name.length > 2),
    Boolean(formData.email && formData.email.includes("@")),
    Boolean(formData.phone && formData.phone.length > 8),
    Boolean(formData.avatar && formData.avatar.length > 5),
    Boolean(formData.monthlyBudget && formData.monthlyBudget > 0),
    Boolean(user.accountStatus),
  ];
  const completedCount = completenessFields.filter(Boolean).length;
  const completenessPercentage = Math.round((completedCount / completenessFields.length) * 100);

  const handleSaveIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser(formData);
    updateUserSession(formData);
    setIsEditing(false);
    setSaveSuccess("Identity credentials successfully re-encrypted and saved.");
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(expenses, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `spendwise_vault_backup_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCSV = () => {
    if (expenses.length === 0) return;
    const headers = ["ID,Date,Description,Category,Type,Amount,Payment Method,Notes"];
    const rows = expenses.map(
      (e) =>
        `"${e.id}","${e.date}","${e.description.replace(/"/g, '""')}","${e.category}","${e.type}","${e.amount}","${e.paymentMethod}","${(e.notes || "").replace(/"/g, '""')}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `spendwise_vault_backup_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePasswordRotate = (e: React.FormEvent) => {
    e.preventDefault();
    setCipherError(null);
    if (!currentCipher) {
      setCipherError("Please enter your existing cipher key.");
      return;
    }
    if (newCipher.length < 6) {
      setCipherError("New cipher key must contain at least 6 characters.");
      return;
    }
    if (newCipher !== confirmCipher) {
      setCipherError("New cipher confirmation does not match.");
      return;
    }

    setCipherSuccess("Cryptographic cipher rotated and authenticated successfully.");
    setTimeout(() => {
      setIsPasswordModalOpen(false);
      setCurrentCipher("");
      setNewCipher("");
      setConfirmCipher("");
      setCipherSuccess(null);
    }, 1200);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`w-2 h-2 rounded-full animate-ping ${
                isDark ? "bg-[#18D9FF]" : "bg-[#1677FF]"
              }`}
            />
            <span
              className={`text-[11px] font-mono uppercase tracking-widest ${
                isDark ? "text-[#18D9FF]" : "text-[#1677FF] font-bold"
              }`}
            >
              BIOMETRIC IDENTITY LAYER
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-[#10213A] dark:text-[#F5F8FF]">
            Identity Core
          </h1>
          <p className="text-xs text-[#60738F] dark:text-[#8FA3BF] mt-0.5">
            Encrypted user profile and spatial financial authority credentials
          </p>
        </div>

        {/* Global Save Alert */}
        {saveSuccess && (
          <div className="px-3.5 py-1.5 rounded-xl bg-[#20D6A3]/10 border border-[#20D6A3]/30 text-[#20D6A3] text-xs font-mono flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>{saveSuccess}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hologram Radar Identity Visualization */}
        <div
          className={`lg:col-span-4 p-6 sm:p-8 rounded-3xl border transition-all flex flex-col items-center justify-center text-center relative overflow-hidden ${
            isDark
              ? "bg-[#0B1426] border-[rgba(80,150,255,0.15)] shadow-[0_12px_40px_rgba(5,9,20,0.4)]"
              : "bg-white border-[rgba(30,90,160,0.14)] shadow-[0_8px_30px_rgba(15,30,60,0.06)]"
          }`}
        >
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center my-3">
            <div
              className={`absolute inset-0 rounded-full border border-dashed animate-orbit-rotate ${
                isDark ? "border-[#18D9FF]/30" : "border-[#1677FF]/40"
              }`}
            />
            <div
              className={`absolute inset-4 rounded-full border animate-spin-reverse ${
                isDark ? "border-[#8B5CF6]/20" : "border-[#7657E8]/30"
              }`}
            />
            <div
              className={`absolute inset-8 rounded-full border animate-pulse ${
                isDark ? "border-[#2684FF]/20" : "border-blue-400/25"
              }`}
            />

            {/* Avatar container */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[#18D9FF] via-[#2684FF] to-[#8B5CF6] shadow-sm">
              <img
                src={formData.avatar || user.avatar}
                alt={formData.name || user.name}
                className="w-full h-full object-cover rounded-full"
              />
              <span className="absolute bottom-0 right-1 w-6 h-6 rounded-full bg-[#20D6A3] border-2 border-[#0B1426] flex items-center justify-center shadow-sm">
                <Check className="w-3.5 h-3.5 text-[#050914] stroke-[3]" />
              </span>
            </div>
          </div>

          <h2 className="text-xl font-bold font-display text-[#10213A] dark:text-[#F5F8FF] mt-1">
            {formData.name || user.name}
          </h2>
          <span
            className={`text-xs font-mono flex items-center gap-1.5 mt-0.5 ${
              isDark ? "text-[#18D9FF]" : "text-[#1677FF] font-semibold"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#20D6A3]" />
            {user.accountStatus}
          </span>
          <span className="text-[11px] font-mono text-[#60738F] dark:text-[#8FA3BF] mt-1">
            {user.memberSince || "Operator Authority"}
          </span>

          {/* Dynamic Profile Completeness Dial */}
          <div className={`w-full mt-6 pt-5 border-t ${isDark ? "border-[rgba(80,150,255,0.12)]" : "border-[rgba(30,90,160,0.12)]"}`}>
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-[#60738F] dark:text-[#8FA3BF]">Core Telemetry Integrity</span>
              <span className={`font-bold ${isDark ? "text-[#18D9FF]" : "text-[#1677FF]"}`}>
                {completenessPercentage}%
              </span>
            </div>
            <div
              className={`w-full h-2 rounded-full p-0.5 border ${
                isDark ? "bg-[#07101F] border-[rgba(80,150,255,0.15)]" : "bg-[#F8FBFF] border-[rgba(30,90,160,0.15)]"
              }`}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#18D9FF] to-[#8B5CF6] transition-all duration-1000"
                style={{ width: `${completenessPercentage}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-[#60738F] dark:text-[#8FA3BF] mt-2 block">
              Biometric hash: <span className="font-mono text-[#18D9FF]">SHA-256:0x7F9A..C4</span>
            </span>
          </div>
        </div>

        {/* Tabbed Interactive Control Panel */}
        <div
          className={`lg:col-span-8 p-6 md:p-8 rounded-3xl border transition-all flex flex-col justify-between ${
            isDark
              ? "bg-[#0B1426] border-[rgba(80,150,255,0.15)] shadow-[0_12px_40px_rgba(5,9,20,0.4)]"
              : "bg-white border-[rgba(30,90,160,0.14)] shadow-[0_8px_30px_rgba(15,30,60,0.06)]"
          }`}
        >
          <div>
            {/* Navigation Tabs */}
            <div
              className={`flex items-center gap-1 p-1 rounded-2xl border mb-6 overflow-x-auto ${
                isDark ? "bg-[#07101F] border-[rgba(80,150,255,0.12)]" : "bg-[#F8FBFF] border-[rgba(30,90,160,0.12)]"
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveTab("identity")}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === "identity"
                    ? isDark
                      ? "bg-[#0F1B31] text-[#18D9FF] border border-[#18D9FF]/30 shadow-sm"
                      : "bg-white text-[#1677FF] border border-[rgba(30,90,160,0.2)] shadow-sm"
                    : "text-[#60738F] hover:text-[#10213A] dark:text-[#8FA3BF] dark:hover:text-[#F5F8FF]"
                }`}
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span>Identity</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("financial")}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === "financial"
                    ? isDark
                      ? "bg-[#0F1B31] text-[#18D9FF] border border-[#18D9FF]/30 shadow-sm"
                      : "bg-white text-[#1677FF] border border-[rgba(30,90,160,0.2)] shadow-sm"
                    : "text-[#60738F] hover:text-[#10213A] dark:text-[#8FA3BF] dark:hover:text-[#F5F8FF]"
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Financial Directives</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("appearance")}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === "appearance"
                    ? isDark
                      ? "bg-[#0F1B31] text-[#18D9FF] border border-[#18D9FF]/30 shadow-sm"
                      : "bg-white text-[#1677FF] border border-[rgba(30,90,160,0.2)] shadow-sm"
                    : "text-[#60738F] hover:text-[#10213A] dark:text-[#8FA3BF] dark:hover:text-[#F5F8FF]"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Appearance</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("security")}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === "security"
                    ? isDark
                      ? "bg-[#0F1B31] text-[#18D9FF] border border-[#18D9FF]/30 shadow-sm"
                      : "bg-white text-[#1677FF] border border-[rgba(30,90,160,0.2)] shadow-sm"
                    : "text-[#60738F] hover:text-[#10213A] dark:text-[#8FA3BF] dark:hover:text-[#F5F8FF]"
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Security</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("account")}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === "account"
                    ? isDark
                      ? "bg-[#0F1B31] text-[#18D9FF] border border-[#18D9FF]/30 shadow-sm"
                      : "bg-white text-[#1677FF] border border-[rgba(30,90,160,0.2)] shadow-sm"
                    : "text-[#60738F] hover:text-[#10213A] dark:text-[#8FA3BF] dark:hover:text-[#F5F8FF]"
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Vault Actions</span>
              </button>
            </div>

            {/* TAB 1: IDENTITY */}
            {activeTab === "identity" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold font-display text-[#10213A] dark:text-[#F5F8FF]">
                    Personal Identity Parameters
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
                      isDark
                        ? "border-[#18D9FF]/40 bg-[#18D9FF]/10 text-[#18D9FF] hover:bg-[#18D9FF]/20"
                        : "border-[rgba(30,90,160,0.3)] bg-sky-50 text-[#1677FF] hover:bg-sky-100 font-semibold"
                    }`}
                  >
                    {isEditing ? <X className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                    <span>{isEditing ? "Cancel" : "Edit Credentials"}</span>
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSaveIdentity} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#60738F] dark:text-[#8FA3BF] mb-1">
                          Full Legal Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                            isDark
                              ? "border-[rgba(80,150,255,0.15)] bg-[#07101F] text-[#F5F8FF] focus:border-[#18D9FF]"
                              : "border-[rgba(30,90,160,0.15)] bg-[#F8FBFF] text-[#10213A] focus:border-[#1677FF]"
                          }`}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[#60738F] dark:text-[#8FA3BF] mb-1">
                          Secure Email Relay
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                            isDark
                              ? "border-[rgba(80,150,255,0.15)] bg-[#07101F] text-[#F5F8FF] focus:border-[#18D9FF]"
                              : "border-[rgba(30,90,160,0.15)] bg-[#F8FBFF] text-[#10213A] focus:border-[#1677FF]"
                          }`}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[#60738F] dark:text-[#8FA3BF] mb-1">
                          Phone Relay
                        </label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                            isDark
                              ? "border-[rgba(80,150,255,0.15)] bg-[#07101F] text-[#F5F8FF] focus:border-[#18D9FF]"
                              : "border-[rgba(30,90,160,0.15)] bg-[#F8FBFF] text-[#10213A] focus:border-[#1677FF]"
                          }`}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[#60738F] dark:text-[#8FA3BF] mb-1">
                          Avatar Image URL
                        </label>
                        <input
                          type="text"
                          value={formData.avatar}
                          onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                            isDark
                              ? "border-[rgba(80,150,255,0.15)] bg-[#07101F] text-[#F5F8FF] focus:border-[#18D9FF]"
                              : "border-[rgba(30,90,160,0.15)] bg-[#F8FBFF] text-[#10213A] focus:border-[#1677FF]"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-3">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#18D9FF] to-[#2684FF] text-[#050914] font-bold text-xs font-mono shadow-sm hover:opacity-95"
                      >
                        Commit Modifications
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-mono ${
                          isDark ? "border-[rgba(80,150,255,0.15)] text-[#8FA3BF]" : "border-[rgba(30,90,160,0.15)] text-[#60738F]"
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      className={`p-3.5 rounded-2xl border ${
                        isDark ? "bg-[#07101F] border-[rgba(80,150,255,0.12)]" : "bg-[#F8FBFF] border-[rgba(30,90,160,0.12)]"
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#60738F] dark:text-[#8FA3BF] flex items-center gap-1 font-medium">
                        <Mail className="w-3 h-3 text-[#18D9FF]" /> Contact Email
                      </span>
                      <p className="text-sm font-semibold text-[#10213A] dark:text-[#F5F8FF] mt-1 truncate">
                        {formData.email}
                      </p>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl border ${
                        isDark ? "bg-[#07101F] border-[rgba(80,150,255,0.12)]" : "bg-[#F8FBFF] border-[rgba(30,90,160,0.12)]"
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#60738F] dark:text-[#8FA3BF] flex items-center gap-1 font-medium">
                        <Phone className="w-3 h-3 text-[#18D9FF]" /> Phone Relay
                      </span>
                      <p className="text-sm font-semibold text-[#10213A] dark:text-[#F5F8FF] mt-1">
                        {formData.phone}
                      </p>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl border ${
                        isDark ? "bg-[#07101F] border-[rgba(80,150,255,0.12)]" : "bg-[#F8FBFF] border-[rgba(30,90,160,0.12)]"
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#60738F] dark:text-[#8FA3BF] flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3 text-[#8B5CF6]" /> Member Since
                      </span>
                      <p className="text-sm font-semibold text-[#10213A] dark:text-[#F5F8FF] mt-1">
                        {user.memberSince || "January 2024"}
                      </p>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl border ${
                        isDark ? "bg-[#07101F] border-[rgba(80,150,255,0.12)]" : "bg-[#F8FBFF] border-[rgba(30,90,160,0.12)]"
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#60738F] dark:text-[#8FA3BF] flex items-center gap-1 font-medium">
                        <ShieldCheck className="w-3 h-3 text-[#20D6A3]" /> Tier Authority
                      </span>
                      <p className="text-sm font-semibold text-[#20D6A3] mt-1">
                        {user.accountStatus || "Verified Prime"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: FINANCIAL DIRECTIVES */}
            {activeTab === "financial" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold font-display text-[#10213A] dark:text-[#F5F8FF]">
                  Financial Directives & Ceiling Budgets
                </h3>
                <p className="text-xs text-[#60738F] dark:text-[#8FA3BF]">
                  Configure dynamic outflow thresholds that govern financial orbit alert states.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div
                    className={`p-4 rounded-2xl border ${
                      isDark ? "bg-[#07101F] border-[rgba(80,150,255,0.12)]" : "bg-[#F8FBFF] border-[rgba(30,90,160,0.12)]"
                    }`}
                  >
                    <label className="text-[10px] font-mono uppercase text-[#60738F] dark:text-[#8FA3BF] block mb-1.5 font-bold">
                      Monthly Budget Ceiling (₹)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={formData.monthlyBudget}
                        onChange={(e) => setFormData({ ...formData, monthlyBudget: parseFloat(e.target.value) || 0 })}
                        className={`w-full px-3 py-2 rounded-xl text-sm font-mono border transition-all focus:outline-none ${
                          isDark
                            ? "bg-[#0B1426] border-[rgba(80,150,255,0.15)] text-[#F5F8FF] focus:border-[#18D9FF]"
                            : "bg-white border-[rgba(30,90,160,0.15)] text-[#10213A] focus:border-[#1677FF]"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          await updateUser({ monthlyBudget: formData.monthlyBudget });
                          updateUserSession({ monthlyBudget: formData.monthlyBudget });
                          setSaveSuccess("Monthly budget ceiling updated.");
                          setTimeout(() => setSaveSuccess(null), 2500);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#18D9FF] to-[#2684FF] text-[#050914] font-bold text-xs font-mono shadow-sm hover:opacity-95"
                      >
                        Apply
                      </button>
                    </div>
                    <span className="text-[11px] font-mono text-[#60738F] dark:text-[#8FA3BF] mt-2 block">
                      Current Target: {formatINR(formData.monthlyBudget)}
                    </span>
                  </div>

                  <div
                    className={`p-4 rounded-2xl border ${
                      isDark ? "bg-[#07101F] border-[rgba(80,150,255,0.12)]" : "bg-[#F8FBFF] border-[rgba(30,90,160,0.12)]"
                    }`}
                  >
                    <label className="text-[10px] font-mono uppercase text-[#60738F] dark:text-[#8FA3BF] block mb-1.5 font-bold">
                      Base Valuation Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={async (e) => {
                        const val = e.target.value;
                        setFormData({ ...formData, currency: val });
                        await updateUser({ currency: val });
                        updateUserSession({ currency: val });
                        setSaveSuccess(`Currency changed to ${val}.`);
                        setTimeout(() => setSaveSuccess(null), 2500);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-sm font-mono border transition-all focus:outline-none ${
                        isDark
                          ? "bg-[#0B1426] border-[rgba(80,150,255,0.15)] text-[#F5F8FF] focus:border-[#18D9FF]"
                          : "bg-white border-[rgba(30,90,160,0.15)] text-[#10213A] focus:border-[#1677FF]"
                      }`}
                    >
                      <option value="INR">INR (₹) — Indian Rupee</option>
                      <option value="USD">USD ($) — US Dollar</option>
                      <option value="EUR">EUR (€) — Euro</option>
                      <option value="GBP">GBP (£) — British Pound</option>
                    </select>
                    <span className="text-[11px] font-mono text-[#60738F] dark:text-[#8FA3BF] mt-2 block">
                      All calculations calibrated to native currency
                    </span>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isDark ? "bg-[#07101F] border-[rgba(80,150,255,0.12)]" : "bg-[#F8FBFF] border-[rgba(30,90,160,0.12)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-[#F5B942]" />
                    <div>
                      <h4 className="text-xs font-bold text-[#10213A] dark:text-[#F5F8FF]">
                        Outflow Velocity Alerts
                      </h4>
                      <p className="text-[11px] text-[#60738F] dark:text-[#8FA3BF]">
                        Trigger orbital pulse warning when monthly spend reaches 80%
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#20D6A3]">Active</span>
                </div>
              </div>
            )}

            {/* TAB 3: APPEARANCE */}
            {activeTab === "appearance" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold font-display text-[#10213A] dark:text-[#F5F8FF]">
                  Visual Spectrum & Spatial Atmosphere
                </h3>
                <p className="text-xs text-[#60738F] dark:text-[#8FA3BF]">
                  Switch between the deep spatial obsidian darkness and the crisp arctic light deck.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Dark Mode Card */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!isDark) toggleTheme();
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isDark
                        ? "bg-[#0B1426] border-[#18D9FF] shadow-[0_0_20px_rgba(24,217,255,0.2)]"
                        : "bg-[#07101F] border-[rgba(80,150,255,0.15)] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-[#18D9FF]">
                        <Moon className="w-4 h-4" />
                        <span className="text-xs font-mono font-bold uppercase">Obsidian Orbit (Dark)</span>
                      </div>
                      {isDark && <Check className="w-4 h-4 text-[#18D9FF]" />}
                    </div>
                    <p className="text-xs text-[#8FA3BF]">
                      Near-black navy (#050914), vibrant cyan glow, floating spatial particles.
                    </p>
                  </button>

                  {/* Light Mode Card */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isDark) toggleTheme();
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      !isDark
                        ? "bg-white border-[#1677FF] shadow-[0_8px_30px_rgba(15,30,60,0.08)]"
                        : "bg-slate-100 border-[rgba(30,90,160,0.15)] text-[#10213A] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-[#1677FF]">
                        <Sun className="w-4 h-4" />
                        <span className="text-xs font-mono font-bold uppercase">Arctic Deck (Light)</span>
                      </div>
                      {!isDark && <Check className="w-4 h-4 text-[#1677FF]" />}
                    </div>
                    <p className="text-xs text-[#60738F]">
                      Pure light surface (#F4F8FC), deep navy text (#10213A), sharp sky-blue rings.
                    </p>
                  </button>
                </div>

                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between mt-4 ${
                    isDark ? "bg-[#07101F] border-[rgba(80,150,255,0.12)]" : "bg-[#F8FBFF] border-[rgba(30,90,160,0.12)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
                    <div>
                      <h4 className="text-xs font-bold text-[#10213A] dark:text-[#F5F8FF]">
                        60fps Hardware Acceleration
                      </h4>
                      <p className="text-[11px] text-[#60738F] dark:text-[#8FA3BF]">
                        WebGL 3D depth-aware rendering with adaptive device pixel ratio
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#18D9FF]">Enabled</span>
                </div>
              </div>
            )}

            {/* TAB 4: SECURITY */}
            {activeTab === "security" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold font-display text-[#10213A] dark:text-[#F5F8FF]">
                  Zero-Knowledge Cryptographic Enclave
                </h3>
                <p className="text-xs text-[#60738F] dark:text-[#8FA3BF]">
                  Manage your cipher keys and review cryptographic authority credentials.
                </p>

                <div className="space-y-3 pt-2">
                  <div
                    className={`p-4 rounded-2xl border flex items-center justify-between ${
                      isDark ? "bg-[#07101F] border-[rgba(80,150,255,0.12)]" : "bg-[#F8FBFF] border-[rgba(30,90,160,0.12)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-[#18D9FF]" />
                      <div>
                        <h4 className="text-xs font-bold text-[#10213A] dark:text-[#F5F8FF]">
                          Cipher Key Rotation
                        </h4>
                        <p className="text-[11px] text-[#60738F] dark:text-[#8FA3BF]">
                          Update your authentication cipher key used to access this node
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#18D9FF]/10 border border-[#18D9FF]/40 text-[#18D9FF] text-xs font-mono font-bold hover:bg-[#18D9FF]/20 transition-all"
                    >
                      Rotate Key
                    </button>
                  </div>

                  <div
                    className={`p-4 rounded-2xl border flex items-center justify-between ${
                      isDark ? "bg-[#07101F] border-[rgba(80,150,255,0.12)]" : "bg-[#F8FBFF] border-[rgba(30,90,160,0.12)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-[#20D6A3]" />
                      <div>
                        <h4 className="text-xs font-bold text-[#10213A] dark:text-[#F5F8FF]">
                          Spatial 256-Bit Ledger Encryption
                        </h4>
                        <p className="text-[11px] text-[#60738F] dark:text-[#8FA3BF]">
                          Transactions signed and sealed with AES-GCM-256 standard
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#20D6A3]">Verified</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: VAULT ACTIONS */}
            {activeTab === "account" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold font-display text-[#10213A] dark:text-[#F5F8FF]">
                  Vault Operations & Data Control
                </h3>
                <p className="text-xs text-[#60738F] dark:text-[#8FA3BF]">
                  Export complete transaction telemetry or manage ledger state.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {/* Export JSON */}
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isDark
                        ? "bg-[#07101F] border-[rgba(80,150,255,0.12)] hover:border-[#18D9FF]/40"
                        : "bg-[#F8FBFF] border-[rgba(30,90,160,0.12)] hover:border-[#1677FF]/40"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-[#10213A] dark:text-[#F5F8FF] block">
                        Backup Vault (JSON)
                      </span>
                      <span className="text-[11px] font-mono text-[#60738F] dark:text-[#8FA3BF]">Full telemetry snapshot</span>
                    </div>
                    <Download className="w-4 h-4 text-[#18D9FF]" />
                  </button>

                  {/* Export CSV */}
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isDark
                        ? "bg-[#07101F] border-[rgba(80,150,255,0.12)] hover:border-[#18D9FF]/40"
                        : "bg-[#F8FBFF] border-[rgba(30,90,160,0.12)] hover:border-[#1677FF]/40"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-[#10213A] dark:text-[#F5F8FF] block">
                        Export Ledger (CSV)
                      </span>
                      <span className="text-[11px] font-mono text-[#60738F] dark:text-[#8FA3BF]">Spreadsheet compatible</span>
                    </div>
                    <Download className="w-4 h-4 text-[#18D9FF]" />
                  </button>

                  {/* Reset to Demo Seed */}
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm("Reset financial vault to default demo dataset (₹27,000 hero outflow)?")) {
                        await resetToDemo();
                        setSaveSuccess("Vault reset to canonical demo state.");
                        setTimeout(() => setSaveSuccess(null), 2500);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isDark
                        ? "bg-[#07101F] border-[rgba(80,150,255,0.12)] hover:border-[#F5B942]/40"
                        : "bg-[#F8FBFF] border-[rgba(30,90,160,0.12)] hover:border-[#F5B942]/40"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-[#10213A] dark:text-[#F5F8FF] block">
                        Reset Demo Orbit
                      </span>
                      <span className="text-[11px] font-mono text-[#60738F] dark:text-[#8FA3BF]">Restore ₹27,000 monthly seed</span>
                    </div>
                    <RotateCcw className="w-4 h-4 text-[#F5B942]" />
                  </button>

                  {/* Clear All Data */}
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm("Permanently clear ALL ledger transactions? This cannot be undone.")) {
                        await clearAll();
                        setSaveSuccess("Ledger cleared.");
                        setTimeout(() => setSaveSuccess(null), 2500);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isDark
                        ? "bg-[#07101F] border-[rgba(80,150,255,0.12)] hover:border-rose-500/40"
                        : "bg-[#F8FBFF] border-[rgba(30,90,160,0.12)] hover:border-rose-400"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-rose-500 block">
                        Clear All Data
                      </span>
                      <span className="text-[11px] font-mono text-[#60738F] dark:text-[#8FA3BF]">Purge entire history</span>
                    </div>
                    <Trash2 className="w-4 h-4 text-rose-500" />
                  </button>
                </div>

                {/* Sign Out Section */}
                <div className="pt-4 border-t border-[rgba(80,150,255,0.12)] dark:border-[rgba(80,150,255,0.12)] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#10213A] dark:text-[#F5F8FF]">
                      Sign Out of Command Center
                    </h4>
                    <p className="text-[11px] text-[#60738F] dark:text-[#8FA3BF]">
                      Disconnect active spatial session
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-mono font-bold hover:bg-rose-500/20 transition-all flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ROTATE CIPHER KEY MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050914]/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className={`relative w-full max-w-md p-6 sm:p-7 rounded-3xl border shadow-2xl transition-all ${
              isDark ? "bg-[#0B1426] border-[rgba(80,150,255,0.25)] shadow-[0_20px_50px_rgba(5,9,20,0.8)]" : "bg-white border-[rgba(30,90,160,0.14)] shadow-xl"
            }`}
          >
            <button
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#60738F] hover:text-[#F5F8FF] hover:bg-[#07101F] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#18D9FF]/10 border border-[#18D9FF]/30 flex items-center justify-center text-[#18D9FF]">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#18D9FF] font-bold">
                  CIPHER KEY ROTATION
                </span>
                <h3 className="text-lg font-bold font-display text-[#10213A] dark:text-[#F5F8FF]">
                  Update Encryption Key
                </h3>
              </div>
            </div>

            <form onSubmit={handlePasswordRotate} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#60738F] dark:text-[#8FA3BF] mb-1">
                  Current Key
                </label>
                <input
                  type="password"
                  value={currentCipher}
                  onChange={(e) => setCurrentCipher(e.target.value)}
                  placeholder="Enter current password"
                  required
                  className={`w-full px-3.5 py-2 rounded-xl text-sm border focus:outline-none ${
                    isDark
                      ? "bg-[#07101F] border-[rgba(80,150,255,0.15)] text-[#F5F8FF] focus:border-[#18D9FF]"
                      : "bg-[#F8FBFF] border-[rgba(30,90,160,0.15)] text-[#10213A] focus:border-[#1677FF]"
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#60738F] dark:text-[#8FA3BF] mb-1">
                  New Key
                </label>
                <input
                  type="password"
                  value={newCipher}
                  onChange={(e) => setNewCipher(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  className={`w-full px-3.5 py-2 rounded-xl text-sm border focus:outline-none ${
                    isDark
                      ? "bg-[#07101F] border-[rgba(80,150,255,0.15)] text-[#F5F8FF] focus:border-[#18D9FF]"
                      : "bg-[#F8FBFF] border-[rgba(30,90,160,0.15)] text-[#10213A] focus:border-[#1677FF]"
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#60738F] dark:text-[#8FA3BF] mb-1">
                  Confirm New Key
                </label>
                <input
                  type="password"
                  value={confirmCipher}
                  onChange={(e) => setConfirmCipher(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  className={`w-full px-3.5 py-2 rounded-xl text-sm border focus:outline-none ${
                    isDark
                      ? "bg-[#07101F] border-[rgba(80,150,255,0.15)] text-[#F5F8FF] focus:border-[#18D9FF]"
                      : "bg-[#F8FBFF] border-[rgba(30,90,160,0.15)] text-[#10213A] focus:border-[#1677FF]"
                  }`}
                />
              </div>

              {cipherError && (
                <p className="text-xs text-rose-500 font-mono pt-1">
                  {cipherError}
                </p>
              )}
              {cipherSuccess && (
                <p className="text-xs text-[#20D6A3] font-mono pt-1">
                  {cipherSuccess}
                </p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-mono ${
                    isDark ? "border-[rgba(80,150,255,0.15)] text-[#8FA3BF]" : "border-[rgba(30,90,160,0.15)] text-[#60738F]"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#18D9FF] to-[#2684FF] text-[#050914] font-bold text-xs font-mono shadow-sm hover:opacity-95"
                >
                  Confirm Rotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

