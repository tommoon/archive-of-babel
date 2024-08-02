import { MeshBasicMaterial, MeshPhongMaterial } from "three";

export const transparentMaterial = new MeshBasicMaterial({
  transparent: true,
  opacity: 0,
});

export const glowMaterial = new MeshPhongMaterial({
  color: "yellow",
  emissive: "red",
});
