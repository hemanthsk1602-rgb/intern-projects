"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Expense, FinancialMetrics, CategorySummary, SpendingPulsePoint, User } from "@/types";
import { INITIAL_USER } from "@/lib/db/seed";

interface ExpenseContextType {
  expenses: Expense[];
  metrics: FinancialMetrics;
  categories: CategorySummary[];
  spendingPulse: SpendingPulsePoint[];
  user: User;
  isLoading: boolean;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  editingExpense: Expense | null;
  setEditingExpense: (expense: Expense | null) => void;
  openEditModal: (expense: Expense) => void;
  fetchData: () => Promise<void>;
  addExpense: (data: Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<{ success: boolean; error?: string }>;
  editExpense: (id: string, data: Partial<Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt">>) => Promise<{ success: boolean; error?: string }>;
  deleteExpense: (id: string) => Promise<{ success: boolean; error?: string }>;
  resetToDemo: () => Promise<void>;
  clearAll: () => Promise<void>;
  updateUser: (partial: Partial<User>) => Promise<void>;
}

const defaultMetrics: FinancialMetrics = {
  totalBalance: 0,
  totalIncome: 0,
  totalExpenses: 0,
  thisMonthOutflow: 0,
  lastMonthOutflow: 0,
  monthOverMonthGrowth: 0,
  savingsRate: 0,
  budgetUtilization: 0,
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [metrics, setMetrics] = useState<FinancialMetrics>(defaultMetrics);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [spendingPulse, setSpendingPulse] = useState<SpendingPulsePoint[]>([]);
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setIsAddModalOpen(true);
  };

  const handleSetIsAddModalOpen = (open: boolean) => {
    setIsAddModalOpen(open);
    if (!open) {
      setEditingExpense(null);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/expenses");
      const json = await res.json();
      if (json.success) {
        setExpenses(json.expenses || []);
        setMetrics(json.metrics || defaultMetrics);
        setCategories(json.categories || []);
        setSpendingPulse(json.spendingPulse || []);
        if (json.user) setUser(json.user);
      }
    } catch (err) {
      console.error("Failed to load SpendWise data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addExpense = async (data: Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt">) => {
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        return { success: false, error: json.error || "Failed to add transaction" };
      }
      // Refresh real state
      await fetchData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error" };
    }
  };

  const editExpense = async (
    id: string,
    data: Partial<Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt">>
  ) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        return { success: false, error: json.error || "Failed to update transaction" };
      }
      await fetchData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error" };
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        return { success: false, error: json.error || "Failed to delete" };
      }
      await fetchData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error" };
    }
  };

  const resetToDemo = async () => {
    try {
      setIsLoading(true);
      await fetch("/api/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      await fetchData();
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = async () => {
    try {
      setIsLoading(true);
      await fetch("/api/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear" }),
      });
      await fetchData();
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (partial: Partial<User>) => {
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partial),
      });
      const json = await res.json();
      if (json.success && json.user) {
        setUser(json.user);
      }
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        metrics,
        categories,
        spendingPulse,
        user,
        isLoading,
        isAddModalOpen,
        setIsAddModalOpen: handleSetIsAddModalOpen,
        editingExpense,
        setEditingExpense,
        openEditModal,
        fetchData,
        addExpense,
        editExpense,
        deleteExpense,
        resetToDemo,
        clearAll,
        updateUser,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
}
