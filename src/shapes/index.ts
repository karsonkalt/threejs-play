import * as THREE from "three";
import { createPaddleMaterial, createPuckMaterial } from "../materials";

export const PADDLE_BASE = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);

export function createPaddle() {
  const baseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 32);
  const baseMaterial = createPaddleMaterial();
  const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);

  const handleGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 32);
  const handleMaterial = createPaddleMaterial();
  const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
  handleMesh.position.y = 0.35; // Adjusted to center

  const topGeometry = new THREE.SphereGeometry(0.15, 32, 32);
  const topMaterial = createPaddleMaterial();
  const topMesh = new THREE.Mesh(topGeometry, topMaterial);
  topMesh.position.y = 0.6; // Adjusted to center

  const paddle = new THREE.Group();
  paddle.add(baseMesh);
  paddle.add(handleMesh);
  paddle.add(topMesh);

  // Center the paddle at the bottom
  paddle.position.y = 0;

  return paddle;
}

export function createPuck() {
  const puckGroup = new THREE.Group();

  const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.25, 32);
  const bodyMaterial = createPuckMaterial();
  const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);

  const topBorderGeometry = new THREE.CylinderGeometry(0.32, 0.32, 0.005, 32);
  const topBorderMaterial = createPuckMaterial();
  const topBorderMesh = new THREE.Mesh(topBorderGeometry, topBorderMaterial);
  topBorderMesh.position.y = 0.0125; // Positioned slightly above the body

  const bottomBorderGeometry = new THREE.CylinderGeometry(
    0.32,
    0.32,
    0.005,
    32
  );
  const bottomBorderMaterial = createPuckMaterial();
  const bottomBorderMesh = new THREE.Mesh(
    bottomBorderGeometry,
    bottomBorderMaterial
  );
  bottomBorderMesh.position.y = -0.0125; // Positioned slightly below the body

  puckGroup.add(bodyMesh);
  puckGroup.add(topBorderMesh);
  puckGroup.add(bottomBorderMesh);

  return puckGroup;
}
