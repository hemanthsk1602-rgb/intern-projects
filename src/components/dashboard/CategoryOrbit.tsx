"use client";

import React, { useState, useMemo } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { useTheme } from "@/context/ThemeContext";
import { formatINR } from "@/lib/utils";
import { PieChart, Layers } from "lucide-react";
import { CategorySummary } from "@/types";

export default function CategoryOrbit() {
  const { categories } = useExpenses();
  const { isDark } = useTheme();
  const [hoveredCategory, setHoveredCategory] = useState<CategorySummary | null>(null);

  const totalExpense = useMemo(() => {
    return categories.reduce((sum, c) => sum + c.amount, 0);
  }, [categories]);

  const size = 260;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = useMemo(() => {
    let accumulatedAngle = 0;
    return categories.map((cat) => {
      const percentage = totalExpense > 0 ? (cat.amount / totalExpense) * 100 : 0;
      const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -accumulatedAngle;
      accumulatedAngle += (percentage / 100) * circumference;

      return {
        ...cat,
        strokeDasharray,
        strokeDashoffset,
      };
    });
  }, [categories, totalExpense, circumference]);

  return (
    <div
      className={`w-full p-5 md:p-6 rounded-3xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
        isDark
          ? "bg-[#0B1426] border-[rgba(80,150,255,0.15)] shadow-card-dark"
          : "bg-[#FFFFFF] border-[rgba(30,90,160,0.14)] shadow-card-light"
      }`}
    >
      {/* Background radial accent */}
      <div
        className={`absolute bottom-0 right-0 w-60 h-60 rounded-full blur-3xl pointer-events-none ${
          isDark ? "bg-violet-500/10" : "bg-violet-500/5"
        }`}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
              isDark
                ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                : "bg-violet-50 text-violet-600 border-violet-200"
            }`}
          >
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display tracking-tight text-slate-900 dark:text-white">
              CATEGORY ORBIT
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive radial distribution of capital outflow
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <Layers className="w-3.5 h-3.5 text-cyan-500" />
          <span>{categories.length} Segments</span>
        </div>
      </div>

      {/* Donut and Legend Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Interactive Radial Donut */}
        <div className="lg:col-span-6 flex justify-center items-center relative py-2">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="transform -rotate-90"
          >
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={isDark ? "rgba(255, 255, 255, 0.06)" : "#E2E8F0"}
              strokeWidth={strokeWidth}
            />

            {/* Category segments */}
            {segments.map((seg) => {
              const isHovered = hoveredCategory?.category === seg.category;
              return (
                <circle
                  key={seg.category}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer origin-center"
                  style={{
                    filter: isHovered && isDark
                      ? `drop-shadow(0 0 10px ${seg.color})`
                      : undefined,
                  }}
                  onMouseEnter={() => setHoveredCategory(seg)}
                  onMouseLeave={() => setHoveredCategory(null)}
                />
              );
            })}
          </svg>

          {/* Donut Center: TOTAL OUTFLOW ₹XX,XXX */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-4">
            <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 dark:text-slate-400 font-medium">
              {hoveredCategory ? hoveredCategory.category : "TOTAL OUTFLOW"}
            </span>
            <div className="text-xl md:text-2xl font-extrabold font-display text-slate-900 dark:text-white my-0.5">
              {formatINR(hoveredCategory ? hoveredCategory.amount : totalExpense)}
            </div>
            <span
              className={`text-xs font-mono font-bold ${
                isDark ? "text-cyan-400" : "text-sky-700"
              }`}
            >
              {hoveredCategory ? `${hoveredCategory.percentage}% of cycle` : `${categories.length} Categories`}
            </span>
          </div>
        </div>

        {/* Category List / Interactive Legend */}
        <div className="lg:col-span-6 flex flex-col gap-2 max-h-[280px] overflow-y-auto pr-1">
          {categories.map((cat) => {
            const isHovered = hoveredCategory?.category === cat.category;
            return (
              <div
                key={cat.category}
                onMouseEnter={() => setHoveredCategory(cat)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isHovered
                    ? isDark
                      ? "bg-slate-800/80 border-cyan-400 shadow-glow-cyan"
                      : "bg-sky-50 border-sky-400 shadow-sm"
                    : isDark
                    ? "bg-slate-900/40 border-slate-800/80 hover:border-slate-700"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">
                      {cat.category}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      {cat.count} txns
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-2">
                  <div className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                    {formatINR(cat.amount)}
                  </div>
                  <div
                    className={`text-[10px] font-mono font-bold ${
                      isDark ? "text-cyan-400" : "text-sky-700"
                    }`}
                  >
                    {cat.percentage}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
