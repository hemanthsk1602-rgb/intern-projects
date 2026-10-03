import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ExpenseProvider } from "@/context/ExpenseContext";
import Navbar from "@/components/navigation/Navbar";
import AddExpenseModal from "@/components/expenses/AddExpenseModal";

export const metadata: Metadata = {
  title: "SpendWise — Your Money. Your Orbit.",
  description:
    "SpendWise is a premium personal expense tracker designed as a futuristic financial command center with a 3D spatial orbit experience.",
  keywords: ["expense tracker", "personal finance", "3d orbit", "spendwise", "budgeting", "fintech"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased selection:bg-cyan-500 selection:text-black">
        <ThemeProvider>
          <ExpenseProvider>
            <div className="relative min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
              </main>
              {/* Add Expense Modal available globally from any screen */}
              <AddExpenseModal />
            </div>
          </ExpenseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
