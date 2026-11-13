import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import LocationMarker from './LocationMarker';
import { createEarthDayTexture, createEarthNightTexture, createEarthCloudsTexture, createBumpTexture } from '../utils/textureGenerator';
import { createAtmosphereMaterial } from './AtmosphereShader';
import { vector3ToLatLon } from '../utils/coordinates';

/**
 * Realistic 3D Earth Globe
 * Features:
 *  - High-definition day & night city lights
 *  - Dynamic clouds layer drifting with atmospheric circulation
 *  - GLSL Rayleigh scattering atmospheric glow shell
 *  - Real geodetic location markers
 *  - Proper disposal of WebGL textures on unmount
 */
export default function Earth({
  radius = 2.5,
  locations = [],
  selectedLocation = null,
  onLocationSelect,
  onCoordinateClick,
  analogScores = {},
  autoRotate = false
}) {
  const earthRef = useRef();
  const cloudsRef = useRef();

  // Generate procedural HD textures
  const { dayTex, nightTex, cloudsTex, bumpTex } = useMemo(() => ({
    dayTex: createEarthDayTexture(2048, 1024),
    nightTex: createEarthNightTexture(1024, 512),
    cloudsTex: createEarthCloudsTexture(1024, 512),
    bumpTex: createBumpTexture(1024, 512, 5)
  }), []);

  // Atmospheric Scattering Shader
  const atmosphereMaterial = useMemo(() => {
    return createAtmosphereMaterial('#00d2ff', 0.55, 3.8);
  }, []);

  // Dispose textures and materials on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      dayTex.dispose();
      nightTex.dispose();
      cloudsTex.dispose();
      bumpTex.dispose();
      atmosphereMaterial.dispose();
    };
  }, [dayTex, nightTex, cloudsTex, bumpTex, atmosphereMaterial]);

  useFrame((state, delta) => {
    if (autoRotate && earthRef.current) {
      earthRef.current.rotation.y += delta * 0.04;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.055; // Atmospheric drift
    }
  });

  const handlePointerDown = (e) => {
    e.stopPropagation();
    if (onCoordinateClick && e.point) {
      // Compensate for group rotation or local position
      const localPoint = earthRef.current ? earthRef.current.worldToLocal(e.point.clone()) : e.point;
      const coords = vector3ToLatLon(localPoint, radius);
      onCoordinateClick(coords);
    }
  };

  return (
    <group rotation={[0.409, 0, 0]}>
      {/* Primary Earth Sphere with realistic axial tilt (23.4°) */}
      <mesh
        ref={earthRef}
        onPointerDown={handlePointerDown}
      >
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={dayTex}
          bumpMap={bumpTex}
          bumpScale={0.035}
          roughness={0.65}
          metalness={0.1}
          emissiveMap={nightTex}
          emissive={new THREE.Color('#ffc107')}
          emissiveIntensity={0.25}
        />

        {/* Location Markers for Earth Analogs */}
        {locations.map((loc) => {
          const sim = analogScores[loc.id] !== undefined ? analogScores[loc.id] : null;
          return (
            <LocationMarker
              key={loc.id}
              location={loc}
              radius={radius}
              color="#00f2fe"
              similarity={sim}
              isSelected={selectedLocation?.id === loc.id}
              onClick={onLocationSelect}
            />
          );
        })}
      </mesh>

      {/* Cloud Layer drifting around planet */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[radius + 0.025, 48, 48]} />
        <meshStandardMaterial
          map={cloudsTex}
          transparent
          opacity={0.85}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Atmospheric Scattering Glow Shell */}
      <mesh material={atmosphereMaterial}>
        <sphereGeometry args={[radius * 1.15, 48, 48]} />
      </mesh>
    </group>
  );
}
