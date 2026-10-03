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
      <div className="w-full h-[520px] md:h-[580px] lg:h-[620px] rounded-3xl border border-slate-800 bg-slate-950/40 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <span className="text-xs font-mono text-cyan-400 tracking-wider">
            INITIALIZING 3D SPATIAL ENGINE...
          </span>
        </div>
      </div>
    ),
  }
);

export default function DashboardPage() {
  const { expenses, isLoading } = useExpenses();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // If there are zero expenses in the system, show the animated Empty State
  if (expenses.length === 0) {
    return <EmptyOrbit />;
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      {/* ======================================================== */}
      {/* HERO SECTION: THE 3D FINANCIAL ORBIT                   */}
      {/* ======================================================== */}
      <section className="relative w-full">
        <FinancialOrbit />
      </section>

      {/* ======================================================== */}
      {/* FINANCIAL COMMAND METRICS (HIERARCHY & ANIMATED NUMBERS)*/}
      {/* ======================================================== */}
      <section className="w-full">
        <MetricCard />
      </section>

      {/* ======================================================== */}
      {/* DUAL TELEMETRY: SPENDING PULSE & CATEGORY ORBIT         */}
      {/* ======================================================== */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <SpendingPulse />
        </div>
        <div className="lg:col-span-5 flex flex-col">
          <CategoryOrbit />
        </div>
      </section>
    </div>
  );
}
