import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uTexture;
uniform sampler2D uDepthMap;
uniform vec2 uMouse;
uniform float uVelo;
varying vec2 vUv;

void main() {
  vec4 depthDistortion = texture2D(uDepthMap, vUv);
  float parallaxMult = depthDistortion.r;
  
  // Base mouse displacement
  vec2 parallax = uMouse * parallaxMult * 0.05;
  
  // Calculate final UV
  vec2 distortedUv = vUv + parallax;
  
  // Clamp to avoid edge wrap
  distortedUv.x = clamp(distortedUv.x, 0.0, 1.0);
  distortedUv.y = clamp(distortedUv.y, 0.0, 1.0);
  
  gl_FragColor = texture2D(uTexture, distortedUv);
}
`;

function Scene({ mouseRef }: { mouseRef: React.MutableRefObject<{ x: number, y: number }> }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const [texture, depthMap] = useTexture([
    '/black_white.webp',
    '/Depth_map.webp'
  ]);

  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uDepthMap: { value: depthMap },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uVelo: { value: 0 },
    }),
    [texture, depthMap]
  );

  // Animate mouse uniform smoothly
  const targetMouse = useRef(new THREE.Vector2(0, 0));
  const currentMouse = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    if (materialRef.current) {
      // Mouse comes in as -1 to 1 based on window
      targetMouse.current.set(mouseRef.current.x, -mouseRef.current.y);
      
      // Smooth interpolation
      currentMouse.current.lerp(targetMouse.current, 0.05);
      
      materialRef.current.uniforms.uMouse.value = currentMouse.current;
    }
  });

  // Calculate size to fill screen while maintaining aspect ratio
  const imageAspect = texture.image.width / texture.image.height;
  const viewportAspect = viewport.width / viewport.height;
  
  let scaleX = viewport.width;
  let scaleY = viewport.height;
  
  // Cover logic (like object-fit: cover)
  // We scale the plane slightly larger (e.g. 1.05) so the edges don't show when displacing
  const coverScale = 1.06;

  if (imageAspect > viewportAspect) {
    scaleX = viewport.height * imageAspect * coverScale;
    scaleY = viewport.height * coverScale;
  } else {
    scaleX = viewport.width * coverScale;
    scaleY = (viewport.width / imageAspect) * coverScale;
  }

  return (
    <mesh scale={[scaleX, scaleY, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

interface PaintingCanvasProps {
  mouseRef: React.MutableRefObject<{ x: number, y: number }>;
}

export default function PaintingCanvas({ mouseRef }: PaintingCanvasProps) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }}>
        <Scene mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
}
