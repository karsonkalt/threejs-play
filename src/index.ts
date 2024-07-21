import * as THREE from "three";
import { createLights } from "./lighting";
import { createPaddle, createPuck } from "./shapes";

function main() {
  const canvas = document.querySelector("canvas") as HTMLCanvasElement;
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 5); // Position the camera above and at an angle to the table
  camera.lookAt(0, 0, 0); // Look at the origin

  const scene = new THREE.Scene();
  scene.background = null; // transparent

  createLights(scene);

  const paddle1 = createPaddle();
  paddle1.position.set(-3, 0.1, 0);
  scene.add(paddle1);

  const paddle2 = createPaddle();
  paddle2.position.set(3, 0.1, 0);
  scene.add(paddle2);

  const puck = createPuck();
  puck.position.set(0, 0.1, 0);
  scene.add(puck);

  const paddleSpeed = 0.1;
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const halfTableWidth = canvasWidth / 2;
  const halfTableDepth = canvasHeight / 2;

  const movement = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  function onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowUp":
        movement.up = true;
        break;
      case "ArrowDown":
        movement.down = true;
        break;
      case "ArrowLeft":
        movement.left = true;
        break;
      case "ArrowRight":
        movement.right = true;
        break;
    }
  }

  function onKeyUp(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowUp":
        movement.up = false;
        break;
      case "ArrowDown":
        movement.down = false;
        break;
      case "ArrowLeft":
        movement.left = false;
        break;
      case "ArrowRight":
        movement.right = false;
        break;
    }
  }

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

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

  function updatePaddlePosition() {
    if (movement.up) {
      paddle1.position.z = Math.max(
        -halfTableDepth,
        paddle1.position.z - paddleSpeed
      );
    }
    if (movement.down) {
      paddle1.position.z = Math.min(
        halfTableDepth,
        paddle1.position.z + paddleSpeed
      );
    }
    if (movement.left) {
      paddle1.position.x = Math.max(
        -halfTableWidth,
        paddle1.position.x - paddleSpeed
      );
    }
    if (movement.right) {
      paddle1.position.x = Math.min(
        halfTableWidth,
        paddle1.position.x + paddleSpeed
      );
    }
  }

  function render(time: number) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    updatePaddlePosition();

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
