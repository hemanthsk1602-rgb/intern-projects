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
  const { isAddModalOpen, setIsAddModalOpen, addExpense, editExpense, editingExpense } = useExpenses();
  const { isDark } = useTheme();

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState<string>("0");
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
      if (editingExpense) {
        setType(editingExpense.type);
        setAmount(String(editingExpense.amount));
        setDescription(editingExpense.description);
        setCategory(editingExpense.category);
        setDate(editingExpense.date);
        setPaymentMethod(editingExpense.paymentMethod);
        setNotes(editingExpense.notes || "");
      } else {
        const today = new Date().toISOString().split("T")[0];
        setDate(today);
        setType("expense");
        setAmount("");
        setDescription("");
        setCategory("Food & Dining");
        setPaymentMethod("UPI");
        setNotes("");
      }
      setErrors({});
      setSuccessMessage(null);
    }
  }, [isAddModalOpen, editingExpense]);

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
      let res;
      if (editingExpense) {
        res = await editExpense(editingExpense.id, {
          amount: parseFloat(amount),
          description: description.trim(),
          category,
          date,
          paymentMethod,
          notes: notes.trim(),
          type,
        });
      } else {
        res = await addExpense({
          amount: parseFloat(amount),
          description: description.trim(),
          category,
          date,
          paymentMethod,
          notes: notes.trim(),
          type,
        });
      }

      if (res.success) {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#18D9FF", "#2684FF", "#8B5CF6", "#20D6A3"],
        });

        setSuccessMessage(
          editingExpense
            ? "Transaction updated in Financial Orbit!"
            : "Transaction committed to Financial Orbit!"
        );
        setTimeout(() => {
          setIsAddModalOpen(false);
          setAmount("");
          setDescription("");
          setNotes("");
          setSuccessMessage(null);
        }, 750);
      } else {
        setErrors({ form: res.error || "Failed to commit transaction." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickAmounts = [100, 500, 1000, 2500, 5000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div
        className={`relative w-full max-w-lg rounded-3xl p-6 md:p-7 border shadow-2xl transition-all my-6 ${
          isDark
            ? "bg-[#0B1426] border-[rgba(80,150,255,0.18)] shadow-card-dark"
            : "bg-[#FFFFFF] border-[rgba(30,90,160,0.16)] shadow-card-light"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsAddModalOpen(false)}
          className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors ${
            isDark
              ? "text-[#8FA3BF] hover:text-white hover:bg-[#07101F]"
              : "text-[#60738F] hover:text-[#10213A] hover:bg-[#F4F8FC]"
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`w-2 h-2 rounded-full animate-ping ${
                isDark ? "bg-[#18D9FF]" : "bg-[#1677FF]"
              }`}
            />
            <span
              className={`text-[10.5px] font-mono uppercase tracking-widest font-semibold ${
                isDark ? "text-[#18D9FF]" : "text-[#1677FF]"
              }`}
            >
              {editingExpense ? "MODIFY EVENT" : "NEW EVENT"}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
            {editingExpense ? "Edit Transaction" : "Log Transaction"}
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? "text-[#8FA3BF]" : "text-[#60738F]"}`}>
            {editingExpense
              ? "Update parameters to recalibrate your financial orbit in real time."
              : "Log a capital inflow or outflow into your financial ledger."}
          </p>
        </div>

        {/* Type Switcher */}
        <div
          className={`grid grid-cols-2 gap-1.5 p-1 mb-5 rounded-2xl border ${
            isDark
              ? "bg-[#07101F] border-[rgba(80,150,255,0.12)]"
              : "bg-[#F4F8FC] border-[rgba(30,90,160,0.14)]"
          }`}
        >
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`py-1.5 text-xs font-mono font-bold rounded-xl transition-all ${
              type === "expense"
                ? "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                : isDark
                ? "text-[#8FA3BF] hover:text-[#F5F8FF]"
                : "text-[#60738F] hover:text-[#10213A]"
            }`}
          >
            Outflow (Expense)
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={`py-1.5 text-xs font-mono font-bold rounded-xl transition-all ${
              type === "income"
                ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                : isDark
                ? "text-[#8FA3BF] hover:text-[#F5F8FF]"
                : "text-[#60738F] hover:text-[#10213A]"
            }`}
          >
            Inflow (Income)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Box */}
          <div
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border ${
              isDark
                ? "bg-[#07101F] border-[rgba(80,150,255,0.15)]"
                : "bg-[#F8FBFF] border-[rgba(30,90,160,0.14)]"
            }`}
          >
            <label className={`text-[10px] font-mono uppercase tracking-wider mb-1 font-semibold ${isDark ? "text-[#8FA3BF]" : "text-[#60738F]"}`}>
              Quantum Amount
            </label>
            <div className="relative flex items-center justify-center w-full">
              <span
                className={`text-2xl sm:text-3xl font-extrabold mr-1 font-display ${
                  isDark ? "text-[#18D9FF]" : "text-[#1677FF]"
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
                className="w-full text-center text-3xl sm:text-4xl font-extrabold font-display bg-transparent text-slate-900 dark:text-white focus:outline-none placeholder-slate-400 dark:placeholder-slate-600"
              />
            </div>

            {/* Quick Amount Pills */}
            <div className="flex flex-wrap gap-1.5 justify-center mt-3">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    const current = parseFloat(amount) || 0;
                    setAmount(String(current + q));
                  }}
                  className={`px-2 py-0.5 text-[10.5px] font-mono rounded-lg border transition-colors ${
                    isDark
                      ? "bg-[#0B1426] hover:bg-[#18D9FF]/20 text-[#8FA3BF] hover:text-[#18D9FF] border-[rgba(80,150,255,0.15)]"
                      : "bg-white hover:bg-sky-50 text-[#60738F] hover:text-[#1677FF] border-[rgba(30,90,160,0.14)]"
                  }`}
                >
                  +{q}
                </button>
              ))}
            </div>

            {errors.amount && (
              <p className="text-xs text-rose-500 mt-2 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.amount}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className={`block text-[11px] font-mono uppercase tracking-wider mb-1 font-semibold ${isDark ? "text-[#8FA3BF]" : "text-[#60738F]"}`}>
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
              }}
              placeholder="e.g. Metro pass or Artisan Coffee"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                isDark
                  ? "bg-[#07101F] border-[rgba(80,150,255,0.15)] text-[#F5F8FF] focus:border-[#18D9FF]"
                  : "bg-[#F8FBFF] border-[rgba(30,90,160,0.16)] text-[#10213A] focus:border-[#1677FF]"
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Category Selection */}
          <div>
            <label className={`block text-[11px] font-mono uppercase tracking-wider mb-1.5 font-semibold ${isDark ? "text-[#8FA3BF]" : "text-[#60738F]"}`}>
              Category
            </label>
            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
              {(Object.keys(CATEGORY_METADATA) as ExpenseCategory[]).map((catKey) => {
                const Icon = CATEGORY_ICONS[catKey] || CircleDot;
                const isSelected = category === catKey;
                const meta = CATEGORY_METADATA[catKey];

                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCategory(catKey)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? isDark
                          ? "bg-[#18D9FF]/10 border-[#18D9FF] text-white shadow-glow-subtle font-semibold"
                          : "bg-[#1677FF]/10 border-[#1677FF] text-[#10213A] font-semibold"
                        : isDark
                        ? "bg-[#07101F] border-[rgba(80,150,255,0.12)] text-[#8FA3BF] hover:text-white"
                        : "bg-[#F8FBFF] border-[rgba(30,90,160,0.14)] text-[#60738F] hover:text-[#10213A]"
                    }`}
                  >
                    <div
                      className="p-1 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${meta.color}20`,
                        color: isDark ? meta.color : meta.lightColor,
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs truncate">{catKey}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Payment Rail */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`block text-[11px] font-mono uppercase tracking-wider mb-1 flex items-center gap-1 font-semibold ${isDark ? "text-[#8FA3BF]" : "text-[#60738F]"}`}>
                <Calendar className="w-3.5 h-3.5" /> Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs transition-all focus:outline-none ${
                  isDark
                    ? "bg-[#07101F] border-[rgba(80,150,255,0.15)] text-[#F5F8FF] focus:border-[#18D9FF]"
                    : "bg-[#F8FBFF] border-[rgba(30,90,160,0.16)] text-[#10213A] focus:border-[#1677FF]"
                }`}
              />
            </div>

            <div>
              <label className={`block text-[11px] font-mono uppercase tracking-wider mb-1 flex items-center gap-1 font-semibold ${isDark ? "text-[#8FA3BF]" : "text-[#60738F]"}`}>
                <CreditCard className="w-3.5 h-3.5" /> Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className={`w-full px-3 py-2 rounded-xl border text-xs transition-all focus:outline-none ${
                  isDark
                    ? "bg-[#07101F] border-[rgba(80,150,255,0.15)] text-[#F5F8FF] focus:border-[#18D9FF]"
                    : "bg-[#F8FBFF] border-[rgba(30,90,160,0.16)] text-[#10213A] focus:border-[#1677FF]"
                }`}
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm} className={isDark ? "bg-[#0B1426] text-white" : "bg-white text-slate-900"}>
                    {pm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={`block text-[11px] font-mono uppercase tracking-wider mb-1 flex items-center gap-1 font-semibold ${isDark ? "text-[#8FA3BF]" : "text-[#60738F]"}`}>
              <FileText className="w-3.5 h-3.5" /> Telemetry Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Reimbursable project expense"
              className={`w-full px-3 py-2 rounded-xl border text-xs transition-all focus:outline-none ${
                isDark
                  ? "bg-[#07101F] border-[rgba(80,150,255,0.15)] text-[#F5F8FF] focus:border-[#18D9FF]"
                  : "bg-[#F8FBFF] border-[rgba(30,90,160,0.16)] text-[#10213A] focus:border-[#1677FF]"
              }`}
            />
          </div>

          {errors.form && (
            <p className="text-xs text-rose-500 font-mono flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.form}
            </p>
          )}
          {successMessage && (
            <p className="text-xs text-emerald-500 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {successMessage}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#18D9FF] to-[#2684FF] text-[#050914] font-bold font-mono tracking-wider flex items-center justify-center gap-2 shadow-glow-subtle hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-[#050914] border-t-transparent rounded-full animate-spin" />
            ) : editingExpense ? (
              <>
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>SAVE MODIFICATIONS</span>
              </>
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
