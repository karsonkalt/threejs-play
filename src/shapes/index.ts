import * as THREE from "three";
import { createPaddleMaterial, createPuckMaterial } from "../materials";

export const PADDLE_BASE = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);

export function createPaddle() {
  const baseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
  const baseMaterial = createPaddleMaterial();
  const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);

  const edgeGeometry = new THREE.TorusGeometry(0.5, 0.05, 16, 100, Math.PI * 2);
  const edgeMaterial = createPaddleMaterial();
  const edgeMesh = new THREE.Mesh(edgeGeometry, edgeMaterial);
  edgeMesh.rotation.x = Math.PI / 2;
  edgeMesh.position.y = 0.1;

  const handleGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 32);
  const handleMaterial = createPaddleMaterial();
  const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
  handleMesh.position.y = 0.4;

  const topGeometry = new THREE.SphereGeometry(0.15, 32, 32);
  const topMaterial = createPaddleMaterial();
  const topMesh = new THREE.Mesh(topGeometry, topMaterial);
  topMesh.position.y = 0.65;

  const paddle = new THREE.Group();
  paddle.add(baseMesh);
  paddle.add(edgeMesh);
  paddle.add(handleMesh);
  paddle.add(topMesh);

  return paddle;
}

export function createPuck() {
  const puckGroup = new THREE.Group();

  const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.02, 32);
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
