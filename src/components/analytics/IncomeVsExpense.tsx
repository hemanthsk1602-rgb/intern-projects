"use client";

import React from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { useTheme } from "@/context/ThemeContext";
import { formatINR } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight, Scale } from "lucide-react";

export default function IncomeVsExpense() {
  const { metrics } = useExpenses();
  const { isDark } = useTheme();

  const total = metrics.totalIncome + metrics.totalExpenses;
  const incomePct = total > 0 ? (metrics.totalIncome / total) * 100 : 50;
  const expensePct = total > 0 ? (metrics.totalExpenses / total) * 100 : 50;
  const netSavings = metrics.totalIncome - metrics.totalExpenses;

  return (
    <div
      className={`p-6 md:p-7 rounded-3xl backdrop-blur-xl border transition-all ${
        isDark
          ? "bg-slate-900/60 border-slate-800 shadow-glass-dark"
          : "bg-white border-slate-200 shadow-glass-light"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
              isDark
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-emerald-50 text-emerald-600 border-emerald-200"
            }`}
          >
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display tracking-tight text-slate-900 dark:text-white">
              INCOME VS EXPENSE
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Macro capital flow equilibrium
            </p>
          </div>
        </div>
        <span
          className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${
            isDark
              ? "bg-slate-800/60 border-slate-700/60 text-slate-300"
              : "bg-slate-100 border-slate-200 text-slate-700 font-semibold"
          }`}
        >
          Savings Rate: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{metrics.savingsRate}%</span>
        </span>
      </div>

      {/* Dual Progress Ratio Bar */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <ArrowDownLeft className="w-3.5 h-3.5" /> Inflow ({incomePct.toFixed(1)}%)
          </span>
          <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
            Outflow ({expensePct.toFixed(1)}%) <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
        <div
          className={`w-full h-3 rounded-full p-0.5 flex overflow-hidden border ${
            isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-100 border-slate-200"
          }`}
        >
          <div
            className="h-full rounded-l-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000"
            style={{ width: `${incomePct}%` }}
          />
          <div
            className="h-full rounded-r-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-1000"
            style={{ width: `${expensePct}%` }}
          />
        </div>
      </div>

      {/* Numerical Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
            Total Inflow
          </span>
          <div className="text-lg font-bold font-display text-slate-900 dark:text-white mt-0.5">
            {formatINR(metrics.totalIncome)}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20">
          <span className="text-[10px] font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold">
            Total Outflow
          </span>
          <div className="text-lg font-bold font-display text-slate-900 dark:text-white mt-0.5">
            {formatINR(metrics.totalExpenses)}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
          <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${isDark ? "text-cyan-400" : "text-sky-700"}`}>
            Net Capital Retained
          </span>
          <div className={`text-lg font-bold font-display mt-0.5 ${isDark ? "text-cyan-400" : "text-sky-700"}`}>
            {formatINR(netSavings)}
          </div>
        </div>
      </div>
    </div>
  );
}
