"use client";

import React from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { useTheme } from "@/context/ThemeContext";
import StatNumber from "@/components/ui/StatNumber";
import { formatINR } from "@/lib/utils";
import {
  TrendingDown,
  TrendingUp,
  PiggyBank,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

export default function MetricCard() {
  const { metrics, expenses } = useExpenses();
  const { isDark } = useTheme();

  const totalSpending = metrics.totalExpenses > 0 ? metrics.totalExpenses : 27000;
  const totalIncome = metrics.totalIncome > 0 ? metrics.totalIncome : 42500;
  const netSavings = totalIncome - totalSpending;
  const transactionsCount = expenses.length > 0 ? expenses.length : 7;

  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
      {/* 1. TOTAL SPENDING */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
          isDark
            ? "bg-[#0B1426] border-[rgba(80,150,255,0.15)] shadow-card-dark hover:border-[#18D9FF]/40"
            : "bg-[#FFFFFF] border-[rgba(30,90,160,0.14)] shadow-card-light hover:border-[#1677FF]/40"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
              isDark ? "text-[#8FA3BF]" : "text-[#60738F]"
            }`}
          >
            TOTAL SPENDING
          </span>
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              isDark ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-600"
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="my-1">
          <div className="text-xl sm:text-2xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
            <StatNumber value={totalSpending} />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10.5px] font-mono mt-1">
          <span
            className={`flex items-center gap-0.5 font-semibold ${
              metrics.monthOverMonthGrowth <= 0 ? "text-emerald-500" : "text-amber-500"
            }`}
          >
            {metrics.monthOverMonthGrowth <= 0 ? "↓" : "↑"} {Math.abs(metrics.monthOverMonthGrowth)}%
          </span>
          <span className={isDark ? "text-[#60738F]" : "text-[#8A9BB2]"}>vs last month</span>
        </div>
      </div>

      {/* 2. TOTAL INCOME */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
          isDark
            ? "bg-[#0B1426] border-[rgba(80,150,255,0.15)] shadow-card-dark hover:border-[#18D9FF]/40"
            : "bg-[#FFFFFF] border-[rgba(30,90,160,0.14)] shadow-card-light hover:border-[#1677FF]/40"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
              isDark ? "text-[#8FA3BF]" : "text-[#60738F]"
            }`}
          >
            TOTAL INCOME
          </span>
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              isDark ? "bg-[#20D6A3]/10 text-[#20D6A3]" : "bg-emerald-50 text-[#0BAF83]"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="my-1">
          <div className="text-xl sm:text-2xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
            <StatNumber value={totalIncome} />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10.5px] font-mono mt-1">
          <span className="font-semibold text-emerald-500">Verified</span>
          <span className={isDark ? "text-[#60738F]" : "text-[#8A9BB2]"}>Inflow settlements</span>
        </div>
      </div>

      {/* 3. SAVINGS */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
          isDark
            ? "bg-[#0B1426] border-[rgba(80,150,255,0.15)] shadow-card-dark hover:border-[#18D9FF]/40"
            : "bg-[#FFFFFF] border-[rgba(30,90,160,0.14)] shadow-card-light hover:border-[#1677FF]/40"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
              isDark ? "text-[#8FA3BF]" : "text-[#60738F]"
            }`}
          >
            SAVINGS
          </span>
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              isDark ? "bg-[#18D9FF]/10 text-[#18D9FF]" : "bg-sky-50 text-[#1677FF]"
            }`}
          >
            <PiggyBank className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="my-1">
          <div className="text-xl sm:text-2xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
            <StatNumber value={netSavings} />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10.5px] font-mono mt-1">
          <span
            className={`font-semibold ${
              isDark ? "text-[#18D9FF]" : "text-[#1677FF]"
            }`}
          >
            {metrics.savingsRate}%
          </span>
          <span className={isDark ? "text-[#60738F]" : "text-[#8A9BB2]"}>savings rate</span>
        </div>
      </div>

      {/* 4. TRANSACTIONS */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
          isDark
            ? "bg-[#0B1426] border-[rgba(80,150,255,0.15)] shadow-card-dark hover:border-[#18D9FF]/40"
            : "bg-[#FFFFFF] border-[rgba(30,90,160,0.14)] shadow-card-light hover:border-[#1677FF]/40"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
              isDark ? "text-[#8FA3BF]" : "text-[#60738F]"
            }`}
          >
            TRANSACTIONS
          </span>
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              isDark ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" : "bg-indigo-50 text-[#7657E8]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="my-1">
          <div className="text-xl sm:text-2xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
            {transactionsCount}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10.5px] font-mono mt-1">
          <span
            className={`font-semibold ${
              metrics.budgetUtilization > 80 ? "text-amber-500" : "text-emerald-500"
            }`}
          >
            {metrics.budgetUtilization}%
          </span>
          <span className={isDark ? "text-[#60738F]" : "text-[#8A9BB2]"}>budget cap</span>
        </div>
      </div>
    </div>
  );
}
