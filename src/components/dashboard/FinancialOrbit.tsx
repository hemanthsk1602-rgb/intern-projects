"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useExpenses } from "@/context/ExpenseContext";
import { useTheme } from "@/context/ThemeContext";
import { formatINR } from "@/lib/utils";
import { Sparkles, Orbit as OrbitIcon, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface ProjectedNode {
  id: string;
  category: string;
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

  // Three.js object references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const ringsRef = useRef<THREE.Mesh[]>([]);
  const particlesRef = useRef<THREE.Points | null>(null);
  const coreMeshRef = useRef<THREE.Mesh | null>(null);
  const coreGlowMeshRef = useRef<THREE.Mesh | null>(null);
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

    // 1. Scene & Camera Setup with realistic 3D perspective
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    // Adjusted initial camera for spacious breathing room (70% breathing room, 30% density)
    camera.position.set(0, 2.8, 12);
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

    // 3. Central Financial Core (3D Geometric Aura behind the 2D glass core)
    // Refined to be subtle and never compete with the ₹27,000 label
    const coreGeometry = new THREE.SphereGeometry(1.3, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0x00f0ff : 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.18 : 0.22,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);
    coreMeshRef.current = coreMesh;

    const glowGeo = new THREE.IcosahedronGeometry(0.9, 2);
    const glowMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x8b5cf6 : 0x4f46e5,
      transparent: true,
      opacity: isDark ? 0.25 : 0.2,
      wireframe: true,
    });
    const coreGlowMesh = new THREE.Mesh(glowGeo, glowMat);
    scene.add(coreGlowMesh);
    coreGlowMeshRef.current = coreGlowMesh;

    // 4. Clean, Thin Orbital Rings (3–4 maximum, depth-based fading, delicate line weight)
    // Radii are carefully calibrated to leave clear central breathing room (>3.6)
    const ringDefinitions = [
      {
        radius: 3.6,
        tube: 0.007,
        tiltX: 1.15,
        tiltY: 0.22,
        speed: 0.0018,
        color: isDark ? 0x00f0ff : 0x0284c7,
        opacity: isDark ? 0.35 : 0.65,
      },
      {
        radius: 4.9,
        tube: 0.006,
        tiltX: 0.85,
        tiltY: -0.32,
        speed: -0.0014,
        color: isDark ? 0x3b82f6 : 0x2563eb,
        opacity: isDark ? 0.28 : 0.55,
      },
      {
        radius: 6.2,
        tube: 0.005,
        tiltX: 1.32,
        tiltY: 0.15,
        speed: 0.001,
        color: isDark ? 0x8b5cf6 : 0x7c3aed,
        opacity: isDark ? 0.22 : 0.48, // Depth-based fading for distant paths
      },
      {
        radius: 7.4,
        tube: 0.004,
        tiltX: 0.72,
        tiltY: -0.18,
        speed: -0.0008,
        color: isDark ? 0x10b981 : 0x059669,
        opacity: isDark ? 0.16 : 0.4, // Subtle outer halo
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

    // 5. Category Satellites (Floating 3D Anchors with Natural Sector Spacing)
    // Distributed along natural distinct angular quadrants so they NEVER stack or overlap
    const topCategories = categories.slice(0, 5);
    const angularOffsets = [-2.35, -0.85, 0.45, 1.85, 3.15]; // Equi-spaced 5 sectors around orbit
    const nodeMeshes: { mesh: THREE.Mesh; cat: string; baseAngle: number; radius: number; speed: number; yOffset: number }[] = [];

    topCategories.forEach((cat, index) => {
      const ringDef = ringDefinitions[index % ringDefinitions.length];
      const radius = ringDef.radius + 0.15;
      const angle = angularOffsets[index % angularOffsets.length];

      const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const nodeColor = isDark ? cat.color : cat.color === "#00F0FF" ? "#0284C7" : cat.color;
      const nodeMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(nodeColor),
        transparent: true,
        opacity: isDark ? 0.85 : 0.95,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);

      // Subtle satellite beacon ring
      const beaconGeo = new THREE.RingGeometry(0.18, 0.22, 24);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(nodeColor),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isDark ? 0.45 : 0.35,
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
        speed: ringDef.speed * 0.9, // Gentle, slow satellite motion
        yOffset: index % 2 === 0 ? 0.2 : -0.2,
      });
    });
    nodeMeshesRef.current = nodeMeshes;

    // 6. Reduced Particle Field (~180 particles, 35% reduction from 320, subtle & non-distracting)
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(isDark ? "#00f0ff" : "#0284c7");
    const c2 = new THREE.Color(isDark ? "#8b5cf6" : "#7c3aed");
    const c3 = new THREE.Color(isDark ? "#3b82f6" : "#2563eb");

    for (let i = 0; i < particleCount; i++) {
      // Dispersed in deep spherical volume far behind and around orbit
      const r = 4.5 + Math.random() * 8.5;
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3] = r * Math.cos(theta);
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5.5 - 2.5;

      const mix = Math.random();
      const chosen = mix < 0.45 ? c1 : mix < 0.75 ? c2 : c3;
      colors[i * 3] = chosen.r;
      colors[i * 3 + 1] = chosen.g;
      colors[i * 3 + 2] = chosen.b;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.45 : 0.32,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // 7. Mouse Parallax with Soft Damping
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
    container.addEventListener("mousemove", handleMouseMove);

    // 8. Visibility change handling (pause RAF when page is inactive)
    let isVisible = true;
    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // 9. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        if (width > 0 && height > 0) {
          camera.aspect = width / height;
          if (width < 640) {
            camera.position.z = 16.5; // Wider field on mobile so elements never collide
          } else if (width < 1024) {
            camera.position.z = 13.8;
          } else {
            camera.position.z = 12.0;
          }
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });
    resizeObserver.observe(container);

    if (width < 640) {
      camera.position.z = 16.5;
    } else if (width < 1024) {
      camera.position.z = 13.8;
    } else {
      camera.position.z = 12.0;
    }
    camera.updateProjectionMatrix();

    // 10. Animation Loop (Smooth 60fps, slow, cinematic easing)
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();
      const motionMultiplier = isReducedMotion ? 0.05 : 1.0;

      // Mouse Parallax Lerp with smooth damping
      targetX += (mouseX * 0.9 - targetX) * 0.04;
      targetY += (mouseY * 0.6 - targetY) * 0.04;

      camera.position.x = targetX;
      camera.position.y = 2.8 + targetY;
      camera.lookAt(0, 0, 0);

      // Rotate Rings gently
      rings.forEach((ring, index) => {
        const speed = ringDefinitions[index].speed * motionMultiplier;
        ring.rotation.z += speed;
        ring.rotation.y += speed * 0.25;
      });

      // Subtle core breathing
      if (coreMesh) {
        const pulse = 1 + Math.sin(elapsedTime * 1.5) * 0.03;
        coreMesh.scale.set(pulse, pulse, pulse);
        coreMesh.rotation.y += 0.0015 * motionMultiplier;
      }
      if (coreGlowMesh) {
        const pulseGlow = 1 + Math.cos(elapsedTime * 1.8) * 0.04;
        coreGlowMesh.scale.set(pulseGlow, pulseGlow, pulseGlow);
        coreGlowMesh.rotation.y -= 0.002 * motionMultiplier;
      }

      // Rotate Particles slowly
      if (particles) {
        particles.rotation.y = elapsedTime * 0.008 * motionMultiplier;
        particles.rotation.x = Math.sin(elapsedTime * 0.006) * 0.02;
      }

      // 3D Satellites Projection to 2D UI with Non-overlapping Spacing
      const projectedList: ProjectedNode[] = [];
      const tempVector = new THREE.Vector3();

      nodeMeshes.forEach((item, idx) => {
        const currentAngle = item.baseAngle + elapsedTime * item.speed * motionMultiplier;
        const currentY = item.yOffset + Math.sin(elapsedTime * 1.2 + idx) * 0.18;

        const posX = Math.cos(currentAngle) * item.radius;
        const posZ = Math.sin(currentAngle) * (item.radius * 0.88);

        item.mesh.position.set(posX, currentY, posZ);

        tempVector.set(posX, currentY, posZ);
        tempVector.project(camera);

        const screenX = ((tempVector.x + 1) * width) / 2;
        const screenY = ((-tempVector.y + 1) * height) / 2;
        const isBehind = tempVector.z > 1.0;

        const catData = topCategories[idx];
        if (catData) {
          projectedList.push({
            id: catData.category,
            category: catData.category,
            amount: catData.amount,
            percentage: catData.percentage,
            color: catData.color,
            lightColor: catData.color === "#00F0FF" ? "#0284C7" : catData.color,
            x: screenX,
            y: screenY,
            visible: !isBehind && screenX > 25 && screenX < width - 25 && screenY > 25 && screenY < height - 25,
            scale: THREE.MathUtils.lerp(0.85, 1.02, (1 - tempVector.z) * 0.5),
          });
        }
      });

      setProjectedNodes(projectedList);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      resizeObserver.disconnect();

      coreGeometry.dispose();
      coreMaterial.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      rings.forEach((r) => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      nodeMeshes.forEach((n) => {
        n.mesh.geometry.dispose();
        (n.mesh.material as THREE.Material).dispose();
      });
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, [categories, isDark, isReducedMotion]);

  const outflowAmount = metrics.thisMonthOutflow > 0 ? metrics.thisMonthOutflow : 27000;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[520px] md:h-[580px] lg:h-[620px] rounded-3xl overflow-hidden flex items-center justify-center select-none"
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Subtle Radial Light Source behind the Core */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          isDark
            ? "bg-radial from-cyan-500/10 via-slate-950/20 to-transparent"
            : "bg-radial from-indigo-500/10 via-sky-500/5 to-transparent"
        }`}
        style={{
          background: isDark
            ? "radial-gradient(circle at center, rgba(0, 240, 255, 0.08) 0%, rgba(139, 92, 246, 0.04) 38%, transparent 70%)"
            : "radial-gradient(circle at center, rgba(2, 132, 199, 0.08) 0%, rgba(99, 102, 241, 0.05) 38%, transparent 70%)",
        }}
      />

      {/* Hero Badge Tag */}
      <div
        className={`absolute top-6 left-6 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md border text-xs font-mono tracking-wider transition-colors ${
          isDark
            ? "bg-slate-950/50 border-cyan-500/30 text-cyan-400"
            : "bg-white/80 border-slate-200 text-sky-700 shadow-sm"
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-reverse" />
        <span>SPENDWISE 3D SPATIAL ORBIT</span>
      </div>

      {/* Control Indicator */}
      <div
        className={`hidden sm:flex absolute top-6 right-6 z-20 items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-mono transition-colors ${
          isDark
            ? "bg-slate-950/50 border-white/10 text-slate-400"
            : "bg-white/80 border-slate-200 text-slate-600 shadow-sm"
        }`}
      >
        <OrbitIcon className="w-3.5 h-3.5 text-violet-400" />
        <span>Spatial Telemetry Active</span>
      </div>

      {/* ======================================================== */}
      {/* THE CENTRAL FINANCIAL CORE (FOCAL POINT)                 */}
      {/* ₹27,000 / OUTFLOW THIS MONTH / COMPARISON INDICATOR       */}
      {/* ======================================================== */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center pointer-events-auto">
        <div
          className={`relative p-8 md:p-10 rounded-full backdrop-blur-2xl border transition-all duration-500 shadow-2xl flex flex-col items-center justify-center ${
            isDark
              ? "bg-slate-950/85 border-cyan-500/40 shadow-glow-cyan"
              : "bg-white/95 border-slate-200 shadow-glass-light"
          }`}
          style={{ width: "232px", height: "232px" }}
        >
          {/* Subtle spinning accent ring behind the core */}
          <div
            className={`absolute -inset-2.5 rounded-full border border-dashed animate-orbit-rotate pointer-events-none transition-colors ${
              isDark ? "border-cyan-400/25" : "border-sky-500/30"
            }`}
          />
          <div
            className={`absolute -inset-5 rounded-full border animate-spin-reverse pointer-events-none transition-colors ${
              isDark ? "border-violet-500/20" : "border-indigo-400/20"
            }`}
          />

          {/* Subtitle / System Tag */}
          <span
            className={`text-[10px] uppercase font-mono tracking-widest mb-1 flex items-center gap-1.5 ${
              isDark ? "text-cyan-400" : "text-sky-700 font-bold"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full animate-ping ${
                isDark ? "bg-cyan-400" : "bg-sky-600"
              }`}
            />
            CORE OUTFLOW
          </span>

          {/* Dynamic Core Outflow Amount (₹27,000) - NEVER obscured */}
          <div className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white drop-shadow-sm my-0.5">
            {formatINR(outflowAmount)}
          </div>

          {/* Requested specific label: OUTFLOW THIS MONTH */}
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mt-1">
            OUTFLOW THIS MONTH
          </div>

          {/* Monthly Comparison Indicator */}
          <div
            className={`mt-2.5 flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
              isDark
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold"
            }`}
          >
            <span>
              {metrics.monthOverMonthGrowth <= 0 ? "↓" : "↑"}{" "}
              {Math.abs(metrics.monthOverMonthGrowth)}% vs last mo
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CATEGORY SATELLITES (SMALLER, ELEGANT, NON-OVERLAPPING) */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {projectedNodes.map((node) => {
          if (!node.visible) return null;
          const isHovered = activeCategory === node.category;

          return (
            <div
              key={node.id}
              className="absolute pointer-events-auto transition-transform duration-100 ease-out will-change-transform"
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                transform: `translate(-50%, -50%) scale(${node.scale * (isHovered ? 1.08 : 1)})`,
              }}
              onMouseEnter={() => setActiveCategory(node.category)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <div
                className={`relative px-3 py-1.5 rounded-xl backdrop-blur-md border transition-all duration-300 cursor-pointer shadow-md flex items-center gap-2 ${
                  isDark
                    ? "bg-slate-950/80 border-slate-800 hover:border-cyan-400 hover:shadow-glow-cyan"
                    : "bg-white/95 border-slate-200/90 hover:border-sky-500 hover:shadow-glass-light"
                }`}
              >
                {/* Category Indicator Dot */}
                <div
                  className="w-2 h-2 rounded-full ring-2 ring-white/20 animate-pulse flex-shrink-0"
                  style={{ backgroundColor: isDark ? node.color : node.lightColor }}
                />

                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {node.category}
                  </span>
                  <span className="text-xs font-extrabold font-mono text-slate-900 dark:text-white">
                    {formatINR(node.amount)}
                  </span>
                </div>

                {/* Percentage chip */}
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded ml-0.5 ${
                    isDark
                      ? "bg-slate-900/60 text-slate-300"
                      : "bg-slate-100 text-slate-700 font-semibold"
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
      <div className="absolute bottom-5 inset-x-6 z-20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-500 dark:text-slate-400 pointer-events-auto">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full inline-block animate-ping ${
                isDark ? "bg-cyan-400" : "bg-sky-500"
              }`}
            />
            <span>Orbit Synchronized ({categories.length} Satellites)</span>
          </span>
        </div>
        <Link
          href="/analytics"
          className={`flex items-center gap-1 transition-colors ${
            isDark ? "text-cyan-400 hover:text-cyan-300" : "text-sky-600 hover:text-sky-700 font-bold"
          }`}
        >
          <span>Deep Orbit Analytics</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
