import { transparentMaterial } from "@/lib/utils";
import { PerspectiveCamera, Plane } from "@react-three/drei";

const handleClick = (e: any) => {
  e.stopPropagation();
};

export const Camera = () => {
  // Create a transparent material

  return (
    <PerspectiveCamera makeDefault>
      <Plane
        onPointerOver={handleClick}
        onPointerOut={handleClick}
        onClick={handleClick}
        args={[0.5, 0.5]}
        position={[0, 0, -1]}
        material={transparentMaterial}
      />
    </PerspectiveCamera>
  );
};
