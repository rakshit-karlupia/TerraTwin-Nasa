import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { generateRegionDEM, computeSlopeGrid } from '../utils/demProcessor';

// Color map converters
function getElevationColor(normalizedH, mode = 'elevation') {
  const c = new THREE.Color();
  if (mode === 'shadedRelief') {
    c.setRGB(normalizedH, normalizedH, normalizedH);
    return c;
  }
  if (mode === 'slope') {
    // Green (gentle) to Yellow (moderate) to Red (steep)
    if (normalizedH < 0.25) c.setHSL(0.33, 0.9, 0.45); // Green
    else if (normalizedH < 0.55) c.setHSL(0.14, 0.9, 0.5); // Yellow
    else c.setHSL(0.0, 0.9, 0.5); // Red
    return c;
  }
  // Standard Hypsometric Rainbow / Viridis
  if (normalizedH < 0.2) c.setRGB(0.1, 0.15, 0.5);
  else if (normalizedH < 0.45) c.setRGB(0.1, 0.55, 0.65);
  else if (normalizedH < 0.7) c.setRGB(0.2, 0.75, 0.35);
  else if (normalizedH < 0.88) c.setRGB(0.85, 0.65, 0.2);
  else c.setRGB(0.95, 0.95, 0.98);
  return c;
}

function TerrainMesh({ demData, renderMode, onProbePoint }) {
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
      
      // Displace Z along plane normal
      pos.setZ(i, (elev - minElev) * verticalScale);

      // Color mapping
      const c = getElevationColor(normalizedH, renderMode);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geom.computeVertexNormals();
    return { geometry: geom };
  }, [demData, renderMode, gridSize, minElev, maxElev]);

  const handlePointerDown = (e) => {
    e.stopPropagation();
    if (e.point && onProbePoint) {
      // Approximate probed elevation from world point Z
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
        roughness={0.75}
        metalness={0.15}
        side={THREE.DoubleSide}
        wireframe={false}
      />
    </mesh>
  );
}

export default function TerrainRenderer({
  regionId = 'lunar-shackleton',
  renderMode = 'elevation',
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
          onProbePoint={onProbePoint}
        />

        <OrbitControls
          enableRotate={true}
          enableZoom={true}
          enablePan={true}
          minDistance={4}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2 - 0.05}
          dampingFactor={0.08}
        />
      </Canvas>
    </div>
  );
}
