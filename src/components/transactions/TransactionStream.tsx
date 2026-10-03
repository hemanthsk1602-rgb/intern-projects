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
      // Last day of month
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
    <div className="w-full space-y-6">
      {/* Telemetry Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                isDark ? "bg-cyan-400" : "bg-sky-600"
              }`}
            />
            <span
              className={`text-[11px] font-mono uppercase tracking-widest ${
                isDark ? "text-cyan-400" : "text-sky-700 font-bold"
              }`}
            >
              LEDGER TELEMETRY STREAM
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
            Transaction Stream
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Chronological log of verified financial events
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className={`px-3.5 py-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
              isDark
                ? "border-slate-700/60 bg-slate-900/40 text-slate-300 hover:text-white hover:border-cyan-400/40"
                : "border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-sm"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-glow-cyan hover:shadow-cyan-400/50 transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Control Strip (Search, Categories, Sort, Type, Date filters) */}
      <div
        className={`p-4 rounded-2xl backdrop-blur-xl border transition-all ${
          isDark
            ? "bg-slate-900/60 border-slate-800 shadow-glass-dark"
            : "bg-white border-slate-200 shadow-glass-light"
        }`}
      >
        {/* Main Search and Primary Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stream by description, note, tag..."
              className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs transition-all focus:outline-none ${
                isDark
                  ? "bg-slate-950/70 border border-slate-800 text-white focus:border-cyan-400"
                  : "bg-slate-50 border border-slate-300 text-slate-900 focus:border-sky-500"
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
                  ? "bg-slate-950/70 border border-slate-800 text-slate-300 focus:border-cyan-400"
                  : "bg-slate-50 border border-slate-300 text-slate-700 focus:border-sky-500"
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
                  ? "bg-slate-950/70 border border-slate-800 text-slate-300 focus:border-cyan-400"
                  : "bg-slate-50 border border-slate-300 text-slate-700 focus:border-sky-500"
              }`}
            >
              <option value="all">All Types</option>
              <option value="expense">Outflow (Expense)</option>
              <option value="income">Inflow (Income)</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`w-full px-3 py-2 rounded-xl text-xs font-mono transition-all focus:outline-none ${
                isDark
                  ? "bg-slate-950/70 border border-slate-800 text-slate-300 focus:border-cyan-400"
                  : "bg-slate-50 border border-slate-300 text-slate-700 focus:border-sky-500"
              }`}
            >
              <option value="date-desc">Date (Newest)</option>
              <option value="date-asc">Date (Oldest)</option>
              <option value="amount-desc">Amount (Highest)</option>
              <option value="amount-asc">Amount (Lowest)</option>
            </select>
          </div>

          {/* Filter Toggle */}
          <div className="lg:col-span-1 flex justify-end">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              title="Toggle date range filters"
              className={`w-full py-2 px-2.5 rounded-xl border text-xs font-mono flex items-center justify-center gap-1 transition-all ${
                showAdvancedFilters || startDate || endDate
                  ? isDark
                    ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400"
                    : "bg-sky-50 border-sky-300 text-sky-700 font-semibold"
                  : isDark
                  ? "bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white"
                  : "bg-slate-50 border-slate-300 text-slate-600 hover:text-slate-900"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="lg:hidden text-[11px]">Filters</span>
            </button>
          </div>
        </div>

        {/* Collapsible Date Range Sub-Bar */}
        {(showAdvancedFilters || startDate || endDate) && (
          <div className={`mt-3 pt-3 border-t grid grid-cols-1 sm:grid-cols-12 gap-3 items-center ${isDark ? "border-slate-800/60" : "border-slate-200"}`}>
            {/* Quick Presets */}
            <div className="sm:col-span-5 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">Range:</span>
              <button
                type="button"
                onClick={() => handleDatePreset("all")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all ${
                  datePreset === "all" && !startDate && !endDate
                    ? isDark
                      ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40 font-bold"
                      : "bg-sky-100 text-sky-800 border-sky-300 font-bold"
                    : isDark
                    ? "border-slate-800 text-slate-400 hover:text-white"
                    : "border-slate-200 text-slate-600 hover:text-slate-900"
                }`}
              >
                All Time
              </button>
              <button
                type="button"
                onClick={() => handleDatePreset("this-month")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all ${
                  datePreset === "this-month"
                    ? isDark
                      ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40 font-bold"
                      : "bg-sky-100 text-sky-800 border-sky-300 font-bold"
                    : isDark
                    ? "border-slate-800 text-slate-400 hover:text-white"
                    : "border-slate-200 text-slate-600 hover:text-slate-900"
                }`}
              >
                This Month
              </button>
              <button
                type="button"
                onClick={() => handleDatePreset("last-30")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all ${
                  datePreset === "last-30"
                    ? isDark
                      ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40 font-bold"
                      : "bg-sky-100 text-sky-800 border-sky-300 font-bold"
                    : isDark
                    ? "border-slate-800 text-slate-400 hover:text-white"
                    : "border-slate-200 text-slate-600 hover:text-slate-900"
                }`}
              >
                Last 30 Days
              </button>
            </div>

            {/* Custom Dates */}
            <div className="sm:col-span-7 flex items-center gap-2 flex-wrap sm:justify-end">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase">From:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleCustomDateChange("start", e.target.value)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all focus:outline-none ${
                    isDark
                      ? "bg-slate-950/70 border-slate-800 text-slate-300 focus:border-cyan-400"
                      : "bg-slate-50 border-slate-300 text-slate-700 focus:border-sky-500"
                  }`}
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase">To:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleCustomDateChange("end", e.target.value)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all focus:outline-none ${
                    isDark
                      ? "bg-slate-950/70 border-slate-800 text-slate-300 focus:border-cyan-400"
                      : "bg-slate-50 border-slate-300 text-slate-700 focus:border-sky-500"
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Active Filter Metrics & Reset */}
        <div
          className={`flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t text-[11px] font-mono ${
            isDark ? "border-slate-800/60 text-slate-400" : "border-slate-200 text-slate-600"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>
              Showing{" "}
              <span className={`font-bold ${isDark ? "text-cyan-400" : "text-sky-700"}`}>
                {filteredTransactions.length}
              </span>{" "}
              of {expenses.length} events
            </span>
            {isAnyFilterActive && (
              <button
                onClick={clearAllFilters}
                className="text-[10px] font-bold text-cyan-500 hover:underline flex items-center gap-1 ml-2"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
          <div>
            Filtered Net Flux:{" "}
            <span
              className={`font-bold ${
                totalFilteredSum >= 0 ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {formatINR(totalFilteredSum)}
            </span>
          </div>
        </div>
      </div>

      {/* STREAM LIST */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
            <p className="text-slate-500 dark:text-slate-400 font-mono text-sm mb-2">
              No transactions match your active filters.
            </p>
            <button
              onClick={clearAllFilters}
              className="text-cyan-500 hover:underline text-xs font-mono font-bold"
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
                className={`group relative p-4 rounded-2xl backdrop-blur-md border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isDark
                    ? "bg-slate-900/50 border-slate-800/80 hover:border-cyan-500/50 hover:shadow-glow-cyan hover:-translate-y-0.5"
                    : "bg-white border-slate-200 hover:border-sky-400 hover:shadow-glass-light hover:-translate-y-0.5 shadow-sm"
                }`}
              >
                {/* Left: Icon & Description */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                    style={{
                      backgroundColor: `${meta.color}15`,
                      border: `1px solid ${meta.color}35`,
                      color: meta.color,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {tx.description}
                      </h4>
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full border truncate"
                        style={{
                          backgroundColor: `${meta.color}15`,
                          borderColor: `${meta.color}40`,
                          color: isDark ? meta.color : meta.lightColor,
                        }}
                      >
                        {tx.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                      <span>{formatDate(tx.date)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3" />
                        {tx.paymentMethod}
                      </span>
                      {tx.notes && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[200px] italic">
                            "{tx.notes}"
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Action Controls */}
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/40">
                  <div className="text-left sm:text-right">
                    <div
                      className={`text-base sm:text-lg font-extrabold font-display ${
                        tx.type === "income"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"} {formatINR(tx.amount)}
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                      {tx.type === "income" ? "Inflow Credit" : "Outflow Debit"}
                    </span>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-1">
                    {/* Inline Edit Action */}
                    <button
                      type="button"
                      onClick={() => openEditModal(tx)}
                      title="Edit transaction"
                      className={`p-2 rounded-xl border transition-all ${
                        isDark
                          ? "text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 border-transparent hover:border-cyan-500/30"
                          : "text-slate-500 hover:text-sky-700 hover:bg-sky-50 border-transparent hover:border-sky-300"
                      }`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete Trigger (Opens Confirmation Modal) */}
                    <button
                      type="button"
                      onClick={() => setDeleteModalTx(tx)}
                      title="Delete transaction"
                      className={`p-2 rounded-xl border transition-all ${
                        isDark
                          ? "text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 border-transparent hover:border-rose-500/30"
                          : "text-slate-500 hover:text-rose-600 hover:bg-rose-50 border-transparent hover:border-rose-300"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* EXPLICIT DELETE CONFIRMATION MODAL */}
      {deleteModalTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className={`relative w-full max-w-md p-6 sm:p-7 rounded-3xl border shadow-2xl backdrop-blur-2xl transition-all ${
              isDark
                ? "bg-slate-950/95 border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.2)]"
                : "bg-white border-rose-200 shadow-xl"
            }`}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setDeleteModalTx(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-500 font-bold">
                  CONFIRM TRANSACTION PURGE
                </span>
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                  Erase Event from Orbit?
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              This transaction will be permanently erased from your financial ledger and all telemetry metrics will be recalibrated immediately.
            </p>

            {/* Transaction Details Preview */}
            <div
              className={`p-3.5 rounded-2xl border mb-6 ${
                isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                <span className="truncate pr-2">{deleteModalTx.description}</span>
                <span
                  className={
                    deleteModalTx.type === "income"
                      ? "text-emerald-500 font-mono"
                      : "text-slate-900 dark:text-white font-mono"
                  }
                >
                  {deleteModalTx.type === "income" ? "+" : "-"} {formatINR(deleteModalTx.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                <span>{deleteModalTx.category}</span>
                <span>{formatDate(deleteModalTx.date)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalTx(null)}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-mono transition-all ${
                  isDark
                    ? "border-slate-800 bg-slate-900/50 text-slate-300 hover:text-white hover:bg-slate-800"
                    : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200"
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
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold text-xs font-mono shadow-md hover:shadow-rose-600/40 transition-all flex items-center justify-center gap-1.5"
              >
                {isDeleting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Purge</span>
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

