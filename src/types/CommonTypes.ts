import { Material, Vector3 } from "three";

export type Option = {
  value: string;
  label: string;
};
export type StaticElementProps = {
  transformInfo: any;
  selected?: boolean;
  hovered?: boolean;
  attachedMaterial?: Material | null;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
};

export type cellLocation = {
  x: number;
  y: number;
  z: number;
};

export type Orientation = "W" | "N" | "E" | "S";

export type StairSide = "L" | "R";

export type RoomProps = {
  position: Vector3;
  noColliders?: boolean;
};
