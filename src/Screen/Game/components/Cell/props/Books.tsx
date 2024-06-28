import * as THREE from "three";
import React, {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { Instance, Instances, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber";
import { CellLocation } from "@/types/CommonTypes";
import { seededRandom } from "@/lib/randomFunctions";
import { setScreenLocked, setSelectedSeed } from "@/Controllers/gameController";
import { degrees_to_radians } from "@/lib/utils";
import { useCellLocation } from "@/hooks/useCellLocation";

type GLTFResult = GLTF & {
  nodes: {
    Book: THREE.Mesh;
  };
  materials: {
    ["Material.001"]: THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

const BOOK_UNIT = 10;
const ROWS = 4;
const UNITS = 4;
const CABINETS = 4;
const COLOR = new THREE.Color();
const rotations = [0, 90, 180, 270].map(degrees_to_radians);

const getPositions = ({ bookUnit, cabinet, row, unit }) => {
  switch (cabinet) {
    case 0:
      return new THREE.Vector3(0.043 * bookUnit + unit * 0.5, 0, -0.24 * row);
    case 1:
      return new THREE.Vector3(0, 0.043 * bookUnit - (unit - 3) * 0.5, -0.24 * row);
    case 2:
      return new THREE.Vector3(-0.043 * bookUnit + (unit - 3) * 0.5, 0, -0.24 * row);
    default:
      return new THREE.Vector3(0, -0.043 * bookUnit + (unit - 3) * 0.5, -0.24 * row);
  }
};

interface BookProps {
  bookUnit: number;
  row: number;
  unit: number;
  cabinet: number;
  cellLocation: CellLocation;
}

const Book: React.FC<BookProps> = React.memo(
  ({ bookUnit, row, cabinet, cellLocation, unit }) => {
    const seed = `${Object.values(cellLocation).join("")}${cabinet}${unit}${row}${bookUnit}`;
    const RNumber = useMemo(() => seededRandom(seed), [seed]);
    const startVector = useMemo(
      () => [
        new THREE.Vector3(-0.94, -2.75, -0.15),
        new THREE.Vector3(2.75, -0.94, -0.15),
        new THREE.Vector3(0.94, 2.75, -0.15),
        new THREE.Vector3(-2.75, 0.94, -0.15),
      ],
      []
    );
    const scale = useMemo(() => RNumber * 0.1, [RNumber]);
    const ref = useRef<THREE.Mesh>();
    const [hovered, setHover] = useState(false);
    const startColor = useMemo(
      () =>
        new THREE.Color(
          seededRandom(seed + "red") / 2,
          seededRandom(seed + "green") / 2,
          seededRandom(seed + "blue") / 2,
        ),
      [seed]
    );

    useLayoutEffect(() => {
      if (ref.current) {
        ref.current.position.copy(
          startVector[cabinet].clone().add(getPositions({ bookUnit, cabinet, row, unit }))
        );
        ref.current.color.copy(startColor);
        ref.current.scale.set(0.6, 0.4, 0.4 + scale);
        ref.current.rotation.set(0, 0, rotations[cabinet]);
      }
    }, [ref, startVector, bookUnit, cabinet, row, scale, startColor, unit]);

    useFrame(() => {
      if (ref.current) {
        if (cabinet === 0) {
          ref.current.position.y = THREE.MathUtils.lerp(
            ref.current.position.y,
            hovered ? startVector[cabinet].y + 0.05 : startVector[cabinet].y,
            0.1,
          );
        }
        if (cabinet === 2) {
          ref.current.position.y = THREE.MathUtils.lerp(
            ref.current.position.y,
            hovered ? startVector[cabinet].y - 0.05 : startVector[cabinet].y,
            0.1,
          );
        }
        if (cabinet === 3) {
          ref.current.position.x = THREE.MathUtils.lerp(
            ref.current.position.x,
            hovered ? startVector[cabinet].x + 0.05 : startVector[cabinet].x,
            0.1,
          );
        }
        if (cabinet === 1) {
          ref.current.position.x = THREE.MathUtils.lerp(
            ref.current.position.x,
            hovered ? startVector[cabinet].x + 0.05 : startVector[cabinet].x,
            0.1,
          );
        }
        ref.current.color.lerp(
          COLOR.set(hovered ? "white" : startColor),
          hovered ? 1 : 0.1,
        ); 
      }
    });

    const handlePointerOver = useCallback((e: any) => {
      e.stopPropagation();
      setHover(true);
    }, []);

    const handlePointerOut = useCallback(() => {
      setHover(false);
    }, []);

    const handleClick = useCallback(
      (e: any) => {
        e.stopPropagation();
        setSelectedSeed(seed);
        setScreenLocked(true);
      },
      [seed]
    );

    return (
      <group>
        <Instance
          ref={ref}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleClick}
        />
      </group>
    );
  }
);

interface BooksProps {
  cellLocation: CellLocation;
}

export const Books: React.FC<BooksProps> = ({ cellLocation }) => {
  const { nodes } = useGLTF("/models/book-transformed.glb") as GLTFResult;
  const { adjustedPosition } = useCellLocation({ cellLocation });

  const bookArray = useMemo(() => {
    const holderArray = [];
    for (let l = 0; l < CABINETS; l++) {
      for (let k = 0; k < UNITS; k++) {
        for (let j = 0; j < ROWS; j++) {
          for (let i = 0; i < BOOK_UNIT; i++) {
            holderArray.push({ bookUnit: i, row: j, cabinet: l, unit: k });
          }
        }
      }
    }
    return holderArray;
  }, []);

  return (
    <group rotation={[0, Math.PI / 4, 0]} position={adjustedPosition}>
      <Instances
        frustumCulled={false}
        rotation={new THREE.Euler(Math.PI / 2, 0, 0)}
        range={BOOK_UNIT * ROWS * CABINETS * UNITS}
        material={nodes.Book.material}
        geometry={nodes.Book.geometry}
      >
        {bookArray.map((props, i) => (
          <Book key={i} cellLocation={cellLocation} {...props} />
        ))}
      </Instances>
    </group>
  );
};

useGLTF.preload("/models/book-transformed.glb");
