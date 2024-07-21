// src/js/materials.js
import * as THREE from "three";

export function createPaddleMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0x0000ff,
    roughness: 0.3,
    metalness: 0.2,
  });
}

export function createPuckMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0xff0000,
    metalness: 0.8,
    roughness: 0.2,
  });
}
