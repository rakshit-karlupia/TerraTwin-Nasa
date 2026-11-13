import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import LocationMarker from './LocationMarker';
import { createMoonTexture, createBumpTexture, createScientificLayerTexture } from '../utils/textureGenerator';
import { createAtmosphereMaterial } from './AtmosphereShader';
import { vector3ToLatLon } from '../utils/coordinates';

/**
 * Realistic 3D Lunar Globe
 * Features:
 *  - Lunar Highlands anorthositic crust & Basaltic Maria plains
 *  - High-relief crater rims and South Pole Aitken basin
 *  - Scientific data overlays (elevation, slope, thermal, water-ice, roughness)
 *  - Subtle exosphere scattering rim
 *  - Artemis candidate landing site markers
 *  - WebGL texture resource disposal
 */
export default function Moon({
  radius = 2.5,
  locations = [],
  selectedLocation = null,
  onLocationSelect,
  onCoordinateClick,
  autoRotate = false,
  activeLayer = 'natural',
  layerOpacity = 0.85
}) {
  const moonRef = useRef();

  // Generate Lunar procedural textures
  const { moonTex, bumpTex } = useMemo(() => ({
    moonTex: createMoonTexture(2048, 1024),
    bumpTex: createBumpTexture(1024, 512, 6)
  }), []);

  // Generate scientific overlay if active
  const scientificTex = useMemo(() => {
    if (activeLayer === 'natural') return null;
    return createScientificLayerTexture('moon', activeLayer, 1024, 512);
  }, [activeLayer]);

  // Subtle lunar exosphere rim shader
  const atmosphereMaterial = useMemo(() => {
    return createAtmosphereMaterial('#b0c4de', 0.45, 5.5);
  }, []);

  // Dispose textures on unmount to prevent WebGL memory leaks
  useEffect(() => {
    return () => {
      moonTex.dispose();
      bumpTex.dispose();
      atmosphereMaterial.dispose();
      if (scientificTex) scientificTex.dispose();
    };
  }, [moonTex, bumpTex, atmosphereMaterial, scientificTex]);

  useFrame((state, delta) => {
    if (autoRotate && moonRef.current) {
      moonRef.current.rotation.y += delta * 0.02;
    }
  });

  const handlePointerDown = (e) => {
    e.stopPropagation();
    if (onCoordinateClick && e.point) {
      const localPoint = moonRef.current ? moonRef.current.worldToLocal(e.point.clone()) : e.point;
      const coords = vector3ToLatLon(localPoint, radius);
      onCoordinateClick(coords);
    }
  };

  return (
    <group rotation={[0.027, 0, 0]}>
      {/* Primary Lunar Sphere with subtle lunar axial tilt (1.54°) */}
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

        {/* Scientific Thematic Layer Overlay */}
        {scientificTex && (
          <mesh>
            <sphereGeometry args={[radius * 1.002, 64, 64]} />
            <meshStandardMaterial
              map={scientificTex}
              transparent
              opacity={layerOpacity}
              blending={THREE.NormalBlending}
              depthWrite={false}
            />
          </mesh>
        )}

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
