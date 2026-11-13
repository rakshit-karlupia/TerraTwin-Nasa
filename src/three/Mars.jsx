import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import LocationMarker from './LocationMarker';
import { createMarsTexture, createBumpTexture } from '../utils/textureGenerator';
import { createAtmosphereMaterial } from './AtmosphereShader';
import { vector3ToLatLon } from '../utils/coordinates';

/**
 * Realistic 3D Mars Globe
 * Features:
 *  - Iron-oxide ochre basemap with dark albedo features (Syrtis Major, Acidalia)
 *  - Geological features: Olympus Mons elevation, Valles Marineris canyon rift
 *  - North & South perennial polar caps (H2O and CO2 frost)
 *  - Thin salmon-orange atmospheric dust haze shell
 *  - Mars research landing site markers
 *  - WebGL texture resource disposal
 */
export default function Mars({
  radius = 2.5,
  locations = [],
  selectedLocation = null,
  onLocationSelect,
  onCoordinateClick,
  autoRotate = false
}) {
  const marsRef = useRef();

  // Generate Martian procedural textures
  const { marsTex, bumpTex } = useMemo(() => ({
    marsTex: createMarsTexture(2048, 1024),
    bumpTex: createBumpTexture(1024, 512, 6)
  }), []);

  // Thin Martian salmon-orange atmospheric haze shader
  const atmosphereMaterial = useMemo(() => {
    return createAtmosphereMaterial('#ff7043', 0.52, 4.5);
  }, []);

  // Dispose textures on unmount to prevent WebGL memory leaks
  useEffect(() => {
    return () => {
      marsTex.dispose();
      bumpTex.dispose();
      atmosphereMaterial.dispose();
    };
  }, [marsTex, bumpTex, atmosphereMaterial]);

  useFrame((state, delta) => {
    if (autoRotate && marsRef.current) {
      marsRef.current.rotation.y += delta * 0.035;
    }
  });

  const handlePointerDown = (e) => {
    e.stopPropagation();
    if (onCoordinateClick && e.point) {
      const localPoint = marsRef.current ? marsRef.current.worldToLocal(e.point.clone()) : e.point;
      const coords = vector3ToLatLon(localPoint, radius);
      onCoordinateClick(coords);
    }
  };

  return (
    <group rotation={[0.440, 0, 0]}>
      {/* Primary Martian Sphere with realistic axial tilt (25.19°) */}
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
