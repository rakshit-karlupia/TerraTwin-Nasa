import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { latLonToVector3 } from '../utils/coordinates';

/**
 * CameraController smoothly animates camera position and lookAt target.
 * It uses spherical avoidance to ensure the camera gracefully orbits around
 * the globe rather than clipping through the planet's core.
 */
export default function CameraController({
  targetLocation,
  radius = 2.5,
  isResetting,
  onResetComplete
}) {
  const { camera, controls } = useThree();
  const animatingRef = useRef(false);
  const targetCamPosRef = useRef(new THREE.Vector3(0, 1.2, 6.5));
  const targetLookAtRef = useRef(new THREE.Vector3(0, 0, 0));

  // Default camera home position
  const homePos = new THREE.Vector3(0, 1.2, 6.5);
  const originLookAt = new THREE.Vector3(0, 0, 0);

  useEffect(() => {
    if (targetLocation) {
      // Calculate 3D surface position of the targeted coordinate
      const surfacePos = latLonToVector3(targetLocation.lat, targetLocation.lon, radius);
      
      // Position camera along the outward normal at 1.85x radius distance
      const camOffset = surfacePos.clone().normalize().multiplyScalar(radius * 1.85);
      
      targetCamPosRef.current.copy(camOffset);
      targetLookAtRef.current.copy(surfacePos);
      animatingRef.current = true;
    }
  }, [targetLocation, radius]);

  useEffect(() => {
    if (isResetting) {
      targetCamPosRef.current.copy(homePos);
      targetLookAtRef.current.copy(originLookAt);
      animatingRef.current = true;
    }
  }, [isResetting]);

  useFrame((state, delta) => {
    if (animatingRef.current) {
      // Smooth damp interpolation
      const step = Math.min(1.0, delta * 3.4);
      camera.position.lerp(targetCamPosRef.current, step);

      // Spherical floor: prevent camera from ever cutting below the surface
      const minAltitude = radius * 1.45;
      if (camera.position.length() < minAltitude) {
        camera.position.setLength(minAltitude);
      }

      if (controls) {
        controls.target.lerp(targetLookAtRef.current, step);
        controls.update();
      } else {
        camera.lookAt(targetLookAtRef.current);
      }

      // Check if animation has settled close to destination
      if (
        camera.position.distanceTo(targetCamPosRef.current) < 0.04 &&
        (!controls || controls.target.distanceTo(targetLookAtRef.current) < 0.04)
      ) {
        animatingRef.current = false;
        if (isResetting && onResetComplete) {
          onResetComplete();
        }
      }
    }
  });

  return null;
}
