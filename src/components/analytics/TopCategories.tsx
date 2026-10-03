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
      className={`p-6 md:p-7 rounded-3xl border transition-all ${
        isDark
          ? "bg-[#0B1426] border-[rgba(80,150,255,0.15)] shadow-[0_12px_40px_rgba(5,9,20,0.4)]"
          : "bg-white border-[rgba(30,90,160,0.14)] shadow-[0_8px_30px_rgba(15,30,60,0.06)]"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
              isDark
                ? "bg-[#F5B942]/10 text-[#F5B942] border-[#F5B942]/25"
                : "bg-amber-50 text-amber-600 border-amber-200"
            }`}
          >
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display tracking-tight text-[#10213A] dark:text-[#F5F8FF]">
              TOP OUTFLOW CATEGORIES
            </h3>
            <p className="text-xs text-[#60738F] dark:text-[#8FA3BF]">
              Ranked capital concentration
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {top.length === 0 ? (
          <p className="text-xs text-[#60738F] dark:text-[#8FA3BF] font-mono py-4">No categories recorded yet.</p>
        ) : (
          top.map((cat, idx) => (
            <div
              key={cat.category}
              className={`p-3.5 rounded-2xl border transition-all ${
                isDark
                  ? "bg-[#07101F] border-[rgba(80,150,255,0.15)] hover:border-[#18D9FF]/30"
                  : "bg-[#F8FBFF] border-[rgba(30,90,160,0.14)] hover:border-[rgba(30,90,160,0.3)]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold border ${
                      isDark
                        ? "bg-[#0F1B31] text-[#18D9FF] border-[#18D9FF]/25"
                        : "bg-white text-[#1677FF] border-[rgba(30,90,160,0.2)]"
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-xs font-bold text-[#10213A] dark:text-[#F5F8FF]">
                    {cat.category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold font-mono text-[#10213A] dark:text-[#F5F8FF]">
                    {formatINR(cat.amount)}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold ml-2 ${
                      isDark ? "text-[#18D9FF]" : "text-[#1677FF]"
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
