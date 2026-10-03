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
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 py-2.5 transition-colors">
      <div
        className={`max-w-7xl mx-auto rounded-2xl backdrop-blur-xl border transition-all duration-200 px-4 sm:px-5 py-2 flex items-center justify-between ${
          isDark
            ? "bg-[#060B14]/85 border-[rgba(0,217,255,0.2)] shadow-[0_4px_30px_rgba(0,217,255,0.08)]"
            : "bg-white/90 border-[rgba(15,23,42,0.12)] shadow-card-light"
        }`}
      >
        {/* Brand Logo & Orbit Emblem */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-7 h-7 rounded-xl bg-gradient-to-tr from-[#00D9FF] to-[#8B5CF6] flex items-center justify-center p-0.5 shadow-[0_0_15px_rgba(0,217,255,0.3)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#03060D] rounded-[10px] flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-ping absolute" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] relative z-10" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-extrabold tracking-wider font-display bg-gradient-to-r from-[#00D9FF] via-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
              SPENDWISE
            </span>
            <span
              className={`text-[8px] font-mono tracking-widest uppercase -mt-0.5 font-semibold ${
                isDark ? "text-[#00D9FF]" : "text-[#0891B2]"
              }`}
            >
              YOUR MONEY. YOUR ORBIT.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? isDark
                      ? "text-[#00D9FF] bg-[#00D9FF]/10 border border-[#00D9FF]/40 shadow-[0_0_15px_rgba(0,217,255,0.25)] font-semibold"
                      : "text-[#0891B2] bg-[#0891B2]/10 border border-[#0891B2]/30 font-semibold"
                    : isDark
                    ? "text-[#A8B4C7] hover:text-[#F4F7FB] hover:bg-[#09111F]"
                    : "text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 transition-colors ${
                    isActive
                      ? isDark
                        ? "text-[#00D9FF]"
                        : "text-[#0891B2]"
                      : isDark
                      ? "text-[#64748B]"
                      : "text-[#94A3B8]"
                  }`}
                />
                <span>{link.name}</span>
                {isActive && (
                  <span
                    className={`absolute bottom-0 inset-x-3 h-[2px] rounded-full ${
                      isDark ? "bg-[#00D9FF] shadow-[0_0_8px_#00D9FF]" : "bg-[#0891B2]"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls: Add Expense, History Undo, Profile/Login, Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Prominent + Add Expense Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#3B82F6] text-[#03060D] font-bold text-xs font-mono tracking-wide flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,217,255,0.3)] hover:shadow-[0_0_20px_rgba(0,217,255,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ Add Expense</span>
          </button>

          {/* Auth State Button / Profile Badge */}
          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-1.5">
              <Link
                href="/profile"
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                  pathname === "/profile"
                    ? isDark
                      ? "bg-[#18D9FF]/10 border-[#18D9FF]/30 text-[#18D9FF]"
                      : "bg-[#1677FF]/10 border-[#1677FF]/25 text-[#1677FF]"
                    : isDark
                    ? "bg-[#0B1426] border-[rgba(80,150,255,0.15)] text-[#8FA3BF] hover:text-[#F5F8FF]"
                    : "bg-[#F8FBFF] border-[rgba(30,90,160,0.14)] text-[#60738F] hover:text-[#10213A]"
                }`}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-4 h-4 rounded-full object-cover border border-[#18D9FF]"
                />
                <span className="hidden lg:inline truncate max-w-[90px]">{user.name.split(" ")[0]}</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                title="Sign out of command center"
                className={`p-1.5 rounded-xl border text-xs transition-all ${
                  isDark
                    ? "border-[rgba(80,150,255,0.15)] text-[#8FA3BF] hover:text-rose-400 hover:border-rose-500/30 bg-[#0B1426]"
                    : "border-[rgba(30,90,160,0.14)] text-[#60738F] hover:text-rose-600 hover:border-rose-300 bg-[#F8FBFF]"
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              title="Enter Financial Command Center"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                pathname === "/login"
                  ? isDark
                    ? "bg-[#18D9FF]/10 border-[#18D9FF]/30 text-[#18D9FF]"
                    : "bg-[#1677FF]/10 border-[#1677FF]/25 text-[#1677FF]"
                  : isDark
                  ? "bg-[#0B1426] border-[rgba(80,150,255,0.15)] text-[#8FA3BF] hover:text-[#18D9FF]"
                  : "bg-[#F8FBFF] border-[rgba(30,90,160,0.14)] text-[#60738F] hover:text-[#1677FF]"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Sign In</span>
            </Link>
          )}

          {/* Quick Undo / Telemetry Reset */}
          <button
            onClick={resetToDemo}
            title="Reset to canonical ₹27,000 seed data"
            className={`flex p-1.5 rounded-xl border transition-all text-xs ${
              isDark
                ? "border-[rgba(0,217,255,0.2)] text-[#A8B4C7] hover:text-[#00D9FF] bg-[#09111F] hover:border-[#00D9FF]/40"
                : "border-[rgba(15,23,42,0.12)] text-[#475569] hover:text-[#0891B2] bg-[#F8FBFF]"
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`p-1.5 rounded-xl border transition-all ${
              isDark
                ? "border-[rgba(80,150,255,0.15)] text-[#F5B942] bg-[#0B1426] hover:border-[#18D9FF]/40"
                : "border-[rgba(30,90,160,0.14)] text-[#1677FF] bg-[#F8FBFF] hover:border-[#1677FF]/40"
            }`}
          >
            {theme === "dark" ? (
              <Sun className="w-3.5 h-3.5 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-3.5 h-3.5 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-1.5 rounded-xl border ${
              isDark
                ? "border-[rgba(80,150,255,0.15)] text-[#8FA3BF]"
                : "border-[rgba(30,90,160,0.14)] text-[#60738F]"
            }`}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden mt-2 p-3 rounded-2xl backdrop-blur-xl border transition-all shadow-xl ${
            isDark
              ? "bg-[#0B1426]/95 border-[rgba(80,150,255,0.15)]"
              : "bg-white/95 border-[rgba(30,90,160,0.14)] shadow-card-light"
          }`}
        >
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2.5 ${
                    isActive
                      ? isDark
                        ? "text-[#18D9FF] bg-[#18D9FF]/10 border border-[#18D9FF]/30"
                        : "text-[#1677FF] bg-[#1677FF]/10 border border-[#1677FF]/25 font-semibold"
                      : isDark
                      ? "text-[#8FA3BF] hover:text-[#F5F8FF]"
                      : "text-[#60738F] hover:text-[#10213A]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
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
                className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-2.5 border text-left ${
                  isDark
                    ? "border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                    : "border-rose-200 text-rose-600 hover:bg-rose-50"
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out ({user.name.split(" ")[0]})</span>
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-2.5 border ${
                  isDark
                    ? "border-[rgba(80,150,255,0.15)] text-[#8FA3BF] hover:text-[#18D9FF]"
                    : "border-[rgba(30,90,160,0.14)] text-[#60738F] hover:text-[#1677FF]"
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In (Command Center)</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
