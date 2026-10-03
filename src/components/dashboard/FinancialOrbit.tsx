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

// Generate static ambient background stars for continuous cosmic environment
const AMBIENT_STARS = Array.from({ length: 48 }, (_, i) => ({
  id: i,
  top: `${((i * 19 + 7) % 94) + 3}%`,
  left: `${((i * 23 + 11) % 96) + 2}%`,
  size: (i % 3 === 0 ? 2 : i % 2 === 0 ? 1.5 : 1),
  opacity: (i % 4 === 0 ? 0.6 : i % 3 === 0 ? 0.4 : 0.25),
  delay: `${(i % 5) * 0.8}s`,
}));

export default function FinancialOrbit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const { metrics, categories } = useExpenses();
  const { isDark } = useTheme();

  const [projectedNodes, setProjectedNodes] = useState<ProjectedNode[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1400, height: 700 });

  // Three.js scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
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

  // Canonical categories matching financial command center specification
  const displayCategories: CategorySummary[] = useMemo(() => {
    const canonicalDefaults: CategorySummary[] = [
      { category: "Food & Dining", amount: 7350, percentage: 15.2, count: 2, color: "#00D9FF", iconName: "Utensils" },
      { category: "Shopping", amount: 14300, percentage: 29.5, count: 2, color: "#8B5CF6", iconName: "ShoppingBag" },
      { category: "Transport", amount: 9300, percentage: 19.2, count: 1, color: "#3B82F6", iconName: "Car" },
      { category: "Entertainment", amount: 2850, percentage: 5.9, count: 1, color: "#F59E0B", iconName: "Film" },
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
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || Math.round(window.innerHeight * 0.72);
    setDimensions({ width, height });

    // 1. Scene & Dynamic Responsive Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera aspect and position scaled for wide spatial environment
    const cameraZ = width < 640 ? 13.8 : width < 1024 ? 12.0 : 10.8;
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 120);
    camera.position.set(0, 1.2, cameraZ);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 1.08 : 1.15;
    rendererRef.current = renderer;

    // 3. Central Financial Reactor Core (Aura Wireframe Sphere)
    const coreGeometry = new THREE.SphereGeometry(1.25, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0x00d9ff : 0x0891b2,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.22 : 0.28,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);
    coreMeshRef.current = coreMesh;

    // 4. Multiple Elliptical Orbital Rings (Large Spatial Scale extending toward screen edges)
    const ringDefinitions = [
      {
        radius: 3.4,
        tube: 0.0055,
        tiltX: 1.18,
        tiltY: 0.20,
        speed: 0.0008,
        color: isDark ? 0x00d9ff : 0x0891b2,
        opacity: isDark ? 0.38 : 0.58,
      },
      {
        radius: 5.2,
        tube: 0.0050,
        tiltX: 0.76,
        tiltY: -0.28,
        speed: -0.0006,
        color: isDark ? 0x3b82f6 : 0x2563eb,
        opacity: isDark ? 0.32 : 0.52,
      },
      {
        radius: 7.4,
        tube: 0.0045,
        tiltX: 1.32,
        tiltY: 0.18,
        speed: 0.0004,
        color: isDark ? 0x8b5cf6 : 0x7c3aed,
        opacity: isDark ? 0.28 : 0.48,
      },
      {
        radius: 9.8,
        tube: 0.0040,
        tiltX: 0.90,
        tiltY: 0.36,
        speed: -0.0003,
        color: isDark ? 0x10b981 : 0x059669,
        opacity: isDark ? 0.24 : 0.42,
      },
      {
        radius: 12.8,
        tube: 0.0035,
        tiltX: 1.08,
        tiltY: -0.16,
        speed: 0.0002,
        color: isDark ? 0x00d9ff : 0x0891b2,
        opacity: isDark ? 0.14 : 0.24,
      },
    ];

    const rings: THREE.Mesh[] = [];
    ringDefinitions.forEach((def) => {
      const ringGeo = new THREE.TorusGeometry(def.radius, def.tube, 16, 160);
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

    // 5. Category Satellites — Positioned across distinct spatial quadrants
    // Top-Left (-138°), Top-Right (-43°), Mid-Right (+22°), Bottom-Right (+109°), Mid-Left (+180°)
    const sectorConfigs = [
      { angle: -2.40, radius: 4.6, yOffset: 0.35, ringIndex: 0 }, // Food & Dining (Top-Left)
      { angle: -0.75, radius: 5.4, yOffset: 0.45, ringIndex: 2 }, // Shopping (Top-Right)
      { angle: 0.38,  radius: 6.8, yOffset: 0.10, ringIndex: 1 }, // Transport (Mid-Right)
      { angle: 1.90,  radius: 5.0, yOffset: -0.40, ringIndex: 3 }, // Entertainment (Bottom-Right)
      { angle: 3.15,  radius: 6.2, yOffset: -0.15, ringIndex: 0 }, // Bills & Utilities (Mid-Left)
    ];

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
      const config = sectorConfigs[index % sectorConfigs.length];
      const ringDef = ringDefinitions[config.ringIndex];

      const nodeGeo = new THREE.SphereGeometry(0.10, 16, 16);
      const nodeColor = isDark ? cat.color : cat.color === "#00D9FF" ? "#0891B2" : cat.color;
      const nodeMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(nodeColor),
        transparent: true,
        opacity: isDark ? 0.92 : 0.95,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);

      // Satellite glowing beacon ring
      const beaconGeo = new THREE.RingGeometry(0.15, 0.18, 24);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(nodeColor),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isDark ? 0.55 : 0.40,
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.rotation.x = Math.PI / 2;
      nodeMesh.add(beacon);

      scene.add(nodeMesh);
      nodeMeshes.push({
        mesh: nodeMesh,
        cat: cat.category,
        baseAngle: config.angle,
        radius: config.radius,
        speed: ringDef.speed * 0.75,
        yOffset: config.yOffset,
        ringIndex: config.ringIndex,
      });
    });
    nodeMeshesRef.current = nodeMeshes;

    // 6. Viewport-Wide Starfield & Particles (140 stars spanning widescreen spatial volume)
    const particleCount = 140;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cCyan = new THREE.Color(isDark ? "#00D9FF" : "#0891B2");
    const cBlue = new THREE.Color(isDark ? "#3B82F6" : "#2563EB");
    const cViolet = new THREE.Color(isDark ? "#8B5CF6" : "#7C3AED");
    const cEmerald = new THREE.Color(isDark ? "#10B981" : "#059669");
    const cWhite = new THREE.Color(isDark ? "#E0F2FE" : "#1E293B");

    for (let i = 0; i < particleCount; i++) {
      // Wide coordinate spread across the full viewport
      positions[i * 3] = (Math.random() - 0.5) * 38;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2.0;

      const mix = Math.random();
      const chosen =
        mix < 0.35 ? cCyan : mix < 0.60 ? cBlue : mix < 0.80 ? cViolet : mix < 0.92 ? cEmerald : cWhite;
      colors[i * 3] = chosen.r;
      colors[i * 3 + 1] = chosen.g;
      colors[i * 3 + 2] = chosen.b;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.040,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.45 : 0.32,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // 7. Interactive Damped Mouse Parallax across the entire viewport
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

      // Smooth Parallax Damping
      targetX += (mouseX - targetX) * 0.035;
      targetY += (mouseY - targetY) * 0.035;

      if (!isReducedMotion) {
        camera.position.x = targetX * 0.85;
        camera.position.y = 1.2 + targetY * 0.45;
      }
      camera.lookAt(0, 0, 0);

      // Rotate Core Sphere Slowly + Subtle Pulse
      if (coreMeshRef.current && !isReducedMotion) {
        coreMeshRef.current.rotation.y = elapsedTime * 0.07;
        coreMeshRef.current.rotation.x = Math.sin(elapsedTime * 0.05) * 0.08;
        const pulse = 1.0 + Math.sin(elapsedTime * 1.6) * 0.02;
        coreMeshRef.current.scale.set(pulse, pulse, pulse);
      }

      // Rotate Orbital Rings Smoothly
      if (!isReducedMotion) {
        ringsRef.current.forEach((ring, idx) => {
          const speed = ringDefinitions[idx % ringDefinitions.length].speed;
          ring.rotation.z += speed;
        });
      }

      // Drift Particles slowly across deep space
      if (particlesRef.current && !isReducedMotion) {
        particlesRef.current.rotation.y = elapsedTime * 0.012;
        particlesRef.current.rotation.x = Math.sin(elapsedTime * 0.008) * 0.015;
      }

      // Project Category Nodes to 2D Screen Space
      const projected: ProjectedNode[] = [];
      const tempVec = new THREE.Vector3();

      const isMobile = width < 640;
      const isTablet = width >= 640 && width < 1024;
      const padX = isMobile ? 65 : isTablet ? 85 : 120;
      const padTop = isMobile ? 65 : 78;
      const padBottom = isMobile ? 55 : 68;

      nodeMeshesRef.current.forEach((item, index) => {
        const catData = displayCategories[index];
        if (!catData) return;

        // Subtle gentle floating orbit sway around designated sector
        const currentAngle = isReducedMotion
          ? item.baseAngle
          : item.baseAngle + Math.sin(elapsedTime * 0.32 + index * 1.25) * 0.08;

        // Position on elliptical orbit in 3D
        const x = item.radius * Math.cos(currentAngle);
        const z = item.radius * Math.sin(currentAngle) * 0.72;
        const y = Math.sin(currentAngle + index) * 0.18 + item.yOffset;

        item.mesh.position.set(x, y, z);

        // Project 3D vector to screen coords
        item.mesh.getWorldPosition(tempVec);
        tempVec.project(camera);

        const isVisible = tempVec.z < 1.0;
        const rawX = (tempVec.x * 0.5 + 0.5) * width;
        const rawY = (-tempVec.y * 0.5 + 0.5) * height;

        const screenX = THREE.MathUtils.clamp(rawX, padX, width - padX);
        const screenY = THREE.MathUtils.clamp(rawY, padTop, height - padBottom);

        const baseScale = isMobile ? 0.82 : isTablet ? 0.92 : 1.0;
        const scale = THREE.MathUtils.clamp(1.0 - tempVec.z * 0.025, 0.88, 1.08) * baseScale;

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

    // 9. Resize Observer for Full-Width Viewport Adaptation
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          width = newWidth;
          height = newHeight;
          setDimensions({ width: newWidth, height: newHeight });

          const newCameraZ = newWidth < 640 ? 13.8 : newWidth < 1024 ? 12.0 : 10.8;
          camera.position.z = newCameraZ;
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

      scene.clear();
      renderer.dispose();
    };
  }, [displayCategories, isDark, isReducedMotion]);

  // Highlight active ring in Three.js when hovering category
  useEffect(() => {
    if (!ringsRef.current || ringsRef.current.length === 0) return;
    const activeNode = nodeMeshesRef.current.find((n) => n.cat === activeCategory);
    ringsRef.current.forEach((ring, idx) => {
      const mat = ring.material as THREE.MeshBasicMaterial;
      if (activeNode && activeNode.ringIndex === idx) {
        mat.opacity = isDark ? 0.90 : 0.92;
      } else {
        const defaultOpacities = [0.38, 0.32, 0.28, 0.24, 0.14];
        mat.opacity = isDark ? defaultOpacities[idx % 5] : defaultOpacities[idx % 5] * 1.6;
      }
    });
  }, [activeCategory, isDark]);

  const outflowAmount = metrics.thisMonthOutflow > 0 ? metrics.thisMonthOutflow : 27000;
  const activeProjectedNode = projectedNodes.find((n) => n.category === activeCategory);

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/transactions?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section
      ref={containerRef}
      className={`spatial-orbit-hero relative w-full h-[68vh] sm:h-[72vh] lg:h-[78vh] min-h-[580px] max-h-[880px] flex items-center justify-center select-none overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-[#03060D]" : "bg-[#F5F8FC]"
      }`}
    >
      {/* 3D WebGL Canvas spanning the entire hero */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

      {/* Atmospheric Background Glow & Nebulae */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isDark
            ? "bg-[radial-gradient(circle_at_50%_50%,rgba(0,217,255,0.12)_0%,rgba(59,130,246,0.05)_32%,transparent_68%)]"
            : "bg-[radial-gradient(circle_at_50%_50%,rgba(8,145,178,0.08)_0%,rgba(37,99,235,0.03)_35%,transparent_70%)]"
        }`}
      />

      {/* Top Atmospheric Nebula Flare */}
      <div
        className={`absolute top-0 inset-x-0 h-48 pointer-events-none ${
          isDark
            ? "bg-[radial-gradient(ellipse_at_50%_0%,rgba(139,92,246,0.06)_0%,transparent_70%)]"
            : "bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,102,241,0.04)_0%,transparent_70%)]"
        }`}
      />

      {/* Subtle Starfield Layer across the entire viewport */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {AMBIENT_STARS.map((star) => (
          <div
            key={star.id}
            className={`absolute rounded-full transition-opacity ${
              isDark ? "bg-white" : "bg-[#0891B2]"
            }`}
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: isDark ? star.opacity : star.opacity * 0.6,
              animation: `pulse 4s ease-in-out infinite`,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Bottom seamless blend into analytics dashboard below */}
      <div
        className={`absolute bottom-0 inset-x-0 h-28 pointer-events-none z-15 ${
          isDark
            ? "bg-gradient-to-b from-transparent via-[#03060D]/60 to-[#03060D]"
            : "bg-gradient-to-b from-transparent via-[#F5F8FC]/60 to-[#F5F8FC]"
        }`}
      />

      {/* ======================================================== */}
      {/* TOP HUD LABELS (ABOVE THE ORBIT)                          */}
      {/* ======================================================== */}
      <div className="absolute top-5 inset-x-6 sm:inset-x-10 lg:inset-x-16 z-20 flex items-center justify-between pointer-events-none">
        {/* Left Badge: ✦ SPENDWISE 3D SPATIAL ORBIT */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono tracking-wider backdrop-blur-md transition-colors ${
            isDark
              ? "bg-[#060B14]/80 border-[#00D9FF]/25 text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.15)]"
              : "bg-white/90 border-[rgba(15,23,42,0.12)] text-[#0891B2] font-semibold shadow-sm"
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
              : "bg-white/90 border-[rgba(15,23,42,0.12)] text-[#475569] font-medium shadow-sm"
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>Interactive Parallax Active</span>
        </div>
      </div>

      {/* Dynamic Hover Connection Beam from Center Core to Active Category Card */}
      {activeCategory && activeProjectedNode && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-15">
          <defs>
            <linearGradient
              id={`beam-${activeProjectedNode.id}`}
              x1="50%"
              y1="50%"
              x2={`${(activeProjectedNode.x / dimensions.width) * 100}%`}
              y2={`${(activeProjectedNode.y / dimensions.height) * 100}%`}
            >
              <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.85" />
              <stop offset="100%" stopColor={activeProjectedNode.color} stopOpacity="0.35" />
            </linearGradient>
          </defs>
          <line
            x1={dimensions.width / 2}
            y1={dimensions.height / 2}
            x2={activeProjectedNode.x}
            y2={activeProjectedNode.y}
            stroke={`url(#beam-${activeProjectedNode.id})`}
            strokeWidth="1.8"
            strokeDasharray="4 4"
            className="animate-pulse"
          />
        </svg>
      )}

      {/* ======================================================== */}
      {/* CENTRAL FINANCIAL REACTOR CORE (HERO FOCAL POINT)        */}
      {/* SPENDWISE / ₹27,000 / OUTFLOW THIS MONTH / ↑ 25.6%       */}
      {/* ======================================================== */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center text-center pointer-events-auto">
        <div
          className={`relative p-5 sm:p-6 rounded-full backdrop-blur-2xl border transition-all duration-300 flex flex-col items-center justify-center ${
            isDark
              ? "bg-[#040814]/90 border-[rgba(0,217,255,0.35)] shadow-[0_0_60px_rgba(0,217,255,0.22),inset_0_0_30px_rgba(0,217,255,0.12)]"
              : "bg-white/95 border-[rgba(2,132,199,0.28)] shadow-[0_8px_35px_rgba(2,132,199,0.15)]"
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
      {/* 5 FLOATING CATEGORY SATELLITE CARDS (DYNAMIC 3D SPACE)   */}
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
                className={`relative px-3.5 py-2.5 rounded-xl backdrop-blur-md border transition-all duration-200 cursor-pointer flex items-center gap-2.5 ${
                  isDark
                    ? `bg-[#040814]/90 border-[rgba(0,217,255,0.22)] shadow-[0_4px_25px_rgba(0,0,0,0.6)] ${
                        isHovered
                          ? "border-[#00D9FF] shadow-[0_0_22px_rgba(0,217,255,0.38)] brightness-110"
                          : ""
                      }`
                    : `bg-white/95 border-[rgba(15,23,42,0.12)] shadow-card-light ${
                        isHovered ? "border-[#0891B2] shadow-[0_4px_20px_rgba(8,145,178,0.22)]" : ""
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
                    className={`text-[9px] font-bold uppercase tracking-wider truncate max-w-[100px] ${
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
      <div className="absolute bottom-5 inset-x-6 sm:inset-x-10 lg:inset-x-16 z-20 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#A8B4C7] dark:text-[#A8B4C7] text-[#64748B] pointer-events-auto">
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
    </section>
  );
}
