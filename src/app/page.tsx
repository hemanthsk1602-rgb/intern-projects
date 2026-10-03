"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useExpenses } from "@/context/ExpenseContext";
import MetricCard from "@/components/dashboard/MetricCard";
import SpendingPulse from "@/components/dashboard/SpendingPulse";
import CategoryOrbit from "@/components/dashboard/CategoryOrbit";
import EmptyOrbit from "@/components/ui/EmptyOrbit";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

// Dynamic import with SSR false for Three.js canvas to ensure flawless client rendering
const FinancialOrbit = dynamic(
  () => import("@/components/dashboard/FinancialOrbit"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[68vh] sm:h-[72vh] lg:h-[78vh] min-h-[580px] max-h-[880px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2.5">
          <div className="w-8 h-8 rounded-full border-2 border-[#00D9FF] border-t-transparent animate-spin" />
          <span className="text-xs font-mono text-[#00D9FF] tracking-wider">
            CALIBRATING 3D SPATIAL ORBIT...
          </span>
        </div>
      </div>
    ),
  }
);

export default function DashboardPage() {
  const { expenses, isLoading } = useExpenses();

  if (isLoading) {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <LoadingSkeleton />
      </div>
    );
  }

  // If there are zero expenses in the system, show the animated Empty State
  if (expenses.length === 0) {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <EmptyOrbit />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col animate-in fade-in duration-500">
      {/* ======================================================== */}
      {/* 1. SPATIAL ORBIT HERO (FULL-WIDTH 3D FINANCIAL UNIVERSE)  */}
      {/* ======================================================== */}
      <section className="spatial-orbit-hero relative w-full overflow-hidden">
        <FinancialOrbit />
      </section>

      {/* ======================================================== */}
      {/* 2. SUPPORTING ANALYTICS & COMMAND METRIC CARDS           */}
      {/* ======================================================== */}
      <section className="analytics max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* FINANCIAL COMMAND METRICS (HIERARCHY & ANIMATED NUMBERS) */}
        <MetricCard />

        {/* DUAL TELEMETRY: SPENDING PULSE & CATEGORY ORBIT */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 flex flex-col">
            <SpendingPulse />
          </div>
          <div className="lg:col-span-5 flex flex-col">
            <CategoryOrbit />
          </div>
        </div>
      </section>
    </div>
  );
}
