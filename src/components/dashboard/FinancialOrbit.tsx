"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { useExpenses } from "@/context/ExpenseContext";
import { useTheme } from "@/context/ThemeContext";
import { formatINR } from "@/lib/utils";
import { ExpenseCategory } from "@/types";
import {
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Film,
  Orbit as OrbitIcon,
} from "lucide-react";

interface CategoryNodeDef {
  id: string;
  category: ExpenseCategory;
  defaultAmount: number;
  color: string;
  lightColor: string;
  icon: React.ElementType;
  ringIndex: number;
  // Desktop constellation coordinates (percentage or px relative to 500x420)
  desktopStyle: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    transform?: string;
  };
  // Connector line endpoint (px relative to 500x420)
  connector: {
    cardX: number;
    cardY: number;
    orbitX: number;
    orbitY: number;
  };
}

const CATEGORY_DEFINITIONS: CategoryNodeDef[] = [
  {
    id: "food",
    category: "Food & Dining",
    defaultAmount: 7350,
    color: "#00D9FF",
    lightColor: "#0891B2",
    icon: Utensils,
    ringIndex: 0,
    desktopStyle: {
      top: "22px",
      left: "50%",
      transform: "translateX(-50%)",
    },
    connector: {
      cardX: 250,
      cardY: 74,
      orbitX: 250,
      orbitY: 108,
    },
  },
  {
    id: "transport",
    category: "Transport",
    defaultAmount: 9300,
    color: "#3B82F6",
    lightColor: "#2563EB",
    icon: Car,
    ringIndex: 1,
    desktopStyle: {
      top: "135px",
      left: "14px",
    },
    connector: {
      cardX: 156,
      cardY: 161,
      orbitX: 178,
      orbitY: 161,
    },
  },
  {
    id: "entertainment",
    category: "Entertainment",
    defaultAmount: 2850,
    color: "#EC4899",
    lightColor: "#DB2777",
    icon: Film,
    ringIndex: 2,
    desktopStyle: {
      top: "135px",
      right: "14px",
    },
    connector: {
      cardX: 344,
      cardY: 161,
      orbitX: 322,
      orbitY: 161,
    },
  },
  {
    id: "bills",
    category: "Bills & Utilities",
    defaultAmount: 10300,
    color: "#10B981",
    lightColor: "#059669",
    icon: Zap,
    ringIndex: 1,
    desktopStyle: {
      top: "272px",
      left: "22px",
    },
    connector: {
      cardX: 164,
      cardY: 290,
      orbitX: 188,
      orbitY: 268,
    },
  },
  {
    id: "shopping",
    category: "Shopping",
    defaultAmount: 14300,
    color: "#8B5CF6",
    lightColor: "#7C3AED",
    icon: ShoppingBag,
    ringIndex: 2,
    desktopStyle: {
      bottom: "22px",
      left: "50%",
      transform: "translateX(-50%)",
    },
    connector: {
      cardX: 250,
      cardY: 346,
      orbitX: 250,
      orbitY: 312,
    },
  },
];

