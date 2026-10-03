"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import { useTheme } from "@/context/ThemeContext";
import { Sparkles, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

const LoginVisual = dynamic(() => import("@/components/auth/LoginVisual"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] lg:h-[500px] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
    </div>
  ),
});

export default function LoginPage() {
  const router = useRouter();
  const { isDark } = useTheme();

  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(null);
  const [isSuccessTransition, setIsSuccessTransition] = useState(false);

  const handleLoginSuccess = () => {
    setIsSuccessTransition(true);
    // Smooth, elegant transition sequence per requirements
    // 1. Core expands slightly
    // 2. Orbital rings accelerate
    // 3. Glow increases
    // 4. Smooth transition to Dashboard
    setTimeout(() => {
      router.push("/");
    }, 1100);
  };

  return (
    <div
      className={`min-h-[85vh] w-full flex flex-col justify-center transition-opacity duration-700 ${
        isSuccessTransition ? "opacity-40 scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* Top Bar for Login */}
      <div className="w-full max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#60738F] hover:text-[#18D9FF] dark:text-[#8FA3BF] dark:hover:text-[#18D9FF] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Dashboard</span>
        </Link>

        <div className="flex items-center gap-2 text-[11px] font-mono text-[#60738F] dark:text-[#8FA3BF]">
          <Shield className="w-3.5 h-3.5 text-[#20D6A3]" />
          <span>256-Bit Spatial Encryption</span>
        </div>
      </div>

      {/* Main Grid: Left 45% Visual, Right 40% Form, 15% Breathing Space */}
      <div className="w-full max-w-7xl mx-auto px-4 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* LEFT 45%: Single Futuristic Financial Core Visual */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-center justify-center text-center relative">
          <LoginVisual
            focusedField={focusedField}
            isSuccessTransition={isSuccessTransition}
          />
          <div className="mt-2 text-center max-w-xs">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#18D9FF] mb-1 inline-block">
              INTELLIGENT FINANCIAL CORE
            </span>
            <p className="text-xs text-[#60738F] dark:text-[#8FA3BF] font-sans">
              Your money is organized inside one intelligent financial system.
            </p>
          </div>
        </div>

        {/* RIGHT 40%: Authentication Card */}
        <div className="lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-start">
          <LoginForm
            onFieldFocus={setFocusedField}
            onLoginSuccess={handleLoginSuccess}
            isTransitioning={isSuccessTransition}
          />
        </div>
      </div>
    </div>
  );
}
