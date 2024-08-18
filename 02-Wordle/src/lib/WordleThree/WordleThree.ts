import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Key } from "./Key";

export const WordleThree = () => {
  const canvas = document.querySelector("canvas") as HTMLCanvasElement;
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
    alpha: true,
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;

  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 6, 3.75);

  const scene = new THREE.Scene();

  const ambientLight = new THREE.AmbientLight(0xffffff, 2);
  scene.add(ambientLight);

  const spotlight = new THREE.SpotLight(0xffffff, 0.5);
  spotlight.position.set(0, 10, 0);

  const KEY_GAP = 1.2;
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].forEach(
    (letter, index) => {
      const LEFT_OFFSET = 6;
      const key = new Key(letter).getInstance();
      key.position.set(-LEFT_OFFSET + index * KEY_GAP, 0, 0);
      scene.add(key);
    }
  );

  ["A", "S", "D", "F", "G", "H", "J", "K", "L"].forEach((letter, index) => {
    const LEFT_OFFSET = 5.4;
    const key = new Key(letter).getInstance();
    key.position.set(-LEFT_OFFSET + index * KEY_GAP, 0, 1.2);
    scene.add(key);
  });

  ["Z", "X", "C", "V", "B", "N", "M"].forEach((letter, index) => {
    const LEFT_OFFSET = 4.8;
    const key = new Key(letter).getInstance();
    key.position.set(-LEFT_OFFSET + index * KEY_GAP, 0, 2.4);
    scene.add(key);
  });

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false;

  function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
};
