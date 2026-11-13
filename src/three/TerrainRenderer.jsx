import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Layers, Activity, Maximize2 } from 'lucide-react';
import { generateRegionDEM } from '../utils/demProcessor';

// Hypsometric & Slope Color Map Converters
function getElevationColor(normalizedH, mode = 'elevation') {
  const c = new THREE.Color();
  if (mode === 'shadedRelief') {
    c.setRGB(normalizedH * 0.9 + 0.1, normalizedH * 0.9 + 0.1, normalizedH * 0.9 + 0.1);
    return c;
  }
  if (mode === 'slope') {
    // Green (0-10° gentle) -> Yellow (10-25° moderate) -> Red (>25° steep cliff)
    if (normalizedH < 0.25) c.setHSL(0.33, 0.9, 0.45);
    else if (normalizedH < 0.55) c.setHSL(0.14, 0.9, 0.5);
    else c.setHSL(0.0, 0.9, 0.5);
    return c;
  }
  // NASA Standard Planetary Hypsometric Palette
  if (normalizedH < 0.18) c.setRGB(0.08, 0.15, 0.55); // Deep basin/trench
  else if (normalizedH < 0.42) c.setRGB(0.10, 0.55, 0.68); // Lowland
  else if (normalizedH < 0.68) c.setRGB(0.18, 0.75, 0.38); // Midland plateau
  else if (normalizedH < 0.86) c.setRGB(0.88, 0.65, 0.22); // Ridge/escarpment
  else c.setRGB(0.96, 0.96, 0.99); // Summit peak
  return c;
}

function TerrainMesh({ demData, renderMode, wireframe = false, onProbePoint }) {
  const meshRef = useRef();
  const { gridSize, elevations, minElev, maxElev } = demData;

  const { geometry } = useMemo(() => {
    const geom = new THREE.PlaneGeometry(14, 14, gridSize - 1, gridSize - 1);
    const pos = geom.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    const elevRange = Math.max(1, maxElev - minElev);
    const verticalScale = 3.2 / elevRange; // Standardized vertical exaggeration factor

    for (let i = 0; i < pos.count; i++) {
      const elev = elevations[i] || minElev;
      const normalizedH = Math.max(0, Math.min(1, (elev - minElev) / elevRange));

      // Displace along plane normal
      pos.setZ(i, (elev - minElev) * verticalScale);

      // Vertex color assignment
      const c = getElevationColor(normalizedH, renderMode);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geom.computeVertexNormals();
    return { geometry: geom };
  }, [demData, renderMode, gridSize, minElev, maxElev]);

  // Dispose buffer geometry when component unmounts
  useEffect(() => {
    return () => {
      if (geometry) geometry.dispose();
    };
  }, [geometry]);

  const handlePointerDown = (e) => {
    e.stopPropagation();
    if (e.point && onProbePoint) {
      const verticalScale = 3.2 / (maxElev - minElev);
      const probedElev = Math.round(minElev + (e.point.y / verticalScale));
      onProbePoint({
        x: Number(e.point.x.toFixed(2)),
        y: Number(e.point.z.toFixed(2)),
        elevationM: probedElev,
        slopeDeg: Math.round(Math.abs(e.point.y) * 8.5)
      });
    }
  };

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerDown={handlePointerDown}
      receiveShadow
      castShadow
    >
      <meshStandardMaterial
        vertexColors
        roughness={0.72}
        metalness={0.12}
        side={THREE.DoubleSide}
        wireframe={wireframe}
      />
    </mesh>
  );
}

export default function TerrainRenderer({
  regionId = 'lunar-shackleton',
  renderMode = 'elevation',
  wireframe = false,
  onProbePoint,
  className = "w-full h-full"
}) {
  const demData = useMemo(() => generateRegionDEM(regionId, 128), [regionId]);

  return (
    <div className={`relative ${className} select-none overflow-hidden bg-space-950`}>
      <Canvas
        camera={{ position: [0, 9, 12], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} color="#0d182b" />
        <directionalLight
          position={[10, 15, 8]}
          intensity={2.2}
          color="#fff5e6"
          castShadow
        />
        <directionalLight
          position={[-10, 8, -8]}
          intensity={0.3}
          color="#00f2fe"
        />

        <TerrainMesh
          demData={demData}
          renderMode={renderMode}
          wireframe={wireframe}
          onProbePoint={onProbePoint}
        />

        <OrbitControls
          enableRotate={true}
          enableZoom={true}
          enablePan={true}
          minDistance={4}
          maxDistance={32}
          maxPolarAngle={Math.PI / 2 - 0.05}
          dampingFactor={0.08}
        />
      </Canvas>

      {/* Floating Elevation Colormap Legend Overlay */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <div className="glass-panel p-3 rounded-xl border border-cyan-500/25 text-xs font-mono space-y-1.5 shadow-xl">
          <div className="flex items-center justify-between space-x-3 text-[10px] uppercase text-cyan-400">
            <span>{demData.label}</span>
          </div>
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="text-slate-400">{demData.minElev} m</span>
            <div className="w-24 h-2.5 rounded-full bg-gradient-to-r from-blue-700 via-emerald-500 to-amber-200 border border-slate-700" />
            <span className="text-slate-200 font-bold">+{demData.maxElev} m</span>
          </div>
          <div className="text-[9px] text-slate-500">
            Grid: {demData.gridSize}×{demData.gridSize} samples • Relief: {demData.maxElev - demData.minElev} m
          </div>
        </div>
      </div>
    </div>
  );
}
