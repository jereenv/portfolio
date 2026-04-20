"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { NetworkGraph } from "./network-graph";

function Particles({ count = 350 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c1 = new THREE.Color("#22d3ee");
    const c2 = new THREE.Color("#a855f7");

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 36;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
      const c = c1.clone().lerp(c2, Math.random());
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.015;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.008) * 0.08;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.07}
        transparent
        opacity={0.85}
        vertexColors
        sizeAttenuation
      />
    </points>
  );
}

function Shape({
  position,
  scale,
  colorHex,
  speed,
  seedOffset,
  detail = 1,
}: {
  position: [number, number, number];
  scale: number;
  colorHex: string;
  speed: number;
  seedOffset: number;
  detail?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + seedOffset;
    ref.current.rotation.x = t * 0.45;
    ref.current.rotation.y = t * 0.3;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.9}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, detail]} />
        <meshStandardMaterial
          color={colorHex}
          wireframe
          transparent
          opacity={0.55}
          emissive={colorHex}
          emissiveIntensity={1.2}
        />
      </mesh>
    </Float>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    camera.position.x += (mouse.current.x * 1.6 - camera.position.x) * 0.03;
    camera.position.y += (mouse.current.y * 1.0 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[8, 8, 4]} color="#22d3ee" intensity={4} />
      <pointLight position={[-8, -4, -6]} color="#a855f7" intensity={3} />
      <pointLight position={[0, 0, 6]} color="#ffffff" intensity={0.6} />

      <Particles count={400} />

      <NetworkGraph />

      <Shape position={[8, 3, -5]} scale={0.9} colorHex="#22d3ee" speed={0.18} seedOffset={0} detail={0} />
      <Shape position={[-8, -2.5, -5]} scale={0.8} colorHex="#a855f7" speed={0.14} seedOffset={2} detail={0} />

      <Sparkles count={100} scale={36} size={2.5} speed={0.25} color="#22d3ee" opacity={0.25} />

      <CameraRig />
    </>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 55 }}
      dpr={[1, 1.5]}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene />
    </Canvas>
  );
}
