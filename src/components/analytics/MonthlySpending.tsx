"use client";

import React, { useMemo } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { useTheme } from "@/context/ThemeContext";
import { formatINR } from "@/lib/utils";
import { CalendarRange } from "lucide-react";

export default function MonthlySpending() {
  const { expenses } = useExpenses();
  const { isDark } = useTheme();

  const monthlyData = useMemo(() => {
    const map = new Map<string, { monthLabel: string; expense: number; income: number }>();

    expenses.forEach((item) => {
      const d = new Date(item.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });

      const current = map.get(key) || { monthLabel: label, expense: 0, income: 0 };
      if (item.type === "expense") {
        current.expense += item.amount;
      } else {
        current.income += item.amount;
      }
      map.set(key, current);
    });

    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, data]) => ({ key, ...data }));
  }, [expenses]);

  const maxExpense = Math.max(...monthlyData.map((m) => m.expense), 10000);

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
                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                : "bg-sky-50 text-sky-600 border-sky-200"
            }`}
          >
            <CalendarRange className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display tracking-tight text-slate-900 dark:text-white">
              MONTHLY SPENDING
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Multi-month historical outflow vectors
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {monthlyData.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono py-4">No monthly records found.</p>
        ) : (
          monthlyData.map((m) => {
            const barWidth = Math.min(100, (m.expense / maxExpense) * 100);

            return (
              <div key={m.key} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold text-slate-900 dark:text-white">{m.monthLabel}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 dark:text-slate-400">In: {formatINR(m.income)}</span>
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">Out: {formatINR(m.expense)}</span>
                  </div>
                </div>

                <div
                  className={`w-full h-3 rounded-full p-0.5 border flex items-center overflow-hidden ${
                    isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-100 border-slate-200"
                  }`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      isDark
                        ? "bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500"
                        : "bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600"
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
