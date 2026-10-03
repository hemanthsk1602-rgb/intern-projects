"use client";

import React from "react";
import TransactionStream from "@/components/transactions/TransactionStream";
import { useExpenses } from "@/context/ExpenseContext";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyOrbit from "@/components/ui/EmptyOrbit";

export default function TransactionsPage() {
  const { expenses, isLoading } = useExpenses();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (expenses.length === 0) {
    return <EmptyOrbit />;
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-300">
      <TransactionStream />
    </div>
  );
}
