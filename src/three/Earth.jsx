import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import LocationMarker from './LocationMarker';
import { createEarthDayTexture, createEarthNightTexture, createEarthCloudsTexture, createBumpTexture } from '../utils/textureGenerator';
import { createAtmosphereMaterial } from './AtmosphereShader';
import { vector3ToLatLon } from '../utils/coordinates';

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

  // Generate HD textures
  const { dayTex, nightTex, cloudsTex, bumpTex } = useMemo(() => ({
    dayTex: createEarthDayTexture(2048, 1024),
    nightTex: createEarthNightTexture(1024, 512),
    cloudsTex: createEarthCloudsTexture(1024, 512),
    bumpTex: createBumpTexture(1024, 512, 5)
  }), []);

  // Atmospheric Glow Shader
  const atmosphereMaterial = useMemo(() => {
    return createAtmosphereMaterial('#00d2ff', 0.55, 3.8);
  }, []);

  useFrame((state, delta) => {
    if (autoRotate && earthRef.current) {
      earthRef.current.rotation.y += delta * 0.04;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.055; // Clouds drift slightly faster than planet
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
      {/* Primary Earth Sphere */}
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

      {/* Cloud Layer */}
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
