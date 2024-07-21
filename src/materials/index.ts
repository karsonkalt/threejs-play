// src/js/materials.js
import * as THREE from "three";

export function createPaddleMaterial() {
  const cssColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--accent-color")
    .trim();

  const color = cssColor ? parseInt(cssColor.slice(1), 16) : 0xff0000;

  return new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.3,
    metalness: 0.2,
  });
}

export function createPuckMaterial() {
  const cssColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--accent-color")
    .trim();

  const color = cssColor ? parseInt(cssColor.slice(1), 16) : 0xff0000;

  return new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.3,
    metalness: 0.2,
  });
}
