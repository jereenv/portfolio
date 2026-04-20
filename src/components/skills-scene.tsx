"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";

export interface Skill {
  label: string;
  category: "lang" | "infra" | "data" | "frontend";
}

const CATEGORY_STYLES: Record<Skill["category"], { border: string; bg: string; text: string; glow: string }> = {
  lang: {
    border: "border-cyan-500/40",
    bg: "bg-cyan-500/10",
    text: "text-cyan-200",
    glow: "shadow-[0_0_14px_-4px_rgba(34,211,238,0.7)]",
  },
  infra: {
    border: "border-purple-500/40",
    bg: "bg-purple-500/10",
    text: "text-purple-200",
    glow: "shadow-[0_0_14px_-4px_rgba(168,85,247,0.7)]",
  },
  data: {
    border: "border-pink-500/40",
    bg: "bg-pink-500/10",
    text: "text-pink-200",
    glow: "shadow-[0_0_14px_-4px_rgba(236,72,153,0.7)]",
  },
  frontend: {
    border: "border-amber-500/40",
    bg: "bg-amber-500/10",
    text: "text-amber-200",
    glow: "shadow-[0_0_14px_-4px_rgba(245,158,11,0.7)]",
  },
};

function SkillSphere({ skills }: { skills: readonly Skill[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const radius = 3.2;

  const positions = useMemo(() => {
    const n = skills.length;
    return skills.map((_, i) => {
      const phi = Math.acos(-1 + (2 * i) / n);
      const theta = Math.sqrt(n * Math.PI) * phi;
      return [
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi),
      ] as [number, number, number];
    });
  }, [skills]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.18;
    groupRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.1) * 0.25;
  });

  return (
    <group ref={groupRef}>
      {/* Wireframe core sphere */}
      <mesh>
        <sphereGeometry args={[radius, 24, 16]} />
        <meshBasicMaterial
          color="#22d3ee"
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>

      {skills.map((skill, i) => {
        const s = CATEGORY_STYLES[skill.category];
        return (
          <Html
            key={skill.label}
            position={positions[i]}
            center
            distanceFactor={8}
            zIndexRange={[10, 0]}
          >
            <div
              className={cn(
                "pointer-events-none select-none whitespace-nowrap rounded-full border px-3 py-1 text-sm font-medium backdrop-blur-sm",
                s.border,
                s.bg,
                s.text,
                s.glow
              )}
            >
              {skill.label}
            </div>
          </Html>
        );
      })}
    </group>
  );
}

export function SkillsScene({ skills }: { skills: readonly Skill[] }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 50 }}
      dpr={[1, 1.5]}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} color="#22d3ee" intensity={2} />
      <pointLight position={[-5, -5, 5]} color="#a855f7" intensity={1.5} />
      <SkillSphere skills={skills} />
    </Canvas>
  );
}
