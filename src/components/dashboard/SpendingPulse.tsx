"use client";

import React, { useState, useMemo } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { useTheme } from "@/context/ThemeContext";
import { formatINR } from "@/lib/utils";
import { Activity, Calendar, TrendingUp } from "lucide-react";

export default function SpendingPulse() {
  const { spendingPulse } = useExpenses();
  const { isDark } = useTheme();

  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const [timeframe, setTimeframe] = useState<7 | 14>(14);

  const displayPoints = useMemo(() => {
    return spendingPulse.slice(-timeframe);
  }, [spendingPulse, timeframe]);

  // SVG Chart Dimensions
  const width = 800;
  const height = 240;
  const padding = { top: 30, right: 30, bottom: 40, left: 60 };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const maxAmount = useMemo(() => {
    const max = Math.max(...displayPoints.map((p) => p.amount), 5000);
    return Math.ceil(max / 1000) * 1000;
  }, [displayPoints]);

  const points = useMemo(() => {
    if (displayPoints.length === 0) return [];
    return displayPoints.map((pt, i) => {
      const x = padding.left + (i / Math.max(1, displayPoints.length - 1)) * innerWidth;
      const y = padding.top + innerHeight - (pt.amount / maxAmount) * innerHeight;
      return { ...pt, x, y };
    });
  }, [displayPoints, maxAmount, innerWidth, innerHeight, padding]);

  const { linePath, areaPath } = useMemo(() => {
    if (points.length < 2) return { linePath: "", areaPath: "" };

    let line = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) / 2;
      const cp2y = p1.y;
      line += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }

    const last = points[points.length - 1];
    const first = points[0];
    const area = `${line} L ${last.x} ${padding.top + innerHeight} L ${first.x} ${padding.top + innerHeight} Z`;

    return { linePath: line, areaPath: area };
  }, [points, padding, innerHeight]);

  const activePoint = activePointIndex !== null ? points[activePointIndex] : points[points.length - 1];
  const totalInPeriod = displayPoints.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div
      className={`w-full p-6 md:p-7 rounded-3xl backdrop-blur-xl border transition-all duration-300 relative overflow-hidden ${
        isDark
          ? "bg-slate-900/60 border-slate-800 shadow-glass-dark"
          : "bg-white border-slate-200 shadow-glass-light"
      }`}
    >
      {/* Background soft ambient glow */}
      <div
        className={`absolute top-0 right-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
          isDark ? "bg-electric/10" : "bg-sky-500/5"
        }`}
      />

      {/* Header with Title and Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                isDark
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                  : "bg-sky-50 text-sky-600 border-sky-200"
              }`}
            >
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold font-display tracking-tight text-slate-900 dark:text-white">
              SPENDING PULSE
            </h3>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                isDark
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                  : "bg-sky-50 text-sky-700 border-sky-300 font-bold"
              }`}
            >
              Real-time Ingestion
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dynamic timeline telemetry showing daily outflow velocities
          </p>
        </div>

        {/* Timeframe toggle buttons */}
        <div
          className={`flex items-center gap-1.5 p-1 rounded-xl border ${
            isDark
              ? "bg-black/30 border-slate-700/40"
              : "bg-slate-100 border-slate-200"
          }`}
        >
          <button
            onClick={() => setTimeframe(7)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
              timeframe === 7
                ? isDark
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                  : "bg-white text-sky-700 font-bold shadow-sm border border-slate-200"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeframe(14)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
              timeframe === 14
                ? isDark
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                  : "bg-white text-sky-700 font-bold shadow-sm border border-slate-200"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            14 Days
          </button>
        </div>
      </div>

      {/* Period Telemetry strip */}
      <div
        className={`flex flex-wrap items-center justify-between gap-4 py-2.5 px-4 mb-4 rounded-xl border text-xs font-mono ${
          isDark
            ? "bg-slate-950/40 border-slate-700/30 text-slate-300"
            : "bg-slate-50 border-slate-200 text-slate-700 font-medium"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400">Cycle Outflow:</span>
          <span className="font-bold text-slate-900 dark:text-white">{formatINR(totalInPeriod)}</span>
        </div>
        {activePoint && (
          <div className="flex items-center gap-3">
            <span
              className={`flex items-center gap-1 font-medium ${
                isDark ? "text-cyan-400" : "text-sky-700"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              {activePoint.formattedDate}
            </span>
            <span
              className={`px-2 py-0.5 rounded border font-bold ${
                isDark
                  ? "bg-cyan-600/40 text-white border-cyan-400/40"
                  : "bg-sky-100 text-sky-900 border-sky-300"
              }`}
            >
              {formatINR(activePoint.amount)}
            </span>
          </div>
        )}
      </div>

      {/* SVG Interactive Chart */}
      <div className="relative w-full aspect-[800/240] min-h-[220px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="spendingPulseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={isDark ? "#00F0FF" : "#0284C7"}
                stopOpacity={isDark ? 0.35 : 0.28}
              />
              <stop
                offset="60%"
                stopColor={isDark ? "#8B5CF6" : "#6366F1"}
                stopOpacity={0.06}
              />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>

            <filter id="neonPulseGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio, idx) => {
            const y = padding.top + innerHeight * (1 - ratio);
            const val = maxAmount * ratio;
            return (
              <g key={idx}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(15, 23, 42, 0.08)"}
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 10}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-slate-500 dark:fill-slate-400"
                >
                  ₹{(val / 1000).toFixed(0)}k
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          {areaPath && (
            <path
              d={areaPath}
              fill="url(#spendingPulseGrad)"
              className="transition-all duration-500 ease-out"
            />
          )}

          {/* Line stroke with high contrast in light mode */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke={isDark ? "#00F0FF" : "#0284C7"}
              strokeWidth="2.5"
              filter={isDark ? "url(#neonPulseGlow)" : undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-500 ease-out"
            />
          )}

          {/* Data Points & Hover Targets */}
          {points.map((pt, index) => {
            const isHovered = activePointIndex === index;
            return (
              <g key={pt.date}>
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={padding.top}
                    x2={pt.x}
                    y2={padding.top + innerHeight}
                    stroke={isDark ? "rgba(0, 240, 255, 0.4)" : "rgba(2, 132, 199, 0.4)"}
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : pt.amount > 0 ? 3.5 : 2}
                  fill={isHovered ? (isDark ? "#00F0FF" : "#0284C7") : isDark ? "#0F172A" : "#FFFFFF"}
                  stroke={isDark ? "#00F0FF" : "#0284C7"}
                  strokeWidth={isHovered ? 2.5 : 2}
                  className="transition-all duration-200"
                />

                {index % (timeframe === 14 ? 2 : 1) === 0 && (
                  <text
                    x={pt.x}
                    y={height - 10}
                    textAnchor="middle"
                    className="text-[10px] font-mono fill-slate-500 dark:fill-slate-400"
                  >
                    {pt.formattedDate}
                  </text>
                )}

                <rect
                  x={pt.x - 18}
                  y={padding.top}
                  width="36"
                  height={innerHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setActivePointIndex(index)}
                  onTouchStart={() => setActivePointIndex(index)}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
