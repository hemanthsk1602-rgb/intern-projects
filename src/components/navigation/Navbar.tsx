"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useExpenses } from "@/context/ExpenseContext";
import {
  Sun,
  Moon,
  Plus,
  Compass,
  ArrowLeftRight,
  BarChart3,
  User as UserIcon,
  RotateCcw,
  Sparkles,
  Menu,
  X,
  LogIn,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme, isDark } = useTheme();
  const { setIsAddModalOpen, resetToDemo } = useExpenses();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", href: "/", icon: Compass },
    { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Profile", href: "/profile", icon: UserIcon },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 py-3.5 transition-colors">
      <div
        className={`max-w-7xl mx-auto rounded-2xl backdrop-blur-xl border transition-all duration-300 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-lg ${
          isDark
            ? "bg-slate-950/80 border-slate-800/80 shadow-glass-dark"
            : "bg-white/95 border-slate-200/90 shadow-glass-light"
        }`}
      >
        {/* Brand Logo & Orbit Emblem */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center p-0.5 shadow-glow-cyan group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping absolute" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 relative z-10" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black tracking-wider font-display bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
              SPENDWISE
            </span>
            <span className="text-[9px] font-mono tracking-widest text-slate-500 dark:text-slate-400 uppercase -mt-0.5">
              Your money. Your orbit.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? isDark
                      ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 shadow-glow-cyan"
                      : "text-sky-700 bg-sky-50 border border-sky-200 shadow-sm font-semibold"
                    : isDark
                    ? "text-slate-400 hover:text-white hover:bg-slate-800/40"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 transition-colors ${
                    isActive
                      ? isDark
                        ? "text-cyan-400"
                        : "text-sky-600"
                      : "text-slate-400"
                  }`}
                />
                <span>{link.name}</span>
                {isActive && (
                  <span
                    className={`absolute bottom-0 inset-x-3 h-[2px] rounded-full ${
                      isDark
                        ? "bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-glow-cyan"
                        : "bg-gradient-to-r from-transparent via-sky-500 to-transparent"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls: Add Expense, Login, Reset Demo, Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Prominent + Add Expense Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="relative group overflow-hidden px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-slate-950 font-bold text-xs font-mono tracking-wide flex items-center gap-1.5 shadow-glow-cyan hover:shadow-cyan-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Expense</span>
          </button>

          {/* Auth State Button / Profile Badge */}
          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-1.5">
              <Link
                href="/profile"
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                  pathname === "/profile"
                    ? isDark
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-glow-cyan"
                      : "bg-sky-50 border-sky-300 text-sky-700 shadow-sm"
                    : isDark
                    ? "bg-slate-900/40 border-slate-800 text-slate-300 hover:border-cyan-500/30"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:border-sky-300"
                }`}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-5 h-5 rounded-full object-cover border border-cyan-400"
                />
                <span className="hidden lg:inline truncate max-w-[100px]">{user.name.split(" ")[0]}</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                title="Sign out of command center"
                className={`p-2 rounded-xl border text-xs transition-all ${
                  isDark
                    ? "border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 bg-slate-900/40"
                    : "border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-300 bg-slate-50"
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              title="Enter Financial Core Portal"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono transition-all ${
                pathname === "/login"
                  ? isDark
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-glow-cyan"
                    : "bg-sky-50 border-sky-300 text-sky-700 shadow-sm"
                  : isDark
                  ? "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:text-sky-700 hover:border-sky-300"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Sign In</span>
            </Link>
          )}

          {/* Quick Demo Reset Button */}
          <button
            onClick={resetToDemo}
            title="Reset to default seed data"
            className={`hidden xl:flex p-2 rounded-xl border transition-all text-xs ${
              isDark
                ? "border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 bg-slate-900/40"
                : "border-slate-200 text-slate-500 hover:text-sky-700 hover:border-slate-300 bg-slate-50"
            }`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Smooth Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`p-2 rounded-xl border transition-all ${
              isDark
                ? "border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 bg-slate-900/40"
                : "border-slate-200 text-slate-600 hover:text-sky-700 hover:border-slate-300 bg-slate-50 shadow-sm"
            }`}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-300 rotate-0 hover:-rotate-12" />
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl border ${
              isDark
                ? "border-slate-800 text-slate-400 hover:text-white"
                : "border-slate-200 text-slate-600 hover:text-slate-900"
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden mt-2 p-4 rounded-2xl backdrop-blur-xl border transition-all shadow-xl ${
            isDark ? "bg-slate-950/95 border-slate-800" : "bg-white/95 border-slate-200"
          }`}
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-mono font-medium flex items-center gap-3 ${
                    isActive
                      ? isDark
                        ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 shadow-glow-cyan"
                        : "text-sky-700 bg-sky-50 border border-sky-200 font-semibold"
                      : isDark
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono flex items-center gap-3 border text-left ${
                  isDark
                    ? "border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                    : "border-rose-200 text-rose-600 hover:bg-rose-50"
                }`}
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({user.name.split(" ")[0]})</span>
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono flex items-center gap-3 border ${
                  isDark
                    ? "border-slate-800 text-slate-400 hover:text-cyan-400"
                    : "border-slate-200 text-slate-600 hover:text-sky-700"
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In (Auth Core)</span>
              </Link>
            )}
            <button
              onClick={() => {
                resetToDemo();
                setMobileMenuOpen(false);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono flex items-center gap-3 border ${
                isDark
                  ? "border-slate-800 text-slate-400 hover:text-cyan-400"
                  : "border-slate-200 text-slate-600 hover:text-sky-700"
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Demo Seed</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
