import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ExpenseCategory } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number, options?: { showFraction?: boolean }): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: options?.showFraction ? 2 : 0,
    minimumFractionDigits: options?.showFraction ? 2 : 0,
  });

  const formatted = formatter.format(absAmount);
  return isNegative ? `-${formatted}` : formatted;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return dateString;
  }
}

export const CATEGORY_METADATA: Record<
  ExpenseCategory,
  {
    color: string;
    lightColor: string;
    glow: string;
    badgeBg: string;
    badgeText: string;
    icon: string;
  }
> = {
  "Food & Dining": {
    color: "#00F0FF", // Cyan
    lightColor: "#0891B2",
    glow: "rgba(0, 240, 255, 0.4)",
    badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    badgeText: "text-cyan-400 dark:text-cyan-300",
    icon: "Utensils",
  },
  Transport: {
    color: "#3B82F6", // Electric Blue
    lightColor: "#2563EB",
    glow: "rgba(59, 130, 246, 0.4)",
    badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    badgeText: "text-blue-400 dark:text-blue-300",
    icon: "Car",
  },
  Shopping: {
    color: "#8B5CF6", // Violet
    lightColor: "#7C3AED",
    glow: "rgba(139, 92, 246, 0.4)",
    badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    badgeText: "text-purple-400 dark:text-purple-300",
    icon: "ShoppingBag",
  },
  "Bills & Utilities": {
    color: "#F59E0B", // Amber
    lightColor: "#D97706",
    glow: "rgba(245, 158, 11, 0.4)",
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    badgeText: "text-amber-400 dark:text-amber-300",
    icon: "Zap",
  },
  Entertainment: {
    color: "#EC4899", // Neon Pink
    lightColor: "#DB2777",
    glow: "rgba(236, 72, 153, 0.4)",
    badgeBg: "bg-pink-500/10 text-pink-400 border-pink-500/30",
    badgeText: "text-pink-400 dark:text-pink-300",
    icon: "Film",
  },
  "Health & Wellness": {
    color: "#10B981", // Emerald
    lightColor: "#059669",
    glow: "rgba(16, 185, 129, 0.4)",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    badgeText: "text-emerald-400 dark:text-emerald-300",
    icon: "Activity",
  },
  Education: {
    color: "#6366F1", // Indigo
    lightColor: "#4F46E5",
    glow: "rgba(99, 102, 241, 0.4)",
    badgeBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    badgeText: "text-indigo-400 dark:text-indigo-300",
    icon: "GraduationCap",
  },
  Investment: {
    color: "#14B8A6", // Teal
    lightColor: "#0D9488",
    glow: "rgba(20, 184, 166, 0.4)",
    badgeBg: "bg-teal-500/10 text-teal-400 border-teal-500/30",
    badgeText: "text-teal-400 dark:text-teal-300",
    icon: "TrendingUp",
  },
  Other: {
    color: "#94A3B8", // Slate
    lightColor: "#64748B",
    glow: "rgba(148, 163, 184, 0.4)",
    badgeBg: "bg-slate-500/10 text-slate-400 border-slate-500/30",
    badgeText: "text-slate-400 dark:text-slate-300",
    icon: "CircleDot",
  },
};
