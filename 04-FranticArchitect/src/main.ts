import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const timer = document.querySelector("#timer") as HTMLDivElement;
const controlsElement = document.querySelector("#controls") as HTMLDivElement;

function updateTimer(time: number) {
  timer.innerText = time.toFixed(1);
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
    new THREE.BoxGeometry(4, 0.4, 4),
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
    shape: new CANNON.Box(new CANNON.Vec3(2, 0.2, 2)),
    type: CANNON.Body.STATIC,
  });

  world.addBody(groundBody);
}

createGround(scene, world);

// const cannonDebugger = new CannonDebugger(scene, world, {}) as any;

const blocks = [];

function createBlock(position: CANNON.Vec3) {
  const blues = [0x00aaff, 0x00ddff, 0x00ffff];
  const color = blues[Math.floor(Math.random() * blues.length)];

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
    mass: 1,
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

const getCurrentBlockTime = () => {
  return 8 - getNumberOfBlocks() * 0.1;
};

let blockTimer = getCurrentBlockTime();
let blockBlink = false;
let previewBlock = createPreviewBlock();
let previewBlockPosition: "top" | "left" | "right" | "front" | "back" = "left";

const syncPreviewBlock = () => {
  previewBlock.position.copy(getLastBlock().block.position);
  previewBlock.rotation.copy(getLastBlock().block.rotation);
  switch (previewBlockPosition) {
    case "top":
      previewBlock.position.y += 1;
      break;
    case "front":
      previewBlock.position.z -= 1;
      break;
    case "back":
      previewBlock.position.z += 1;
      break;
    case "left":
      previewBlock.position.x -= 1;
      break;
    case "right":
      previewBlock.position.x += 1;
      break;
  }
};

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
const increaseBlocksArray = generateCountArray([6, 6, 5, 5, 4, 4, 3, 2, 1]);

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

function generateCountArray(array: number[]) {
  let count = 0;
  return array.map((num) => (count += num));
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Shift") {
    if (increaseBlocksArray.includes(getNumberOfBlocks())) {
      rotatePreviewBlock("top");
    } else {
      rotatePreviewBlock(
        ["right", "left", "front", "back"][Math.floor(Math.random() * 4)]
      );
    }
  }
  if (event.key === "Enter") {
    placeBlock();
    updatePreviewBlockPosition();
    blockTimer = getCurrentBlockTime();
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

  blockTimer -= 1 / 120;
  updateTimer(blockTimer);

  const blinkInterval = Math.max(0.25, blockTimer / 2);
  blockBlink = Math.floor((2 - blockTimer) / blinkInterval) % 2 === 0;
  previewBlock.material.color.setHex(blockBlink ? 0xffffff : 0xff0000);

  if (blockTimer <= 0) {
    placeBlock();
    updatePreviewBlockPosition();
    blockTimer = getCurrentBlockTime();
  }

  cameraAngle += cameraSpeed;

  const lastBlockPosition = getLastBlock().block.position;
  const cameraX = lastBlockPosition.x + cameraRadius * Math.cos(cameraAngle);
  const cameraZ = lastBlockPosition.z + cameraRadius * Math.sin(cameraAngle);
  const cameraY = lastBlockPosition.y + 5; // Adjust Y to keep a good viewing angle

  camera.position.set(cameraX, cameraY, cameraZ);
  camera.lookAt(lastBlockPosition);

  syncPreviewBlock();

  if (isCurrentBlockUnderPlatform() && !gameOver) {
    gameOver = true;
    console.log("Game Over");
    controlsElement.classList.remove("hidden");
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
