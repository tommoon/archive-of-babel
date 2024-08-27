import { Plane, useGLTF } from "@react-three/drei";
import paintingModel from '@/assets/models/Painting.glb'
import { useCellHex } from "@/hooks/useCellHex";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { CellHex, Orientation } from "@/types/CommonTypes";
import { generatePainting } from "@/lib/randomFunctions";
import { useMemo } from "react";

type GLTFResult = GLTF & {
  nodes: {
    frame: THREE.Mesh
    painting: THREE.Mesh
  }
  materials: {
    oldwood: THREE.MeshPhysicalMaterial
  }
}

type BooksProps = {
  cellHex: CellHex;
  orientation: Orientation;
};

export const Painting: React.FC<BooksProps> = ({ cellHex, orientation }) => {
    const { nodes, materials } = useGLTF(paintingModel) as GLTFResult;
    const { adjustedPosition } = useCellHex({ cellHex });
    
  const texture = useMemo(() => {
    const canvas = generatePainting(cellHex, orientation);
    if(!canvas) return
    return new THREE.CanvasTexture(canvas);
   }, [cellHex, orientation])
  
  
  return (
    <group
      rotation={[0, ['N', 'S'].includes(orientation) ? Math.PI / 2 : 0, 0]}
      scale={[['N', 'W'].includes(orientation) ? -1 : 1, 1, 1]}
      position={adjustedPosition}>
        <mesh
          name="frame"
          geometry={nodes.frame.geometry}
          material={materials.oldwood}
          scale={[0.5,1,0.7]}
          position={[-5.5, 0.6, -1.38]}
          rotation={[Math.PI/2, 0, 0]}
        >
        
        </mesh>
        <Plane
          name="painting"
          material={new THREE.MeshBasicMaterial({ map: texture })}
          rotation={[0, 0, 0]}  // Plane is facing up (towards positive Y)
          position={[-5.5, 0.6, -1.38]}
          args={[0.5, 0.65]}         // Size of the plane
        />
      </group>
    );
};
  
useGLTF.preload(paintingModel);
