import * as THREE from "three";
import * as CANNON from "cannon-es";

export class PhysicsObject {
  private static instances: PhysicsObject[] = [];

  constructor(public mesh: THREE.Mesh, public body: CANNON.Body) {
    PhysicsObject.instances.push(this);
  }

  update() {
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);
  }

  static updateAll() {
    for (const instance of PhysicsObject.instances) {
      instance.update();
    }
  }
}
