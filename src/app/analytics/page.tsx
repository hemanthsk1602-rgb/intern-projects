"use client";

import React, { useMemo } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { useTheme } from "@/context/ThemeContext";
import SpendingPulse from "@/components/dashboard/SpendingPulse";
import CategoryOrbit from "@/components/dashboard/CategoryOrbit";
import MonthlySpending from "@/components/analytics/MonthlySpending";
import IncomeVsExpense from "@/components/analytics/IncomeVsExpense";
import TopCategories from "@/components/analytics/TopCategories";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyOrbit from "@/components/ui/EmptyOrbit";
import { formatINR } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  Layers,
  ArrowUpRight,
  Activity,
  CreditCard,
  PieChart,
} from "lucide-react";

export default function AnalyticsPage() {
  const { expenses, isLoading } = useExpenses();
  const { isDark } = useTheme();

  // Dynamic Telemetry Computations
  const stats = useMemo(() => {
    const expenseItems = expenses.filter((e) => e.type === "expense");
    const totalOutflow = expenseItems.reduce((acc, curr) => acc + curr.amount, 0);
    const avgExpense = expenseItems.length > 0 ? totalOutflow / expenseItems.length : 0;
    const largestExpense =
      expenseItems.length > 0 ? Math.max(...expenseItems.map((e) => e.amount)) : 0;

    // Find most used payment method
    const methodCounts: Record<string, number> = {};
    expenses.forEach((e) => {
      methodCounts[e.paymentMethod] = (methodCounts[e.paymentMethod] || 0) + 1;
    });
    let topMethod = "None";
    let maxMethodCount = 0;
    Object.entries(methodCounts).forEach(([method, count]) => {
      if (count > maxMethodCount) {
        maxMethodCount = count;
        topMethod = method;
      }
    });

    return {
      totalTransactions: expenses.length,
      avgExpense,
      largestExpense,
      topMethod,
    };
  }, [expenses]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (expenses.length === 0) {
    return <EmptyOrbit />;
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-violet-400">
              DEEP TELEMETRY & SPATIAL INTELLIGENCE
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
            Financial Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Holistic capital velocity, category distributions, and equilibrium ratios
          </p>
        </div>
      </div>

      {/* Row 0: High-Level Analytics Telemetry Bar */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Events */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDark
              ? "bg-[#0B1426] border-[rgba(80,150,255,0.15)] shadow-[0_12px_40px_rgba(5,9,20,0.4)]"
              : "bg-white border-[rgba(30,90,160,0.14)] shadow-[0_8px_30px_rgba(15,30,60,0.06)]"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[#60738F] dark:text-[#8FA3BF]">
              Total Ledger Events
            </span>
            <Layers className="w-4 h-4 text-[#18D9FF]" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-display text-[#10213A] dark:text-[#F5F8FF]">
            {stats.totalTransactions}
          </div>
          <span className="text-[10px] font-mono text-[#60738F] dark:text-[#8FA3BF] mt-1 block">
            Indexed transactions
          </span>
        </div>

        {/* Avg Outflow */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDark
              ? "bg-[#0B1426] border-[rgba(80,150,255,0.15)] shadow-[0_12px_40px_rgba(5,9,20,0.4)]"
              : "bg-white border-[rgba(30,90,160,0.14)] shadow-[0_8px_30px_rgba(15,30,60,0.06)]"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[#60738F] dark:text-[#8FA3BF]">
              Average Outflow
            </span>
            <Activity className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-display text-[#10213A] dark:text-[#F5F8FF]">
            {formatINR(stats.avgExpense)}
          </div>
          <span className="text-[10px] font-mono text-[#60738F] dark:text-[#8FA3BF] mt-1 block">
            Per expense event
          </span>
        </div>

        {/* Largest Outflow */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDark
              ? "bg-[#0B1426] border-[rgba(80,150,255,0.15)] shadow-[0_12px_40px_rgba(5,9,20,0.4)]"
              : "bg-white border-[rgba(30,90,160,0.14)] shadow-[0_8px_30px_rgba(15,30,60,0.06)]"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[#60738F] dark:text-[#8FA3BF]">
              Largest Single Outflow
            </span>
            <ArrowUpRight className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-display text-[#10213A] dark:text-[#F5F8FF]">
            {formatINR(stats.largestExpense)}
          </div>
          <span className="text-[10px] font-mono text-[#60738F] dark:text-[#8FA3BF] mt-1 block">
            Max capital drawdown
          </span>
        </div>

        {/* Top Rail */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDark
              ? "bg-[#0B1426] border-[rgba(80,150,255,0.15)] shadow-[0_12px_40px_rgba(5,9,20,0.4)]"
              : "bg-white border-[rgba(30,90,160,0.14)] shadow-[0_8px_30px_rgba(15,30,60,0.06)]"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[#60738F] dark:text-[#8FA3BF]">
              Primary Rail
            </span>
            <CreditCard className="w-4 h-4 text-[#20D6A3]" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-display text-[#10213A] dark:text-[#F5F8FF] truncate">
            {stats.topMethod}
          </div>
          <span className="text-[10px] font-mono text-[#60738F] dark:text-[#8FA3BF] mt-1 block">
            Most active settlement
          </span>
        </div>
      </section>

      {/* Row 1: Spending Pulse */}
      <section className="w-full">
        <SpendingPulse />
      </section>

      {/* Row 2: Category Orbit & Top Categories */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 flex flex-col">
          <CategoryOrbit />
        </div>
        <div className="lg:col-span-6 flex flex-col">
          <TopCategories />
        </div>
      </section>

      {/* Row 3: Monthly Spending & Income vs Expense */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 flex flex-col">
          <MonthlySpending />
        </div>
        <div className="lg:col-span-6 flex flex-col">
          <IncomeVsExpense />
        </div>
      </section>
    </div>
  );
}

