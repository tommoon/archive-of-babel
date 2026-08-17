import { Vector3 } from "three";

export type Option = {
  value: string;
  label: string;
};

export type CellHex = {
  x: string;
  y: string;
  z: string;
};

export type Orientation = "W" | "N" | "E" | "S";

export type StairSide = "L" | "R";

export type RoomProps = {
  position: Vector3;
  noColliders?: boolean;
};

export type Vector3Like = [x: number, y: number, z: number];
