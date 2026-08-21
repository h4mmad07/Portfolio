import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function AvatarModel({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  
  let gltf: any = null;
  try {
    gltf = useGLTF('/models/character.glb');
  } catch (e) {
    // Handled by fallback
  }

  useFrame((state, delta) => {
    if (groupRef.current) {
      const targetRotationY = (mousePosition.x * 0.4);
      const targetRotationX = (-mousePosition.y * 0.2);
      
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetRotationY,
        4,
        delta
      );
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetRotationX,
        4,
        delta
      );
    }
  });

  if (gltf && gltf.scene) {
    return (
      <group ref={groupRef} position={[0, -1.8, 0]} scale={2.2}>
        <primitive object={gltf.scene} />
      </group>
    );
  }

  return <TechArtifact mousePosition={mousePosition} />;
}

function TechArtifact({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const midRingRef = useRef<THREE.Mesh>(null);
  const innerSphereRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x += delta * 0.5;
      outerRingRef.current.rotation.y += delta * 0.7;
    }
    if (midRingRef.current) {
      midRingRef.current.rotation.y -= delta * 0.6;
      midRingRef.current.rotation.z += delta * 0.4;
    }
    if (innerSphereRef.current) {
      innerSphereRef.current.rotation.y += delta * 0.8;
      innerSphereRef.current.position.x = THREE.MathUtils.damp(
        innerSphereRef.current.position.x,
        mousePosition.x * 0.5,
        3,
        delta
      );
      innerSphereRef.current.position.y = THREE.MathUtils.damp(
        innerSphereRef.current.position.y,
        -mousePosition.y * 0.5,
        3,
        delta
      );
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <Float speed={2.5} rotationIntensity={1} floatIntensity={1.5}>
        <Sphere ref={innerSphereRef} args={[1.2, 64, 64]} scale={1}>
          <MeshDistortMaterial
            color="#00f2fe"
            attach="material"
            distort={0.4}
            speed={2.5}
            roughness={0.15}
            metalness={0.8}
            wireframe={false}
          />
        </Sphere>
      </Float>

      <Torus ref={outerRingRef} args={[2.0, 0.04, 16, 100]}>
        <meshStandardMaterial
          color="#8a2be2"
          emissive="#8a2be2"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.9}
        />
      </Torus>

      <Torus ref={midRingRef} args={[1.6, 0.03, 16, 100]} rotation={[Math.PI / 3, 0, 0]}>
        <meshStandardMaterial
          color="#00ffcc"
          emissive="#00ffcc"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.9}
        />
      </Torus>

      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 2.4;
        return (
          <Float key={i} speed={3 + i * 0.5} floatIntensity={2}>
            <mesh position={[Math.cos(angle) * radius, Math.sin(angle) * radius, (i % 2 === 0 ? 0.6 : -0.6)]}>
              <boxGeometry args={[0.15, 0.15, 0.15]} />
              <meshStandardMaterial color="#4facfe" emissive="#00f2fe" emissiveIntensity={0.8} />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

export const Hero3DCanvas: React.FC = () => {
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setMousePos({ x, y });
  };

  return (
    <div 
      className="relative w-full h-[400px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden border border-white/10 bg-surface/40 backdrop-blur-xl shadow-[0_0_50px_rgba(0,242,254,0.08)]"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 bg-radial-gradient from-accent-cyan/10 via-accent-purple/5 to-transparent pointer-events-none" />
      
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-surface-light/80 border border-white/10 text-xs font-mono text-cyan-400">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>3D_INTERACTIVE_CORE</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 text-[11px] font-mono text-muted/60 pointer-events-none">
        [MOUSE_ORBIT_ENABLED]
      </div>

      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#00f2fe" />
        <pointLight position={[-10, -10, -5]} intensity={1.2} color="#8a2be2" />
        <pointLight position={[0, 5, 2]} intensity={2.0} color="#ffffff" />
        
        <Suspense fallback={null}>
          <AvatarModel mousePosition={mousePos} />
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          maxPolarAngle={Math.PI / 1.8} 
          minPolarAngle={Math.PI / 2.3}
          maxAzimuthAngle={Math.PI / 4}
          minAzimuthAngle={-Math.PI / 4}
        />
      </Canvas>
    </div>
  );
};
