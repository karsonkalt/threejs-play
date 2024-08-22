import Phaser from "phaser";

export default class HelloWorldScene extends Phaser.Scene {
  player: Phaser.Physics.Arcade.Sprite | undefined = undefined;
  score = 0;
  scoreText: Phaser.GameObjects.Text | undefined = undefined;

  constructor() {
    super("hello-world");
  }

  preload() {
    this.load.setBaseURL("/");

    this.load.image("platform", "assets/platform.png");
    this.load.image("star", "assets/star.png");
    this.load.image("sky", "assets/sky.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.spritesheet("frog_hop", "assets/frog/frog_hop.png", {
      frameWidth: 48,
      frameHeight: 32,
    });
    this.load.spritesheet("frog_idle", "assets/frog/frog_idle.png", {
      frameWidth: 48,
      frameHeight: 32,
    });
    this.load.spritesheet("frog_explode", "assets/frog/frog_explode.png", {
      frameWidth: 48,
      frameHeight: 32,
    });
  }

  create() {
    this.add.image(400, 300, "sky");

    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, "platform").setScale(2).refreshBody();
    platforms.create(600, 400, "platform");
    platforms.create(50, 250, "platform");
    platforms.create(750, 280, "platform");

    const player = this.physics.add.sprite(100, 450, "frog_hop");
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.body.setGravityY(300);
    // adjust the hitbox
    player.setSize(20, 18).setOffset(12, 14);
    this.player = player;
    player.setScale(2).refreshBody();

    this.physics.add.collider(player, platforms);

    // PLAYER ANIMATIONS
    this.anims.create({
      key: "hop",
      frames: this.anims.generateFrameNumbers("frog_hop", { start: 3, end: 6 }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("frog_idle", {
        start: 0,
        end: 7,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("frog_explode", {
        start: 0,
        end: 8,
      }),
      frameRate: 6,
      repeat: 1,
    });

    // STARS
    const stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });
    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.8, 1));
    });
    this.physics.add.collider(stars, platforms);
    function collectStar(player, star) {
      star.disableBody(true, true);

      this.score += 10;
      this.scoreText.setText("Score: " + this.score);
    }
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "18px",
      fill: "#000",
    });

    // BOMBS
    const bombs = this.physics.add.group({
      key: "bomb",
      repeat: 3,
      setXY: { x: 58, y: 200, stepX: 200 },
    });
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
    function hitBomb(player, bomb) {
      this.physics.pause();
      player.setTint(0xff0000);
      player.anims.play("explode", true);
    }
  }

  update() {
    const cursors = this.input.keyboard!.createCursorKeys();
    if (cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("hop", true);
      this.player.flipX = true;
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("hop", true);
      this.player.flipX = false;
    } else {
      this.player.anims.play("idle", true);
      this.player.setVelocityX(0);
    }

    if (cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-450);
    }
  }
}
