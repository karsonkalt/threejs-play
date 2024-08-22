import Phaser from "phaser";

import HelloWorldScene from "./scenes/HelloWorldScene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      // debug: true,
    },
  },
  scene: [HelloWorldScene],
};

new Phaser.Game(config);
