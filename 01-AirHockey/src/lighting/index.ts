import * as THREE from "three";
function createPointLight(
  color: number,
  position: THREE.Vector3
): THREE.PointLight {
  const intensity = 30;
  const decay = 0;

  const pointLight = new THREE.PointLight(color, intensity, decay);
  pointLight.position.copy(position);
  pointLight.castShadow = true;
  return pointLight;
}

export function createLights(scene: THREE.Scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  // Create and add point lights for arcade-style lighting
  const redPointLight = createPointLight(0xff0000, new THREE.Vector3(-5, 5, 5));
  scene.add(redPointLight);

  const bluePointLight = createPointLight(
    0x0000ff,
    new THREE.Vector3(5, 5, -5)
  );
  scene.add(bluePointLight);

  const greenPointLight = createPointLight(
    0x00ff00,
    new THREE.Vector3(5, 5, 5)
  );
  scene.add(greenPointLight);

  const whitePointLight1 = createPointLight(
    0xffffff,
    new THREE.Vector3(5, 5, 5)
  );
  scene.add(whitePointLight1);

  const whitePointLight2 = createPointLight(
    0xffffff,
    new THREE.Vector3(-5, 5, -5)
  );
  scene.add(whitePointLight2);

  const redPointLightHelper = new THREE.PointLightHelper(redPointLight);
  scene.add(redPointLightHelper);

  const bluePointLightHelper = new THREE.PointLightHelper(bluePointLight);
  scene.add(bluePointLightHelper);

  const greenPointLightHelper = new THREE.PointLightHelper(greenPointLight);
  scene.add(greenPointLightHelper);
}
