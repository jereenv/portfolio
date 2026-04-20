"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Node {
  pos: THREE.Vector3;
  isHub: boolean;
}

interface Edge {
  a: number;
  b: number;
}

interface Packet {
  edgeIdx: number;
  phase: number;
  speed: number;
  color: THREE.Color;
}

// Seeded RNG so the layout is consistent across renders
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function NetworkGraph() {
  const groupRef = useRef<THREE.Group>(null);
  const packetsRef = useRef<(THREE.Mesh | null)[]>([]);
  const edgesGeomRef = useRef<THREE.BufferGeometry>(null);

  const { nodes, edges, packets, edgePositions } = useMemo(() => {
    const rand = mulberry32(42);
    const nodes: Node[] = [];
    const nodeCount = 22;

    // Distribute nodes in a rough ellipsoid
    for (let i = 0; i < nodeCount; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const r = 3 + rand() * 1.8;
      nodes.push({
        pos: new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta) * 1.2,
          r * Math.sin(phi) * Math.sin(theta) * 0.85,
          r * Math.cos(phi) * 0.9
        ),
        isHub: i < 4, // first 4 are "hub" nodes, rendered larger
      });
    }

    // Build edges: each node connects to its 2-3 nearest neighbors
    const edgeSet = new Set<string>();
    const edges: Edge[] = [];
    nodes.forEach((node, i) => {
      const dists = nodes
        .map((n, j) => ({ j, d: node.pos.distanceTo(n.pos) }))
        .filter((x) => x.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, nodes[i].isHub ? 5 : 3);

      dists.forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edges.push({ a: Math.min(i, j), b: Math.max(i, j) });
        }
      });
    });

    // Flat positions array for the edge LineSegments
    const edgePositions = new Float32Array(edges.length * 2 * 3);
    edges.forEach((e, i) => {
      const a = nodes[e.a].pos;
      const b = nodes[e.b].pos;
      edgePositions[i * 6 + 0] = a.x;
      edgePositions[i * 6 + 1] = a.y;
      edgePositions[i * 6 + 2] = a.z;
      edgePositions[i * 6 + 3] = b.x;
      edgePositions[i * 6 + 4] = b.y;
      edgePositions[i * 6 + 5] = b.z;
    });

    // One packet per edge, some edges get a second packet
    const cyan = new THREE.Color("#22d3ee");
    const purple = new THREE.Color("#a855f7");
    const pink = new THREE.Color("#ec4899");
    const palette = [cyan, cyan, purple, pink];

    const packets: Packet[] = [];
    edges.forEach((_, i) => {
      packets.push({
        edgeIdx: i,
        phase: rand(),
        speed: 0.15 + rand() * 0.25,
        color: palette[Math.floor(rand() * palette.length)],
      });
      if (rand() > 0.5) {
        packets.push({
          edgeIdx: i,
          phase: rand(),
          speed: 0.15 + rand() * 0.25,
          color: palette[Math.floor(rand() * palette.length)],
        });
      }
    });

    return { nodes, edges, packets, edgePositions };
  }, []);

  useFrame((state, delta) => {
    // Slow group rotation
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
      groupRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.12) * 0.1;
    }

    // Animate packets along their edges
    packets.forEach((p, i) => {
      const mesh = packetsRef.current[i];
      if (!mesh) return;
      p.phase += delta * p.speed;
      if (p.phase > 1) p.phase -= 1;

      const edge = edges[p.edgeIdx];
      const a = nodes[edge.a].pos;
      const b = nodes[edge.b].pos;

      // Ping-pong: 0→1 goes a→b, 1→0 goes b→a
      const t = p.phase < 0.5 ? p.phase * 2 : (1 - p.phase) * 2;
      mesh.position.lerpVectors(a, b, t);
    });
  });

  return (
    <group ref={groupRef}>
      {/* Edges */}
      <lineSegments>
        <bufferGeometry ref={edgesGeomRef}>
          <bufferAttribute
            attach="attributes-position"
            count={edgePositions.length / 3}
            array={edgePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.28}
          linewidth={1}
        />
      </lineSegments>

      {/* Nodes */}
      {nodes.map((node, i) => (
        <mesh key={`n-${i}`} position={node.pos}>
          <sphereGeometry args={[node.isHub ? 0.18 : 0.1, 16, 16]} />
          <meshStandardMaterial
            color={node.isHub ? "#a855f7" : "#22d3ee"}
            emissive={node.isHub ? "#a855f7" : "#22d3ee"}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Packets flowing along edges */}
      {packets.map((p, i) => (
        <mesh
          key={`p-${i}`}
          ref={(el) => {
            packetsRef.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color={p.color} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
