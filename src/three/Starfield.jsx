import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Starfield({ count = 2500, radius = 90 }) {
  const pointsRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    // Astronomical star palette
    const palette = [
      new THREE.Color('#ffffff'), // Class A (White)
      new THREE.Color('#d0e6ff'), // Class B (Blue-white)
      new THREE.Color('#9bb0ff'), // Class O (Electric blue)
      new THREE.Color('#fff4e8'), // Class F (Warm white)
      new THREE.Color('#ffd2a1'), // Class G/K (Yellow-orange)
    ];

    for (let i = 0; i < count; i++) {
      // Uniform point distribution on sphere shell
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = radius + (Math.random() - 0.5) * 15;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      const brightness = 0.5 + Math.random() * 0.5;
      col[i * 3] = color.r * brightness;
      col[i * 3 + 1] = color.g * brightness;
      col[i * 3 + 2] = color.b * brightness;
    }

    return [pos, col];
  }, [count, radius]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.002;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.1}
        vertexColors
        transparent
        opacity={0.88}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
