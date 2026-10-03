import { NextRequest, NextResponse } from "next/server";
import {
  getExpenses,
  createExpense,
  calculateFinancialMetrics,
  calculateCategoryBreakdown,
  calculateSpendingPulse,
  getUserProfile,
} from "@/lib/db/repository";
import { ExpenseCategory, PaymentMethod, TransactionType } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const query = searchParams.get("query");
    const type = searchParams.get("type");

    let items = await getExpenses();
    const user = await getUserProfile();

    const metrics = calculateFinancialMetrics(items, user.monthlyBudget);
    const categories = calculateCategoryBreakdown(items);
    const spendingPulse = calculateSpendingPulse(items, 14);

    // Apply filtering if provided
    if (category && category !== "all") {
      items = items.filter((e) => e.category === category);
    }
    if (type && (type === "expense" || type === "income")) {
      items = items.filter((e) => e.type === type);
    }
    if (query && query.trim() !== "") {
      const q = query.toLowerCase().trim();
      items = items.filter(
        (e) =>
          e.description.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.paymentMethod.toLowerCase().includes(q) ||
          (e.notes && e.notes.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      success: true,
      expenses: items,
      metrics,
      categories,
      spendingPulse,
      user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve expenses" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const amount = Number(body.amount);
    const description = String(body.description || "").trim();
    const category = body.category as ExpenseCategory;
    const date = String(body.date || "").trim();
    const paymentMethod = (body.paymentMethod || "UPI") as PaymentMethod;
    const notes = body.notes ? String(body.notes).trim() : "";
    const type = (body.type || "expense") as TransactionType;

    // Strict validation
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid amount greater than ₹0 is required." },
        { status: 400 }
      );
    }
    if (!description || description.length < 2) {
      return NextResponse.json(
        { success: false, error: "Description must be at least 2 characters long." },
        { status: 400 }
      );
    }
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category selection is required." },
        { status: 400 }
      );
    }
    if (!date) {
      return NextResponse.json(
        { success: false, error: "Transaction date is required." },
        { status: 400 }
      );
    }

    const created = await createExpense({
      userId: "user_orbit_01",
      amount,
      description,
      category,
      date,
      paymentMethod,
      notes,
      type,
    });

    return NextResponse.json({ success: true, expense: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create transaction" },
      { status: 500 }
    );
  }
}
