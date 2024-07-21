import * as CANNON from "cannon-es";
import * as THREE from "three";

// Export the world
export const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // Normal gravity

// Materials for different objects
const groundMaterial = new CANNON.Material("groundMaterial");
const paddleMaterial = new CANNON.Material("paddleMaterial");
const puckMaterial = new CANNON.Material("puckMaterial");

// Contact materials defining the interaction between objects
const groundPuckContactMaterial = new CANNON.ContactMaterial(
  groundMaterial,
  puckMaterial,
  {
    friction: 0.001,
    restitution: 0.9, // High restitution for elastic collisions
  }
);
world.addContactMaterial(groundPuckContactMaterial);

const paddlePuckContactMaterial = new CANNON.ContactMaterial(
  paddleMaterial,
  puckMaterial,
  {
    friction: 0.01,
    restitution: 0.8, // Slightly lower restitution for controlled impacts
  }
);
world.addContactMaterial(paddlePuckContactMaterial);

const paddleGroundContactMaterial = new CANNON.ContactMaterial(
  paddleMaterial,
  groundMaterial,
  {
    friction: 0.01,
    restitution: 0.2, // Low restitution for paddles to stay on the table
  }
);
world.addContactMaterial(paddleGroundContactMaterial);

// Add ground plane to the world
export function addGroundPlane(world: CANNON.World): void {
  const groundShape = new CANNON.Plane();
  const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
  groundBody.addShape(groundShape);
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(groundBody);
}

// Create paddle physics body
export function createPaddlePhysicsBody(position: THREE.Vector3): CANNON.Body {
  const shape = new CANNON.Cylinder(1, 1, 0.2, 32); // Paddle shape with handle as cylinder
  const body = new CANNON.Body({
    mass: 1, // Dynamic body to move with user input
    position: new CANNON.Vec3(position.x, position.y, position.z),
    material: paddleMaterial,
  });
  body.addShape(shape);
  body.angularDamping = 0.8; // Damping to reduce excessive spinning
  return body;
}

// Create puck physics body
export function createPuckPhysicsBody(position: THREE.Vector3): CANNON.Body {
  const shape = new CANNON.Cylinder(0.5, 0.5, 0.2, 32); // Adjust size as needed
  const body = new CANNON.Body({
    mass: 0.5,
    position: new CANNON.Vec3(position.x, position.y, position.z),
    material: puckMaterial,
  });
  body.addShape(shape);
  body.angularDamping = 0.9; // Damping to reduce excessive spinning
  return body;
}

// Initialize the world
addGroundPlane(world);
