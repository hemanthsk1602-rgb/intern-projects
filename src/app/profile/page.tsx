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
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-300">
      <IdentityCore />
    </div>
  );
}
