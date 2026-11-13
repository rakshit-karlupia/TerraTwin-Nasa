import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Earth from './Earth';
import Moon from './Moon';
import Mars from './Mars';
import Starfield from './Starfield';
import CameraController from './CameraController';

export default function PlanetaryScene({
  activePlanet = 'earth',
  locations = [],
  selectedLocation = null,
  onLocationSelect,
  onCoordinateClick,
  analogScores = {},
  autoRotate = false,
  isResetting = false,
  onResetComplete,
  className = "w-full h-full"
}) {
  const controlsRef = useRef();

  return (
    <div className={`relative ${className} select-none overflow-hidden bg-space-950`}>
      <Canvas
        camera={{ position: [0, 1.2, 6.5], fov: 45, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          {/* Deep Space Starfield */}
          <Starfield count={2600} radius={85} />

          {/* Planetary Solar System Lighting */}
          <ambientLight intensity={0.4} color="#0c172a" />
          <directionalLight
            position={[12, 6, 10]}
            intensity={2.4}
            color="#fff8e7"
            castShadow
          />
          {/* Subtle opposite side rim light */}
          <directionalLight
            position={[-10, -5, -10]}
            intensity={0.25}
            color="#00f2fe"
          />

          {/* Active Planet Rendering */}
          {activePlanet === 'earth' && (
            <Earth
              locations={locations}
              selectedLocation={selectedLocation}
              onLocationSelect={onLocationSelect}
              onCoordinateClick={onCoordinateClick}
              analogScores={analogScores}
              autoRotate={autoRotate}
            />
          )}

          {activePlanet === 'moon' && (
            <Moon
              locations={locations}
              selectedLocation={selectedLocation}
              onLocationSelect={onLocationSelect}
              onCoordinateClick={onCoordinateClick}
              autoRotate={autoRotate}
            />
          )}

          {activePlanet === 'mars' && (
            <Mars
              locations={locations}
              selectedLocation={selectedLocation}
              onLocationSelect={onLocationSelect}
              onCoordinateClick={onCoordinateClick}
              autoRotate={autoRotate}
            />
          )}

          {/* Camera Interpolator with Spherical Avoidance */}
          <CameraController
            targetLocation={selectedLocation}
            radius={2.5}
            isResetting={isResetting}
            onResetComplete={onResetComplete}
          />

          {/* Standard Orbit Controls */}
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3.2}
            maxDistance={18.0}
            rotateSpeed={0.65}
            zoomSpeed={0.8}
            dampingFactor={0.08}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
