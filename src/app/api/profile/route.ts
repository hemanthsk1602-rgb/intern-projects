import { NextRequest, NextResponse } from "next/server";
import { getUserProfile, updateUserProfile } from "@/lib/db/repository";

export async function GET() {
  try {
    const user = await getUserProfile();

    // Dynamically calculate profile completeness based on user attributes
    const fields = [
      Boolean(user.name && user.name.length > 2),
      Boolean(user.email && user.email.includes("@")),
      Boolean(user.phone && user.phone.length > 8),
      Boolean(user.avatar && user.avatar.length > 5),
      Boolean(user.monthlyBudget && user.monthlyBudget > 0),
      Boolean(user.accountStatus),
    ];
    const completedCount = fields.filter(Boolean).length;
    const completeness = Math.round((completedCount / fields.length) * 100);

    return NextResponse.json({
      success: true,
      user,
      completeness,
      orbitStatus: "Synchronized",
      securityLevel: "Tier 1 Biometric",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await updateUserProfile(body);
    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
