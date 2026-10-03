"use client";

import React from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { useTheme } from "@/context/ThemeContext";
import { formatINR } from "@/lib/utils";
import { Award } from "lucide-react";

export default function TopCategories() {
  const { categories } = useExpenses();
  const { isDark } = useTheme();

  const top = categories.slice(0, 5);

  return (
    <div
      className={`p-6 md:p-7 rounded-3xl backdrop-blur-xl border transition-all ${
        isDark
          ? "bg-slate-900/60 border-slate-800 shadow-glass-dark"
          : "bg-white border-slate-200 shadow-glass-light"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
              isDark
                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                : "bg-amber-50 text-amber-600 border-amber-200"
            }`}
          >
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display tracking-tight text-slate-900 dark:text-white">
              TOP OUTFLOW CATEGORIES
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ranked capital concentration
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {top.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono py-4">No categories recorded yet.</p>
        ) : (
          top.map((cat, idx) => (
            <div
              key={cat.category}
              className={`p-3.5 rounded-2xl border transition-all ${
                isDark
                  ? "bg-slate-950/40 border-slate-800 hover:border-slate-700"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold border ${
                      isDark
                        ? "bg-slate-800 text-cyan-400 border-transparent"
                        : "bg-white text-sky-700 border-slate-200"
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {cat.category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold font-mono text-slate-900 dark:text-white">
                    {formatINR(cat.amount)}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold ml-2 ${
                      isDark ? "text-cyan-400" : "text-sky-700"
                    }`}
                  >
                    {cat.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800/40 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
