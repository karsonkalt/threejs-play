import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import CannonDebugger from "cannon-es-debugger";
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

function main() {
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

  addGroundPlane(world);

  const paddle1 = createPaddlePhysicsObject(new THREE.Vector3(-3, 1, 0));
  scene.add(paddle1.mesh);
  world.addBody(paddle1.body);

  const paddle2 = createPaddlePhysicsObject(new THREE.Vector3(3, 1, 0));
  scene.add(paddle2.mesh);
  world.addBody(paddle2.body);

  const puck = createPuckPhysicsObject(new THREE.Vector3(0, 1, 0));
  scene.add(puck.mesh);
  world.addBody(puck.body);

  addWalls(world, scene, canvas);

  document.addEventListener("mousemove", (event) =>
    handleMouseMove(event, camera, canvas, paddle1)
  );

  const addPuckButton = document.querySelector("#add-puck")!;

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
  const randomX = Math.random() * 2 - 1;
  const randomZ = Math.random() * 2 - 1;
  const puck = createPuckPhysicsObject(new THREE.Vector3(randomX, 1, randomZ));
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

main();
