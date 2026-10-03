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
      className={`w-full max-w-md p-7 sm:p-8 rounded-3xl transition-all duration-300 shadow-xl relative border ${
        isDark
          ? "bg-[#0B1426]/90 border-[rgba(80,150,255,0.15)] shadow-[0_12px_40px_rgba(5,9,20,0.6)]"
          : "bg-white border-[rgba(30,90,160,0.14)] shadow-[0_8px_30px_rgba(15,30,60,0.06)]"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-[#18D9FF] to-[#8B5CF6] flex items-center justify-center p-0.5 shadow-sm">
          <div className="w-full h-full bg-[#050914] rounded-[10px] flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#18D9FF] animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#18D9FF] relative z-10" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-black tracking-wider font-display bg-gradient-to-r from-[#18D9FF] via-[#2684FF] to-[#8B5CF6] bg-clip-text text-transparent">
            SPENDWISE
          </span>
          <span className="text-[9px] font-mono tracking-widest text-[#60738F] dark:text-[#8FA3BF] uppercase -mt-0.5">
            Financial Command
          </span>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div
        className={`grid grid-cols-2 gap-1.5 p-1 mb-5 rounded-2xl border ${
          isDark
            ? "bg-[#07101F] border-[rgba(80,150,255,0.12)]"
            : "bg-[#F8FBFF] border-[rgba(30,90,160,0.12)]"
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
                ? "bg-[#0F1B31] text-[#18D9FF] border border-[#18D9FF]/30 shadow-sm"
                : "bg-white text-[#1677FF] border border-[rgba(30,90,160,0.2)] shadow-sm"
              : "text-[#60738F] hover:text-[#10213A] dark:text-[#8FA3BF] dark:hover:text-[#F5F8FF]"
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
                ? "bg-[#0F1B31] text-[#18D9FF] border border-[#18D9FF]/30 shadow-sm"
                : "bg-white text-[#1677FF] border border-[rgba(30,90,160,0.2)] shadow-sm"
              : "text-[#60738F] hover:text-[#10213A] dark:text-[#8FA3BF] dark:hover:text-[#F5F8FF]"
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Heading */}
      <div className="mb-5">
        <h2 className="text-2xl font-bold font-display tracking-tight text-[#10213A] dark:text-[#F5F8FF]">
          {mode === "signin" ? "Welcome back" : "Initialize Identity"}
        </h2>
        <p className="text-xs text-[#60738F] dark:text-[#8FA3BF] mt-1">
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
            <label className="block text-[11px] font-mono uppercase text-[#60738F] dark:text-[#8FA3BF] mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#18D9FF]" />
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
                    ? "bg-[#07101F] border-[rgba(80,150,255,0.15)] text-[#F5F8FF] focus:border-[#18D9FF] focus:ring-1 focus:ring-[#18D9FF]/30"
                    : "bg-[#F8FBFF] border-[rgba(30,90,160,0.15)] text-[#10213A] focus:border-[#1677FF] focus:ring-1 focus:ring-[#1677FF]/20"
                }`}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#60738F] dark:text-[#8FA3BF] mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#8B5CF6]" />
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
                    ? "bg-[#07101F] border-[rgba(80,150,255,0.15)] text-[#F5F8FF] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/30"
                    : "bg-[#F8FBFF] border-[rgba(30,90,160,0.15)] text-[#10213A] focus:border-[#7657E8] focus:ring-1 focus:ring-[#7657E8]/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#60738F] hover:text-[#8FA3BF] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs font-mono pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-[#60738F] dark:text-[#8FA3BF] select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-[rgba(80,150,255,0.3)] text-[#18D9FF] focus:ring-0"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => alert("Credentials reset instructions dispatched to your verified relay.")}
              className="text-[#18D9FF] dark:text-[#18D9FF] hover:underline"
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
            className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-[#18D9FF] to-[#2684FF] text-[#050914] font-bold font-mono text-xs tracking-wider flex items-center justify-center gap-2 shadow-sm hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-75"
          >
            {isTransitioning || isSubmitting ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#050914] border-t-transparent rounded-full animate-spin" />
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
              className="text-[11px] font-mono text-[#60738F] hover:text-[#18D9FF] dark:hover:text-[#18D9FF] transition-colors"
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
            <label className="block text-[11px] font-mono uppercase text-[#60738F] dark:text-[#8FA3BF] mb-1 flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-[#18D9FF]" />
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
                  ? "bg-[#07101F] border-[rgba(80,150,255,0.15)] text-[#F5F8FF] focus:border-[#18D9FF] focus:ring-1 focus:ring-[#18D9FF]/30"
                  : "bg-[#F8FBFF] border-[rgba(30,90,160,0.15)] text-[#10213A] focus:border-[#1677FF] focus:ring-1 focus:ring-[#1677FF]/20"
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#60738F] dark:text-[#8FA3BF] mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#18D9FF]" />
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
                  ? "bg-[#07101F] border-[rgba(80,150,255,0.15)] text-[#F5F8FF] focus:border-[#18D9FF] focus:ring-1 focus:ring-[#18D9FF]/30"
                  : "bg-[#F8FBFF] border-[rgba(30,90,160,0.15)] text-[#10213A] focus:border-[#1677FF] focus:ring-1 focus:ring-[#1677FF]/20"
              }`}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#60738F] dark:text-[#8FA3BF] mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#8B5CF6]" />
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
                  ? "bg-[#07101F] border-[rgba(80,150,255,0.15)] text-[#F5F8FF] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/30"
                  : "bg-[#F8FBFF] border-[rgba(30,90,160,0.15)] text-[#10213A] focus:border-[#7657E8] focus:ring-1 focus:ring-[#7657E8]/20"
              }`}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#60738F] dark:text-[#8FA3BF] mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#20D6A3]" />
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
                  ? "bg-[#07101F] border-[rgba(80,150,255,0.15)] text-[#F5F8FF] focus:border-[#20D6A3] focus:ring-1 focus:ring-[#20D6A3]/30"
                  : "bg-[#F8FBFF] border-[rgba(30,90,160,0.15)] text-[#10213A] focus:border-[#0BAF83] focus:ring-1 focus:ring-[#0BAF83]/20"
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
            className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-[#20D6A3] via-[#18D9FF] to-[#2684FF] text-[#050914] font-bold font-mono text-xs tracking-wider flex items-center justify-center gap-2 shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-75"
          >
            {isTransitioning || isSubmitting ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#050914] border-t-transparent rounded-full animate-spin" />
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
      <div className="pt-4 mt-5 border-t border-[rgba(80,150,255,0.12)] dark:border-[rgba(80,150,255,0.12)] flex items-center justify-center gap-2 text-[11px] font-mono text-[#60738F] dark:text-[#8FA3BF]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#20D6A3]" />
        <span>End-to-end encrypted financial ledger</span>
      </div>
    </div>
  );
}

