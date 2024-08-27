import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { PALETTES } from "./colorPalettes";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const height = document.querySelector("#height") as HTMLDivElement;
const controlsElement = document.querySelector("#controls") as HTMLDivElement;

const palette = PALETTES.SUNSET;
function increaseHeight() {
  height.innerText = (Number(height.innerText) + 1).toString();
}

function initializeRenderer(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  return renderer;
}

const renderer = initializeRenderer(canvas);

function initializeCamera() {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(5, 5, 5);
  camera.lookAt(0, 0, 0);
  return camera;
}

const camera = initializeCamera();

const scene = new THREE.Scene();

function initializeParticles(scene: THREE.Scene) {
  const particleCount = 500; // Number of particles
  const particlesGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3); // Each particle has 3 coordinates (x, y, z)

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 100; // Spread particles out in space
    const y = (Math.random() - 0.5) * 100;
    const z = (Math.random() - 0.5) * 100;
    positions.set([x, y, z], i * 3);
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const particlesMaterial = new THREE.PointsMaterial({
    color: 0xffffff, // Particle color
    size: 0.2, // Size of each particle
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);
}

initializeParticles(scene);

function initializeLights(scene: THREE.Scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
  directionalLight1.position.set(5, 10, 7.5);
  directionalLight1.castShadow = true;
  scene.add(directionalLight1);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
  directionalLight2.position.set(10, 12, 10.5);
  directionalLight2.castShadow = true;
  scene.add(directionalLight2);
}

initializeLights(scene);

function initializeControls(
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) {
  return new OrbitControls(camera, renderer.domElement);
}

const controls = initializeControls(camera, renderer);

function initializePhysicsWorld() {
  const world = new CANNON.World();
  world.gravity.set(0, -9.82, 0);
  return world;
}

const world = initializePhysicsWorld();

function createGround(scene: THREE.Scene, world: CANNON.World) {
  const ground = new THREE.Mesh(
    new THREE.BoxGeometry(3, 0.4, 3),
    new THREE.MeshPhysicalMaterial({
      color: 0xaaaaaa,
      metalness: 0.3,
      roughness: 0.4,
      clearcoat: 0.1,
    })
  );
  ground.receiveShadow = true;
  scene.add(ground);

  const groundBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(new CANNON.Vec3(1.5, 0.2, 1.5)),
    type: CANNON.Body.STATIC,
  });

  world.addBody(groundBody);
}

createGround(scene, world);

// const cannonDebugger = new CannonDebugger(scene, world, {}) as any;

const blocks = [];

function isCollidingWithExistingBlocks(potentialNewBlockPosition: CANNON.Vec3) {
  return blocks.some(({ blockBody }) => {
    const distance = blockBody.position.distanceTo(potentialNewBlockPosition);
    return distance <= 0.5; // Assuming blocks are of size 1x1x1
  });
}

function createBlock(position: CANNON.Vec3) {
  const color = palette[Math.floor(Math.random() * palette.length)];

  const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
  const blockMaterial = new THREE.MeshPhysicalMaterial({
    color: color,
    metalness: Math.random() * 0.3,
    roughness: Math.random() * 0.3,
    iridescence: Math.random() * 0.3,
    sheen: Math.random() * 0.3,
    clearcoat: Math.random() > 0.5 ? Math.random() * 0.3 : 0,
  });
  const block = new THREE.Mesh(blockGeometry, blockMaterial);
  block.castShadow = true;

  block.position.copy(position as unknown as THREE.Vector3);
  scene.add(block);

  const blockShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
  const blockBody = new CANNON.Body({
    mass: 10,
    position: position.clone(),
    shape: blockShape,
  });
  world.addBody(blockBody);

  return { block, blockBody };
}

const initialPosition = new CANNON.Vec3(0, 1, 0);
const initialBlock = createBlock(initialPosition);
blocks.push(initialBlock);

const getLastBlock = () => blocks[blocks.length - 1];

const getNumberOfBlocks = () => blocks.length;

const getPreviewBlockChangeRate = () => {
  // as more blocks are placed,
  // return the wait time in ms
  const numBlocks = getNumberOfBlocks();
  if (numBlocks < 5) return 800;
  if (numBlocks < 10) return 700;
  if (numBlocks < 15) return 600;
  if (numBlocks < 20) return 500;
  if (numBlocks < 25) return 400;
  if (numBlocks < 30) return 300;
  if (numBlocks < 35) return 200;
  return 100;
};

function changePreviewBlockAfterDelay() {
  setTimeout(() => {
    const directions = ["top", "front", "back", "left", "right"];
    const randomDirection =
      directions[Math.floor(Math.random() * directions.length)];

    rotatePreviewBlock(randomDirection);

    // Continue changing the position after each interval
    changePreviewBlockAfterDelay();
  }, getPreviewBlockChangeRate());
}

let blockBlink = false;
let previewBlock = createPreviewBlock();
changePreviewBlockAfterDelay();
let previewBlockPosition: "top" | "left" | "right" | "front" | "back" = "left";

