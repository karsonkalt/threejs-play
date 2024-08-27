import { UpdateManager } from "./updateManager";
import * as THREE from "three";
import * as CANNON from "cannon-es";

export class Block {
  constructor(
    private scene: THREE.Scene,
    private world: CANNON.World,
    private updateManager: UpdateManager,
    private position: CANNON.Vec3
  ) {
    this.createBlock();
  }

  private createBlock() {
    const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
    const blockMaterial = new THREE.MeshPhysicalMaterial({ color: 0x00aaff });
    const block = new THREE.Mesh(blockGeometry, blockMaterial);
    block.castShadow = true;

    block.position.copy(this.position as unknown as THREE.Vector3);
    this.scene.add(block);

    const blockShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    const blockBody = new CANNON.Body({
      mass: 10,
      position: this.position.clone(),
      shape: blockShape,
    });
    this.world.addBody(blockBody);

    // Register block's update function to the UpdateManager
    this.updateManager.register(() => {
      block.position.copy(blockBody.position as unknown as THREE.Vector3);
      block.quaternion.copy(
        blockBody.quaternion as unknown as THREE.Quaternion
      );
    });
  }
}
