import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Key } from "./Key";

export const WordleThree = () => {
  const canvas = document.querySelector("canvas") as HTMLCanvasElement;
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 0);
  camera.lookAt(0, 0, 0);

  const scene = new THREE.Scene();

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const spotlight = new THREE.SpotLight(0xffffff, 0.5);
  spotlight.position.set(0, 10, 0);

  const planeWidth = 13;
  const planeHeight = 5;

  const geometry = new THREE.BoxGeometry(planeWidth, planeHeight, 0.2);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xd3d3d3, // Light grey
    roughness: 0.5,
    metalness: 0,
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.receiveShadow = true;
  plane.rotateX(-Math.PI / 2);

  plane.position.set(5.5, -0.1, 1);
  scene.add(plane);

  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].forEach(
    (letter, index) => {
      const key = new Key(letter).getInstance();
      key.position.set(index * 1.2, 0, 0);
      scene.add(key);
    }
  );

  ["A", "S", "D", "F", "G", "H", "J", "K", "L"].forEach((letter, index) => {
    const key = new Key(letter).getInstance();
    key.position.set(0.5 + index * 1.2, 0, 1.2);
    scene.add(key);
  });

  ["Z", "X", "C", "V", "B", "N", "M"].forEach((letter, index) => {
    const key = new Key(letter).getInstance();
    key.position.set(1 + index * 1.2, 0, 2.4);
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
