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
const CABINETS = 4; // Including 3 more cabinets
const COLOR = new THREE.Color();

interface BookProps {
  bookUnit: number;
  row: number;
  cabinet: number;
  cellLocation: CellLocation;
  shelfIndex: number;
}

const Book: React.FC<BookProps> = React.memo(
  ({ bookUnit, row, cabinet, cellLocation, shelfIndex }) => {
    const seed = `${Object.values(cellLocation).join("")}${shelfIndex}${cabinet}${row}${bookUnit}`;
    const RNumber = useMemo(() => seededRandom(seed), [seed]);
    const startVector = useMemo(
      () => new THREE.Vector3(0.06, RNumber * 0.025 + 0.075, -0.131),
      [RNumber],
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
      [seed],
    );

    useLayoutEffect(() => {
      if (ref.current) {
        ref.current.position.copy(
          startVector.add(
            new THREE.Vector3(
              0.043 * bookUnit + (cabinet - 2) * 0.5,
              -0.05,
              -0.25 * row,
            ),
          ),
        );
        ref.current.scale.set(0.6, 0.6, 0.5 + scale);
        ref.current.color.copy(startColor);
      }
    }, [ref, startVector, bookUnit, cabinet, row, scale, startColor]);

    useFrame(() => {
      if (ref.current) {
        ref.current.position.y = THREE.MathUtils.lerp(
          ref.current.position.y,
          hovered ? startVector.y + 0.05 : startVector.y,
          0.1,
        );
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
      [seed],
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
  },
);

interface BooksProps {
  cellLocation: CellLocation;
}

export const Books: React.FC<BooksProps> = ({ cellLocation }) => {
  const { nodes } = useGLTF("/models/book-transformed.glb") as GLTFResult;
  const { adjustedPosition } = useCellLocation({ cellLocation });

  const bookArray = useMemo(() => {
    const holderArray = [];
    for (let k = 0; k < CABINETS; k++) {
      for (let j = 0; j < ROWS; j++) {
        for (let i = 0; i < BOOK_UNIT; i++) {
          holderArray.push({ bookUnit: i, row: j, cabinet: k });
        }
      }
    }
    return holderArray;
  }, []);

  return [45, 135, 225, 315].map((deg, index) => (
    <group
      key={deg}
      position={adjustedPosition}
      rotation={[0, degrees_to_radians(deg), 0]}
    >
      <Instances
        frustumCulled={false}
        rotation={new THREE.Euler(Math.PI / 2, 0, 0)}
        position={new THREE.Vector3(0, 0, -2.8)}
        range={BOOK_UNIT * ROWS * CABINETS}
        material={nodes.Book.material}
        geometry={nodes.Book.geometry}
      >
        {bookArray.map((props, i) => (
          <Book
            key={i}
            shelfIndex={index}
            cellLocation={cellLocation}
            {...props}
          />
        ))}
      </Instances>
    </group>
  ));
};

useGLTF.preload("/models/book-transformed.glb");
