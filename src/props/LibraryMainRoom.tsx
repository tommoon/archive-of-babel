import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { useGLTF, Plane } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { RigidBody } from "@react-three/rapier";
import { CellHex, Vector3Like } from "@/types/CommonTypes";
import { playerPos } from "../Screen/Game/components/Player/Player";
import { _objectIsEqual } from "@/lib/comparisons";
import { gameController } from "@/Controllers/gameController";
import { useCellHex } from "../hooks/useCellHex";
import { Text } from "@react-three/drei";
import { degrees_to_radians } from "@/lib/utils";
import LibraryMainRoomModel from '@/assets/models//MainRoom-transformed.glb';
import LibraryMainRoomColliders from '@/assets/models/libraryMainRoomColliders.glb';
import books from '@/assets/images/bookstandin.jpg';
import { useLoader } from "@react-three/fiber";
import { transparentMaterial } from "@/lib/materials";
import { Fire } from "./Fire";


type GLTFResult = GLTF & {
  nodes: {
    floorCol: THREE.Mesh
    lowerwallCol: THREE.Mesh
    object1021: THREE.Mesh
    railing1: THREE.Mesh
    roof: THREE.Mesh
    lightGem008: THREE.Mesh
    object1022: THREE.Mesh
    object2011: THREE.Mesh
  }
  materials: {
    floorMainRoom: THREE.MeshBasicMaterial
    wallMainRoom: THREE.MeshBasicMaterial
    detailMainRoom: THREE.MeshBasicMaterial
    railingNormalized: THREE.MeshBasicMaterial
    roofMainRoom: THREE.MeshBasicMaterial
    ['fresnelGlow.004']: THREE.MeshPhysicalMaterial
    ['floor.001']: THREE.MeshPhysicalMaterial
    oldwood: THREE.MeshPhysicalMaterial
  }
}

