import Phaser from "phaser";

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("hello-world");
  }

  preload() {
    this.load.setBaseURL("/");

    this.load.image("dude", "assets/dude.png");
  }

  create() {
    this.add.image(10, 10, "dude");

    const dude = this.physics.add.image(10, 10, "dude");

    dude.setVelocity(100, 200);
    dude.setBounce(1, 1);
    dude.setCollideWorldBounds(true);
  }
}
