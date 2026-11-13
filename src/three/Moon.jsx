import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import LocationMarker from './LocationMarker';
import { createMoonTexture, createBumpTexture } from '../utils/textureGenerator';
import { createAtmosphereMaterial } from './AtmosphereShader';
import { vector3ToLatLon } from '../utils/coordinates';

export default function Moon({
  radius = 2.5,
  locations = [],
  selectedLocation = null,
  onLocationSelect,
  onCoordinateClick,
  autoRotate = false
}) {
  const moonRef = useRef();

  // Generate Lunar textures
  const { moonTex, bumpTex } = useMemo(() => ({
    moonTex: createMoonTexture(2048, 1024),
    bumpTex: createBumpTexture(1024, 512, 6)
  }), []);

  // Subtle lunar exosphere rim shader
  const atmosphereMaterial = useMemo(() => {
    return createAtmosphereMaterial('#b0c4de', 0.45, 5.5);
  }, []);

  useFrame((state, delta) => {
    if (autoRotate && moonRef.current) {
      moonRef.current.rotation.y += delta * 0.02;
    }
  });

  const handlePointerDown = (e) => {
    e.stopPropagation();
    if (onCoordinateClick && e.point) {
      const coords = vector3ToLatLon(e.point, radius);
      onCoordinateClick(coords);
    }
  };

  return (
    <group>
      {/* Primary Lunar Sphere */}
      <mesh
        ref={moonRef}
        onPointerDown={handlePointerDown}
      >
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={moonTex}
          bumpMap={bumpTex}
          bumpScale={0.05}
          roughness={0.92}
          metalness={0.05}
        />

        {/* Lunar Candidate Regions Markers */}
        {locations.map((loc) => (
          <LocationMarker
            key={loc.id}
            location={loc}
            radius={radius}
            color="#90caf9"
            isSelected={selectedLocation?.id === loc.id}
            onClick={onLocationSelect}
          />
        ))}
      </mesh>

      {/* Subtle Lunar Exosphere Glow */}
      <mesh material={atmosphereMaterial}>
        <sphereGeometry args={[radius * 1.08, 48, 48]} />
      </mesh>
    </group>
  );
}
