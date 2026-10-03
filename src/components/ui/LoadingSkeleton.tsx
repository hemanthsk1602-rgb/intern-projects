"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

export default function LoadingSkeleton() {
  const { isDark } = useTheme();

  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Hero Orbit Skeleton */}
      <div
        className={`w-full h-[400px] rounded-3xl border flex items-center justify-center relative overflow-hidden ${
          isDark ? "bg-[#0B1426] border-[rgba(80,150,255,0.15)]" : "bg-white border-[rgba(30,90,160,0.14)]"
        }`}
      >
        <div className="w-52 h-52 rounded-full border border-dashed border-[#18D9FF]/20 flex items-center justify-center">
          <div className="w-40 h-40 rounded-full border border-[#8B5CF6]/20 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-[#18D9FF]/10" />
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
