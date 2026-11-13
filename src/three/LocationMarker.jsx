import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { latLonToVector3, formatCoordinates } from '../utils/coordinates';

export default function LocationMarker({
  location,
  radius = 2.5,
  color = '#00f2fe',
  onClick,
  isSelected = false,
  similarity = null
}) {
  const meshRef = useRef();
  const ringRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Compute 3D position slightly above planetary surface
  const pos = latLonToVector3(location.lat, location.lon, radius + 0.04);
  
  // Compute normal vector pointing directly away from sphere center
  const normal = pos.clone().normalize();
  const markerQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 1.5;
      const s = 1.0 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
      ringRef.current.scale.set(s, s, s);
    }
  });

  const markerColor = similarity != null
    ? similarity >= 75 ? '#10b981' : similarity >= 55 ? '#06b6d4' : '#f59e0b'
    : color;

  return (
    <group position={pos} quaternion={markerQuat}>
      {/* Central Marker Pin */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick && onClick(location);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[isSelected ? 0.045 : 0.035, 16, 16]} />
        <meshStandardMaterial
          color={markerColor}
          emissive={markerColor}
          emissiveIntensity={isSelected || hovered ? 2.5 : 1.2}
          roughness={0.2}
        />
      </mesh>

      {/* Pulsing Target Ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.045, 0.065, 32]} />
        <meshBasicMaterial
          color={markerColor}
          side={THREE.DoubleSide}
          transparent
          opacity={isSelected || hovered ? 0.9 : 0.5}
        />
      </mesh>

      {/* Information HUD on Hover or Selected */}
      {(hovered || isSelected) && (
        <Html
          position={[0, 0.12, 0]}
          center
          distanceFactor={6}
          style={{ pointerEvents: 'none' }}
        >
          <div className="glass-panel px-3 py-1.5 rounded-md border border-cyan-400/40 shadow-glow-cyan text-xs whitespace-nowrap z-50">
            <div className="flex items-center space-x-1.5 font-bold text-slate-100">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: markerColor }} />
              <span>{location.name}</span>
            </div>
            <div className="text-[10px] text-cyan-300 font-mono mt-0.5">
              {formatCoordinates(location.lat, location.lon)}
            </div>
            {similarity != null && (
              <div className="text-[10px] font-semibold text-emerald-400 font-mono mt-0.5">
                Similarity: {similarity}%
              </div>
            )}
            {location.elevationM !== undefined && (
              <div className="text-[10px] text-slate-400 font-mono">
                Elev: {location.elevationM > 0 ? `+${location.elevationM}` : location.elevationM} m
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
