import { SceneInit } from "./SceneInit";
import * as THREE from "three";

export const WordleThree = () => {
  const sceneInit = new SceneInit({
    canvasID: "canvas",
    camera: new THREE.PerspectiveCamera(
      36,
      window.innerWidth / window.innerHeight,
      1,
      1000
    ),
    scene: new THREE.Scene(),
    renderer: new THREE.WebGLRenderer(),
    fov: 36,
  });
  sceneInit.initScene();
};
