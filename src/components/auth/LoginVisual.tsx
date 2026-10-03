"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/context/ThemeContext";

interface LoginVisualProps {
  focusedField: "email" | "password" | null;
  isSuccessTransition: boolean;
}

export default function LoginVisual({
  focusedField,
  isSuccessTransition,
}: LoginVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDark } = useTheme();

  const sceneRef = useRef<THREE.Scene | null>(null);
  const coreRef = useRef<THREE.Mesh | null>(null);
  const coreGlowRef = useRef<THREE.Mesh | null>(null);
  const ring1Ref = useRef<THREE.Mesh | null>(null);
  const ring2Ref = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  // Store transition state in refs so the RAF loop can access updated props smoothly
  const stateRef = useRef({
    focusedField,
    isSuccessTransition,
    isDark,
  });

  useEffect(() => {
    stateRef.current = {
      focusedField,
      isSuccessTransition,
      isDark,
    };
  }, [focusedField, isSuccessTransition, isDark]);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 10.5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 1. Single Central Futuristic Core
    const coreGeo = new THREE.SphereGeometry(1.3, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x18d9ff : 0x00afcf,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.3 : 0.4,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);
    coreRef.current = coreMesh;

    // Inner Luminous Core
    const innerGeo = new THREE.IcosahedronGeometry(0.85, 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x8b5cf6 : 0x7657e8,
      transparent: true,
      opacity: isDark ? 0.38 : 0.35,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);
    coreGlowRef.current = innerMesh;

    // 2. Exactly 1–2 Thin Orbital Rings
    const ring1Geo = new THREE.TorusGeometry(3.0, 0.006, 16, 120);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x18d9ff : 0x00afcf,
      transparent: true,
      opacity: isDark ? 0.35 : 0.55,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = 1.15;
    ring1.rotation.y = 0.2;
    scene.add(ring1);
    ring1Ref.current = ring1;

    const ring2Geo = new THREE.TorusGeometry(4.2, 0.005, 16, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x2684ff : 0x1677ff,
      transparent: true,
      opacity: isDark ? 0.28 : 0.45,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = 0.85;
    ring2.rotation.y = -0.35;
    scene.add(ring2);
    ring2Ref.current = ring2;

    // 3. Very Small Particle Field (~40 particles, subtle & calm)
    const particleCount = 40;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cyanCol = new THREE.Color(isDark ? "#18D9FF" : "#00AFCF");
    const blueCol = new THREE.Color(isDark ? "#2684FF" : "#1677FF");

    for (let i = 0; i < particleCount; i++) {
      const r = 3 + Math.random() * 5.5;
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3] = r * Math.cos(theta);
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3 - 1.5;

      const c = Math.random() > 0.5 ? cyanCol : blueCol;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.35 : 0.25,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // 4. Subtle Cursor Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        if (width > 0 && height > 0) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let currentScale = 1;
    let ringSpeedMultiplier = 1;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const { focusedField, isSuccessTransition } = stateRef.current;

      // Cursor Parallax Interpolation
      targetX += (mouseX * 0.7 - targetX) * 0.04;
      targetY += (mouseY * 0.5 - targetY) * 0.04;

      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(0, 0, 0);

      // Handle Success Transition:
      // 1. Core expands slightly
      // 2. Orbital rings accelerate briefly
      // 3. Glow increases
      if (isSuccessTransition) {
        currentScale += (1.4 - currentScale) * 0.08;
        ringSpeedMultiplier += (8.0 - ringSpeedMultiplier) * 0.08;
      } else {
        currentScale += (1.0 - currentScale) * 0.05;
        ringSpeedMultiplier += (1.0 - ringSpeedMultiplier) * 0.05;
      }

      // Rotate Rings smoothly
      ring1.rotation.z += 0.0016 * ringSpeedMultiplier;
      ring1.rotation.y += 0.0006 * ringSpeedMultiplier;

      ring2.rotation.z -= 0.0012 * ringSpeedMultiplier;
      ring2.rotation.x += 0.0004 * ringSpeedMultiplier;

      // Base breathing motion
      const breathing = Math.sin(elapsedTime * 1.6) * 0.03;
      const targetCoreScale = (1 + breathing) * currentScale;

      // Focused Field response:
      // Email focus: core gently brightens with cyan glow
      // Password focus: core shifts with violet aura
      if (focusedField === "email") {
        coreMesh.scale.set(targetCoreScale * 1.08, targetCoreScale * 1.08, targetCoreScale * 1.08);
        coreMat.opacity = isDark ? 0.6 : 0.75;
        innerMat.opacity = isDark ? 0.35 : 0.3;
      } else if (focusedField === "password") {
        coreMesh.scale.set(targetCoreScale * 1.05, targetCoreScale * 1.05, targetCoreScale * 1.05);
        coreMat.opacity = isDark ? 0.3 : 0.4;
        innerMat.opacity = isDark ? 0.7 : 0.75; // Enhanced violet inner glow
      } else {
        coreMesh.scale.set(targetCoreScale, targetCoreScale, targetCoreScale);
        coreMat.opacity = isDark ? 0.35 : 0.45;
        innerMat.opacity = isDark ? 0.45 : 0.4;
      }

      innerMesh.scale.set(targetCoreScale * 0.95, targetCoreScale * 0.95, targetCoreScale * 0.95);
      coreMesh.rotation.y += 0.0015 * ringSpeedMultiplier;
      innerMesh.rotation.y -= 0.0025 * ringSpeedMultiplier;

      // Particles subtle motion
      if (particles) {
        particles.rotation.y = elapsedTime * 0.006 * ringSpeedMultiplier;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();

      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380px] sm:h-[460px] lg:h-[580px] flex items-center justify-center select-none"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full pointer-events-none z-10"
      />

      {/* Atmospheric Radial Backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(circle at center, rgba(0, 240, 255, 0.09) 0%, rgba(139, 92, 246, 0.04) 40%, transparent 70%)"
            : "radial-gradient(circle at center, rgba(2, 132, 199, 0.1) 0%, rgba(99, 102, 241, 0.05) 40%, transparent 70%)",
        }}
      />
    </div>
  );
}
