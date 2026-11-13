import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import Starfield from '../three/Starfield';
import Earth from '../three/Earth';
import Moon from '../three/Moon';
import Mars from '../three/Mars';

function SunMesh() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial color="#ffaa00" />
      </mesh>
      {/* Sun Glow Corona */}
      <mesh>
        <sphereGeometry args={[2.3, 32, 32]} />
        <meshBasicMaterial color="#ffdd44" transparent opacity={0.35} />
      </mesh>
      <pointLight intensity={3.5} distance={150} color="#fff6e5" />
    </group>
  );
}

function OrbitPath({ radius, color = '#00f2fe' }) {
  const lineGeom = React.useMemo(() => {
    const points = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * 2 * Math.PI;
      points.push(new THREE.Vector3(radius * Math.cos(theta), 0, radius * Math.sin(theta)));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [radius]);

  return (
    <line geometry={lineGeom}>
      <lineBasicMaterial color={color} transparent opacity={0.25} />
    </line>
  );
}

function RevolvingBody({ radius, speed, children, onClick, label }) {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    if (groupRef.current) {
      groupRef.current.position.x = radius * Math.cos(t);
      groupRef.current.position.z = radius * Math.sin(t);
    }
  });

  return (
    <group ref={groupRef} onClick={onClick}>
      {children}
      {label && (
        <Html position={[0, 1.8, 0]} center distanceFactor={20} style={{ pointerEvents: 'none' }}>
          <div className="glass-panel px-2.5 py-1 rounded text-[11px] font-mono text-cyan-300 whitespace-nowrap border border-cyan-400/40">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function Universe({ setActivePlanet, setView }) {
  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-space-950 overflow-hidden select-none">
      {/* Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 22, 32], fov: 45 }}>
          <Suspense fallback={null}>
            <Starfield count={3000} radius={120} />
            <ambientLight intensity={0.2} color="#0d182b" />

            {/* Central Sun */}
            <SunMesh />

            {/* Earth & Moon Orbit */}
            <OrbitPath radius={12} color="#4facfe" />
            <RevolvingBody
              radius={12}
              speed={0.12}
              label="Earth (Click to Explore)"
              onClick={() => {
                setActivePlanet('earth');
                setView('explorer');
              }}
            >
              <group scale={[0.45, 0.45, 0.45]}>
                <Earth autoRotate={true} />
              </group>
            </RevolvingBody>

            {/* Mars Orbit */}
            <OrbitPath radius={18} color="#ff5e3a" />
            <RevolvingBody
              radius={18}
              speed={0.07}
              label="Mars (Click to Explore)"
              onClick={() => {
                setActivePlanet('mars');
                setView('explorer');
              }}
            >
              <group scale={[0.35, 0.35, 0.35]}>
                <Mars autoRotate={true} />
              </group>
            </RevolvingBody>

            <OrbitControls
              enableRotate={true}
              enableZoom={true}
              enablePan={true}
              minDistance={10}
              maxDistance={75}
              dampingFactor={0.08}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Top Left HUD */}
      <div className="absolute top-6 left-6 z-30 pointer-events-auto max-w-sm space-y-2">
        <div className="glass-panel p-4 rounded-xl border border-cyan-500/30">
          <div className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider">
            Macro Scale // Orbital View
          </div>
          <h2 className="text-2xl font-bold font-display text-white mt-0.5">
            3D Planetary Universe
          </h2>
          <p className="text-xs text-slate-300 font-sans mt-1 leading-relaxed">
            Interactive solar system view. Click any orbiting body to transition directly into high-resolution surface exploration.
          </p>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs font-mono">
            <button
              onClick={() => {
                setActivePlanet('earth');
                setView('explorer');
              }}
              className="py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-black font-bold border border-cyan-500/40 shadow-glow-cyan transition-all"
            >
              🌍 Earth
            </button>
            <button
              onClick={() => {
                setActivePlanet('moon');
                setView('explorer');
              }}
              className="py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-200 text-slate-300 hover:text-black font-bold border border-slate-500/40 shadow-glow-lunar transition-all"
            >
              🌕 Moon
            </button>
            <button
              onClick={() => {
                setActivePlanet('mars');
                setView('explorer');
              }}
              className="py-1.5 rounded-lg bg-red-950/50 hover:bg-red-600 text-red-300 hover:text-white font-bold border border-red-500/40 shadow-glow-mars transition-all"
            >
              🔴 Mars
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
