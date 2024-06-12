import { Material } from "three";

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
