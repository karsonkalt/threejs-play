import * as THREE from "three";
import * as CANNON from "cannon-es";
import {
  world,
  createPaddlePhysicsBody,
  createPuckPhysicsBody,
  addGroundPlane,
} from "./physics";
import { createLights } from "./lighting";
import { createPaddle, createPuck } from "./shapes";
import { createCamera } from "./cameras";

function main() {
  const canvas = document.querySelector("canvas") as HTMLCanvasElement;
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  const camera = createCamera();

  const scene = new THREE.Scene();
  scene.background = null; // transparent

  createLights(scene);

  addGroundPlane(world); // Add invisible ground plane to the physics world

  // Create paddles and puck with physics
  const paddle1 = createPaddle();
  paddle1.position.set(-3, 0.1, 0);
  scene.add(paddle1);
  const paddle1Body = createPaddlePhysicsBody(paddle1.position);
  world.addBody(paddle1Body);

  const paddle2 = createPaddle();
  paddle2.position.set(3, 0.1, 0);
  scene.add(paddle2);
  const paddle2Body = createPaddlePhysicsBody(paddle2.position);
  world.addBody(paddle2Body);

  const puck = createPuck();
  puck.position.set(0, 0.1, 0);
  scene.add(puck);
  const puckBody = createPuckPhysicsBody(puck.position);
  world.addBody(puckBody);

  document.addEventListener("mousemove", (event) =>
    handleMouseMove(event, camera, canvas, paddle1, paddle1Body)
  );

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
    world.step(1 / 60); // 60 FPS

    // Update Three.js objects based on Cannon.js physics bodies
    paddle1.position.copy(paddle1Body.position);
    paddle1.quaternion.copy(paddle1Body.quaternion);

    paddle2.position.copy(paddle2Body.position);
    paddle2.quaternion.copy(paddle2Body.quaternion);

    puck.position.copy(puckBody.position);
    puck.quaternion.copy(puckBody.quaternion);
  }

  function render(time: number) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    updatePhysics();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

function handleMouseMove(
  event: MouseEvent,
  camera: THREE.Camera,
  canvas: HTMLCanvasElement,
  paddle: THREE.Object3D,
  paddleBody: CANNON.Body
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

  paddle.position.set(position.x, 0.1, position.z);
  paddleBody.position.set(position.x, 0.1, position.z);
}

main();
