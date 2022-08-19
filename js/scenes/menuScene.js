let menuScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function menuScene() {
    Phaser.Scene.call(this, {
      key: "menuScene",
    });
  },

  preload: function () {
    scene = this;
    soundController = new soundControllerObj();
    soundController.loadSounds();
    preloader();
  },

  create: function () {
    createAnimations();
    this.tutorialMode = true;
    this.matter.world.setBounds(0, -100, GAME_WIDTH, GAME_HEIGHT + 100);
    this.add.image(GAME_WIDTH / 2, Math.floor(GAME_HEIGHT / 2), "splashBg");
    this.counter = 0;
    this.blocks = this.add.group();
    this.blockList = [];
    this.burners = [];
    for (let i = 0; i < 71; i++) {
      let b = new Burner(8 + i * 16, 603);
      this.burners.push(b);
    }

    this.matter.world.on("collisionactive", function (event, bodyA, bodyB) {
      _.each(event.pairs, function (pair) {
        try {
          if (
            pair.bodyA.labelText === "burner" &&
            pair.bodyA.gameObject.image.anims.currentAnim.key === "burnerC"
          ) {
            pair.bodyA.gameObject.burn();
            pair.bodyB.gameObject.payout("burn");
          } else if (
            pair.bodyB.labelText === "burner" &&
            pair.bodyB.gameObject.image.anims.currentAnim.key === "burnerC"
          ) {
            pair.bodyB.gameObject.burn();
            pair.bodyA.gameObject.payout("burn");
          }
        } catch (error) {}
      });
    });

    let that = this;
    let start = scene.add.sprite(
      GAME_WIDTH / 2,
      Math.floor(GAME_HEIGHT / 2) - 100,
      "start"
    );
    start.setOrigin(0.5);
    start.setInteractive();
    start
      .on("pointerover", function () {
        this.setFrame(1);
      })
      .on("pointerout", function () {
        this.setFrame(0);
      })
      .on("pointerdown", function () {
        if (MONITIZATION === "crazygames" && crazysdk) {
          crazysdk.gameplayStart();
        }
        that.scene.start("gameScene");
      });

    if (MONITIZATION === "crazygames") {
      this.add
        .image(GAME_WIDTH - 20, 20, "cgLogo")
        .setOrigin(1, 0)
        .setScale(0.05);
    }
  },

  update: function () {
    this.counter++;
    if (this.counter % 10 === 0) {
      new splashBlock();
    }

    try {
      this.burners[
        this.burners.length - 1 - Math.floor(this.counter / 50)
      ].enable(20);
    } catch (error) {
      this.counter = 0;
    }
  },
});
