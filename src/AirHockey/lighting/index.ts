import * as THREE from "three";

export function createLights(scene: THREE.Scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
  directionalLight.position.set(0, 50, 0);
  directionalLight.castShadow = true; // Enable shadows
  directionalLight.shadow.mapSize.width = 1024; // Shadow resolution
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  // const directionalLightHelper = new THREE.DirectionalLightHelper(
  //   directionalLight,
  //   5
  // );
  // scene.add(directionalLightHelper);

  const pointLight = new THREE.PointLight(0xffffff, 0.6, 100);
  pointLight.position.set(0, 10, 0);
  pointLight.castShadow = true; // Enable shadows
  pointLight.shadow.mapSize.width = 1024; // Shadow resolution
  pointLight.shadow.mapSize.height = 1024;
  pointLight.shadow.camera.near = 0.5;
  pointLight.shadow.camera.far = 50;
  scene.add(pointLight);

  // const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
  // scene.add(pointLightHelper);

  const redSpotLight = new THREE.SpotLight(0xff0000, 50);
  redSpotLight.position.set(-5, 5, 5);
  redSpotLight.angle = Math.PI / 2;
  redSpotLight.penumbra = 0.75;
  redSpotLight.decay = 2;
  redSpotLight.distance = 50;
  redSpotLight.castShadow = true;
  scene.add(redSpotLight);

  const blueSpotLight = new THREE.SpotLight(0x0000ff, 50);
  blueSpotLight.position.set(5, 5, -5);
  blueSpotLight.angle = Math.PI / 2;
  blueSpotLight.penumbra = 0.75;
  blueSpotLight.decay = 2;
  blueSpotLight.distance = 50;
  blueSpotLight.castShadow = true;
  scene.add(blueSpotLight);

  const greenSpotLight = new THREE.SpotLight(0x00ff00, 50);
  greenSpotLight.position.set(-5, 5, -5);
  greenSpotLight.angle = Math.PI / 2;
  greenSpotLight.penumbra = 0.75;
  greenSpotLight.decay = 2;
  greenSpotLight.distance = 50;
  greenSpotLight.castShadow = true;
  scene.add(greenSpotLight);

  // const redSpotLightHelper = new THREE.SpotLightHelper(redSpotLight);
  // scene.add(redSpotLightHelper);

  // const blueSpotLightHelper = new THREE.SpotLightHelper(blueSpotLight);
  // scene.add(blueSpotLightHelper);

  // const greenSpotLightHelper = new THREE.SpotLightHelper(greenSpotLight);
  // scene.add(greenSpotLightHelper);
}
