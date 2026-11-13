import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { latLonToVector3 } from '../utils/coordinates';

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
      // Calculate 3D position of target location
      const surfacePos = latLonToVector3(targetLocation.lat, targetLocation.lon, radius);
      
      // Position camera along the vector pointing out from the sphere
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
      const step = Math.min(1.0, delta * 3.2);
      camera.position.lerp(targetCamPosRef.current, step);

      if (controls) {
        controls.target.lerp(targetLookAtRef.current, step);
        controls.update();
      } else {
        camera.lookAt(targetLookAtRef.current);
      }

      // Check if animation has settled
      if (camera.position.distanceTo(targetCamPosRef.current) < 0.05) {
        animatingRef.current = false;
        if (isResetting && onResetComplete) {
          onResetComplete();
        }
      }
    }
  });

  return null;
}
