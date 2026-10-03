"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface LoginFormProps {
  onFieldFocus: (field: "email" | "password" | null) => void;
  onLoginSuccess: () => void;
  isTransitioning: boolean;
}

export default function LoginForm({
  onFieldFocus,
  onLoginSuccess,
  isTransitioning,
}: LoginFormProps) {
  const { isDark } = useTheme();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");

  // Sign In fields
  const [email, setEmail] = useState("aarav.sharma@spendwise.orbit");
  const [password, setPassword] = useState("orbitPass2026");
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please provide verified authentication credentials.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await login(email, password);
      if (res.success) {
        onLoginSuccess();
      } else {
        setError(res.error || "Authentication failed.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regName.trim() || regName.trim().length < 2) {
      setError("Please enter your legal name (min 2 characters).");
      return;
    }
    if (!regEmail.trim() || !regEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (regPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await register(regName, regEmail, regPassword);
      if (res.success) {
        onLoginSuccess();
      } else {
        setError(res.error || "Failed to create account.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadDemo = () => {
    setMode("signin");
    setEmail("aarav.sharma@spendwise.orbit");
    setPassword("orbitPass2026");
    setError(null);
  };

  return (
    <div
      className={`w-full max-w-md p-7 sm:p-8 rounded-3xl backdrop-blur-2xl border transition-all duration-300 shadow-2xl relative ${
        isDark
          ? "bg-slate-950/80 border-slate-800 shadow-glow-cyan"
          : "bg-white/95 border-slate-200/90 shadow-glass-light"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center p-0.5 shadow-glow-cyan">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 relative z-10" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-black tracking-wider font-display bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
            SPENDWISE
          </span>
          <span className="text-[9px] font-mono tracking-widest text-slate-500 dark:text-slate-400 uppercase -mt-0.5">
            Financial Command
          </span>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div
        className={`grid grid-cols-2 gap-1.5 p-1 mb-5 rounded-2xl border ${
          isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-100 border-slate-200"
        }`}
      >
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setError(null);
          }}
          className={`py-2 text-xs font-mono font-bold rounded-xl transition-all ${
            mode === "signin"
              ? isDark
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm"
                : "bg-white text-sky-800 border border-slate-200 shadow-sm"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setError(null);
          }}
          className={`py-2 text-xs font-mono font-bold rounded-xl transition-all ${
            mode === "signup"
              ? isDark
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm"
                : "bg-white text-sky-800 border border-slate-200 shadow-sm"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Heading */}
      <div className="mb-5">
        <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
          {mode === "signin" ? "Welcome back" : "Initialize Identity"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {mode === "signin"
            ? "Your financial orbit is active and calibrated."
            : "Establish your sovereign financial command center."}
        </p>
      </div>

      {/* Form: Sign In Mode */}
      {mode === "signin" ? (
        <form onSubmit={handleSignIn} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-500" />
              <span>Identity Relay (Email)</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => onFieldFocus("email")}
                onBlur={() => onFieldFocus(null)}
                placeholder="operator@spendwise.orbit"
                required
                className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans transition-all focus:outline-none ${
                  isDark
                    ? "bg-slate-900/60 border-slate-800 text-white focus:border-cyan-400"
                    : "bg-slate-50 border-slate-300 text-slate-900 focus:border-sky-500"
                }`}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-violet-500" />
              <span>Cipher Key (Password)</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => onFieldFocus("password")}
                onBlur={() => onFieldFocus(null)}
                placeholder="••••••••••••"
                required
                className={`w-full px-4 py-2.5 pr-11 rounded-xl border text-sm font-sans transition-all focus:outline-none ${
                  isDark
                    ? "bg-slate-900/60 border-slate-800 text-white focus:border-violet-400"
                    : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs font-mono pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-500 dark:text-slate-400 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => alert("Credentials reset instructions dispatched to your verified relay.")}
              className="text-cyan-500 dark:text-cyan-400 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <p className="text-xs text-rose-500 dark:text-rose-400 font-mono pt-1 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isTransitioning || isSubmitting}
            className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-slate-950 font-bold font-mono text-xs tracking-wider flex items-center justify-center gap-2 shadow-glow-cyan hover:shadow-cyan-400/50 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-75"
          >
            {isTransitioning || isSubmitting ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>SYNCHRONIZING ORBIT...</span>
              </div>
            ) : (
              <>
                <span>SIGN IN</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Demo Button */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={loadDemo}
              className="text-[11px] font-mono text-slate-500 hover:text-cyan-400 transition-colors"
            >
              Load Demo Credentials (Aarav Sharma)
            </button>
          </div>
        </form>
      ) : (
        /* Form: Create Account Mode */
        <form onSubmit={handleSignUp} className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-cyan-500" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="e.g. Maya Chen"
              required
              className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans transition-all focus:outline-none ${
                isDark
                  ? "bg-slate-900/60 border-slate-800 text-white focus:border-cyan-400"
                  : "bg-slate-50 border-slate-300 text-slate-900 focus:border-sky-500"
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-500" />
              <span>Identity Email</span>
            </label>
            <input
              type="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              onFocus={() => onFieldFocus("email")}
              onBlur={() => onFieldFocus(null)}
              placeholder="maya.chen@spendwise.orbit"
              required
              className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans transition-all focus:outline-none ${
                isDark
                  ? "bg-slate-900/60 border-slate-800 text-white focus:border-cyan-400"
                  : "bg-slate-50 border-slate-300 text-slate-900 focus:border-sky-500"
              }`}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-violet-500" />
              <span>Password (Cipher Key)</span>
            </label>
            <input
              type="password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              onFocus={() => onFieldFocus("password")}
              onBlur={() => onFieldFocus(null)}
              placeholder="Min. 6 characters"
              required
              className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans transition-all focus:outline-none ${
                isDark
                  ? "bg-slate-900/60 border-slate-800 text-white focus:border-violet-400"
                  : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500"
              }`}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Confirm Password</span>
            </label>
            <input
              type="password"
              value={regConfirmPassword}
              onChange={(e) => setRegConfirmPassword(e.target.value)}
              placeholder="Repeat cipher key"
              required
              className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans transition-all focus:outline-none ${
                isDark
                  ? "bg-slate-900/60 border-slate-800 text-white focus:border-emerald-400"
                  : "bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600"
              }`}
            />
          </div>

          {error && (
            <p className="text-xs text-rose-500 dark:text-rose-400 font-mono pt-1 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isTransitioning || isSubmitting}
            className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold font-mono text-xs tracking-wider flex items-center justify-center gap-2 shadow-glow-cyan hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-75"
          >
            {isTransitioning || isSubmitting ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>INITIALIZING ORBIT...</span>
              </div>
            ) : (
              <>
                <span>INITIALIZE IDENTITY</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Footer Info */}
      <div className="pt-4 mt-5 border-t border-slate-800/60 flex items-center justify-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>End-to-end encrypted financial ledger</span>
      </div>
    </div>
  );
}

