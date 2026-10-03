import { Expense, FinancialMetrics, CategorySummary, SpendingPulsePoint, User, ExpenseCategory } from "@/types";
import { getDatabase } from "./mongodb";
import { getInitialExpenses, INITIAL_USER } from "./seed";
import { CATEGORY_METADATA } from "../utils";

// Memory store fallback for environments where MongoDB URI is not provided
class InMemoryStore {
  private expenses: Expense[] = [];
  private user: User = { ...INITIAL_USER };
  private initialized: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    if (!this.initialized) {
      this.expenses = getInitialExpenses();
      this.initialized = true;
    }
  }

  public getAll(): Expense[] {
    this.init();
    return [...this.expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public add(expense: Expense): Expense {
    this.init();
    this.expenses.unshift(expense);
    return expense;
  }

  public delete(id: string): boolean {
    this.init();
    const lenBefore = this.expenses.length;
    this.expenses = this.expenses.filter((e) => e.id !== id);
    return this.expenses.length < lenBefore;
  }

  public update(id: string, partial: Partial<Expense>): Expense | null {
    this.init();
    const index = this.expenses.findIndex((e) => e.id === id);
    if (index === -1) return null;
    const existing = this.expenses[index];
    const updated: Expense = {
      ...existing,
      ...partial,
      id: existing.id,
      userId: existing.userId,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.expenses[index] = updated;
    return updated;
  }

  public reset(): Expense[] {
    this.expenses = getInitialExpenses();
    return this.expenses;
  }

  public clear(): void {
    this.expenses = [];
  }

  public getUser(): User {
    return { ...this.user };
  }

  public updateUser(partial: Partial<User>): User {
    this.user = { ...this.user, ...partial };
    return { ...this.user };
  }
}

declare global {
  // eslint-disable-next-line no-var
  var _spendwiseStore: InMemoryStore | undefined;
}

const memoryStore: InMemoryStore =
  globalThis._spendwiseStore || (globalThis._spendwiseStore = new InMemoryStore());

export async function getExpenses(): Promise<Expense[]> {
  const db = await getDatabase();
  if (db) {
    try {
      const collection = db.collection<Expense>("expenses");
      const items = await collection.find({}).sort({ date: -1 }).toArray();
      if (items.length === 0) {
        // Seed if empty
        const initial = getInitialExpenses();
        await collection.insertMany(initial as any);
        return initial;
      }
      return items.map((doc: any) => ({
        id: doc.id || doc._id.toString(),
        userId: doc.userId || "user_orbit_01",
        amount: Number(doc.amount),
        description: doc.description,
        category: doc.category,
        date: doc.date,
        paymentMethod: doc.paymentMethod,
        notes: doc.notes || "",
        type: doc.type || "expense",
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }));
    } catch (err) {
      console.warn("Failed querying Mongo collection, falling back to memory store:", err);
    }
  }
  return memoryStore.getAll();
}

export async function createExpense(data: Omit<Expense, "id" | "createdAt" | "updatedAt">): Promise<Expense> {
  const now = new Date().toISOString();
  const id = `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newExpense: Expense = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  const db = await getDatabase();
  if (db) {
    try {
      const collection = db.collection("expenses");
      await collection.insertOne({ ...newExpense });
      return newExpense;
    } catch (err) {
      console.warn("Error inserting into MongoDB, storing in memory:", err);
    }
  }

  return memoryStore.add(newExpense);
}

export async function deleteExpense(id: string): Promise<boolean> {
  const db = await getDatabase();
  if (db) {
    try {
      const collection = db.collection("expenses");
      const res = await collection.deleteOne({ $or: [{ id }, { _id: id as any }] });
      if (res.deletedCount > 0) return true;
    } catch (err) {
      console.warn("Error deleting from MongoDB:", err);
    }
  }

  return memoryStore.delete(id);
}

export async function updateExpense(
  id: string,
  partial: Partial<Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt">>
): Promise<Expense | null> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  if (db) {
    try {
      const collection = db.collection("expenses");
      const res = await collection.findOneAndUpdate(
        { $or: [{ id }, { _id: id as any }] },
        { $set: { ...partial, updatedAt: now } },
        { returnDocument: "after" }
      );
      if (res) {
        return {
          id: (res as any).id || (res as any)._id?.toString() || id,
          userId: (res as any).userId || "user_orbit_01",
          amount: Number((res as any).amount),
          description: (res as any).description,
          category: (res as any).category,
          date: (res as any).date,
          paymentMethod: (res as any).paymentMethod,
          notes: (res as any).notes || "",
          type: (res as any).type || "expense",
          createdAt: (res as any).createdAt || now,
          updatedAt: (res as any).updatedAt || now,
        };
      }
    } catch (err) {
      console.warn("Error updating in MongoDB, falling back to memory:", err);
    }
  }

  return memoryStore.update(id, partial);
}

export async function resetExpenses(): Promise<Expense[]> {
  const db = await getDatabase();
  if (db) {
    try {
      const collection = db.collection("expenses");
      await collection.deleteMany({});
      const initial = getInitialExpenses();
      await collection.insertMany(initial as any);
      return initial;
    } catch (err) {
      console.warn("Error resetting MongoDB data:", err);
    }
  }

  return memoryStore.reset();
}

export async function clearAllExpenses(): Promise<void> {
  const db = await getDatabase();
  if (db) {
    try {
      const collection = db.collection("expenses");
      await collection.deleteMany({});
    } catch (err) {
      console.warn("Error clearing MongoDB data:", err);
    }
  }
  memoryStore.clear();
}

export async function getUserProfile(): Promise<User> {
  return memoryStore.getUser();
}

export async function updateUserProfile(partial: Partial<User>): Promise<User> {
  return memoryStore.updateUser(partial);
}

// Compute real analytics directly from transactions
export function calculateFinancialMetrics(expenses: Expense[], userBudget: number = 50000): FinancialMetrics {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const prevYear = prevMonthDate.getFullYear();
  const prevMonth = prevMonthDate.getMonth();

  let totalIncome = 0;
  let totalExpenses = 0;
  let thisMonthOutflow = 0;
  let lastMonthOutflow = 0;

  for (const item of expenses) {
    const itemDate = new Date(item.date);
    const itemYear = itemDate.getFullYear();
    const itemMonth = itemDate.getMonth();

    if (item.type === "income") {
      totalIncome += item.amount;
    } else {
      totalExpenses += item.amount;

      if (itemYear === currentYear && itemMonth === currentMonth) {
        thisMonthOutflow += item.amount;
      } else if (itemYear === prevYear && itemMonth === prevMonth) {
        lastMonthOutflow += item.amount;
      }
    }
  }

  const totalBalance = totalIncome - totalExpenses;
  const monthOverMonthGrowth =
    lastMonthOutflow > 0
      ? Number((((thisMonthOutflow - lastMonthOutflow) / lastMonthOutflow) * 100).toFixed(1))
      : 0;

  const savingsRate =
    totalIncome > 0
      ? Number((((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1))
      : 0;

  const budgetUtilization =
    userBudget > 0
      ? Math.min(100, Number(((thisMonthOutflow / userBudget) * 100).toFixed(1)))
      : 0;

  return {
    totalBalance,
    totalIncome,
    totalExpenses,
    thisMonthOutflow,
    lastMonthOutflow,
    monthOverMonthGrowth,
    savingsRate,
    budgetUtilization,
  };
}

export function calculateCategoryBreakdown(expenses: Expense[], currentMonthOnly = false): CategorySummary[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const expenseItems = expenses.filter((e) => {
    if (e.type !== "expense") return false;
    if (currentMonthOnly) {
      const d = new Date(e.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    }
    return true;
  });

  const totalExpense = expenseItems.reduce((acc, curr) => acc + curr.amount, 0);
  const map = new Map<ExpenseCategory, { amount: number; count: number }>();

  for (const item of expenseItems) {
    const existing = map.get(item.category) || { amount: 0, count: 0 };
    map.set(item.category, {
      amount: existing.amount + item.amount,
      count: existing.count + 1,
    });
  }

  const result: CategorySummary[] = [];
  map.forEach((value, cat) => {
    const meta = CATEGORY_METADATA[cat] || CATEGORY_METADATA["Other"];
    result.push({
      category: cat,
      amount: value.amount,
      count: value.count,
      percentage: totalExpense > 0 ? Number(((value.amount / totalExpense) * 100).toFixed(1)) : 0,
      color: meta.color,
      iconName: meta.icon,
    });
  });

  return result.sort((a, b) => b.amount - a.amount);
}

export function calculateSpendingPulse(expenses: Expense[], daysCount = 14): SpendingPulsePoint[] {
  const now = new Date();
  const points: SpendingPulsePoint[] = [];
  const expenseItems = expenses.filter((e) => e.type === "expense");

  let runningTotal = 0;

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const formatted = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

    const dayExpenses = expenseItems.filter((e) => e.date === dateStr);
    const dayAmount = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
    runningTotal += dayAmount;

    points.push({
      date: dateStr,
      formattedDate: formatted,
      amount: dayAmount,
      accumulated: runningTotal,
      transactionsCount: dayExpenses.length,
    });
  }

  return points;
}
