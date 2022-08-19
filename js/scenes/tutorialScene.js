let tutorialScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function tutorialScene() {
    Phaser.Scene.call(this, {
      key: "tutorialScene",
    });
  },

  preload: function () {
    scene = this;
    preloader();
  },

  create: function () {
    soundController.addSounds();
    this.tutorialMode = true;
    this.tutorialStage = 0;
    createAnimations();
    drawBackground(false);

    drawStage(this.tutorialStage);

    this.bg.setFrame(1);
    this.zoneClear = false;
    this.counter = 0;
    this.heartbeat = 0;
    this.blocks = this.add.group();
    this.achievementManager = new achievementManager();

    this.matter.world.on("collisionstart", function (event, bodyA, bodyB) {
      _.each(event.pairs, function (pair) {
        try {
          if (pair.bodyA.gameObject.y > 0) {
            pair.bodyA.gameObject.falling = false;
            pair.bodyB.gameObject.falling = false;
          }
        } catch (error) {}
      });
    });

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

    this.tips = new tooltip();
    this.tutorial = new tutorialWindow();

    scene.skip = new simpleButton(80, 45, "skipTutorial", "Skip Tutorial");
    scene.skip.setTitle("Skip Tutorial");
    scene.skip.setText("Know what you're doing? Skip the tutorial!");
    scene.skip.button.on(
      "pointerup",
      function () {
        soundController.play("click");
        stats.lp = stats.clickLevel - 1;
        _.each(this.upgrades, function (u) {
          u.reset();
        });
        _.each(this.lps, function (u) {
          u.reset();
        });
        saveGame();
        // location.reload();
        scene.scene.start("gameScene");
      },
      scene
    );
  },

  update: function () {
    this.achievementManager.tick();
    this.burnerManager.tick();
    this.counter++;
    this.heartbeat++;
    let droprate = 80;
    if (this.skills && scene.skills[0].active) {
      droprate = 40;
    }
    if (this.counter > droprate && !this.zoneClear) {
      saveGame();
      this.counter = 0;
      this.blocks.children.each(function (b) {
        if (
          b.body &&
          b.y - b.radius < 40 &&
          b.body.velocity.x < 0.1 &&
          b.body.velocity.y < 0.1
        ) {
          scene.zoneClear = true;
        }
      });
      new TutorialBlock();
      if (this.blocks.countActive() > 50 && this.tutorialStage !== 2) {
        scene.burnerManager.currentPattern = 2;
      }
    }
    if (this.zoneClear) {
      this.zoneClear = popNext();
      if (!this.zoneClear) {
        stats.tutorialComplete = true;
        stats.lp = stats.clickLevel - 1;
        _.each(this.upgrades, function (u) {
          u.reset();
        });
        _.each(this.lps, function (u) {
          u.reset();
        });
        saveGame();
        // location.reload();
        // scene.scene.stop()
        scene.scene.start("gameScene");
      }
    }
  },
});

function drawStage(stage) {
  switch (stage) {
    case 0:
      scene.tutorialBar = new expBar(1009, 105, false);
      scene.tutorialBar.setProgress(0);
      let steps = 15;
      scene.fg;
      scene.leftWall.x = 25 + steps * 16;
      scene.rightWall.x = 889 - steps * 16;
      scene.matter.world.setBounds(
        32 + steps * 16,
        -1000,
        864 - steps * 2 * 16,
        1498
      );
      break;
    case 1:
      tutorialDrawUpgrades();
      break;

    default:
      break;
  }
}