function syncPreviewBlock() {
  let potentialPosition = getLastBlock().block.position.clone();
  switch (previewBlockPosition) {
    case "top":
      potentialPosition.y += 1;
      break;
    case "front":
      potentialPosition.z -= 1;
      break;
    case "back":
      potentialPosition.z += 1;
      break;
    case "left":
      potentialPosition.x -= 1;
      break;
    case "right":
      potentialPosition.x += 1;
      break;
  }

  if (!isCollidingWithExistingBlocks(potentialPosition)) {
    previewBlock.position.copy(potentialPosition);
  } else {
    previewBlockPosition = "top";
  }
}

function createGoal(y: number) {
  // make a hollow block at the given height
  const blockGeometry = new THREE.BoxGeometry(5, 0.1, 5);
  const edges = new THREE.EdgesGeometry(blockGeometry);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0.7,
  });
  const lineSegments = new THREE.LineSegments(edges, lineMaterial);
  lineSegments.position.set(0, y, 0);
  scene.add(lineSegments);
}

createGoal(7);

function isPastGoal(y: number) {
  return y >= 7;
}

// if the last block y is higher than the goal, then change bgcolor of the scene
function checkGoal() {
  if (isPastGoal(getLastBlock().block.position.y)) {
    // make bg yellow
    scene.background = new THREE.Color(0x616050);
  }
}

function createPreviewBlock() {
  const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
  const blockMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
  });
  const block = new THREE.Mesh(blockGeometry, blockMaterial);

  scene.add(block);

  return block;
}

function placeBlock() {
  if (!getLastBlock()) return;
  if (previewBlockPosition === "top") increaseHeight();

  const lastBlock = getLastBlock();

  const newBlockPosition = new CANNON.Vec3().copy(
    previewBlock.position as unknown as CANNON.Vec3
  );
  const newBlockQuaternion = new CANNON.Quaternion().copy(
    previewBlock.quaternion as unknown as CANNON.Quaternion
  );

  const newBlock = createBlock(newBlockPosition);
  newBlock.blockBody.quaternion.copy(newBlockQuaternion);

  const constraint = new CANNON.LockConstraint(
    lastBlock.blockBody,
    newBlock.blockBody
  );
  world.addConstraint(constraint);

  blocks.push(newBlock);
}

function updatePreviewBlockPosition() {
  if (getLastBlock()) {
    previewBlock.position.copy(getLastBlock().block.position);
    previewBlock.position.y += 1;
    previewBlock.rotation.copy(getLastBlock().block.rotation);
  }
}

function rotatePreviewBlock(direction: string) {
  if (!getLastBlock) return;

  const lastBlockPosition = getLastBlock().block.position;

  switch (direction) {
    case "front":
      previewBlockPosition = "front";
      previewBlock.position.set(
        lastBlockPosition.x,
        lastBlockPosition.y,
        lastBlockPosition.z - 1
      );
      break;
    case "back":
      previewBlockPosition = "back";
      previewBlock.position.set(
        lastBlockPosition.x,
        lastBlockPosition.y,
        lastBlockPosition.z + 1
      );
      break;
    case "left":
      previewBlockPosition = "left";
      previewBlock.position.set(
        lastBlockPosition.x - 1,
        lastBlockPosition.y,
        lastBlockPosition.z
      );
      break;
    case "right":
      previewBlockPosition = "right";
      previewBlock.position.set(
        lastBlockPosition.x + 1,
        lastBlockPosition.y,
        lastBlockPosition.z
      );
      break;
    case "top":
      previewBlockPosition = "top";
      previewBlock.position.set(
        lastBlockPosition.x,
        lastBlockPosition.y + 1,
        lastBlockPosition.z
      );
      break;
  }
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    placeBlock();
    updatePreviewBlockPosition();
  }
});

let cameraAngle = 0;
const cameraRadius = 10;
const cameraSpeed = 0.003;
let gameOver = false;

function isCurrentBlockUnderPlatform() {
  if (!getLastBlock()) return false;
  const lastBlock = getLastBlock();
  const lastBlockPosition = lastBlock.block.position;
  return lastBlockPosition.y < -1;
}

function animate() {
  requestAnimationFrame(animate);
  world.step(1 / 60);

  // cannonDebugger.update();

  blocks.forEach(({ block, blockBody }) => {
    block.position.copy(blockBody.position as unknown as THREE.Vector3);
    block.quaternion.copy(blockBody.quaternion as unknown as THREE.Quaternion);
  });

  cameraAngle += cameraSpeed;

  const lastBlockPosition = getLastBlock().block.position;
  const cameraX = lastBlockPosition.x + cameraRadius * Math.cos(cameraAngle);
  const cameraZ = lastBlockPosition.z + cameraRadius * Math.sin(cameraAngle);
  const cameraY = lastBlockPosition.y + 6; // Adjust Y to keep a good viewing angle

  camera.position.set(cameraX, cameraY, cameraZ);
  camera.lookAt(lastBlockPosition);

  syncPreviewBlock();
  checkGoal();

  if (isCurrentBlockUnderPlatform() && !gameOver) {
    gameOver = true;
    controlsElement.classList.remove("hidden");
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
