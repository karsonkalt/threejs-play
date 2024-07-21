import * as THREE from "three";
import { createPaddleMaterial, createPuckMaterial } from "../materials";

export function createPaddle() {
  const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
  const material = createPaddleMaterial();
  return new THREE.Mesh(geometry, material);
}

export function createPuck() {
  const geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32);
  const material = createPuckMaterial();
  return new THREE.Mesh(geometry, material);
}
