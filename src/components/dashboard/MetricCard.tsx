"use client";

import React from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { useTheme } from "@/context/ThemeContext";
import StatNumber from "@/components/ui/StatNumber";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function MetricCard() {
  const { metrics } = useExpenses();
  const { isDark } = useTheme();

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 my-8">
      {/* 1. PRIMARY HERO METRIC: TOTAL NET BALANCE (Dominant Visual Hierarchy) */}
      <div
        className={`md:col-span-5 lg:col-span-4 p-6 md:p-7 rounded-3xl backdrop-blur-xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
          isDark
            ? "bg-gradient-to-br from-slate-900/90 via-slate-950/80 to-slate-900/50 border-cyan-500/30 shadow-glass-dark"
            : "bg-white border-slate-200 shadow-glass-light"
        }`}
      >
        {/* Glow ambient background accent */}
        <div
          className={`absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl pointer-events-none ${
            isDark ? "bg-cyan-500/15" : "bg-sky-500/10"
          }`}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                isDark
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                  : "bg-sky-50 text-sky-600 border-sky-200"
              }`}
            >
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                TOTAL NET BALANCE
              </span>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Assets</span>
              </div>
            </div>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase border ${
              isDark
                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                : "bg-sky-50 text-sky-700 border-sky-300 font-bold"
            }`}
          >
            Command Orbit
          </span>
        </div>

        <div className="my-5">
          <div className="text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
            <StatNumber value={metrics.totalBalance} />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1.5 font-sans">
            <span>Savings efficiency:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {metrics.savingsRate}%
            </span>
          </p>
        </div>

        {/* Dynamic mini progress indicator */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span>Monthly Budget Cap</span>
            <span className={isDark ? "text-cyan-400" : "text-sky-700 font-bold"}>
              {metrics.budgetUtilization}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800/60 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isDark
                  ? "bg-gradient-to-r from-cyan-400 to-electric"
                  : "bg-gradient-to-r from-sky-500 to-indigo-600"
              }`}
              style={{ width: `${Math.min(100, metrics.budgetUtilization)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. SECONDARY TELEMETRY METRICS: (Total Inflow, Total Outflow, This Month) */}
      <div className="md:col-span-7 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* TOTAL INFLOW */}
        <div
          className={`p-5 rounded-2xl backdrop-blur-md border transition-all duration-300 flex flex-col justify-between ${
            isDark
              ? "bg-slate-900/60 border-slate-800 hover:border-emerald-500/40"
              : "bg-white border-slate-200 hover:border-emerald-400 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
              Total Inflow
            </span>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400">
              <StatNumber value={metrics.totalIncome} />
            </div>
          </div>
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">↑ Inflow</span>
            <span>records</span>
          </div>
        </div>

        {/* TOTAL OUTFLOW */}
        <div
          className={`p-5 rounded-2xl backdrop-blur-md border transition-all duration-300 flex flex-col justify-between ${
            isDark
              ? "bg-slate-900/60 border-slate-800 hover:border-rose-500/40"
              : "bg-white border-slate-200 hover:border-rose-400 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
              Total Outflow
            </span>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl font-bold font-display text-rose-600 dark:text-rose-400">
              <StatNumber value={metrics.totalExpenses} />
            </div>
          </div>
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span className="text-rose-600 dark:text-rose-400 font-bold">All-time</span>
            <span>outflow debit</span>
          </div>
        </div>

        {/* THIS MONTH OUTFLOW */}
        <div
          className={`p-5 rounded-2xl backdrop-blur-md border transition-all duration-300 flex flex-col justify-between ${
            isDark
              ? "bg-slate-900/60 border-slate-800 hover:border-violet-500/40"
              : "bg-white border-slate-200 hover:border-violet-400 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
              This Month
            </span>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl font-bold font-display text-violet-600 dark:text-violet-300">
              <StatNumber value={metrics.thisMonthOutflow} />
            </div>
          </div>
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Zap className={`w-3 h-3 ${isDark ? "text-cyan-400" : "text-sky-600"}`} />
            <span>Active cycle burn</span>
          </div>
        </div>
      </div>
    </div>
  );
}
