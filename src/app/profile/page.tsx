"use client";

import React from "react";
import IdentityCore from "@/components/profile/IdentityCore";
import { useExpenses } from "@/context/ExpenseContext";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

export default function ProfilePage() {
  const { isLoading } = useExpenses();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="w-full animate-in fade-in duration-300">
      <IdentityCore />
    </div>
  );
}