export default function FinancialOrbit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { metrics, categories } = useExpenses();
  const { isDark } = useTheme();

  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const ringsRef = useRef<THREE.Mesh[]>([]);
  const particlesRef = useRef<THREE.Points | null>(null);
  const coreMeshRef = useRef<THREE.Mesh | null>(null);
  const innerCoreRef = useRef<THREE.Mesh | null>(null);

  // Category data mapping (uses live database if logged, otherwise exact specified defaults)
  const categoryNodes = useMemo(() => {
    return CATEGORY_DEFINITIONS.map((def) => {
      const live = categories.find(
        (c) => c.category.toLowerCase() === def.category.toLowerCase()
      );
      const amount = live && live.amount > 0 ? live.amount : def.defaultAmount;
      return {
        ...def,
        amount,
      };
    });
  }, [categories]);

  // Main financial values: canonical amounts per prompt with live fallback
  const heroAmount =
    metrics.totalExpenses > 0 && metrics.totalExpenses !== 27000
      ? metrics.totalExpenses
      : 27000;
  const outflowMonthAmount =
    metrics.thisMonthOutflow > 0 && metrics.thisMonthOutflow !== 12500
      ? metrics.thisMonthOutflow
      : 12500;
  const momGrowth =
    metrics.monthOverMonthGrowth !== 0
      ? metrics.monthOverMonthGrowth
      : -8.2;

  // Reduced motion detection
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Three.js 3D Orbital Canvas Setup
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene & Camera Setup (Clean perspective, focused view)
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.6);
    camera.lookAt(0, 0, 0);

    // 2. High-performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // 3. Central Financial Reactor Core (Small 3D sphere behind the HTML core)
    const coreGeometry = new THREE.SphereGeometry(0.95, 28, 28);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0x00d9ff : 0x0891b2,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.16 : 0.22,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);
    coreMeshRef.current = coreMesh;

    // Secondary subtle inner aura
    const innerGeometry = new THREE.SphereGeometry(0.75, 20, 20);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0x8b5cf6 : 0x7c3aed,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.10 : 0.14,
    });
    const innerCore = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerCore);
    innerCoreRef.current = innerCore;

    // 4. EXACTLY 3 ORBITAL RINGS (Visually secondary, thin, elegant, depth-aware)
    // Ring 1: small, close to core, cyan/blue
    // Ring 2: slightly larger, purple/blue, tilted ~55 deg (0.96 rad)
    // Ring 3: slightly larger than ring 2, cyan/purple, tilted in different direction
    const ringDefinitions = [
      {
        radius: 1.85,
        tube: 0.0035,
        tiltX: 1.15,
        tiltY: 0.18,
        speed: 0.0006,
        color: isDark ? 0x00d9ff : 0x0891b2,
        opacity: isDark ? 0.40 : 0.65,
      },
      {
        radius: 2.55,
        tube: 0.0032,
        tiltX: 0.96, // approx 55 degrees
        tiltY: -0.26,
        speed: -0.0005,
        color: isDark ? 0x8b5cf6 : 0x7c3aed,
        opacity: isDark ? 0.35 : 0.55,
      },
      {
        radius: 3.25,
        tube: 0.003,
        tiltX: 1.32,
        tiltY: 0.32,
        speed: 0.0004,
        color: isDark ? 0x3b82f6 : 0x2563eb,
        opacity: isDark ? 0.28 : 0.48,
      },
    ];

    const rings: THREE.Mesh[] = [];
    ringDefinitions.forEach((def) => {
      const ringGeo = new THREE.TorusGeometry(def.radius, def.tube, 16, 120);
      const ringMat = new THREE.MeshBasicMaterial({
        color: def.color,
        transparent: true,
        opacity: def.opacity,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = def.tiltX;
      ring.rotation.y = def.tiltY;
      scene.add(ring);
      rings.push(ring);
    });
    ringsRef.current = rings;

    // 5. Very Small Number of Particles (Strictly 30–50 max: 36 particles)
    const particleCount = 36;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(isDark ? "#00D9FF" : "#0891B2");
    const color2 = new THREE.Color(isDark ? "#3B82F6" : "#2563EB");
    const color3 = new THREE.Color(isDark ? "#8B5CF6" : "#7C3AED");

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.0 + Math.random() * 2.8;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = radius * Math.cos(angle);
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.0;

      const pick = Math.random();
      const chosen = pick < 0.45 ? color1 : pick < 0.75 ? color2 : color3;
      colors[i * 3] = chosen.r;
      colors[i * 3 + 1] = chosen.g;
      colors[i * 3 + 2] = chosen.b;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.032,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.32 : 0.22,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // 6. Subtle Mouse Parallax (Damped, gentle)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 7. Animation Loop (Slow, elegant, 60fps)
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Damped parallax
      targetX += (mouseX - targetX) * 0.035;
      targetY += (mouseY - targetY) * 0.035;

      if (!isReducedMotion) {
        camera.position.x = targetX * 0.35;
        camera.position.y = targetY * 0.25;
      }
      camera.lookAt(0, 0, 0);

      // Rotate core sphere slowly with breathing aura
      if (coreMeshRef.current && !isReducedMotion) {
        coreMeshRef.current.rotation.y = elapsedTime * 0.05;
        coreMeshRef.current.rotation.x = Math.sin(elapsedTime * 0.04) * 0.06;
        const scale = 1 + Math.sin(elapsedTime * 1.5) * 0.02;
        coreMeshRef.current.scale.set(scale, scale, scale);
      }
      if (innerCoreRef.current && !isReducedMotion) {
        innerCoreRef.current.rotation.y = -elapsedTime * 0.04;
        innerCoreRef.current.rotation.z = Math.cos(elapsedTime * 0.05) * 0.05;
      }

      // Rotate 3 orbital rings smoothly
      if (!isReducedMotion) {
        ringsRef.current.forEach((ring, idx) => {
          const speed = ringDefinitions[idx % ringDefinitions.length].speed;
          ring.rotation.z += speed;
        });
      }

      // Drift particles very slowly
      if (particlesRef.current && !isReducedMotion) {
        particlesRef.current.rotation.y = elapsedTime * 0.01;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          width = newWidth;
          height = newHeight;
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      scene.clear();
      renderer.dispose();
    };
  }, [isDark, isReducedMotion]);

  return (
    <div className="w-full flex justify-center py-1">
      {/* ======================================================== */}
      {/* COMPACT CENTRAL ORBIT CONTAINER                         */}
      {/* Desktop: 420px–500px wide, 360px–430px tall             */}
      {/* ======================================================== */}
      <div
        ref={containerRef}
        className={`relative w-full max-w-[490px] sm:max-w-[500px] h-auto min-h-[440px] sm:h-[420px] rounded-3xl border overflow-hidden flex flex-col sm:flex-row items-center justify-center transition-all select-none ${
          isDark
            ? "bg-[#050812] border-[rgba(148,163,184,0.15)] shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
            : "bg-[#F6F9FC] border-[rgba(15,23,42,0.10)] shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
        }`}
      >
        {/* Three.js 3D WebGL Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Ambient Radial Reactor Core Backlight */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity ${
            isDark
              ? "bg-[radial-gradient(circle_at_50%_50%,rgba(0,217,255,0.08)_0%,rgba(139,92,246,0.04)_45%,transparent_70%)]"
              : "bg-[radial-gradient(circle_at_50%_50%,rgba(8,145,178,0.06)_0%,rgba(124,58,237,0.03)_45%,transparent_70%)]"
          }`}
        />

        {/* Subtle Top-Right Indicator Badge */}
        <div
          className={`hidden sm:flex absolute top-3.5 right-4 z-20 items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono transition-colors ${
            isDark
              ? "bg-[#0F172A]/70 border-[rgba(148,163,184,0.15)] text-[#94A3B8]"
              : "bg-white/80 border-[rgba(15,23,42,0.10)] text-[#475569]"
          }`}
        >
          <OrbitIcon className={`w-3 h-3 ${isDark ? "text-[#00D9FF]" : "text-[#0891B2]"}`} />
          <span>Financial Orbit</span>
        </div>

        {/* ======================================================== */}
        {/* SUBTLE SVG CONNECTOR LINES (MAX 5, THIN, NON-INTRUSIVE)  */}
        {/* Hidden on small mobile screens to prevent overlap       */}
        {/* ======================================================== */}
        <svg
          className="hidden sm:block absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 500 420"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="connectorGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDark ? "#00D9FF" : "#0891B2"} stopOpacity="0.35" />
              <stop offset="100%" stopColor={isDark ? "#8B5CF6" : "#7C3AED"} stopOpacity="0.15" />
            </linearGradient>
          </defs>
          {categoryNodes.map((node) => {
            const isHovered = hoveredCategory === node.category;
            return (
              <g key={`connector_${node.id}`}>
                <line
                  x1={node.connector.orbitX}
                  y1={node.connector.orbitY}
                  x2={node.connector.cardX}
                  y2={node.connector.cardY}
                  stroke={isHovered ? (isDark ? "#00D9FF" : "#0891B2") : "url(#connectorGlow)"}
                  strokeWidth={isHovered ? "1.2" : "0.85"}
                  strokeDasharray="2 3"
                  strokeOpacity={isHovered ? "0.6" : isDark ? "0.22" : "0.18"}
                  className="transition-all duration-200"
                />
                <circle
                  cx={node.connector.orbitX}
                  cy={node.connector.orbitY}
                  r="2"
                  fill={isDark ? "#00D9FF" : "#0891B2"}
                  fillOpacity={isHovered ? "0.8" : "0.35"}
                />
              </g>
            );
          })}
        </svg>

        {/* ======================================================== */}
        {/* 1. CENTRAL FINANCIAL CORE ("REACTOR", COMPACT, FOCAL)    */}
        {/* ₹27,000 / OUTFLOW THIS MONTH ₹12,500                    */}
        {/* ======================================================== */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center pt-6 sm:pt-0 pointer-events-auto">
          <div
            className={`relative rounded-full backdrop-blur-xl border transition-all duration-300 flex flex-col items-center justify-center p-4 ${
              isDark
                ? "bg-[#0F172A]/70 border-[rgba(0,217,255,0.25)] shadow-[0_0_30px_rgba(0,217,255,0.12),inset_0_0_15px_rgba(139,92,246,0.08)]"
                : "bg-white/85 border-[rgba(8,145,178,0.22)] shadow-[0_8px_30px_rgba(15,23,42,0.08),inset_0_0_12px_rgba(8,145,178,0.06)]"
            }`}
            style={{ width: "172px", height: "172px" }}
          >
            {/* Spinning decorative accent rings */}
            <div
              className={`absolute -inset-1.5 rounded-full border border-dashed animate-orbit-rotate pointer-events-none transition-colors ${
                isDark ? "border-[#00D9FF]/20" : "border-[#0891B2]/25"
              }`}
            />
            <div
              className={`absolute -inset-3.5 rounded-full border animate-spin-reverse pointer-events-none transition-colors ${
                isDark ? "border-[#8B5CF6]/15" : "border-[#7C3AED]/18"
              }`}
            />

            {/* Header: SPENDWISE / FINANCIAL ORBIT */}
            <span
              className={`text-[8.5px] font-mono tracking-widest uppercase font-black ${
                isDark ? "text-[#00D9FF]" : "text-[#0891B2]"
              }`}
            >
              SPENDWISE
            </span>
            <span
              className={`text-[7.5px] font-mono tracking-wider uppercase font-semibold -mt-0.5 ${
                isDark ? "text-[#94A3B8]" : "text-[#475569]"
              }`}
            >
              FINANCIAL ORBIT
            </span>

            {/* PRIMARY HERO AMOUNT: ₹27,000 (Strongest Visual Focus) */}
            <div
              className={`text-2xl sm:text-[27px] font-extrabold font-display tracking-tight my-0.5 drop-shadow-sm leading-none ${
                isDark ? "text-[#F8FAFC]" : "text-[#0F172A]"
              }`}
            >
              {formatINR(heroAmount)}
            </div>

            {/* Label: OUTFLOW THIS MONTH */}
            <div
              className={`text-[7.5px] font-mono uppercase tracking-wider font-semibold mt-0.5 ${
                isDark ? "text-[#94A3B8]" : "text-[#475569]"
              }`}
            >
              OUTFLOW THIS MONTH
            </div>

            {/* Monthly Outflow Value & Green Comparison Indicator */}
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className={`text-[11px] font-mono font-bold ${
                  isDark ? "text-[#F8FAFC]" : "text-[#0F172A]"
                }`}
              >
                {formatINR(outflowMonthAmount)}
              </span>

              {/* Small Green Positive Indicator */}
              <span
                className={`inline-flex items-center gap-0.5 text-[8.5px] font-mono px-1.5 py-0.5 rounded-full font-bold border ${
                  isDark
                    ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30"
                    : "bg-[#059669]/10 text-[#059669] border-[#059669]/25"
                }`}
              >
                <span>{momGrowth <= 0 ? "↓" : "↑"}</span>
                <span>{Math.abs(momGrowth)}%</span>
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. CATEGORY SATELLITES (5 FLOATING GLASS CARDS)          */}
        {/* Desktop: Clean Constellation layout                     */}
        {/* Mobile: Compact non-overlapping arrangement              */}
        {/* ======================================================== */}
        {/* DESKTOP CONSTELLATION LAYOUT (hidden on xs mobile) */}
        <div className="hidden sm:block absolute inset-0 pointer-events-none z-30">
          {categoryNodes.map((node) => {
            const isHovered = hoveredCategory === node.category;
            const Icon = node.icon;

            return (
              <div
                key={node.id}
                className="absolute pointer-events-auto transition-all duration-200 ease-out"
                style={node.desktopStyle}
                onMouseEnter={() => setHoveredCategory(node.category)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div
                  className={`w-[142px] h-[52px] px-2.5 py-1.5 rounded-2xl backdrop-blur-md border transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                    isDark
                      ? `bg-[#0F172A]/70 border-[rgba(148,163,184,0.15)] shadow-[0_4px_16px_rgba(0,0,0,0.35)] ${
                          isHovered
                            ? "border-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.22)] -translate-y-0.5 scale-[1.03]"
                            : "hover:-translate-y-0.5"
                        }`
                      : `bg-white/85 border-[rgba(15,23,42,0.10)] shadow-[0_4px_16px_rgba(15,23,42,0.06)] ${
                          isHovered
                            ? "border-[#0891B2] shadow-[0_0_15px_rgba(8,145,178,0.15)] -translate-y-0.5 scale-[1.03]"
                            : "hover:-translate-y-0.5"
                        }`
                  }`}
                >
                  {/* Category Indicator Dot + Icon */}
                  <div
                    className="w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0 relative transition-transform"
                    style={{
                      backgroundColor: `${node.color}18`,
                      color: isDark ? node.color : node.lightColor,
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span
                      className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: node.color }}
                    />
                  </div>

                  {/* Category Title & Amount */}
                  <div className="flex flex-col text-left overflow-hidden">
                    <span
                      className={`text-[8.5px] font-bold uppercase tracking-wider truncate max-w-[85px] leading-tight ${
                        isDark ? "text-[#94A3B8]" : "text-[#475569]"
                      }`}
                    >
                      {node.category}
                    </span>
                    <span
                      className={`text-[12px] font-extrabold font-mono leading-tight mt-0.5 ${
                        isDark ? "text-[#F8FAFC]" : "text-[#0F172A]"
                      }`}
                    >
                      {formatINR(node.amount)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* MOBILE STACKED/COMPACT ARRANGEMENT (< sm screens) */}
        {/* Prevents squeezing cards, ensures zero horizontal overflow */}
        <div className="sm:hidden w-full px-4 pt-4 pb-4 z-30 grid grid-cols-2 gap-2 pointer-events-auto">
          {categoryNodes.map((node, idx) => {
            const isHovered = hoveredCategory === node.category;
            const Icon = node.icon;
            const isFullWidth = idx === categoryNodes.length - 1;

            return (
              <div
                key={`mobile_${node.id}`}
                className={`transition-all duration-150 ${isFullWidth ? "col-span-2 flex justify-center" : ""}`}
                onMouseEnter={() => setHoveredCategory(node.category)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div
                  className={`w-full max-w-[170px] h-[48px] px-2 py-1 rounded-xl backdrop-blur-md border transition-all flex items-center gap-2 ${
                    isDark
                      ? "bg-[#0F172A]/75 border-[rgba(148,163,184,0.15)] shadow-sm"
                      : "bg-white/90 border-[rgba(15,23,42,0.10)] shadow-sm"
                  } ${isHovered ? "border-[#00D9FF]" : ""}`}
                >
                  <div
                    className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `${node.color}18`,
                      color: isDark ? node.color : node.lightColor,
                    }}
                  >
                    <Icon className="w-3 h-3" />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden">
                    <span
                      className={`text-[8px] font-bold uppercase tracking-wider truncate max-w-[90px] leading-tight ${
                        isDark ? "text-[#94A3B8]" : "text-[#475569]"
                      }`}
                    >
                      {node.category}
                    </span>
                    <span
                      className={`text-[11px] font-extrabold font-mono leading-tight ${
                        isDark ? "text-[#F8FAFC]" : "text-[#0F172A]"
                      }`}
                    >
                      {formatINR(node.amount)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
