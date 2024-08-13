import * as THREE from "three";

export const createCamera = () => {
  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 0);
  camera.lookAt(0, 0, 0);

  return camera;
};
