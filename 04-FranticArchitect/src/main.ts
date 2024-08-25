import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from "cannon-es";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshBasicMaterial({ color: 0xcccccc })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const groundBody = new CANNON.Body({
  mass: 0,
  shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

const blocks = [];

function createBlock(position: CANNON.Vec3) {
  const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
  const blockMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    metalness: 0.5,
  });
  const block = new THREE.Mesh(blockGeometry, blockMaterial);

  block.position.copy(position as unknown as THREE.Vector3);
  scene.add(block);

  const blockShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
  const blockBody = new CANNON.Body({
    mass: 1,
    position: position.clone(),
    shape: blockShape,
  });
  world.addBody(blockBody);

  return { block, blockBody };
}

const initialPosition = new CANNON.Vec3(0, 0.5, 0);
const initialBlock = createBlock(initialPosition);
blocks.push(initialBlock);
let lastBlock = initialBlock;

let previewBlock = createPreviewBlock();

function createPreviewBlock() {
  const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
  const blockMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 0.5,
  });
  const block = new THREE.Mesh(blockGeometry, blockMaterial);

  block.position.set(0, 5, 0);

  scene.add(block);

  return block;
}

function placeBlock() {
  if (!lastBlock) return;

  const newBlockPosition = new CANNON.Vec3().copy(
    previewBlock.position as unknown as CANNON.Vec3
  );
  const newBlock = createBlock(newBlockPosition);

  const constraint = new CANNON.LockConstraint(
    lastBlock.blockBody,
    newBlock.blockBody
  );
  world.addConstraint(constraint);

  blocks.push(newBlock);
  lastBlock = newBlock;
}

function updatePreviewBlockPosition() {
  if (lastBlock) {
    previewBlock.position.copy(lastBlock.block.position);
    previewBlock.position.y += 1;
  }
}

function rotatePreviewBlock(direction: string) {
  if (!lastBlock) return;

  const offset = 1;
  const position = lastBlock.block.position;

  switch (direction) {
    case "ArrowUp":
      previewBlock.position.set(position.x, position.y + offset, position.z);
      break;
    case "ArrowDown":
      previewBlock.position.set(position.x, position.y - offset, position.z);
      break;
    case "ArrowLeft":
      previewBlock.position.set(position.x - offset, position.y, position.z);
      break;
    case "ArrowRight":
      previewBlock.position.set(position.x + offset, position.y, position.z);
      break;
  }
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    placeBlock();
    updatePreviewBlockPosition();
  } else if (
    event.key === "ArrowUp" ||
    event.key === "ArrowDown" ||
    event.key === "ArrowLeft" ||
    event.key === "ArrowRight"
  ) {
    rotatePreviewBlock(event.key);
  }
});

function animate() {
  requestAnimationFrame(animate);
  world.step(1 / 60);

  blocks.forEach(({ block, blockBody }) => {
    block.position.copy(blockBody.position as unknown as THREE.Vector3);
    block.quaternion.copy(blockBody.quaternion as unknown as THREE.Quaternion);
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();
