import { transparentMaterial } from "@/lib/materials";
import { PerspectiveCamera, Plane } from "@react-three/drei";
import { Euler, Vector3 } from "three";

const handleClick = (e: any) => {
  e.stopPropagation();
};

export const cameraForard = new Vector3()

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
