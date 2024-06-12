import { Euler, Vector3 } from "@react-three/fiber";
import { Material } from "three";
export type PropInfo = {
  position: Vector3;
  rotation: Euler;
  material?: Material;
  mirror?: boolean;
};

export type SceneProp = {
  uuid: string | null;
  editableProps: PropInfo;
  propName: string;
  propRepo: string;
};

export type acceptedPropertyValues = Vector3 | Euler | boolean;
