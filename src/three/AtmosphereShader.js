import * as THREE from 'three';

/**
 * Custom GLSL Fresnel Atmospheric Glow Shader
 * Produces realistic atmospheric scattering and soft rim illumination
 */
export function createAtmosphereMaterial(color = '#00f2fe', coefficient = 0.5, power = 4.2) {
  const c = new THREE.Color(color);

  return new THREE.ShaderMaterial({
    uniforms: {
      color: { value: c },
      viewVector: { value: new THREE.Vector3(0, 0, 1) },
      coefficient: { value: coefficient },
      power: { value: power }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float coefficient;
      uniform float power;
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vPosition);
        float intensity = pow(coefficient - dot(normal, viewDir), power);
        intensity = clamp(intensity, 0.0, 1.0);
        gl_FragColor = vec4(color, intensity * 0.95);
      }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false
  });
}
