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
    color: "#18D9FF", // Primary Cyan
    lightColor: "#00AFCF",
    glow: "rgba(24, 217, 255, 0.3)",
    badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    badgeText: "text-cyan-400 dark:text-cyan-300",
    icon: "Utensils",
  },
  Transport: {
    color: "#2684FF", // Primary Blue
    lightColor: "#1677FF",
    glow: "rgba(38, 132, 255, 0.3)",
    badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    badgeText: "text-blue-400 dark:text-blue-300",
    icon: "Car",
  },
  Shopping: {
    color: "#8B5CF6", // Secondary Violet
    lightColor: "#7657E8",
    glow: "rgba(139, 92, 246, 0.3)",
    badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    badgeText: "text-purple-400 dark:text-purple-300",
    icon: "ShoppingBag",
  },
  "Bills & Utilities": {
    color: "#F5B942", // Warning Amber
    lightColor: "#D97706",
    glow: "rgba(245, 185, 66, 0.3)",
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    badgeText: "text-amber-400 dark:text-amber-300",
    icon: "Zap",
  },
  Entertainment: {
    color: "#EC4899", // Magenta Pink
    lightColor: "#DB2777",
    glow: "rgba(236, 72, 153, 0.3)",
    badgeBg: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    badgeText: "text-pink-400 dark:text-pink-300",
    icon: "Film",
  },
  "Health & Wellness": {
    color: "#20D6A3", // Success Mint
    lightColor: "#0BAF83",
    glow: "rgba(32, 214, 163, 0.3)",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    badgeText: "text-emerald-400 dark:text-emerald-300",
    icon: "Activity",
  },
  Education: {
    color: "#6366F1", // Indigo
    lightColor: "#4F46E5",
    glow: "rgba(99, 102, 241, 0.3)",
    badgeBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    badgeText: "text-indigo-400 dark:text-indigo-300",
    icon: "GraduationCap",
  },
  Investment: {
    color: "#14B8A6", // Teal
    lightColor: "#0D9488",
    glow: "rgba(20, 184, 166, 0.3)",
    badgeBg: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    badgeText: "text-teal-400 dark:text-teal-300",
    icon: "TrendingUp",
  },
  Other: {
    color: "#8FA3BF", // Secondary Slate
    lightColor: "#60738F",
    glow: "rgba(143, 163, 191, 0.3)",
    badgeBg: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    badgeText: "text-slate-400 dark:text-slate-300",
    icon: "CircleDot",
  },
};
