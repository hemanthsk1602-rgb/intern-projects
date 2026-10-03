"use client";

import React, { useState } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { useTheme } from "@/context/ThemeContext";
import { formatINR } from "@/lib/utils";
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
} from "lucide-react";

export default function IdentityCore() {
  const { user, updateUser } = useExpenses();
  const { isDark } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    monthlyBudget: user.monthlyBudget,
  });

  const completenessFields = [
    Boolean(user.name && user.name.length > 2),
    Boolean(user.email && user.email.includes("@")),
    Boolean(user.phone && user.phone.length > 8),
    Boolean(user.avatar && user.avatar.length > 5),
    Boolean(user.monthlyBudget && user.monthlyBudget > 0),
    Boolean(user.accountStatus),
  ];
  const completedCount = completenessFields.filter(Boolean).length;
  const completenessPercentage = Math.round((completedCount / completenessFields.length) * 100);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser(formData);
    setIsEditing(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`w-2 h-2 rounded-full animate-ping ${
                isDark ? "bg-cyan-400" : "bg-sky-600"
              }`}
            />
            <span
              className={`text-[11px] font-mono uppercase tracking-widest ${
                isDark ? "text-cyan-400" : "text-sky-700 font-bold"
              }`}
            >
              BIOMETRIC IDENTITY LAYER
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
            Identity Core
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Encrypted user profile and spatial financial authority credentials
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              name: user.name,
              email: user.email,
              phone: user.phone,
              monthlyBudget: user.monthlyBudget,
            });
            setIsEditing(!isEditing);
          }}
          className={`px-4 py-2 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all self-start sm:self-auto ${
            isDark
              ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
              : "border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold"
          }`}
        >
          {isEditing ? <X className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
          <span>{isEditing ? "Cancel Modification" : "Configure Credentials"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hologram Radar Identity Visualization */}
        <div
          className={`lg:col-span-5 p-8 rounded-3xl backdrop-blur-xl border transition-all flex flex-col items-center justify-center text-center relative overflow-hidden ${
            isDark
              ? "bg-slate-900/60 border-slate-800 shadow-glass-dark"
              : "bg-white border-slate-200 shadow-glass-light"
          }`}
        >
          <div className="relative w-56 h-56 flex items-center justify-center my-4">
            <div
              className={`absolute inset-0 rounded-full border border-dashed animate-orbit-rotate ${
                isDark ? "border-cyan-400/30" : "border-sky-400/40"
              }`}
            />
            <div
              className={`absolute inset-4 rounded-full border animate-spin-reverse ${
                isDark ? "border-violet-500/20" : "border-indigo-400/30"
              }`}
            />
            <div
              className={`absolute inset-8 rounded-full border animate-pulse ${
                isDark ? "border-blue-500/20" : "border-blue-400/25"
              }`}
            />

            {/* Avatar container */}
            <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-sky-400 to-violet-500 shadow-glow-cyan">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover rounded-full"
              />
              <span className="absolute bottom-0 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
              </span>
            </div>
          </div>

          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white mt-2">
            {user.name}
          </h2>
          <span
            className={`text-xs font-mono flex items-center gap-1.5 mt-0.5 ${
              isDark ? "text-cyan-400" : "text-sky-700 font-semibold"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            {user.accountStatus}
          </span>

          {/* Dynamic Profile Completeness Dial */}
          <div className={`w-full mt-6 pt-6 border-t ${isDark ? "border-slate-800/80" : "border-slate-200"}`}>
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-slate-500 dark:text-slate-400">Core Telemetry Integrity</span>
              <span className={`font-bold ${isDark ? "text-cyan-400" : "text-sky-700"}`}>
                {completenessPercentage}%
              </span>
            </div>
            <div
              className={`w-full h-2 rounded-full p-0.5 border ${
                isDark ? "bg-slate-950/80 border-slate-800" : "bg-slate-100 border-slate-200"
              }`}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-1000"
                style={{ width: `${completenessPercentage}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-2 block">
              Dynamic completeness calculated from verified attributes
            </span>
          </div>
        </div>

        {/* Identity Credentials Details */}
        <div
          className={`lg:col-span-7 p-6 md:p-8 rounded-3xl backdrop-blur-xl border transition-all ${
            isDark
              ? "bg-slate-900/60 border-slate-800 shadow-glass-dark"
              : "bg-white border-slate-200 shadow-glass-light"
          }`}
        >
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white mb-4">
                Update Identity Parameters
              </h3>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                    isDark
                      ? "border-slate-800 bg-slate-950/70 text-white focus:border-cyan-400"
                      : "border-slate-300 bg-slate-50 text-slate-900 focus:border-sky-500"
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Secure Communication Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                    isDark
                      ? "border-slate-800 bg-slate-950/70 text-white focus:border-cyan-400"
                      : "border-slate-300 bg-slate-50 text-slate-900 focus:border-sky-500"
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Verified Contact Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                    isDark
                      ? "border-slate-800 bg-slate-950/70 text-white focus:border-cyan-400"
                      : "border-slate-300 bg-slate-50 text-slate-900 focus:border-sky-500"
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Monthly Outflow Ceiling Budget (₹)
                </label>
                <input
                  type="number"
                  value={formData.monthlyBudget}
                  onChange={(e) =>
                    setFormData({ ...formData, monthlyBudget: parseFloat(e.target.value) || 0 })
                  }
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                    isDark
                      ? "border-slate-800 bg-slate-950/70 text-white focus:border-cyan-400"
                      : "border-slate-300 bg-slate-50 text-slate-900 focus:border-sky-500"
                  }`}
                  required
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs font-mono shadow-glow-cyan"
                >
                  Commit Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-mono ${
                    isDark ? "border-slate-800 text-slate-400" : "border-slate-300 text-slate-600"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div
                className={`flex items-center justify-between pb-3 border-b ${
                  isDark ? "border-slate-800/60" : "border-slate-200"
                }`}
              >
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                  <Fingerprint className={`w-4 h-4 ${isDark ? "text-cyan-400" : "text-sky-600"}`} /> Identity Matrix
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                  Biometric Synchronized
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Email */}
                <div
                  className={`p-3.5 rounded-2xl border ${
                    isDark ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                    <Mail className="w-3 h-3 text-cyan-500" /> Contact Email
                  </span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1 truncate">
                    {user.email}
                  </p>
                </div>

                {/* Phone */}
                <div
                  className={`p-3.5 rounded-2xl border ${
                    isDark ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                    <Phone className="w-3 h-3 text-cyan-500" /> Phone Relay
                  </span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                    {user.phone}
                  </p>
                </div>

                {/* Member Since */}
                <div
                  className={`p-3.5 rounded-2xl border ${
                    isDark ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                    <Calendar className="w-3 h-3 text-violet-500" /> Member Since
                  </span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                    {user.memberSince}
                  </p>
                </div>

                {/* Monthly Budget */}
                <div
                  className={`p-3.5 rounded-2xl border ${
                    isDark ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                    <Wallet className="w-3 h-3 text-emerald-500" /> Monthly Budget Ceiling
                  </span>
                  <p className="text-sm font-semibold font-mono text-slate-900 dark:text-white mt-1">
                    {formatINR(user.monthlyBudget)}
                  </p>
                </div>
              </div>

              {/* Security Status Box */}
              <div
                className={`mt-6 p-4 rounded-2xl border flex items-center justify-between ${
                  isDark
                    ? "bg-gradient-to-r from-cyan-950/30 to-violet-950/30 border-cyan-500/20"
                    : "bg-sky-50/60 border-sky-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                      isDark
                        ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                        : "bg-sky-100 border-sky-300 text-sky-700"
                    }`}
                  >
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Zero-Knowledge Enclave
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      All transaction hashes encrypted and local-state isolated
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full border ${
                    isDark
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                      : "bg-sky-100 text-sky-800 border-sky-300 font-bold"
                  }`}
                >
                  Tier 1
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
