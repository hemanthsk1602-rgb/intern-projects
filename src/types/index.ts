export type ExpenseCategory =
  | "Food & Dining"
  | "Transport"
  | "Shopping"
  | "Bills & Utilities"
  | "Entertainment"
  | "Health & Wellness"
  | "Education"
  | "Investment"
  | "Other";

export type PaymentMethod =
  | "UPI"
  | "Credit Card"
  | "Debit Card"
  | "Net Banking"
  | "Cash"
  | "Crypto";

export type TransactionType = "expense" | "income";

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: string; // ISO date string YYYY-MM-DD
  paymentMethod: PaymentMethod;
  notes?: string;
  type: TransactionType;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  accountStatus: "Verified Prime" | "Active" | "Enterprise Orbit";
  memberSince: string;
  monthlyBudget: number;
  currency: string;
}

export interface CategorySummary {
  category: ExpenseCategory;
  amount: number;
  count: number;
  percentage: number;
  color: string;
  iconName: string;
}

export interface FinancialMetrics {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  thisMonthOutflow: number;
  lastMonthOutflow: number;
  monthOverMonthGrowth: number;
  savingsRate: number;
  budgetUtilization: number;
}

export interface SpendingPulsePoint {
  date: string;
  formattedDate: string;
  amount: number;
  accumulated: number;
  transactionsCount: number;
}

export interface FilterOptions {
  searchQuery: string;
  category: string;
  paymentMethod: string;
  type: "all" | "expense" | "income";
  startDate?: string;
  endDate?: string;
  sortBy: "date-desc" | "date-asc" | "amount-desc" | "amount-asc";
}