export const LibraryMainRoom: React.FC<{
  cellHex: CellHex;
  hasColliders?: boolean;
  demo?: boolean;
}> = ({ cellHex, hasColliders = true, demo = false }) => {
  const { nodes, materials } = useGLTF(LibraryMainRoomModel) as GLTFResult;
  const { nodes: colliders } = useGLTF(LibraryMainRoomColliders) as GLTFResult;
  const { cellHex: playerCellHex, setCellHex: setPlayerPosition, debug } = gameController();

  const roomRef = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
  const { adjustedPosition } = useCellHex({ cellHex });

  const bookTexture = useLoader(THREE.TextureLoader, books);

  const BookStandin: React.FC<{position: Vector3Like,rotation:Vector3Like}> = ({position,rotation}) => {
    return (
      <Plane
            position={position}
            rotation={rotation}
            scale={[2.2, 1.2, 1]}
          >
            <meshStandardMaterial attach="material" map={bookTexture} />
          </Plane>
    )
  }
  useEffect(() => {
    const interval = setInterval(() => {
      if (roomRef.current) {
        const bb = new THREE.Box3().setFromObject(roomRef.current);
        const inside = bb.containsPoint(playerPos);
        if (inside && !_objectIsEqual(cellHex, playerCellHex)) {
          setPlayerPosition(cellHex);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [roomRef, cellHex, playerCellHex, setPlayerPosition]);
  
  return (
    <group ref={roomRef} position={adjustedPosition} dispose={null}>
      {debug && (
        <Text position={new THREE.Vector3(0, 1, 0)}>
          {`${cellHex.x}_${cellHex.y}_${cellHex.z}`}
          <meshNormalMaterial />
        </Text>
      )}
      {hasColliders ? (
        <>
          <RigidBody type="fixed" colliders="trimesh">
          <mesh name="lowerwallCol" geometry={nodes.lowerwallCol.geometry} material={materials.wallMainRoom} rotation={[Math.PI / 2, 0, 0]} />
          </RigidBody>
          <RigidBody type="fixed" colliders="hull">
            <mesh
              geometry={colliders.floorCol.geometry}
              material={transparentMaterial}
              rotation={[Math.PI / 2, 0, Math.PI]}
            />
            <mesh name="railing1" geometry={nodes.railing1.geometry} material={materials.railingNormalized} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.75]} />
          </RigidBody>
        </>
      ) : (
          <>
      <mesh name="lowerwallCol" geometry={nodes.lowerwallCol.geometry} material={materials.wallMainRoom} rotation={[Math.PI / 2, 0, 0]} />
      <mesh
              geometry={colliders.floorCol.geometry}
              material={transparentMaterial}
              rotation={[Math.PI / 2, 0, Math.PI]}
            />
            <mesh name="railing1" geometry={nodes.railing1.geometry} material={materials.railingNormalized} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.75]} />
          </>
      )}
      {demo && (
            <>
              <pointLight
                color={"#ebf5fe"}
                position={[0, 1.5, -2.5]}
                distance={20}
                intensity={2}
              />
              <pointLight
                color={"#ebf5fe"}
                position={[0, 1.5, 2.5]}
                distance={20}
                intensity={2}
              />
              <pointLight
                color={"#ebf5fe"}
                position={[-2.5, 1.5, 0]}
                distance={20}
                intensity={2}
              />
              <pointLight
                color={"#ebf5fe"}
                position={[2.5, 1.5, 0]}
                distance={20}
                intensity={2}
              />
            </>
          )}
   <mesh name="floorCol" geometry={nodes.floorCol.geometry} material={materials.floorMainRoom} rotation={[Math.PI / 2, 0, Math.PI]} />
      <mesh name="lowerwallCol" geometry={nodes.lowerwallCol.geometry} material={materials.wallMainRoom} rotation={[Math.PI / 2, 0, 0]} />
      <mesh name="object1021" geometry={nodes.object1021.geometry} material={materials.detailMainRoom} rotation={[Math.PI / 2, 0, 0]} />
      <mesh name="roof" geometry={nodes.roof.geometry} material={materials.roofMainRoom} rotation={[Math.PI / 2, 0, Math.PI]} />
      <mesh name="railing1" geometry={nodes.railing1.geometry} material={materials.railingNormalized} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.75]} />
      <mesh name="lightGem008" geometry={nodes.lightGem008.geometry} material={materials['fresnelGlow.004']} position={[0, 1.604, 2.853]} rotation={[2.955, 0, Math.PI]} scale={10} />
      <mesh name="object1022" geometry={nodes.object1022.geometry} material={materials['floor.001']} position={[0, 1.273, 2.742]} rotation={[Math.PI / 2, 0, Math.PI]} scale={0.5} />
      <mesh name="object2011" geometry={nodes.object2011.geometry} material={materials.oldwood} position={[0, 1.273, 2.742]} rotation={[Math.PI / 2, 0, Math.PI]} scale={0.5} />
       {!_objectIsEqual(cellHex, playerCellHex) && (
        <group>
          <BookStandin
            position={[-1.9, 0.702, -1.9]}
            rotation={[0, Math.PI / 4, 0]}
          />
          <BookStandin
            position={[1.9, 0.702, -1.9]}
            rotation={[0, -Math.PI / 4, 0]}
          />
          <BookStandin
            position={[-1.9, 0.702, 1.9]}
            rotation={[0, degrees_to_radians(135), 0]}
          />
          <BookStandin
            position={[1.9, 0.702, 1.9]}
            rotation={[0, degrees_to_radians(225), 0]}
          />
        </group>
      )}
      {demo && (
        <group>
          <BookStandin
            position={[-1.9, 0.702, -1.9]}
            rotation={[0, Math.PI / 4, 0]}
          />
          <BookStandin
            position={[1.9, 0.702, -1.9]}
            rotation={[0, -Math.PI / 4, 0]}
          />
          <BookStandin
            position={[-1.9, 0.702, 1.9]}
            rotation={[0, degrees_to_radians(135), 0]}
          />
          <BookStandin
            position={[1.9, 0.702, 1.9]}
            rotation={[0, degrees_to_radians(225), 0]}
          />
        </group>
      )}
    </group>
  );
};

useGLTF.preload(LibraryMainRoomColliders);
useGLTF.preload(LibraryMainRoomModel);
