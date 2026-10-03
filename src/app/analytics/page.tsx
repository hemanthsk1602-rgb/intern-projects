"use client";

import React from "react";
import { useExpenses } from "@/context/ExpenseContext";
import SpendingPulse from "@/components/dashboard/SpendingPulse";
import CategoryOrbit from "@/components/dashboard/CategoryOrbit";
import MonthlySpending from "@/components/analytics/MonthlySpending";
import IncomeVsExpense from "@/components/analytics/IncomeVsExpense";
import TopCategories from "@/components/analytics/TopCategories";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyOrbit from "@/components/ui/EmptyOrbit";
import { BarChart3, TrendingUp, Sparkles } from "lucide-react";

export default function AnalyticsPage() {
  const { expenses, isLoading } = useExpenses();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (expenses.length === 0) {
    return <EmptyOrbit />;
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
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
