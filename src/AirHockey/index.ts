import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import CannonDebugger from "cannon-es-debugger";
import * as CANNON from "cannon-es";
import {
  world,
  createPaddlePhysicsObject,
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
  const cannonDebugger = new CannonDebugger(scene, world, {}) as any;

  createLights(scene);

  addGroundPlane(world, scene);

  const paddle1 = createPaddlePhysicsObject(new THREE.Vector3(-3, 1, 0));
  scene.add(paddle1.mesh);
  world.addBody(paddle1.body);

  const paddle2 = createPaddlePhysicsObject(new THREE.Vector3(3, 1, 0));
  scene.add(paddle2.mesh);
  world.addBody(paddle2.body);

  addPuck(camera, canvas, scene);

  addWalls(world, scene, canvas);

  const controlsElement = document.querySelector("#controls")!;
  const addPuckButton = document.createElement("button");
  addPuckButton.id = "add-puck";
  addPuckButton.textContent = "Add Puck";
  controlsElement.appendChild(addPuckButton);

  addPuckButton.addEventListener("click", (event) => {
    addPuck(camera, canvas, scene);
  });

  // document.addEventListener("mousemove", (event) =>
  //   handleMouseMove(event, camera, canvas, paddle1)
  // );

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

    cannonDebugger.update();

    handleMovement(paddle1, "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight");
    handleMovement(paddle2, "w", "s", "a", "d");

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
  const puck = createPuckPhysicsObject(new THREE.Vector3(dropX, 1, dropZ));

  const [spinX, spinY, spinZ] = Array.from(
    { length: 3 },
    () => Math.random() * 2 - 1
  );
  puck.body.velocity.set(spinX, spinY, spinZ);

  scene.add(puck.mesh);
  world.addBody(puck.body);
}

function handleMouseMove(
  event: MouseEvent,
  camera: THREE.Camera,
  canvas: HTMLCanvasElement,
  paddle: PhysicsObject
) {
  const canvasBounds = canvas.getBoundingClientRect();
  const mouseX = event.clientX - canvasBounds.left;
  const mouseY = event.clientY - canvasBounds.top;

  const normalizedX = (mouseX / canvasBounds.width) * 2 - 1;
  const normalizedY = -(mouseY / canvasBounds.height) * 2 + 1;

  const vector = new THREE.Vector3(normalizedX, normalizedY, 0.5);
  vector.unproject(camera);

  const dir = vector.sub(camera.position).normalize();
  const distance = -camera.position.y / dir.y;
  const position = camera.position.clone().add(dir.multiplyScalar(distance));
  const currentPaddleY = paddle.mesh.position.y;

  paddle.mesh.position.set(position.x, currentPaddleY, position.z);
  paddle.body.velocity.set(0, 0, 0);
  paddle.body.angularVelocity.set(0, 0, 0);
  paddle.body.position.set(position.x, currentPaddleY, position.z);
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
