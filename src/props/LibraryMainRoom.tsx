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
import { degrees_to_radians, transparentMaterial } from "@/lib/utils";
import LibraryMainRoomModel from '@/assets/models/libraryMainRoom-transformed.glb';
import LibraryMainRoomColliders from '@/assets/models/libraryMainRoomColliders.glb';
import { optionsController } from "@/Controllers/optionsController";
import books from '@/assets/images/bookstandin.jpg';
import { useLoader } from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    railing4: any;
    railing2: any;
    railing3: any;
    lowerwallCol: THREE.Mesh;
    floorCol: THREE.Mesh;
    railing1: THREE.Mesh;
    object1004: THREE.Mesh;
    lightGem004: THREE.Mesh;
    object1063: THREE.Mesh;
    object2008: THREE.Mesh;
  };
  materials: {
    WallBake: THREE.MeshStandardMaterial;
    floor: THREE.MeshStandardMaterial;
    SandstoneTrim: THREE.MeshStandardMaterial;
    oldwood: THREE.MeshStandardMaterial;
    fresnelGlow: THREE.MeshStandardMaterial;
    ["floor.003"]: THREE.MeshStandardMaterial;
    ["oldwood.004"]: THREE.MeshStandardMaterial;
    ["SandstoneTrim.008"]: THREE.MeshStandardMaterial;
  };
};

export const LibraryMainRoom: React.FC<{
  cellHex: CellHex;
  hasColliders?: boolean;
  hasLights?: boolean;
}> = ({ cellHex, hasColliders = true, hasLights = false }) => {
  const { nodes, materials } = useGLTF(LibraryMainRoomModel) as GLTFResult;
  const { nodes: colliders } = useGLTF(LibraryMainRoomColliders) as GLTFResult;

  const { cellHex: playerCellHex, setCellHex: setPlayerPosition, debug } = gameController();
  const { dynamicLights } = optionsController();

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
      {hasColliders && (
        <>
          <RigidBody type="fixed" colliders="trimesh">
            <mesh
              geometry={colliders.lowerwallCol.geometry}
              material={transparentMaterial}
              rotation={[Math.PI / 2, 0, 0]}
            />
          </RigidBody>
          <RigidBody type="fixed" colliders="hull">
            <mesh
              geometry={colliders.floorCol.geometry}
              material={transparentMaterial}
              rotation={[Math.PI / 2, 0, Math.PI]}
            />
            <mesh
              geometry={colliders.railing1.geometry}
              material={transparentMaterial}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[1, 1, 0.75]}
            />
            <mesh
              geometry={colliders.railing3.geometry}
              material={transparentMaterial}
              rotation={[Math.PI / 2, 0, -Math.PI / 2]}
              scale={[1, 1, 0.75]}
            />
            <mesh
              geometry={colliders.railing2.geometry}
              material={transparentMaterial}
              rotation={[Math.PI / 2, 0, Math.PI / 2]}
              scale={[1, 1, 0.75]}
            />
            <mesh
              geometry={colliders.railing4.geometry}
              material={transparentMaterial}
              rotation={[Math.PI / 2, 0, -Math.PI]}
              scale={[1, 1, 0.75]}
            />
          </RigidBody>
          {dynamicLights && (
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
        </>
      )}
      {hasLights && (
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
      <mesh
        name="lowerwallCol"
        geometry={nodes.lowerwallCol.geometry}
        material={materials.WallBake}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        name="floorCol"
        geometry={nodes.floorCol.geometry}
        material={materials.floor}
        rotation={[Math.PI / 2, 0, Math.PI]}
      />
            <mesh
        name="lightGem004"
        geometry={nodes.lightGem004.geometry}
        material={materials.fresnelGlow}
        position={[0, 1.589, -2.845]}
        rotation={[0.187, 0, 0]}
        scale={10}
      />
      <mesh
        name="railing1"
        geometry={nodes.railing1.geometry}
        material={materials.oldwood}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[1, 1, 0.75]}
      />
      <mesh
        name="object1004"
        geometry={nodes.object1004.geometry}
        material={materials["SandstoneTrim.008"]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        name="object1063"
        geometry={nodes.object1063.geometry}
        material={materials["floor.003"]}
        position={[0, 1.257, -2.734]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.5}
      />
      <mesh
        name="object2008"
        geometry={nodes.object2008.geometry}
        material={materials["oldwood.004"]}
        position={[0, 1.257, -2.734]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.5}
      />
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
      {hasLights && (
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
