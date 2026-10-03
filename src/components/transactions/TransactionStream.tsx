"use client";

import React, { useState, useMemo } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { useTheme } from "@/context/ThemeContext";
import { formatINR, formatDate, CATEGORY_METADATA } from "@/lib/utils";
import { ExpenseCategory, TransactionType, Expense } from "@/types";
import {
  Search,
  Download,
  Trash2,
  Plus,
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Film,
  Activity,
  GraduationCap,
  TrendingUp,
  CircleDot,
  CreditCard,
  Edit3,
  Calendar,
  AlertTriangle,
  X,
  SlidersHorizontal,
  RotateCcw,
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

export default function TransactionStream() {
  const { expenses, deleteExpense, setIsAddModalOpen, openEditModal } = useExpenses();
  const { isDark } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<"all" | TransactionType>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [datePreset, setDatePreset] = useState<"all" | "this-month" | "last-30" | "custom">("all");
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "amount-desc" | "amount-asc">("date-desc");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Delete confirmation modal state
  const [deleteModalTx, setDeleteModalTx] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDatePreset = (preset: "all" | "this-month" | "last-30") => {
    setDatePreset(preset);
    const now = new Date();
    if (preset === "all") {
      setStartDate("");
      setEndDate("");
    } else if (preset === "this-month") {
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      setStartDate(`${year}-${month}-01`);
      const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
      setEndDate(`${year}-${month}-${String(lastDay).padStart(2, "0")}`);
    } else if (preset === "last-30") {
      const past = new Date();
      past.setDate(now.getDate() - 30);
      setStartDate(past.toISOString().split("T")[0]);
      setEndDate(now.toISOString().split("T")[0]);
    }
  };

  const handleCustomDateChange = (type: "start" | "end", val: string) => {
    setDatePreset("custom");
    if (type === "start") setStartDate(val);
    if (type === "end") setEndDate(val);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedType("all");
    setStartDate("");
    setEndDate("");
    setDatePreset("all");
    setSortBy("date-desc");
  };

  const isAnyFilterActive =
    searchQuery.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedType !== "all" ||
    startDate !== "" ||
    endDate !== "" ||
    sortBy !== "date-desc";

  const filteredTransactions = useMemo(() => {
    return expenses
      .filter((item) => {
        if (selectedCategory !== "all" && item.category !== selectedCategory) {
          return false;
        }
        if (selectedType !== "all" && item.type !== selectedType) {
          return false;
        }
        if (startDate && item.date < startDate) {
          return false;
        }
        if (endDate && item.date > endDate) {
          return false;
        }
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchCat = item.category.toLowerCase().includes(q);
          const matchNotes = item.notes?.toLowerCase().includes(q);
          const matchMethod = item.paymentMethod.toLowerCase().includes(q);
          if (!matchDesc && !matchCat && !matchNotes && !matchMethod) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "date-desc") {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === "date-asc") {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (sortBy === "amount-desc") {
          return b.amount - a.amount;
        }
        if (sortBy === "amount-asc") {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [expenses, selectedCategory, selectedType, searchQuery, sortBy, startDate, endDate]);

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;
    const headers = ["ID,Date,Description,Category,Type,Amount,Payment Method,Notes"];
    const rows = filteredTransactions.map(
      (e) =>
        `"${e.id}","${e.date}","${e.description.replace(/"/g, '""')}","${e.category}","${e.type}","${e.amount}","${e.paymentMethod}","${(e.notes || "").replace(/"/g, '""')}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `spendwise_transactions_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalFilteredSum = filteredTransactions.reduce(
    (acc, curr) => (curr.type === "expense" ? acc - curr.amount : acc + curr.amount),
    0
  );

  return (
    <div className="w-full space-y-5">
      {/* Telemetry Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                isDark ? "bg-[#18D9FF]" : "bg-[#1677FF]"
              }`}
            />
            <span
              className={`text-[11px] font-mono uppercase tracking-widest font-semibold ${
                isDark ? "text-[#18D9FF]" : "text-[#1677FF]"
              }`}
            >
              FINANCIAL TELEMETRY STREAM
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
            Transactions
          </h1>
          <p className={`text-xs mt-0.5 ${isDark ? "text-[#8FA3BF]" : "text-[#60738F]"}`}>
            Chronological ledger of verified financial inflows and outflows
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
              isDark
                ? "border-[rgba(80,150,255,0.15)] bg-[#0B1426] text-[#8FA3BF] hover:text-[#F5F8FF]"
                : "border-[rgba(30,90,160,0.14)] bg-white text-[#60738F] hover:text-[#10213A] shadow-card-light"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#18D9FF] to-[#2684FF] text-[#050914] font-bold text-xs font-mono flex items-center gap-1.5 shadow-glow-subtle hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Control Strip */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          isDark
            ? "bg-[#0B1426] border-[rgba(80,150,255,0.15)] shadow-card-dark"
            : "bg-[#FFFFFF] border-[rgba(30,90,160,0.14)] shadow-card-light"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-center">
          {/* Search Box */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8FA3BF]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search description, notes, rail..."
              className={`w-full pl-9 pr-3.5 py-2 rounded-xl text-xs transition-all focus:outline-none ${
                isDark
                  ? "bg-[#07101F] border border-[rgba(80,150,255,0.15)] text-[#F5F8FF] focus:border-[#18D9FF]"
                  : "bg-[#F8FBFF] border border-[rgba(30,90,160,0.16)] text-[#10213A] focus:border-[#1677FF]"
              }`}
            />
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-xs font-mono transition-all focus:outline-none ${
                isDark
                  ? "bg-[#07101F] border border-[rgba(80,150,255,0.15)] text-[#8FA3BF] focus:border-[#18D9FF]"
                  : "bg-[#F8FBFF] border border-[rgba(30,90,160,0.16)] text-[#60738F] focus:border-[#1677FF]"
              }`}
            >
              <option value="all">All Categories ({expenses.length})</option>
              {Object.keys(CATEGORY_METADATA).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className={`w-full px-3 py-2 rounded-xl text-xs font-mono transition-all focus:outline-none ${
                isDark
                  ? "bg-[#07101F] border border-[rgba(80,150,255,0.15)] text-[#8FA3BF] focus:border-[#18D9FF]"
                  : "bg-[#F8FBFF] border border-[rgba(30,90,160,0.16)] text-[#60738F] focus:border-[#1677FF]"
              }`}
            >
              <option value="all">All Types</option>
              <option value="expense">Outflow Only</option>
              <option value="income">Inflow Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`w-full px-3 py-2 rounded-xl text-xs font-mono transition-all focus:outline-none ${
                isDark
                  ? "bg-[#07101F] border border-[rgba(80,150,255,0.15)] text-[#8FA3BF] focus:border-[#18D9FF]"
                  : "bg-[#F8FBFF] border border-[rgba(30,90,160,0.16)] text-[#60738F] focus:border-[#1677FF]"
              }`}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>

          {/* Date Filter Toggle */}
          <div className="lg:col-span-1 flex justify-end">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              title="Toggle date range filter"
              className={`w-full py-2 px-2 rounded-xl border text-xs font-mono flex items-center justify-center gap-1 transition-all ${
                showAdvancedFilters || startDate || endDate
                  ? isDark
                    ? "bg-[#18D9FF]/10 border-[#18D9FF]/40 text-[#18D9FF]"
                    : "bg-[#1677FF]/10 border-[#1677FF]/30 text-[#1677FF]"
                  : isDark
                  ? "bg-[#07101F] border-[rgba(80,150,255,0.15)] text-[#8FA3BF] hover:text-[#F5F8FF]"
                  : "bg-[#F8FBFF] border-[rgba(30,90,160,0.16)] text-[#60738F] hover:text-[#10213A]"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="lg:hidden text-[11px]">Range</span>
            </button>
          </div>
        </div>

        {/* Collapsible Date Sub-Bar */}
        {(showAdvancedFilters || startDate || endDate) && (
          <div
            className={`mt-3 pt-3 border-t grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center ${
              isDark ? "border-[rgba(80,150,255,0.15)]" : "border-[rgba(30,90,160,0.14)]"
            }`}
          >
            {/* Quick Presets */}
            <div className="sm:col-span-5 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">Preset:</span>
              <button
                type="button"
                onClick={() => handleDatePreset("all")}
                className={`px-2 py-0.5 rounded-lg text-[10.5px] font-mono border transition-all ${
                  datePreset === "all" && !startDate && !endDate
                    ? isDark
                      ? "bg-[#18D9FF]/20 text-[#18D9FF] border-[#18D9FF]/40 font-bold"
                      : "bg-[#1677FF]/15 text-[#1677FF] border-[#1677FF]/30 font-bold"
                    : isDark
                    ? "border-[rgba(80,150,255,0.15)] text-[#8FA3BF]"
                    : "border-[rgba(30,90,160,0.14)] text-[#60738F]"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => handleDatePreset("this-month")}
                className={`px-2 py-0.5 rounded-lg text-[10.5px] font-mono border transition-all ${
                  datePreset === "this-month"
                    ? isDark
                      ? "bg-[#18D9FF]/20 text-[#18D9FF] border-[#18D9FF]/40 font-bold"
                      : "bg-[#1677FF]/15 text-[#1677FF] border-[#1677FF]/30 font-bold"
                    : isDark
                    ? "border-[rgba(80,150,255,0.15)] text-[#8FA3BF]"
                    : "border-[rgba(30,90,160,0.14)] text-[#60738F]"
                }`}
              >
                This Month
              </button>
              <button
                type="button"
                onClick={() => handleDatePreset("last-30")}
                className={`px-2 py-0.5 rounded-lg text-[10.5px] font-mono border transition-all ${
                  datePreset === "last-30"
                    ? isDark
                      ? "bg-[#18D9FF]/20 text-[#18D9FF] border-[#18D9FF]/40 font-bold"
                      : "bg-[#1677FF]/15 text-[#1677FF] border-[#1677FF]/30 font-bold"
                    : isDark
                    ? "border-[rgba(80,150,255,0.15)] text-[#8FA3BF]"
                    : "border-[rgba(30,90,160,0.14)] text-[#60738F]"
                }`}
              >
                Last 30 Days
              </button>
            </div>

            {/* Custom Range */}
            <div className="sm:col-span-7 flex items-center gap-2 flex-wrap sm:justify-end">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase">From</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleCustomDateChange("start", e.target.value)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-mono border focus:outline-none ${
                    isDark
                      ? "bg-[#07101F] border-[rgba(80,150,255,0.15)] text-[#F5F8FF]"
                      : "bg-[#F8FBFF] border-[rgba(30,90,160,0.16)] text-[#10213A]"
                  }`}
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase">To</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleCustomDateChange("end", e.target.value)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-mono border focus:outline-none ${
                    isDark
                      ? "bg-[#07101F] border-[rgba(80,150,255,0.15)] text-[#F5F8FF]"
                      : "bg-[#F8FBFF] border-[rgba(30,90,160,0.16)] text-[#10213A]"
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Filter Summary */}
        <div
          className={`flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t text-[11px] font-mono ${
            isDark ? "border-[rgba(80,150,255,0.12)] text-[#8FA3BF]" : "border-[rgba(30,90,160,0.12)] text-[#60738F]"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>
              Showing{" "}
              <span className={`font-bold ${isDark ? "text-[#18D9FF]" : "text-[#1677FF]"}`}>
                {filteredTransactions.length}
              </span>{" "}
              of {expenses.length} events
            </span>
            {isAnyFilterActive && (
              <button
                onClick={clearAllFilters}
                className="text-[10px] font-bold text-[#18D9FF] hover:underline flex items-center gap-1 ml-2"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
          <div>
            Net Flux:{" "}
            <span
              className={`font-bold ${
                totalFilteredSum >= 0 ? "text-[#20D6A3]" : "text-rose-500"
              }`}
            >
              {formatINR(totalFilteredSum)}
            </span>
          </div>
        </div>
      </div>

      {/* STREAM LIST */}
      <div className="space-y-2.5">
        {filteredTransactions.length === 0 ? (
          <div className="py-14 text-center rounded-2xl border border-dashed border-[rgba(80,150,255,0.2)] p-8">
            <p className={`font-mono text-sm mb-2 ${isDark ? "text-[#8FA3BF]" : "text-[#60738F]"}`}>
              No transactions match your active filters.
            </p>
            <button
              onClick={clearAllFilters}
              className="text-[#18D9FF] hover:underline text-xs font-mono font-bold"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const Icon = CATEGORY_ICONS[tx.category] || CircleDot;
            const meta = CATEGORY_METADATA[tx.category] || CATEGORY_METADATA.Other;

            return (
              <div
                key={tx.id}
                className={`group p-3.5 sm:p-4 rounded-2xl border transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDark
                    ? "bg-[#0B1426] border-[rgba(80,150,255,0.12)] hover:border-[rgba(80,150,255,0.3)] shadow-card-dark"
                    : "bg-[#FFFFFF] border-[rgba(30,90,160,0.14)] hover:border-[rgba(30,90,160,0.3)] shadow-card-light"
                }`}
              >
                {/* Left: Icon, Description & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `${meta.color}15`,
                      border: `1px solid ${meta.color}30`,
                      color: isDark ? meta.color : meta.lightColor,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-[#F5F8FF] truncate">
                        {tx.description}
                      </h4>
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full border truncate"
                        style={{
                          backgroundColor: `${meta.color}15`,
                          borderColor: `${meta.color}35`,
                          color: isDark ? meta.color : meta.lightColor,
                        }}
                      >
                        {tx.category}
                      </span>
                    </div>

                    <div
                      className={`flex flex-wrap items-center gap-2 text-[11px] font-mono mt-0.5 ${
                        isDark ? "text-[#8FA3BF]" : "text-[#60738F]"
                      }`}
                    >
                      <span>{formatDate(tx.date)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3" />
                        {tx.paymentMethod}
                      </span>
                      {tx.notes && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[180px] italic">
                            "{tx.notes}"
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[rgba(80,150,255,0.1)]">
                  <div className="text-left sm:text-right">
                    <div
                      className={`text-base sm:text-lg font-bold font-display ${
                        tx.type === "income"
                          ? isDark
                            ? "text-[#20D6A3]"
                            : "text-[#0BAF83]"
                          : isDark
                          ? "text-[#F5F8FF]"
                          : "text-[#10213A]"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"} {formatINR(tx.amount)}
                    </div>
                    <span
                      className={`text-[9.5px] font-mono uppercase tracking-wider block ${
                        isDark ? "text-[#60738F]" : "text-[#8A9BB2]"
                      }`}
                    >
                      {tx.type === "income" ? "Credit Inflow" : "Debit Outflow"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(tx)}
                      title="Edit transaction"
                      className={`p-1.5 rounded-lg border transition-all ${
                        isDark
                          ? "text-[#8FA3BF] hover:text-[#18D9FF] hover:bg-[#18D9FF]/10 border-transparent hover:border-[#18D9FF]/30"
                          : "text-[#60738F] hover:text-[#1677FF] hover:bg-[#1677FF]/10 border-transparent hover:border-[#1677FF]/30"
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteModalTx(tx)}
                      title="Delete transaction"
                      className={`p-1.5 rounded-lg border transition-all ${
                        isDark
                          ? "text-[#8FA3BF] hover:text-rose-400 hover:bg-rose-500/10 border-transparent hover:border-rose-500/30"
                          : "text-[#60738F] hover:text-rose-600 hover:bg-rose-50 border-transparent hover:border-rose-300"
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className={`relative w-full max-w-md p-6 rounded-3xl border shadow-2xl transition-all ${
              isDark
                ? "bg-[#0B1426] border-rose-500/30 shadow-card-dark"
                : "bg-[#FFFFFF] border-rose-200 shadow-card-light"
            }`}
          >
            <button
              onClick={() => setDeleteModalTx(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-500 font-bold">
                  CONFIRM EVENT PURGE
                </span>
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                  Delete Transaction?
                </h3>
              </div>
            </div>

            <p className={`text-xs mb-4 ${isDark ? "text-[#8FA3BF]" : "text-[#60738F]"}`}>
              This event will be removed from your financial ledger and all orbital metrics will be recalculated immediately.
            </p>

            <div
              className={`p-3 rounded-xl border mb-5 ${
                isDark ? "bg-[#07101F] border-[rgba(80,150,255,0.15)]" : "bg-[#F8FBFF] border-[rgba(30,90,160,0.14)]"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                <span className="truncate pr-2">{deleteModalTx.description}</span>
                <span className="font-mono">
                  {deleteModalTx.type === "income" ? "+" : "-"} {formatINR(deleteModalTx.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>{deleteModalTx.category}</span>
                <span>{formatDate(deleteModalTx.date)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteModalTx(null)}
                className={`flex-1 py-2 rounded-xl border text-xs font-mono transition-all ${
                  isDark
                    ? "border-[rgba(80,150,255,0.15)] bg-[#07101F] text-[#8FA3BF] hover:text-[#F5F8FF]"
                    : "border-[rgba(30,90,160,0.14)] bg-[#F8FBFF] text-[#60738F] hover:text-[#10213A]"
                }`}
              >
                Abort / Keep
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);
                  await deleteExpense(deleteModalTx.id);
                  setIsDeleting(false);
                  setDeleteModalTx(null);
                }}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold text-xs font-mono shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
              >
                {isDeleting ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
