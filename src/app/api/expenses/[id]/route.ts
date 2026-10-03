import { NextRequest, NextResponse } from "next/server";
import { deleteExpense, updateExpense } from "@/lib/db/repository";
import { ExpenseCategory, PaymentMethod, TransactionType } from "@/types";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const amount = body.amount !== undefined ? Number(body.amount) : undefined;
    const description = body.description !== undefined ? String(body.description).trim() : undefined;
    const category = body.category as ExpenseCategory | undefined;
    const date = body.date !== undefined ? String(body.date).trim() : undefined;
    const paymentMethod = body.paymentMethod as PaymentMethod | undefined;
    const notes = body.notes !== undefined ? String(body.notes).trim() : undefined;
    const type = body.type as TransactionType | undefined;

    if (amount !== undefined && (isNaN(amount) || amount <= 0)) {
      return NextResponse.json(
        { success: false, error: "Amount must be a valid number greater than ₹0." },
        { status: 400 }
      );
    }
    if (description !== undefined && description.length < 2) {
      return NextResponse.json(
        { success: false, error: "Description must be at least 2 characters long." },
        { status: 400 }
      );
    }
    if (date !== undefined && !date) {
      return NextResponse.json(
        { success: false, error: "Transaction date is required." },
        { status: 400 }
      );
    }

    const updated = await updateExpense(id, {
      ...(amount !== undefined && { amount }),
      ...(description !== undefined && { description }),
      ...(category !== undefined && { category }),
      ...(date !== undefined && { date }),
      ...(paymentMethod !== undefined && { paymentMethod }),
      ...(notes !== undefined && { notes }),
      ...(type !== undefined && { type }),
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, expense: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update transaction" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: { id: string } }
) {
  return PUT(req, ctx);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    const deleted = await deleteExpense(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Transaction deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
