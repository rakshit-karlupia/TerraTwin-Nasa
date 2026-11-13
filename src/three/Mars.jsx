import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import LocationMarker from './LocationMarker';
import { createMarsTexture, createBumpTexture } from '../utils/textureGenerator';
import { createAtmosphereMaterial } from './AtmosphereShader';
import { vector3ToLatLon } from '../utils/coordinates';

export default function Mars({
  radius = 2.5,
  locations = [],
  selectedLocation = null,
  onLocationSelect,
  onCoordinateClick,
  autoRotate = false
}) {
  const marsRef = useRef();

  // Generate Martian textures
  const { marsTex, bumpTex } = useMemo(() => ({
    marsTex: createMarsTexture(2048, 1024),
    bumpTex: createBumpTexture(1024, 512, 6)
  }), []);

  // Thin Martian salmon-orange atmospheric haze shader
  const atmosphereMaterial = useMemo(() => {
    return createAtmosphereMaterial('#ff7043', 0.52, 4.5);
  }, []);

  useFrame((state, delta) => {
    if (autoRotate && marsRef.current) {
      marsRef.current.rotation.y += delta * 0.035;
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
      {/* Primary Martian Sphere */}
      <mesh
        ref={marsRef}
        onPointerDown={handlePointerDown}
      >
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={marsTex}
          bumpMap={bumpTex}
          bumpScale={0.045}
          roughness={0.88}
          metalness={0.08}
        />

        {/* Mars Exploration Zones Markers */}
        {locations.map((loc) => (
          <LocationMarker
            key={loc.id}
            location={loc}
            radius={radius}
            color="#ff5e3a"
            isSelected={selectedLocation?.id === loc.id}
            onClick={onLocationSelect}
          />
        ))}
      </mesh>

      {/* Thin Atmospheric Dust / Gas Haze Shell */}
      <mesh material={atmosphereMaterial}>
        <sphereGeometry args={[radius * 1.11, 48, 48]} />
      </mesh>
    </group>
  );
}
