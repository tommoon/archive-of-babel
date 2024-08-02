import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { Box, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { RigidBody } from "@react-three/rapier";
import { CellHex, Orientation } from "@/types/CommonTypes";
import { gameController } from "@/Controllers/gameController";
import { playerPos } from "../Screen/Game/components/Player/Player";
import { useCellHex } from "../hooks/useCellHex";
import { transparentMaterial } from "@/lib/materials";
import { base32Add, base32Subtract } from "@/lib/base32Utils";
import { adjustments } from "@/lib/positions";
import LibraryStairsModel from '@/assets/models/Stairs-transformed.glb'
import LibraryStairsColliders from '@/assets/models/LibraryStairsNewColliders-transformed.glb'
import { optionsController } from "@/Controllers/optionsController";

type GLTFResult = GLTF & {
  nodes: {
    ramp: any;
    stairs: THREE.Mesh
    floor2: THREE.Mesh
    lightGem001: THREE.Mesh
    object1002: THREE.Mesh
    object2004: THREE.Mesh
    DETAILS: THREE.Mesh
    upperwALL: THREE.Mesh
    upperwALL003: THREE.Mesh
  }
  materials: {
    stairsStairs: THREE.MeshBasicMaterial
    stairsFloor: THREE.MeshBasicMaterial
    ['fresnelGlow.004']: THREE.MeshStandardMaterial
    ['floor.001']: THREE.MeshStandardMaterial
    oldwood: THREE.MeshStandardMaterial
    stairsDetail: THREE.MeshBasicMaterial
    wallStairsOuter: THREE.MeshBasicMaterial
    wallStairsInner: THREE.MeshBasicMaterial
  }
}

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
  const { nodes: colliders } = useGLTF(
    LibraryStairsColliders,
  ) as GLTFResult;

  const { setCellHex: setPlayerPosition } = gameController();
  const staircaseRef = useRef<THREE.Group>(null);

  const upstairsHex = { ...cellHex, y: base32Add(cellHex.y, '1') }
  const downstairsHex = { ...cellHex, y: base32Subtract(cellHex.y, '1') }

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
          setPlayerPosition(upstairsHex);
        }
        if (downstairs) {
          setPlayerPosition(downstairsHex);
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
      {[downstairsHex, cellHex, upstairsHex].map((hex, index) => (
        <group key={`stair-${hex.x}-${hex.y}-${hex.z}`} position={[0, index * 2, 0]} dispose={null}>
          <RigidBody
            key={`stair-${hex.x}-${hex.y}-${hex.z}-rigidbody`}
            type="fixed"
            colliders="trimesh"
          >
            <Box material={transparentMaterial} scale={[2.1, 2, 1.1]} position={[-2.5, 0, 0]} />
            <mesh
              name="floor2"
              geometry={nodes.floor2.geometry}
              material={materials.stairsFloor}
              position={[-1.84, -0.25274, -0.045]}
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
            name="lightGem001"
            geometry={nodes.lightGem001.geometry}
            material={materials['fresnelGlow.004']}
            position={[-0.75, -0.311, -0.001]}
            rotation={[Math.PI / 2, -1.384, Math.PI / 2]}
            scale={10}
          />
          <mesh
            name="object1002"
            geometry={nodes.object1002.geometry}
            material={materials["floor.001"]}
            position={[-0.867, -0.643, -0.001]}
            rotation={[Math.PI / 2, 0, Math.PI / 2]}
            scale={0.5}
          />
          <mesh
            name="object2004"
            geometry={nodes.object2004.geometry}
            material={materials.oldwood}
            position={[-0.867, -0.643, -0.001]}
            rotation={[Math.PI / 2, 0, Math.PI / 2]}
            scale={0.5}
          />
          <group
            position={[-5, -0.9, 0]}
            rotation={[Math.PI / 2, 0, -Math.PI / 2]}
          >
            <mesh
              name="upperwALL"
              geometry={nodes.upperwALL.geometry}
              material={materials.wallStairsOuter}
            />
            <mesh
              name="upperwALL003"
              geometry={nodes.upperwALL003.geometry}
              material={materials.wallStairsInner}
            />
            <mesh
              name="DETAILS"
              geometry={nodes.DETAILS.geometry}
              material={materials.stairsDetail}
            />
          </group>
          <mesh
            name="stairs"
            geometry={nodes.stairs.geometry}
            material={materials.stairsStairs}
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
