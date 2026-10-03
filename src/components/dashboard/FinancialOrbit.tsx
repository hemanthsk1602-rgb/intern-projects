"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useExpenses } from "@/context/ExpenseContext";
import { useTheme } from "@/context/ThemeContext";
import { formatINR, CATEGORY_METADATA } from "@/lib/utils";
import { ExpenseCategory, CategorySummary } from "@/types";
import {
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Film,
  Activity,
  GraduationCap,
  TrendingUp,
  CircleDot,
  Orbit as OrbitIcon,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

const CATEGORY_ICONS: Record<ExpenseCategory, React.ElementType> = {
  "Food & Dining": Utensils,
  Transport: Car,
  Shopping: ShoppingBag,
  "Bills & Utilities": Zap,
  Entertainment: Film,
  "Health & Wellness": Activity,
  Education: GraduationCap,
  Investment: TrendingUp,
  Other: CircleDot,
};

interface ProjectedNode {
  id: string;
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  color: string;
  lightColor: string;
  x: number;
  y: number;
  visible: boolean;
  scale: number;
}

export default function FinancialOrbit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { metrics, categories } = useExpenses();
  const { isDark } = useTheme();

  const [projectedNodes, setProjectedNodes] = useState<ProjectedNode[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Three.js references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const ringsRef = useRef<THREE.Mesh[]>([]);
  const particlesRef = useRef<THREE.Points | null>(null);
  const coreMeshRef = useRef<THREE.Mesh | null>(null);
  const nodeMeshesRef = useRef<
    { mesh: THREE.Mesh; cat: string; baseAngle: number; radius: number; speed: number; yOffset: number }[]
  >([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene & Camera Setup (Realistic perspective, compact orbit focus)
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 10.5);
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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 1.05 : 1.15;
    rendererRef.current = renderer;

    // 3. Compact Financial Core (Aura sphere behind HTML central element)
    const coreGeometry = new THREE.SphereGeometry(0.85, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0x18d9ff : 0x00afcf,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.15 : 0.18,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);
    coreMeshRef.current = coreMesh;

    // 4. Exactly 3 Thin, Elegant Orbital Rings
    const ringDefinitions = [
      {
        radius: 2.1,
        tube: 0.005,
        tiltX: 1.15,
        tiltY: 0.18,
        speed: 0.0010,
        color: isDark ? 0x18d9ff : 0x00afcf,
        opacity: isDark ? 0.35 : 0.6,
      },
      {
        radius: 2.8,
        tube: 0.0045,
        tiltX: 0.82,
        tiltY: -0.24,
        speed: -0.0008,
        color: isDark ? 0x2684ff : 0x1677ff,
        opacity: isDark ? 0.28 : 0.5,
      },
      {
        radius: 3.5,
        tube: 0.004,
        tiltX: 1.25,
        tiltY: 0.12,
        speed: 0.0006,
        color: isDark ? 0x8b5cf6 : 0x7657e8,
        opacity: isDark ? 0.22 : 0.42,
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

    // 5. Category Satellites — Exactly 4–5 Major Nodes, Non-Overlapping Sectors
    const canonicalDefaults: CategorySummary[] = [
      { category: "Food & Dining", amount: 7350, percentage: 27, count: 2, color: "#18D9FF", iconName: "Utensils" },
      { category: "Transport", amount: 9300, percentage: 34, count: 1, color: "#2684FF", iconName: "Car" },
      { category: "Shopping", amount: 14300, percentage: 53, count: 2, color: "#8B5CF6", iconName: "ShoppingBag" },
      { category: "Bills & Utilities", amount: 10300, percentage: 38, count: 1, color: "#20D6A3", iconName: "Zap" },
      { category: "Entertainment", amount: 2850, percentage: 11, count: 1, color: "#F59E0B", iconName: "Film" },
    ];
    const topCategories = categories.length >= 5 ? categories.slice(0, 5) : canonicalDefaults;

    // 5 balanced angular sectors: Top-Left, Top-Right, Mid-Right, Bottom-Right, Mid-Left
    const sectorAngles = [-2.35, -0.80, 0.35, 1.85, 3.10];
    const nodeMeshes: { mesh: THREE.Mesh; cat: string; baseAngle: number; radius: number; speed: number; yOffset: number }[] = [];

    topCategories.forEach((cat, index) => {
      const ringDef = ringDefinitions[index % ringDefinitions.length];
      const radius = ringDef.radius + (index % 2 === 0 ? 0.08 : -0.08);
      const angle = sectorAngles[index % sectorAngles.length];

      const nodeGeo = new THREE.SphereGeometry(0.085, 16, 16);
      const nodeColor = isDark ? cat.color : cat.color === "#18D9FF" ? "#00AFCF" : cat.color;
      const nodeMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(nodeColor),
        transparent: true,
        opacity: isDark ? 0.85 : 0.95,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);

      // Subtle satellite beacon ring
      const beaconGeo = new THREE.RingGeometry(0.12, 0.15, 20);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(nodeColor),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isDark ? 0.4 : 0.3,
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.rotation.x = Math.PI / 2;
      nodeMesh.add(beacon);

      scene.add(nodeMesh);
      nodeMeshes.push({
        mesh: nodeMesh,
        cat: cat.category,
        baseAngle: angle,
        radius,
        speed: ringDef.speed * 0.8,
        yOffset: index % 2 === 0 ? 0.12 : -0.12,
      });
    });
    nodeMeshesRef.current = nodeMeshes;

    // 6. Minimal, Subtle Particles (Exactly 36 particles within requested 30-40 range)
    const particleCount = 36;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(isDark ? "#18D9FF" : "#00AFCF");
    const c2 = new THREE.Color(isDark ? "#2684FF" : "#1677FF");
    const c3 = new THREE.Color(isDark ? "#8B5CF6" : "#7657E8");

    for (let i = 0; i < particleCount; i++) {
      const r = 2.8 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3] = r * Math.cos(theta);
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4.0;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3.0 - 1.0;

      const mix = Math.random();
      const chosen = mix < 0.5 ? c1 : mix < 0.8 ? c2 : c3;
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
      opacity: isDark ? 0.30 : 0.20,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // 7. Subtle Mouse Parallax (Damped)
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

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Damped Parallax
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      if (!isReducedMotion) {
        camera.position.x = targetX * 0.7;
        camera.position.y = 1.4 + targetY * 0.4;
      }
      camera.lookAt(0, 0, 0);

      // Rotate Core Sphere Slowly
      if (coreMeshRef.current && !isReducedMotion) {
        coreMeshRef.current.rotation.y = elapsedTime * 0.08;
        coreMeshRef.current.rotation.x = Math.sin(elapsedTime * 0.06) * 0.1;
      }

      // Rotate Orbital Rings Smoothly
      if (!isReducedMotion) {
        ringsRef.current.forEach((ring, idx) => {
          const speed = ringDefinitions[idx % ringDefinitions.length].speed;
          ring.rotation.z += speed;
        });
      }

      // Drift Particles
      if (particlesRef.current && !isReducedMotion) {
        particlesRef.current.rotation.y = elapsedTime * 0.015;
      }

      // Project Category Nodes to 2D HTML
      const projected: ProjectedNode[] = [];
      const tempVec = new THREE.Vector3();

      nodeMeshesRef.current.forEach((item, index) => {
        const catData = topCategories[index];
        if (!catData) return;

        // Subtle gentle floating orbit sway around designated sector
        const currentAngle = isReducedMotion
          ? item.baseAngle
          : item.baseAngle + Math.sin(elapsedTime * 0.4 + index * 1.3) * 0.08;

        // Position on its orbital ellipse
        const x = item.radius * Math.cos(currentAngle);
        const z = item.radius * Math.sin(currentAngle) * 0.72;
        const y = Math.sin(currentAngle + index) * 0.15 + item.yOffset;

        item.mesh.position.set(x, y, z);

        // Project 3D vector to screen coords
        item.mesh.getWorldPosition(tempVec);
        tempVec.project(camera);

        const isVisible = tempVec.z < 1.0;
        const screenX = THREE.MathUtils.clamp((tempVec.x * 0.5 + 0.5) * width, 75, width - 75);
        const screenY = THREE.MathUtils.clamp((-tempVec.y * 0.5 + 0.5) * height, 32, height - 32);

        // Depth scale
        const scale = THREE.MathUtils.clamp(1.0 - z * 0.035, 0.88, 1.05);

        projected.push({
          id: `node_${index}`,
          category: catData.category,
          amount: catData.amount,
          percentage: catData.percentage,
          color: catData.color,
          lightColor: CATEGORY_METADATA[catData.category]?.lightColor || catData.color,
          x: screenX,
          y: screenY,
          visible: isVisible,
          scale,
        });
      });

      setProjectedNodes(projected);
      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Observer
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

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();

      // Dispose Three.js objects
      scene.clear();
      renderer.dispose();
    };
  }, [categories, isDark, isReducedMotion]);

  // Outflow values: primary total spending (₹27,000) and this month outflow (₹12,500)
  const totalSpending = metrics.totalExpenses > 0 ? metrics.totalExpenses : 27000;
  const outflowAmount = metrics.thisMonthOutflow > 0 ? metrics.thisMonthOutflow : 12500;

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-[490px] h-[390px] sm:h-[410px] rounded-3xl border overflow-hidden flex items-center justify-center transition-all select-none mx-auto ${
        isDark
          ? "bg-[#07101F]/80 border-[rgba(80,150,255,0.15)] shadow-card-dark"
          : "bg-[#FFFFFF] border-[rgba(30,90,160,0.14)] shadow-card-light"
      }`}
    >
      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Subtle radial ambient background glow behind the core */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity ${
          isDark
            ? "bg-[radial-gradient(circle_at_50%_50%,rgba(24,217,255,0.06)_0%,transparent_60%)]"
            : "bg-[radial-gradient(circle_at_50%_50%,rgba(22,119,255,0.04)_0%,transparent_60%)]"
        }`}
      />

      {/* Control Indicator */}
      <div
        className={`hidden sm:flex absolute top-4 right-4 z-20 items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono transition-colors ${
          isDark
            ? "bg-[#0B1426]/70 border-[rgba(80,150,255,0.15)] text-[#8FA3BF]"
            : "bg-[#F8FBFF] border-[rgba(30,90,160,0.14)] text-[#60738F]"
        }`}
      >
        <OrbitIcon className="w-3 h-3 text-[#18D9FF]" />
        <span>3D Financial Orbit</span>
      </div>

      {/* ======================================================== */}
      {/* COMPACT CENTRAL FINANCIAL CORE (FOCAL POINT)             */}
      {/* SPENDWISE / FINANCIAL ORBIT / ₹27,000 / OUTFLOW THIS MONTH ₹12,500 */}
      {/* ======================================================== */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center pointer-events-auto">
        <div
          className={`relative p-3.5 sm:p-4 rounded-full backdrop-blur-xl border transition-all duration-300 flex flex-col items-center justify-center ${
            isDark
              ? "bg-[#0B1426]/90 border-[rgba(80,150,255,0.22)] shadow-glow-subtle"
              : "bg-white/95 border-[rgba(30,90,160,0.2)] shadow-card-light"
          }`}
          style={{ width: "180px", height: "180px" }}
        >
          {/* Subtle spinning accent ring behind the core */}
          <div
            className={`absolute -inset-2 rounded-full border border-dashed animate-orbit-rotate pointer-events-none transition-colors ${
              isDark ? "border-[#18D9FF]/20" : "border-[#1677FF]/25"
            }`}
          />
          <div
            className={`absolute -inset-4 rounded-full border animate-spin-reverse pointer-events-none transition-colors ${
              isDark ? "border-[#8B5CF6]/15" : "border-[#7657E8]/20"
            }`}
          />

          {/* SPENDWISE / FINANCIAL ORBIT header */}
          <div className="flex flex-col items-center mb-0.5">
            <span className="text-[9px] font-extrabold tracking-widest text-[#18D9FF] dark:text-[#18D9FF] text-cyan-600 uppercase">
              SPENDWISE
            </span>
            <span
              className={`text-[7.5px] font-mono tracking-wider -mt-0.5 font-medium ${
                isDark ? "text-[#8FA3BF]" : "text-[#60738F]"
              }`}
            >
              FINANCIAL ORBIT
            </span>
          </div>

          {/* Core Focal Outflow Value - ₹27,000 (Strongest visual element) */}
          <div className="text-2xl sm:text-[28px] font-extrabold tracking-tight font-display text-slate-900 dark:text-white drop-shadow-sm my-0.5 leading-none">
            {formatINR(totalSpending)}
          </div>

          {/* OUTFLOW THIS MONTH - ₹12,500 */}
          <div className="flex flex-col items-center mt-1">
            <span
              className={`text-[8px] font-bold uppercase tracking-wider ${
                isDark ? "text-[#8FA3BF]" : "text-[#60738F]"
              }`}
            >
              OUTFLOW THIS MONTH
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {formatINR(outflowAmount)}
              </span>
              <span
                className={`text-[8.5px] font-mono px-1.5 py-0.2 rounded border font-semibold ${
                  isDark
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-emerald-50 text-emerald-700 border-emerald-300"
                }`}
              >
                ↓ 4.2%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4–5 MAJOR CATEGORY NODES (COMPACT FLOATING GLASS CARDS)  */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {projectedNodes.map((node) => {
          if (!node.visible) return null;
          const isHovered = activeCategory === node.category;
          const Icon = CATEGORY_ICONS[node.category] || CircleDot;

          return (
            <div
              key={node.id}
              className="absolute pointer-events-auto transition-transform duration-150 ease-out will-change-transform"
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                transform: `translate(-50%, -50%) scale(${node.scale * (isHovered ? 1.06 : 1)})`,
              }}
              onMouseEnter={() => setActiveCategory(node.category)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <div
                className={`relative px-2.5 py-1.5 rounded-xl backdrop-blur-md border transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  isDark
                    ? `bg-[#0B1426]/90 border-[rgba(80,150,255,0.18)] ${
                        isHovered ? "border-[#18D9FF] shadow-glow-subtle" : ""
                      }`
                    : `bg-white/95 border-[rgba(30,90,160,0.16)] shadow-card-light ${
                        isHovered ? "border-[#1677FF]" : ""
                      }`
                }`}
              >
                {/* Category Icon */}
                <div
                  className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${node.color}18`,
                    color: isDark ? node.color : node.lightColor,
                  }}
                >
                  <Icon className="w-3 h-3" />
                </div>

                {/* Info: Name & Amount */}
                <div className="flex flex-col text-left">
                  <span
                    className={`text-[8.5px] font-bold uppercase tracking-wider truncate max-w-[85px] ${
                      isDark ? "text-[#8FA3BF]" : "text-[#60738F]"
                    }`}
                  >
                    {node.category}
                  </span>
                  <span className="text-[11px] font-extrabold font-mono text-slate-900 dark:text-white leading-tight">
                    {formatINR(node.amount)}
                  </span>
                </div>

                {/* Percentage Chip */}
                <span
                  className={`text-[9px] font-mono px-1 py-0.5 rounded ml-0.5 font-semibold ${
                    isDark
                      ? "bg-[#07101F] text-[#18D9FF]"
                      : "bg-[#F4F8FC] text-[#1677FF]"
                  }`}
                >
                  {node.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Orbit Footer Telemetry Strip */}
      <div className="absolute bottom-3 inset-x-5 z-20 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 pointer-events-auto">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full inline-block bg-[#18D9FF]" />
          <span>Active Telemetry ({projectedNodes.length || 5} Nodes)</span>
        </span>
        <Link
          href="/analytics"
          className={`flex items-center gap-1 transition-colors ${
            isDark ? "text-[#18D9FF] hover:underline" : "text-[#1677FF] hover:underline font-semibold"
          }`}
        >
          <span>Analytics</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
