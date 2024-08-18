import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

export class Key {
  private cube: THREE.Mesh;
  private letter: string;
  private pressedColor = 0x545454;
  private defaultColor = 0x2f2f2f;

  constructor(letter: string = "Z") {
    this.letter = letter;
    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 0.5, 1),
      new THREE.MeshPhysicalMaterial({
        color: this.defaultColor,
        roughness: 0.5,
        metalness: 0,
      })
    );
    this.cube.position.set(1, 1, 1);
    this.cube.castShadow = true;

    const loader = new FontLoader();
    loader.load("/fonts/helvetiker_bold.typeface.json", (font) => {
      const material = new THREE.MeshStandardMaterial({ color: 0xd3d3d3 });
      const geometry = new TextGeometry(letter, {
        font: font,
        size: 0.4, // Adjust size to fit on top of the cube
        height: 0.05, // Adjust height to make it look like a keyboard button
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 1,
      });
      const text = new THREE.Mesh(geometry, material);
      text.position.set(-0.18, 0.3, 0.2);
      text.rotateX(-Math.PI / 2);
      this.cube.add(text);

      document.addEventListener("keydown", (event) => {
        if (event.key.toUpperCase() === this.letter) {
          // turn it yello
          this.cube.material = new THREE.MeshPhysicalMaterial({
            color: this.pressedColor,
            roughness: 0.5,
            metalness: 0,
          });
          this.cube.position.set(
            this.cube.position.x,
            this.cube.position.y - 0.1,
            this.cube.position.z
          );
        }
      });

      document.addEventListener("keyup", (event) => {
        if (event.key.toUpperCase() === this.letter) {
          // turn it yello
          this.cube.material = new THREE.MeshPhysicalMaterial({
            color: this.defaultColor,
            roughness: 0.5,
            metalness: 0,
          });
          this.cube.position.set(
            this.cube.position.x,
            this.cube.position.y + 0.1,
            this.cube.position.z
          );
        }
      });
    });
  }

  public getInstance(): THREE.Mesh {
    return this.cube;
  }

  public setPosition(x: number, y: number, z: number): void {
    this.cube.position.set(x, y, z);
  }

  public setScale(x: number, y: number, z: number): void {
    this.cube.scale.set(x, y, z);
  }

  public static createDefault(): LetterCube {
    return new LetterCube();
  }
}
