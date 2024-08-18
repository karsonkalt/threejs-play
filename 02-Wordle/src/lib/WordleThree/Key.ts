import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

export class Key {
  // STATE
  private cube: THREE.Mesh;
  private letter: string;
  private hasBeenPressed: boolean = false;

  // CONStANTS
  private defaultColor = 0xdedede;
  private pressedColor = 0xc4c4c4;
  private correctColor = 0x5b915b;
  private absentColor = 0x828282;
  private presentColor = 0xe4e430;

  constructor(letter: string = "Z") {
    this.letter = letter;
    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 0.1, 1),
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
      const material = new THREE.MeshStandardMaterial({ color: 0x000000 });
      const geometry = new TextGeometry(letter, {
        font: font,
        size: 0.4,
        height: 0.01,
        curveSegments: 12,
      });
      const text = new THREE.Mesh(geometry, material);
      text.position.set(-0.18, 0.1, 0.2);
      text.rotateX(-Math.PI / 2);
      this.cube.add(text);

      document.addEventListener("keydown", (event) => {
        if (event.repeat) return; // ignore repeats
        if (event.key.toUpperCase() === this.letter) {
          this.isPressed();
        }
      });

      document.addEventListener("keyup", (event) => {
        if (event.key.toUpperCase() === this.letter) {
          this.isReleased();
        }
      });

      document.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          if (this.hasBeenPressed) {
            this.isPresent();
          }
        }
      });
    });
  }

  public getInstance(): THREE.Mesh {
    return this.cube;
  }

  private isPressed(): void {
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

  private isReleased(): void {
    if (!this.hasBeenPressed)
      this.cube.material = new THREE.MeshPhysicalMaterial({
        color: this.defaultColor,
      });
    this.cube.position.set(
      this.cube.position.x,
      this.cube.position.y + 0.1,
      this.cube.position.z
    );
    this.hasBeenPressed = true;
  }

  public isPresent(): void {
    this.cube.material = new THREE.MeshPhysicalMaterial({
      color: this.presentColor,
      roughness: 0.5,
      metalness: 0,
    });
  }

  public isAbsent(): void {
    this.cube.material = new THREE.MeshPhysicalMaterial({
      color: this.absentColor,
      roughness: 0.5,
      metalness: 0,
    });
  }

  public isCorrect(): void {
    this.cube.material = new THREE.MeshPhysicalMaterial({
      color: this.correctColor,
      roughness: 0.5,
      metalness: 0,
    });
  }
}
