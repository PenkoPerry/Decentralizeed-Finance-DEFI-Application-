import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars, Text } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

function CryptoSphere({ position, color, scale = 1, symbol }: { position: [number, number, number]; color: string; scale?: number; symbol: string }) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
    if (textRef.current) {
      textRef.current.lookAt(0, 0, 5);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group>
        <Sphere ref={sphereRef} args={[1, 64, 64]} scale={scale}>
          <MeshDistortMaterial
            color={color}
            attach="material"
            distort={0.4}
            speed={1.5}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
        <Text
          ref={textRef}
          position={[0, -1.5 * scale, 0]}
          fontSize={0.5 * scale}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {symbol}
        </Text>
      </group>
    </Float>
  );
}

function BlockchainNetwork() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <CryptoSphere position={[-4, 2, 0]} color="#3B82F6" scale={1.2} symbol="ETH" />
      <CryptoSphere position={[4, -2, 2]} color="#10B981" scale={0.8} symbol="USDC" />
      <CryptoSphere position={[0, 3, -2]} color="#F59E0B" scale={1} symbol="BTC" />
      <CryptoSphere position={[-2, -3, 1]} color="#8B5CF6" scale={0.9} symbol="USDT" />
      
      {/* Add connecting lines between spheres */}
      <group>
        <mesh>
          <tubeGeometry args={[
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(-4, 2, 0),
              new THREE.Vector3(4, -2, 2),
              new THREE.Vector3(0, 3, -2),
              new THREE.Vector3(-2, -3, 1),
            ]),
            64,
            0.05,
            8,
            false
          ]} />
          <meshStandardMaterial
            color="#4B5563"
            transparent
            opacity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>
    </group>
  );
}

export function Background3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <BlockchainNetwork />
        <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        
        {/* Add volumetric light effects */}
        <fog attach="fog" args={['#0F172A', 5, 20]} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/50 to-gray-900/90" />
    </div>
  );
}