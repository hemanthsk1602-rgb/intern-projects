"use client";

import React from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { Plus, RotateCcw } from "lucide-react";

export default function EmptyOrbit() {
  const { setIsAddModalOpen, resetToDemo } = useExpenses();

  return (
    <div className="w-full py-16 px-6 flex flex-col items-center justify-center text-center">
      {/* Small Animated Orbit Visualization */}
      <div className="relative w-36 h-36 flex items-center justify-center mb-8">
        <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/30 animate-orbit-rotate" />
        <div className="absolute inset-4 rounded-full border border-violet-500/25 animate-spin-reverse" />
        <div className="absolute inset-8 rounded-full border border-blue-500/20 animate-pulse-slow" />

        {/* Small floating orbit node */}
        <div className="absolute top-1 left-4 w-3 h-3 rounded-full bg-cyan-400 shadow-glow-cyan animate-pulse" />
        <div className="absolute bottom-3 right-5 w-2.5 h-2.5 rounded-full bg-violet-400 shadow-glow-violet" />

        {/* Central glowing core beacon */}
        <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500/30 to-violet-500/30 backdrop-blur-md border border-cyan-400/40 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-cyan-400 animate-ping opacity-75" />
          <div className="w-3 h-3 rounded-full bg-white absolute" />
        </div>
      </div>

      {/* Primary Empty State Heading */}
      <h3 className="text-xl md:text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white mb-2">
        YOUR FINANCIAL ORBIT IS EMPTY
      </h3>

      {/* Subtitle */}
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 font-sans">
        Start tracking your first expense to awaken your financial command center.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-slate-950 font-bold font-mono text-xs tracking-wider flex items-center gap-2 shadow-glow-cyan hover:shadow-cyan-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>ADD FIRST EXPENSE</span>
        </button>

        <button
          onClick={resetToDemo}
          className="px-5 py-3 rounded-xl border border-slate-700/60 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 bg-slate-900/30 dark:bg-black/30 font-mono text-xs flex items-center gap-2 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Load Demo System</span>
        </button>
      </div>
    </div>
  );
}
