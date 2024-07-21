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

  let selectedPaddle: THREE.Object3D | null = null;
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onMouseDown(event: MouseEvent) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([paddle1, paddle2], true);

    if (intersects.length > 0) {
      selectedPaddle = intersects[0].object.parent; // Select the parent Group object
    }
  }

  function onMouseMove(event: MouseEvent) {
    if (selectedPaddle) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([puck]);

      if (intersects.length > 0) {
        const intersect = intersects[0];
        const newX = intersect.point.x;
        const newZ = intersect.point.z;

        // Restrict movement within the bounds of the table
        const halfTableWidth = 2.5; // tableWidth / 2
        const halfTableDepth = 1.5; // tableDepth / 2
        selectedPaddle.position.x = Math.max(
          -halfTableWidth,
          Math.min(halfTableWidth, newX)
        );
        selectedPaddle.position.z = Math.max(
          -halfTableDepth,
          Math.min(halfTableDepth, newZ)
        );
      }
    }
  }

  function onMouseUp() {
    selectedPaddle = null;
  }

  window.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);

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

  function render(time: number) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
