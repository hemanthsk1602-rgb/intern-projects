"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
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
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { metrics, categories } = useExpenses();
  const { isDark } = useTheme();

  const [projectedNodes, setProjectedNodes] = useState<ProjectedNode[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 900, height: 560 });

  // Three.js references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const ringsRef = useRef<THREE.Mesh[]>([]);
  const particlesRef = useRef<THREE.Points | null>(null);
  const coreMeshRef = useRef<THREE.Mesh | null>(null);
  const nodeMeshesRef = useRef<
    { mesh: THREE.Mesh; cat: string; baseAngle: number; radius: number; speed: number; yOffset: number; ringIndex: number }[]
  >([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Canonical categories exactly matching prompt specification
  const displayCategories: CategorySummary[] = useMemo(() => {
    const canonicalDefaults: CategorySummary[] = [
      { category: "Food & Dining", amount: 7350, percentage: 15.2, count: 2, color: "#00D9FF", iconName: "Utensils" },
      { category: "Transport", amount: 9300, percentage: 19.2, count: 1, color: "#3B82F6", iconName: "Car" },
      { category: "Entertainment", amount: 2850, percentage: 5.9, count: 1, color: "#F59E0B", iconName: "Film" },
      { category: "Shopping", amount: 14300, percentage: 29.5, count: 2, color: "#8B5CF6", iconName: "ShoppingBag" },
      { category: "Bills & Utilities", amount: 10300, percentage: 21.2, count: 1, color: "#10B981", iconName: "Zap" },
    ];

    if (categories && categories.length >= 5) {
      return categories.slice(0, 5);
    }
    return canonicalDefaults;
  }, [categories]);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;
    setContainerDimensions({ width, height });

    // 1. Scene & Camera Setup (Perspective Camera with cinematic depth)
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 11.5);
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

    // 3. Central Financial Reactor Core (Aura sphere behind HTML central element)
    const coreGeometry = new THREE.SphereGeometry(1.15, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0x00d9ff : 0x0891b2,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.20 : 0.24,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);
    coreMeshRef.current = coreMesh;

    // 4. Multiple Elliptical Orbital Rings (4 rings, different planes & speeds)
    const ringDefinitions = [
      {
        radius: 3.0,
        tube: 0.0055,
        tiltX: 1.18,
        tiltY: 0.20,
        speed: 0.0009,
        color: isDark ? 0x00d9ff : 0x0891b2,
        opacity: isDark ? 0.32 : 0.55,
      },
      {
        radius: 4.2,
        tube: 0.005,
        tiltX: 0.78,
        tiltY: -0.28,
        speed: -0.0007,
        color: isDark ? 0x3b82f6 : 0x2563eb,
        opacity: isDark ? 0.26 : 0.48,
      },
      {
        radius: 5.4,
        tube: 0.0045,
        tiltX: 1.30,
        tiltY: 0.16,
        speed: 0.0005,
        color: isDark ? 0x8b5cf6 : 0x7c3aed,
        opacity: isDark ? 0.22 : 0.42,
      },
      {
        radius: 6.5,
        tube: 0.004,
        tiltX: 0.92,
        tiltY: 0.38,
        speed: -0.0004,
        color: isDark ? 0x10b981 : 0x059669,
        opacity: isDark ? 0.18 : 0.38,
      },
    ];

    const rings: THREE.Mesh[] = [];
    ringDefinitions.forEach((def) => {
      const ringGeo = new THREE.TorusGeometry(def.radius, def.tube, 16, 140);
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

    // 5. Category Satellites — Exactly 5 Nodes positioned along distinct angular quadrants
    // Top-Left (-140°), Top-Right (-40°), Mid-Right (+25°), Bottom-Right (+110°), Mid-Left (+185°)
    const sectorAngles = [-2.44, -0.70, 0.44, 1.92, 3.23];
    const nodeMeshes: {
      mesh: THREE.Mesh;
      cat: string;
      baseAngle: number;
      radius: number;
      speed: number;
      yOffset: number;
      ringIndex: number;
    }[] = [];

    displayCategories.forEach((cat, index) => {
      const ringIdx = index % ringDefinitions.length;
      const ringDef = ringDefinitions[ringIdx];
      const radius = ringDef.radius + (index % 2 === 0 ? 0.1 : -0.1);
      const angle = sectorAngles[index % sectorAngles.length];

      const nodeGeo = new THREE.SphereGeometry(0.09, 16, 16);
      const nodeColor = isDark ? cat.color : cat.color === "#00D9FF" ? "#0891B2" : cat.color;
      const nodeMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(nodeColor),
        transparent: true,
        opacity: isDark ? 0.9 : 0.95,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);

      // Satellite glowing beacon ring
      const beaconGeo = new THREE.RingGeometry(0.13, 0.16, 24);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(nodeColor),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isDark ? 0.5 : 0.35,
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
        yOffset: index % 2 === 0 ? 0.15 : -0.15,
        ringIndex: ringIdx,
      });
    });
    nodeMeshesRef.current = nodeMeshes;

    // 6. Sparse Animated Particles/Stars (~48 particles)
    const particleCount = 48;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(isDark ? "#00D9FF" : "#0891B2");
    const c2 = new THREE.Color(isDark ? "#3B82F6" : "#2563EB");
    const c3 = new THREE.Color(isDark ? "#8B5CF6" : "#7C3AED");

    for (let i = 0; i < particleCount; i++) {
      const r = 3.5 + Math.random() * 6.5;
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3] = r * Math.cos(theta);
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4.0 - 1.0;

      const mix = Math.random();
      const chosen = mix < 0.45 ? c1 : mix < 0.8 ? c2 : c3;
      colors[i * 3] = chosen.r;
      colors[i * 3 + 1] = chosen.g;
      colors[i * 3 + 2] = chosen.b;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.32 : 0.22,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // 7. Interactive Damped Mouse Parallax
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

      // Damped Parallax (Subtle, never aggressive)
      targetX += (mouseX - targetX) * 0.035;
      targetY += (mouseY - targetY) * 0.035;

      if (!isReducedMotion) {
        camera.position.x = targetX * 0.75;
        camera.position.y = 1.4 + targetY * 0.4;
      }
      camera.lookAt(0, 0, 0);

      // Rotate Core Sphere Slowly + Subtle Pulse
      if (coreMeshRef.current && !isReducedMotion) {
        coreMeshRef.current.rotation.y = elapsedTime * 0.08;
        coreMeshRef.current.rotation.x = Math.sin(elapsedTime * 0.06) * 0.1;
        const pulse = 1.0 + Math.sin(elapsedTime * 1.5) * 0.02;
        coreMeshRef.current.scale.set(pulse, pulse, pulse);
      }

      // Rotate Orbital Rings Smoothly at different speeds
      if (!isReducedMotion) {
        ringsRef.current.forEach((ring, idx) => {
          const speed = ringDefinitions[idx % ringDefinitions.length].speed;
          ring.rotation.z += speed;
        });
      }

      // Drift Particles slowly
      if (particlesRef.current && !isReducedMotion) {
        particlesRef.current.rotation.y = elapsedTime * 0.012;
      }

      // Project Category Nodes to 2D HTML Screen Coordinates
      const projected: ProjectedNode[] = [];
      const tempVec = new THREE.Vector3();

      nodeMeshesRef.current.forEach((item, index) => {
        const catData = displayCategories[index];
        if (!catData) return;

        // Subtle gentle floating orbit sway around designated sector
        const currentAngle = isReducedMotion
          ? item.baseAngle
          : item.baseAngle + Math.sin(elapsedTime * 0.35 + index * 1.2) * 0.09;

        // Position on its orbital ellipse
        const x = item.radius * Math.cos(currentAngle);
        const z = item.radius * Math.sin(currentAngle) * 0.70;
        const y = Math.sin(currentAngle + index) * 0.18 + item.yOffset;

        item.mesh.position.set(x, y, z);

        // Project 3D vector to screen coords
        item.mesh.getWorldPosition(tempVec);
        tempVec.project(camera);

        const isVisible = tempVec.z < 1.0;
        // Keep cards safely inside container padding
        const screenX = THREE.MathUtils.clamp((tempVec.x * 0.5 + 0.5) * width, 85, width - 85);
        const screenY = THREE.MathUtils.clamp((-tempVec.y * 0.5 + 0.5) * height, 48, height - 48);

        // Depth scale
        const scale = THREE.MathUtils.clamp(1.0 - z * 0.03, 0.88, 1.06);

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
          setContainerDimensions({ width: newWidth, height: newHeight });
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
  }, [displayCategories, isDark, isReducedMotion]);

  // Highlight active ring in Three.js when hovering a category
  useEffect(() => {
    if (!ringsRef.current || ringsRef.current.length === 0) return;
    const activeNode = nodeMeshesRef.current.find((n) => n.cat === activeCategory);
    ringsRef.current.forEach((ring, idx) => {
      const mat = ring.material as THREE.MeshBasicMaterial;
      if (activeNode && activeNode.ringIndex === idx) {
        mat.opacity = isDark ? 0.85 : 0.90;
      } else {
        const defaultOpacities = [0.32, 0.26, 0.22, 0.18];
        mat.opacity = isDark ? defaultOpacities[idx % 4] : defaultOpacities[idx % 4] * 1.8;
      }
    });
  }, [activeCategory, isDark]);

  // Outflow values: Center shows ₹27,000 as primary visual focus
  const outflowAmount = metrics.thisMonthOutflow > 0 ? metrics.thisMonthOutflow : 27000;
  const activeProjectedNode = projectedNodes.find((n) => n.category === activeCategory);

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/transactions?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-5xl h-[520px] sm:h-[560px] md:h-[620px] rounded-3xl border transition-all duration-300 overflow-hidden flex items-center justify-center select-none mx-auto ${
        isDark
          ? "bg-[#03060D]/90 border-[rgba(0,217,255,0.2)] shadow-[0_0_60px_rgba(0,0,0,0.8),inset_0_0_40px_rgba(0,217,255,0.03)]"
          : "bg-[#F8FAFD] border-[rgba(15,23,42,0.12)] shadow-card-light"
      }`}
    >
      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Subtle radial ambient background glow behind the core */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity ${
          isDark
            ? "bg-[radial-gradient(circle_at_50%_50%,rgba(0,217,255,0.08)_0%,transparent_65%)]"
            : "bg-[radial-gradient(circle_at_50%_50%,rgba(8,145,178,0.06)_0%,transparent_65%)]"
        }`}
      />

      {/* ======================================================== */}
      {/* TOP LABELS (HUD BADGES ABOVE THE ORBIT)                   */}
      {/* ======================================================== */}
      <div className="absolute top-4 inset-x-6 z-20 flex items-center justify-between pointer-events-none">
        {/* Left Badge: ✦ SPENDWISE 3D SPATIAL ORBIT */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono tracking-wider backdrop-blur-md transition-colors ${
            isDark
              ? "bg-[#060B14]/80 border-[#00D9FF]/25 text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.15)]"
              : "bg-white/85 border-[rgba(15,23,42,0.12)] text-[#0891B2] font-semibold shadow-sm"
          }`}
        >
          <Sparkles className="w-3 h-3 text-[#00D9FF]" />
          <span>SPENDWISE 3D SPATIAL ORBIT</span>
        </div>

        {/* Right Badge: ◎ Interactive Parallax Active */}
        <div
          className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-mono tracking-wider backdrop-blur-md transition-colors ${
            isDark
              ? "bg-[#060B14]/80 border-[rgba(59,130,246,0.25)] text-[#A8B4C7]"
              : "bg-white/85 border-[rgba(15,23,42,0.12)] text-[#475569] font-medium shadow-sm"
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>Interactive Parallax Active</span>
        </div>
      </div>

      {/* Dynamic Hover Connection Beam from Center Core to Category Card */}
      {activeCategory && activeProjectedNode && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-15">
          <defs>
            <linearGradient
              id={`beam-${activeProjectedNode.id}`}
              x1="50%"
              y1="50%"
              x2={`${(activeProjectedNode.x / containerDimensions.width) * 100}%`}
              y2={`${(activeProjectedNode.y / containerDimensions.height) * 100}%`}
            >
              <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor={activeProjectedNode.color} stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <line
            x1={containerDimensions.width / 2}
            y1={containerDimensions.height / 2}
            x2={activeProjectedNode.x}
            y2={activeProjectedNode.y}
            stroke={`url(#beam-${activeProjectedNode.id})`}
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="animate-pulse"
          />
        </svg>
      )}

      {/* ======================================================== */}
      {/* COMPACT CENTRAL FINANCIAL REACTOR / SPHERE (FOCAL POINT)  */}
      {/* ₹27,000 / OUTFLOW THIS MONTH / ↑ 25.6% vs last mo         */}
      {/* ======================================================== */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center pointer-events-auto">
        <div
          className={`relative p-5 sm:p-6 rounded-full backdrop-blur-2xl border transition-all duration-300 flex flex-col items-center justify-center ${
            isDark
              ? "bg-[#040814]/90 border-[rgba(0,217,255,0.32)] shadow-[0_0_50px_rgba(0,217,255,0.2),inset_0_0_30px_rgba(0,217,255,0.12)]"
              : "bg-white/95 border-[rgba(2,132,199,0.25)] shadow-[0_4px_30px_rgba(2,132,199,0.14)]"
          }`}
          style={{ width: "215px", height: "215px" }}
        >
          {/* Concentric spinning accent rings */}
          <div
            className={`absolute -inset-2.5 rounded-full border border-dashed animate-orbit-rotate pointer-events-none transition-colors ${
              isDark ? "border-[#00D9FF]/30" : "border-[#0891B2]/30"
            }`}
          />
          <div
            className={`absolute -inset-5 rounded-full border animate-spin-reverse pointer-events-none transition-colors ${
              isDark ? "border-[#8B5CF6]/20" : "border-[#7C3AED]/25"
            }`}
          />
          <div
            className={`absolute -inset-7.5 rounded-full border border-dotted animate-pulse-slow pointer-events-none transition-colors ${
              isDark ? "border-[#3B82F6]/15" : "border-[#2563EB]/20"
            }`}
          />

          {/* SPENDWISE Brand Caption */}
          <div className="flex flex-col items-center mb-0.5">
            <span className="text-[9.5px] font-extrabold tracking-widest text-[#00D9FF] dark:text-[#00D9FF] text-cyan-600 uppercase">
              SPENDWISE
            </span>
          </div>

          {/* Primary Dominant Number: ₹27,000 */}
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white dark:text-white text-slate-900 drop-shadow-[0_0_15px_rgba(0,217,255,0.35)] my-0.5 leading-none">
            {formatINR(outflowAmount)}
          </div>

          {/* Label: OUTFLOW THIS MONTH */}
          <div className="flex flex-col items-center mt-1">
            <span
              className={`text-[8.5px] font-bold uppercase tracking-wider ${
                isDark ? "text-[#A8B4C7]" : "text-[#475569]"
              }`}
            >
              OUTFLOW THIS MONTH
            </span>

            {/* Growth indicator: ↑ 25.6% vs last mo */}
            <div className="flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 dark:text-emerald-400 text-[10px] font-mono font-semibold">
              <span>↑ 25.6% vs last mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5 FLOATING CATEGORY SATELLITE CARDS (3D OBJECTS IN SPACE) */}
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
                transform: `translate(-50%, -50%) scale(${node.scale * (isHovered ? 1.08 : 1)})`,
              }}
              onMouseEnter={() => setActiveCategory(node.category)}
              onMouseLeave={() => setActiveCategory(null)}
              onClick={() => handleCategoryClick(node.category)}
            >
              <div
                className={`relative px-3 py-2 rounded-xl backdrop-blur-md border transition-all duration-200 cursor-pointer flex items-center gap-2.5 ${
                  isDark
                    ? `bg-[#040814]/90 border-[rgba(0,217,255,0.22)] shadow-[0_4px_25px_rgba(0,0,0,0.6)] ${
                        isHovered
                          ? "border-[#00D9FF] shadow-[0_0_20px_rgba(0,217,255,0.35)] brightness-110"
                          : ""
                      }`
                    : `bg-white/95 border-[rgba(15,23,42,0.12)] shadow-card-light ${
                        isHovered ? "border-[#0891B2] shadow-[0_4px_20px_rgba(8,145,178,0.2)]" : ""
                      }`
                }`}
              >
                {/* Glowing Dot & Category Icon */}
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 relative"
                  style={{
                    backgroundColor: `${node.color}18`,
                    color: isDark ? node.color : node.lightColor,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full absolute -top-0.5 -right-0.5 shadow-sm"
                    style={{
                      backgroundColor: node.color,
                      boxShadow: `0 0 6px ${node.color}`,
                    }}
                  />
                  <Icon className="w-3.5 h-3.5" />
                </div>

                {/* Category Name & Amount */}
                <div className="flex flex-col text-left">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider truncate max-w-[95px] ${
                      isDark ? "text-[#A8B4C7]" : "text-[#475569]"
                    }`}
                  >
                    {node.category}
                  </span>
                  <span className="text-xs font-extrabold font-mono text-white dark:text-white text-slate-900 leading-tight">
                    {formatINR(node.amount)}
                  </span>
                </div>

                {/* Percentage Chip */}
                <span
                  className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                    isDark
                      ? "bg-[#060B14] text-[#00D9FF] border border-[#00D9FF]/20"
                      : "bg-[#F1F5F9] text-[#0891B2] border border-[#0891B2]/20"
                  }`}
                >
                  {node.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* BOTTOM STATUS TELEMETRY                                  */}
      {/* ======================================================== */}
      <div className="absolute bottom-4 inset-x-6 z-20 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#A8B4C7] dark:text-[#A8B4C7] text-[#64748B] pointer-events-auto">
        {/* Bottom-left: ● Orbit-Synchronized (7 Active Categories) */}
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D9FF] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D9FF]" />
          </span>
          <span>Orbit-Synchronized ({categories.length || 7} Active Categories)</span>
        </span>

        {/* Bottom-right: Deep Orbit Analytics ↗ */}
        <Link
          href="/analytics"
          className={`flex items-center gap-1 transition-all ${
            isDark ? "text-[#00D9FF] hover:underline" : "text-[#0891B2] hover:underline font-semibold"
          }`}
        >
          <span>Deep Orbit Analytics</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

