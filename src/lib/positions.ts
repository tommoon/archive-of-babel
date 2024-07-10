import { Vector3 } from "three";

const northAdjustmentVector = new Vector3(0, 0, 5.5);
const southAdjustmentVector = new Vector3(0, 0, -5.5);
const eastAdjustmentVector = new Vector3(-5.5, 0, 0);
const westAdjustmentVector = new Vector3(5.5, 0, 0);

export const adjustments = {
  E: eastAdjustmentVector,
  W: westAdjustmentVector,
  S: southAdjustmentVector,
  N: northAdjustmentVector,
};
export const nullVector3 = new Vector3(0, 0, 0);
