"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

export default function LoadingSkeleton() {
  const { isDark } = useTheme();

  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Hero Orbit Skeleton */}
      <div
        className={`w-full h-[520px] rounded-3xl border flex items-center justify-center relative overflow-hidden ${
          isDark ? "bg-slate-900/40 border-slate-800" : "bg-slate-200/50 border-slate-200"
        }`}
      >
        <div className="w-64 h-64 rounded-full border border-dashed border-cyan-500/20 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border border-violet-500/20 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-cyan-500/10" />
          </div>
        </div>
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-32 rounded-2xl border p-5 ${
              isDark ? "bg-slate-900/40 border-slate-800" : "bg-slate-200/50 border-slate-200"
            }`}
          />
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`h-72 rounded-3xl border ${
            isDark ? "bg-slate-900/40 border-slate-800" : "bg-slate-200/50 border-slate-200"
          }`}
        />
        <div
          className={`h-72 rounded-3xl border ${
            isDark ? "bg-slate-900/40 border-slate-800" : "bg-slate-200/50 border-slate-200"
          }`}
        />
      </div>
    </div>
  );
}
