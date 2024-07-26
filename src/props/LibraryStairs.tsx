import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { Box, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { RigidBody } from "@react-three/rapier";
import { CellHex, Orientation } from "@/types/CommonTypes";
import { gameController } from "@/Controllers/gameController";
import { playerPos } from "../Screen/Game/components/Player/Player";
import { useCellHex } from "../hooks/useCellHex";
import { transparentMaterial } from "@/lib/utils";
import { base32Add, base32Subtract } from "@/lib/base32Utils";
import { adjustments } from "@/lib/positions";
import LibraryStairsModel from '@/assets/models/LibraryStairsNew-transformed.glb'
import LibraryStairsColliders from '@/assets/models/LibraryStairsNewColliders-transformed.glb'
import { optionsController } from "@/Controllers/optionsController";

type GLTFResult = GLTF & {
  nodes: {
    floor2: THREE.Mesh;
    ramp: THREE.Mesh;
    lightGem004: THREE.Mesh;
    object1063: THREE.Mesh;
    object2008: THREE.Mesh;
    object1093: THREE.Mesh;
    object1093_1: THREE.Mesh;
    stairs: THREE.Mesh;
  };
  materials: {
    fresnelGlow: THREE.MeshStandardMaterial;
    ["floor.003"]: THREE.MeshStandardMaterial;
    ["oldwood.004"]: THREE.MeshStandardMaterial;
    Wall: THREE.MeshStandardMaterial;
    sandTrim: THREE.MeshStandardMaterial;
    floor: THREE.MeshStandardMaterial;
  };
  animations: any[];
};

type LibraryStairsProps = {
  cellHex: CellHex;
  orientation: Orientation;
};

export const LibraryStairs: React.FC<LibraryStairsProps> = ({
  cellHex,
  orientation,
}) => {
  const { nodes, materials } = useGLTF(
    LibraryStairsModel,
  ) as GLTFResult;
  const { nodes: colliders, materials: colliderMat } = useGLTF(
    LibraryStairsColliders,
  ) as GLTFResult;

  const { cellHex: playerCellHex, setCellHex: setPlayerPosition } = gameController();
  const staircaseRef = useRef<THREE.Group>(null);
  const { dynamicLights } = optionsController();

  const { adjustedPosition } = useCellHex({
    cellHex,
    addition: adjustments[orientation]
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (staircaseRef.current) {
        const wholeBoundingBox = new THREE.Box3().setFromObject(
          staircaseRef.current,
        );
        const upstairsBBox = wholeBoundingBox
          .clone()
          .setFromObject(staircaseRef.current);
        upstairsBBox.min.y = upstairsBBox.max.y - 3.3;

        const downstairsBBox = wholeBoundingBox
          .clone()
          .setFromObject(staircaseRef.current);
        downstairsBBox.max.y = downstairsBBox.min.y + 2;

        const upstairs = upstairsBBox.containsPoint(playerPos);
        const downstairs = downstairsBBox.containsPoint(playerPos);
        if (upstairs) {
          setPlayerPosition({ ...playerCellHex, y: base32Add(playerCellHex.y, '1') });
        }
        if (downstairs) {
          setPlayerPosition({ ...playerCellHex, y: base32Subtract(playerCellHex.y, '1') });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cellHex, setPlayerPosition, cellHex]);

  return (
    <group
      rotation={new THREE.Euler(0, !["N", "S"].includes(orientation) ? -Math.PI / 2 : 0, 0)}
      position={adjustedPosition}
      ref={staircaseRef}
    >
                {dynamicLights && (
        <>
                  <pointLight
          color={"#ebf5fe"}
          position={[-1, 1.7, 0]}
          distance={20}
          intensity={2}
          /> 
                         <pointLight
          color={"#ebf5fe"}
          position={[-4, 1.7, 0]}
          distance={20}
          intensity={2}
          /> 
        </>
      )}
      {[0, 2, 4].map((floor) => (
        <group key={`stair-${floor}`} position={[0, floor, 0]} dispose={null}>
          <RigidBody
            key={`stair-${cellHex.x}-${base32Add(playerCellHex.y, '1')}-${cellHex.z}-rigidbody`}
            type="fixed"
            colliders="trimesh"
          >
            <Box scale={[2.1, 2, 1.1]} position={[-2.5, 0, 0]} />
            <mesh
              name="floor2"
              geometry={colliders.floor2.geometry}
              material={colliderMat.floor}
              position={[-1, 0.1, -1]}
              rotation={[Math.PI / 2, 0, Math.PI]}
            />
            <mesh
              name="ramp"
              geometry={colliders.ramp.geometry}
              material={transparentMaterial}
              position={[-2, -1.9, -1]}
              rotation={[Math.PI / 2, 0, Math.PI / 2]}
            />
          </RigidBody>
          <mesh
            name="lightGem004"
            geometry={nodes.lightGem004.geometry}
            material={materials.fresnelGlow}
            position={[-0.756, -0.311, -0.001]}
            rotation={[Math.PI / 2, -1.384, Math.PI / 2]}
            scale={10}
          />
          <mesh
            name="object1063"
            geometry={nodes.object1063.geometry}
            material={materials["floor.003"]}
            position={[-0.867, -0.643, -0.001]}
            rotation={[Math.PI / 2, 0, Math.PI / 2]}
            scale={0.5}
          />
          <mesh
            name="object2008"
            geometry={nodes.object2008.geometry}
            material={materials["oldwood.004"]}
            position={[-0.867, -0.643, -0.001]}
            rotation={[Math.PI / 2, 0, Math.PI / 2]}
            scale={0.5}
          />
          <group
            name="upperwALL"
            position={[-5, -0.9, 0]}
            rotation={[Math.PI / 2, 0, -Math.PI / 2]}
          >
            <mesh
              name="object1093"
              geometry={nodes.object1093.geometry}
              material={materials.Wall}
            />
            <mesh
              name="object1093_1"
              geometry={nodes.object1093_1.geometry}
              material={materials.sandTrim}
            />
          </group>
          <mesh
            name="stairs"
            geometry={nodes.stairs.geometry}
            material={materials.floor}
            position={[-2, -1.9, -1]}
            rotation={[Math.PI / 2, 0, Math.PI / 2]}
          />
        </group>
      ))}
    </group>
  );
};

useGLTF.preload(LibraryStairsModel);
useGLTF.preload(LibraryStairsColliders);
