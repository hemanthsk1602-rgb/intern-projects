"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

export default function LoadingSkeleton() {
  const { isDark } = useTheme();

  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Hero Orbit Skeleton */}
      <div
        className="w-full h-[60vh] min-h-[460px] flex items-center justify-center relative overflow-hidden"
      >
        <div className="w-56 h-56 rounded-full border border-dashed border-[#00D9FF]/20 flex items-center justify-center">
          <div className="w-44 h-44 rounded-full border border-[#8B5CF6]/20 flex items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-[#00D9FF]/10" />
          </div>
        </div>
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-24 rounded-2xl border p-4 ${
              isDark ? "bg-[#0B1426] border-[rgba(80,150,255,0.15)]" : "bg-white border-[rgba(30,90,160,0.14)]"
            }`}
          />
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`h-72 rounded-3xl border ${
            isDark ? "bg-[#0B1426] border-[rgba(80,150,255,0.15)]" : "bg-white border-[rgba(30,90,160,0.14)]"
          }`}
        />
        <div
          className={`h-72 rounded-3xl border ${
            isDark ? "bg-[#0B1426] border-[rgba(80,150,255,0.15)]" : "bg-white border-[rgba(30,90,160,0.14)]"
          }`}
        />
      </div>
    </div>
  );
}
