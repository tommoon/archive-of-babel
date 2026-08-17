import { Vector3 } from "three";

/**
 * Live player position, written once per frame by <Player/> and read by room
 * geometry for cheap bounding-box checks. A shared mutable vector avoids
 * allocating on every frame and avoids re-rendering the tree on every step.
 */
export const playerPos = new Vector3();
