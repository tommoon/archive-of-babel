import { Plane, useGLTF } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import paintingModel from '@/assets/models/Painting.glb'
import { useCellHex } from "@/hooks/useCellHex";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { CellHex, Orientation } from "@/types/CommonTypes";
import { generatePainting } from "@/lib/randomFunctions";
import { useCallback, useMemo } from "react";
import { gameController, setScreenLocked } from "@/Controllers/gameController";

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
    const { setPainting, setImage } = gameController()
  const texture = useMemo(() =>  generatePainting(cellHex, orientation), [cellHex, orientation])
  
  const canvasTexture = useMemo(() => {
    if(!texture) return
    return new THREE.CanvasTexture(texture);

  }, [texture])
  
  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (texture) {
        setPainting(orientation);
        setImage(texture);
        setScreenLocked(true);
      }
    },
    // `texture` is keyed on cellHex, so it must be a dependency: without it the
    // handler keeps a stale canvas and opens the previous cell's painting.
    [orientation, texture, setPainting, setImage],
  );

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
        onClick={handleClick}
          name="painting"
          material={new THREE.MeshBasicMaterial({ map: canvasTexture })}
          rotation={[0, 0, 0]}  // Plane is facing up (towards positive Y)
          position={[-5.5, 0.6, -1.38]}
          args={[0.5, 0.65]}         // Size of the plane
      >
        </Plane>
      </group>
    );
};
  
useGLTF.preload(paintingModel);
