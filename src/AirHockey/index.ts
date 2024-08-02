import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import CannonDebugger from "cannon-es-debugger";
import * as CANNON from "cannon-es";
import {
  world,
  Paddle,
  createPuckPhysicsObject,
  addGroundPlane,
  addWalls,
} from "./physics";
import { createLights } from "./lighting";
import { createCamera } from "./cameras";
import { PhysicsObject } from "./PhysicsObject";

export function AirHockey() {
  const canvas = document.querySelector("canvas") as HTMLCanvasElement;
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
    // alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  const camera = createCamera();

  const scene = new THREE.Scene();
  // scene.background = null;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false;

  //@ts-ignore
  // const cannonDebugger = new CannonDebugger(scene, world, {}) as any;

  createLights(scene);
  addGroundPlane(world, scene);

  const playableArea = addWalls(world, scene, canvas);
  const leftX = playableArea.minX;
  const rightX = playableArea.maxX;
  const midX = (playableArea.minX + playableArea.maxX) / 2;

  const paddle1 = new Paddle(new THREE.Vector3(-3, 1, 0), {
    minLeft: leftX,
    maxRight: midX,
  });
  scene.add(paddle1.mesh);
  world.addBody(paddle1.body);

  const paddle2 = new Paddle(new THREE.Vector3(3, 1, 0), {
    minLeft: midX,
    maxRight: rightX,
  });
  scene.add(paddle2.mesh);
  world.addBody(paddle2.body);

  addPuck(camera, canvas, scene);

  const controlsElement = document.querySelector("#controls")!;
  const addPuckButton = document.createElement("button");
  addPuckButton.id = "add-puck";
  addPuckButton.textContent = "Add Puck";
  controlsElement.appendChild(addPuckButton);

  addPuckButton.addEventListener("click", (event) => {
    addPuck(camera, canvas, scene);
  });

  function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = Math.floor(canvas.clientWidth * pixelRatio);
    const height = Math.floor(canvas.clientHeight * pixelRatio);
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function updatePhysics() {
    world.step(1 / 60);
    PhysicsObject.updateAll();
  }

  function render(time: number) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // cannonDebugger.update();

    handleMovement(paddle1, "w", "s", "a", "d");
    handleMovement(paddle2, "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight");

    updatePhysics();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

function addPuck(
  camera: THREE.Camera,
  canvas: HTMLCanvasElement,
  scene: THREE.Scene
) {
  // Drop slightly off center
  const dropX = Math.random() * 2 - 1;
  const dropZ = Math.random() * 2 - 1;
  const puck = createPuckPhysicsObject(new THREE.Vector3(dropX, 3, dropZ));

  // In from an angle
  const [dirX, dirY, dirZ] = Array.from(
    { length: 3 },
    () => Math.random() * 2 - 1
  );
  puck.body.velocity.set(dirX, dirY, dirZ);
  puck.body.angularVelocity.set(0, 0, Math.random() * 3 - 1);

  scene.add(puck.mesh);
  world.addBody(puck.body);
}

const keysPressed: { [key: string]: boolean } = {};

document.addEventListener("keydown", (event) => {
  keysPressed[event.key] = true;
});

document.addEventListener("keyup", (event) => {
  keysPressed[event.key] = false;
});

function handleMovement(
  paddle: PhysicsObject,
  upKey: string,
  downKey: string,
  leftKey: string,
  rightKey: string
) {
  const acceleration = 0.2;
  const maxSpeed = 8;
  let velocityX = 0;
  let velocityZ = 0;

  if (keysPressed[upKey]) velocityZ -= acceleration;
  if (keysPressed[downKey]) velocityZ += acceleration;
  if (keysPressed[leftKey]) velocityX -= acceleration;
  if (keysPressed[rightKey]) velocityX += acceleration;

  paddle.body.velocity.x = THREE.MathUtils.clamp(
    paddle.body.velocity.x + velocityX,
    -maxSpeed,
    maxSpeed
  );
  paddle.body.velocity.z = THREE.MathUtils.clamp(
    paddle.body.velocity.z + velocityZ,
    -maxSpeed,
    maxSpeed
  );
}
