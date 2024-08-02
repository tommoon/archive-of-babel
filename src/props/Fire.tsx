import React, { useRef } from 'react';
import { Points, PointMaterial, Point } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Color, Vector3 } from 'three';

// Define a type for the particles
interface Particle {
  key: number;
  position: Vector3;
  color: Color;
  size: number;
}

export const Fire: React.FC = () => {
  const numPoints = 40;
  const fireParticles = useRef<Particle[]>([]);

  // Initialize particles
  if (fireParticles.current.length === 0) {
    for (let i = 0; i < numPoints; i++) {
      fireParticles.current.push({
        key: i,
        position: new Vector3(Math.random() * 0.05, 0, Math.random() * 0.05),
        color: new Color(1, Math.random(), 0),
        size: 5
      });
    }
  }

  // Update particles position over time
  useFrame(() => {
    fireParticles.current.forEach(particle => {
      particle.position.y += 0.01; // Adjust speed of rising
      if (particle.position.y > 1) { // Reset position if it reaches height of 1
        particle.position.y = 0;
      }
    });
  });

  return (
    <Points position={[0, 0.5, 1.5]}>
      <PointMaterial
        sizeAttenuation={false}
        vertexColors
        size={5}
      />
      {fireParticles.current.map(particle => (
        <Point key={particle.key} position={particle.position} color={particle.color} size={particle.size} />
      ))}
    </Points>
  );
}
