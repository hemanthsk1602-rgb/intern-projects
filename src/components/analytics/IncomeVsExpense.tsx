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
      className={`p-6 md:p-7 rounded-3xl border transition-all ${
        isDark
          ? "bg-[#0B1426] border-[rgba(80,150,255,0.15)] shadow-[0_12px_40px_rgba(5,9,20,0.4)]"
          : "bg-white border-[rgba(30,90,160,0.14)] shadow-[0_8px_30px_rgba(15,30,60,0.06)]"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
              isDark
                ? "bg-[#20D6A3]/10 text-[#20D6A3] border-[#20D6A3]/25"
                : "bg-emerald-50 text-emerald-600 border-emerald-200"
            }`}
          >
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display tracking-tight text-[#10213A] dark:text-[#F5F8FF]">
              INCOME VS EXPENSE
            </h3>
            <p className="text-xs text-[#60738F] dark:text-[#8FA3BF]">
              Macro capital flow equilibrium
            </p>
          </div>
        </div>
        <span
          className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${
            isDark
              ? "bg-[#07101F] border-[rgba(80,150,255,0.15)] text-[#8FA3BF]"
              : "bg-[#F8FBFF] border-[rgba(30,90,160,0.15)] text-[#60738F] font-semibold"
          }`}
        >
          Savings Rate: <span className="text-[#20D6A3] font-bold">{metrics.savingsRate}%</span>
        </span>
      </div>

      {/* Dual Progress Ratio Bar */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-[#20D6A3] font-semibold flex items-center gap-1">
            <ArrowDownLeft className="w-3.5 h-3.5" /> Inflow ({incomePct.toFixed(1)}%)
          </span>
          <span className="text-rose-500 font-semibold flex items-center gap-1">
            Outflow ({expensePct.toFixed(1)}%) <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
        <div
          className={`w-full h-3 rounded-full p-0.5 flex overflow-hidden border ${
            isDark ? "bg-[#07101F] border-[rgba(80,150,255,0.15)]" : "bg-[#F8FBFF] border-[rgba(30,90,160,0.15)]"
          }`}
        >
          <div
            className="h-full rounded-l-full bg-gradient-to-r from-[#20D6A3] to-teal-400 transition-all duration-1000"
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
        <div className="p-3.5 rounded-xl bg-[#20D6A3]/5 border border-[#20D6A3]/20">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#20D6A3] font-bold">
            Total Inflow
          </span>
          <div className="text-lg font-bold font-display text-[#10213A] dark:text-[#F5F8FF] mt-0.5">
            {formatINR(metrics.totalIncome)}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20">
          <span className="text-[10px] font-mono uppercase tracking-wider text-rose-500 font-bold">
            Total Outflow
          </span>
          <div className="text-lg font-bold font-display text-[#10213A] dark:text-[#F5F8FF] mt-0.5">
            {formatINR(metrics.totalExpenses)}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#18D9FF]/5 border border-[#18D9FF]/20">
          <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${isDark ? "text-[#18D9FF]" : "text-[#1677FF]"}`}>
            Net Capital Retained
          </span>
          <div className={`text-lg font-bold font-display mt-0.5 ${isDark ? "text-[#18D9FF]" : "text-[#1677FF]"}`}>
            {formatINR(netSavings)}
          </div>
        </div>
      </div>
    </div>
  );
}
