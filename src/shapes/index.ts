import * as THREE from "three";
import { createPaddleMaterial, createPuckMaterial } from "../materials";

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
  const geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32);
  const material = createPuckMaterial();
  return new THREE.Mesh(geometry, material);
}
