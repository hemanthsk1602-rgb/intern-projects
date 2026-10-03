import { NextRequest, NextResponse } from "next/server";
import { resetExpenses, clearAllExpenses } from "@/lib/db/repository";

export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json();

    if (action === "clear") {
      await clearAllExpenses();
      return NextResponse.json({ success: true, message: "Cleared all expenses for testing empty state" });
    }

    const resetData = await resetExpenses();
    return NextResponse.json({
      success: true,
      message: "Reset data successfully with default seed",
      count: resetData.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to handle seed action" },
      { status: 500 }
    );
  }
}
