"use client";

import React, { useState, useEffect } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { useTheme } from "@/context/ThemeContext";
import { ExpenseCategory, PaymentMethod, TransactionType } from "@/types";
import { CATEGORY_METADATA } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  X,
  Plus,
  Calendar,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle2,
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Film,
  Activity,
  GraduationCap,
  TrendingUp,
  CircleDot,
} from "lucide-react";

const CATEGORY_ICONS: Record<ExpenseCategory, React.ElementType> = {
  "Food & Dining": Utensils,
  Transport: Car,
  Shopping: ShoppingBag,
  "Bills & Utilities": Zap,
  Entertainment: Film,
  "Health & Wellness": Activity,
  Education: GraduationCap,
  Investment: TrendingUp,
  Other: CircleDot,
};

const PAYMENT_METHODS: PaymentMethod[] = [
  "UPI",
  "Credit Card",
  "Debit Card",
  "Net Banking",
  "Cash",
  "Crypto",
];

export default function AddExpenseModal() {
  const { isAddModalOpen, setIsAddModalOpen, addExpense } = useExpenses();
  const { isDark } = useTheme();

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<ExpenseCategory>("Food & Dining");
  const [date, setDate] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [notes, setNotes] = useState<string>("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAddModalOpen) {
      const today = new Date().toISOString().split("T")[0];
      setDate(today);
      setErrors({});
      setSuccessMessage(null);
    }
  }, [isAddModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsAddModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsAddModalOpen]);

  if (!isAddModalOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = "Please enter a valid amount greater than ₹0";
    }
    if (!description.trim() || description.trim().length < 2) {
      newErrors.description = "Description must be at least 2 characters";
    }
    if (!category) {
      newErrors.category = "Please select a category";
    }
    if (!date) {
      newErrors.date = "Please specify a valid transaction date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const res = await addExpense({
        amount: parseFloat(amount),
        description: description.trim(),
        category,
        date,
        paymentMethod,
        notes: notes.trim(),
        type,
      });

      if (res.success) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#00F0FF", "#3B82F6", "#8B5CF6", "#10B981"],
        });

        setSuccessMessage("Transaction committed to Financial Orbit!");
        setTimeout(() => {
          setIsAddModalOpen(false);
          setAmount("");
          setDescription("");
          setNotes("");
          setSuccessMessage(null);
        }, 800);
      } else {
        setErrors({ form: res.error || "Failed to commit transaction." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickAmounts = [100, 500, 1000, 2500, 5000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-xl rounded-3xl p-6 md:p-8 backdrop-blur-2xl border shadow-2xl transition-all my-8 ${
          isDark
            ? "bg-slate-950/95 border-slate-800 shadow-glow-cyan"
            : "bg-white border-slate-200 shadow-glass-light"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsAddModalOpen(false)}
          className={`absolute top-5 right-5 p-2 rounded-full transition-colors ${
            isDark
              ? "text-slate-400 hover:text-white hover:bg-slate-800/60"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`w-2 h-2 rounded-full animate-ping ${
                isDark ? "bg-cyan-400" : "bg-sky-600"
              }`}
            />
            <span
              className={`text-[11px] font-mono uppercase tracking-widest ${
                isDark ? "text-cyan-500" : "text-sky-700 font-bold"
              }`}
            >
              NEW FINANCIAL TELEMETRY
            </span>
          </div>
          <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
            Log Transaction
          </h2>
        </div>

        {/* Type Switcher */}
        <div
          className={`grid grid-cols-2 gap-2 p-1 mb-6 rounded-2xl border ${
            isDark
              ? "bg-slate-900/60 border-slate-800"
              : "bg-slate-100 border-slate-200"
          }`}
        >
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`py-2 text-xs font-mono font-bold rounded-xl transition-all ${
              type === "expense"
                ? "bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/40 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Outflow (Expense)
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={`py-2 text-xs font-mono font-bold rounded-xl transition-all ${
              type === "income"
                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Inflow (Income)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* VISUAL FOCUS: AMOUNT INPUT */}
          <div
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border ${
              isDark
                ? "bg-slate-900/40 border-slate-800/80"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <label className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Transaction Quantum
            </label>
            <div className="relative flex items-center justify-center w-full">
              <span
                className={`text-3xl md:text-4xl font-extrabold mr-2 font-display ${
                  isDark ? "text-cyan-400" : "text-sky-700"
                }`}
              >
                ₹
              </span>
              <input
                type="number"
                step="any"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors((prev) => ({ ...prev, amount: "" }));
                }}
                placeholder="0"
                autoFocus
                className="w-full text-center text-4xl md:text-5xl font-extrabold font-display bg-transparent text-slate-900 dark:text-white focus:outline-none placeholder-slate-400 dark:placeholder-slate-600"
              />
            </div>

            {/* Quick Amount Pills */}
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    const current = parseFloat(amount) || 0;
                    setAmount(String(current + q));
                  }}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-colors ${
                    isDark
                      ? "bg-slate-800/60 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border-slate-700/60"
                      : "bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 border-slate-200 shadow-sm"
                  }`}
                >
                  +{q}
                </button>
              ))}
            </div>

            {errors.amount && (
              <p className="text-xs text-rose-500 dark:text-rose-400 mt-2 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.amount}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-1.5 font-medium">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
              }}
              placeholder="e.g. Blue Tokai Coffee & Bakery"
              className={`w-full px-4 py-3 rounded-xl border text-sm font-sans transition-all focus:outline-none ${
                isDark
                  ? "bg-slate-900/60 border-slate-800 text-white focus:border-cyan-400"
                  : "bg-slate-50 border-slate-300 text-slate-900 focus:border-sky-500"
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-500 dark:text-rose-400 mt-1 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Category Selection with Interactive Icons */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2 font-medium">
              Category Matrix
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {(Object.keys(CATEGORY_METADATA) as ExpenseCategory[]).map((catKey) => {
                const Icon = CATEGORY_ICONS[catKey] || CircleDot;
                const isSelected = category === catKey;
                const meta = CATEGORY_METADATA[catKey];

                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCategory(catKey)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? isDark
                          ? "bg-slate-800/90 border-cyan-400 shadow-glow-cyan text-white"
                          : "bg-sky-50 border-sky-400 text-sky-950 shadow-sm font-semibold"
                        : isDark
                        ? "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <div
                      className="p-1.5 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: isSelected ? meta.color : undefined,
                        color: isSelected ? "#05070D" : meta.color,
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium truncate">{catKey}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-1.5 flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5" /> Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                  isDark
                    ? "bg-slate-900/60 border-slate-800 text-white focus:border-cyan-400"
                    : "bg-slate-50 border-slate-300 text-slate-900 focus:border-sky-500"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-1.5 flex items-center gap-1 font-medium">
                <CreditCard className="w-3.5 h-3.5" /> Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                  isDark
                    ? "bg-slate-900/60 border-slate-800 text-white focus:border-cyan-400"
                    : "bg-slate-50 border-slate-300 text-slate-900 focus:border-sky-500"
                }`}
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm} className={isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900"}>
                    {pm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-1.5 flex items-center gap-1 font-medium">
              <FileText className="w-3.5 h-3.5" /> Telemetry Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Reimbursable project expense"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                isDark
                  ? "bg-slate-900/60 border-slate-800 text-white focus:border-cyan-400"
                  : "bg-slate-50 border-slate-300 text-slate-900 focus:border-sky-500"
              }`}
            />
          </div>

          {errors.form && (
            <p className="text-xs text-rose-500 dark:text-rose-400 font-mono flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.form}
            </p>
          )}
          {successMessage && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              {successMessage}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-slate-950 font-bold font-mono tracking-wider flex items-center justify-center gap-2 shadow-glow-cyan hover:shadow-cyan-400/50 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>COMMIT TO ORBIT</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
