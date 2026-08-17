import { transparentMaterial } from "@/lib/materials";
import { PerspectiveCamera, Plane } from "@react-three/drei";
import { Euler } from "three";
import { ThreeEvent } from "@react-three/fiber";

const handleClick = (e: ThreeEvent<MouseEvent>) => {
  e.stopPropagation();
};

export const Camera: React.FC<{ initialRotation: Euler, fov: number }> = ({ initialRotation, fov }) => <PerspectiveCamera
      fov={fov}
      rotation={initialRotation}
      makeDefault>
      <Plane
        onPointerOver={handleClick}
        onPointerOut={handleClick}
        onClick={handleClick}
        args={[0.5, 0.5]}
        position={[0, 0, -1]}
        material={transparentMaterial}
      />
    </PerspectiveCamera>
