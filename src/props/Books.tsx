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
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { CellHex } from "@/types/CommonTypes";
import { seededRandom } from "@/lib/randomFunctions";
import { gameController, setScreenLocked } from "@/Controllers/gameController";
import { degrees_to_radians } from "@/lib/utils";
import { useCellHex } from "@/hooks/useCellHex";
import bookModel from '@/assets/models/book-transformed.glb'

type GLTFResult = GLTF & {
  nodes: {
    Book: THREE.Mesh;
  };
  materials: {
    ["Material.001"]: THREE.MeshStandardMaterial;
  };
};

const BOOK_UNIT = 10;
const ROWS = 5;
const UNITS = 5;
const CABINETS = 4;
const COLOR = new THREE.Color();
const rotations = [0, 90, 180, 270].map(degrees_to_radians);

const getPositions = ({
  book,
  cabinet,
  row,
  unit,
}: {
  book: number;
  cabinet: number;
  row: number;
  unit: number;
}) => {
  switch (cabinet) {
    case 0:
      return new THREE.Vector3(0.043 * book + unit * 0.47, 0, -0.225 * row);
    case 1:
      return new THREE.Vector3(
        0,
        0.043 * book - (unit - 4) * 0.47,
        -0.225 * row,
      );
    case 2:
      return new THREE.Vector3(
        -0.043 * book + (unit - 4) * 0.47,
        0,
        -0.225 * row,
      );
    default:
      return new THREE.Vector3(
        0,
        -0.043 * book + (unit - 4) * 0.47,
        -0.225 * row,
      );
  }
};

interface BookProps {
  book: number;
  row: number;
  unit: number;
  cabinet: number;
  cellHex: CellHex;
}

const Book: React.FC<BookProps> = React.memo(
  ({ book, row, cabinet, cellHex, unit }) => {
    const { setBookState, setBookOpen, setPage } = gameController();
    const seed = `${Object.values(cellHex).join("")}${cabinet}${unit}${row}${book}`;
    const RNumber = useMemo(() => seededRandom(seed), [seed]);
    const startVector = useMemo(
      () => [
        new THREE.Vector3(-1.135, -2.85, -0.16),
        new THREE.Vector3(2.85, -1.135, -0.16),
        new THREE.Vector3(1.135, 2.85, -0.16),
        new THREE.Vector3(-2.85, 1.135, -0.16),
      ],
      [],
    );
    const scale = useMemo(() => RNumber * 0.1, [RNumber]);
    const ref = useRef<THREE.Mesh>();
    const [hovered, setHover] = useState(false);
    const startColor = useMemo(
      () =>
        new THREE.Color(
          seededRandom(seed + "red") / 3,
          seededRandom(seed + "green") / 3,
          seededRandom(seed + "blue") / 3,
        ),
      [seed],
    );

    useLayoutEffect(() => {
      if (ref.current) {
        ref.current.position.copy(
          startVector[cabinet]
            .clone()
            .add(getPositions({ book, cabinet, row, unit })),
        );
        // @ts-expect-error - drei's <Instance> ref exposes .color at runtime but it is not in the type
        ref.current.color.copy(startColor);
        ref.current.scale.set(0.6, 0.4, 0.4 + scale);
        ref.current.rotation.set(0, 0, rotations[cabinet]);
      }
    }, [ref, startVector, book, cabinet, row, scale, startColor, unit]);

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
            hovered ? startVector[cabinet].x - 0.05 : startVector[cabinet].x,
            0.1,
          );
        }
        // @ts-expect-error - see above: .color is present at runtime, absent from the type
        ref.current.color.lerp(
          COLOR.set(hovered ? "white" : startColor),
          hovered ? 1 : 0.1,
        );
      }
    });

    const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHover(true);
    }, []);

    const handlePointerOut = useCallback(() => {
      setHover(false);
    }, []);

    const handleClick = useCallback(
      (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        setBookState({
          book: book,
          cabinet: cabinet,
          row: row,
          unit: unit,
        });
        setBookOpen(true);
        setScreenLocked(true);
        setPage(1)
      },
      // `seed` is derived from cellHex + cabinet/unit/row/book, so it changes
      // whenever any of them do.
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
  cellHex: CellHex;
}

export const Books: React.FC<BooksProps> = ({ cellHex }) => {
  const { nodes } = useGLTF(bookModel) as GLTFResult;
  const { adjustedPosition } = useCellHex({ cellHex });

  const bookArray = useMemo(() => {
    const holderArray = [];
    for (let l = 0; l < CABINETS; l++) {
      for (let k = 0; k < UNITS; k++) {
        for (let j = 0; j < ROWS; j++) {
          for (let i = 0; i < BOOK_UNIT; i++) {
            holderArray.push({ book: i, row: j, cabinet: l, unit: k });
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
        scale={[0.95,0.95,1]}
      >
        {bookArray.map((props, i) => (
          <Book key={i} cellHex={cellHex} {...props} />
        ))}
      </Instances>
    </group>
  );
};

useGLTF.preload(bookModel);
