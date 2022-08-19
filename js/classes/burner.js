class Burner extends Phaser.GameObjects.Container {
  constructor(x, y) {
    super(scene, x, y);
    scene.add.existing(this);
    this.setSize(16, 30);
    scene.matter.add.gameObject(this, { isStatic: true });
    this.image = scene.add.sprite(0, 0, "burner");
    this.state = "burnerA";
    this.image.play(this.state);
    this.grounded = true;
    this.counter = 5;
    this.add(this.image);
    let that = this;

    this.image.on("animationcomplete", function (animation, frame) {
      switch (animation.key) {
        case "burnerBurnout":
          that.image.play("burnerA");
          that.broken = false;
          break;
        case "burnerJ":
          that.image.play("burnerK");
          break;
        case "burnerK":
          if (scene.skills[5].active) {
            that.image.play("burnerK");
          } else {
            that.image.play("burnerL");
          }

          break;
        case "burnerL":
          that.image.play("burnerA");
          that.broken = false;
          break;
        case "burnerB":
          that.image.play("burnerC");
          that.enabling = false;
          break;
        case "burnerC":
          if (that.counter > 0) {
            that.counter--;
            that.image.play("burnerC");
          } else {
            that.counter = 5;
            that.image.play("burnerD");
          }
          break;
        case "burnerD":
          that.image.play("burnerA");
          break;
        default:
          break;
      }
    });

    this.body.labelText = "burner";
    this.body.burning = false;
  }

  burn() {
    try {
      let that = this;
      let tints = [0xff5a19, 0xff3919, 0xff6721];
      let x = 0;
      let intervalID = setInterval(function () {
        try {
          let fadeHeight = Phaser.Math.Between(-30, -10);
          let at = scene.add.sprite(
            that.x + Phaser.Math.Between(-10, 10),
            that.y - 16,
            "pixel2"
          );
          // at.setScale(1.5);
          at.tint = tints[Phaser.Math.Between(0, 2)];
          at.upTween = scene.tweens.add({
            targets: at,
            y: 430 - fadeHeight,
            alpha: 0.2,
            duration: 500,
            ease: "Cubic.easeIn",
            onComplete: function () {
              this.targets[0].destroy();
            },
          });
          if (++x === 20) {
            clearInterval(intervalID);
          }
        } catch (error) {}
      }, 5);
    } catch (error) {}
  }

  enable(duration) {
    if (this.image.anims.currentAnim.key !== "burnerA") {
      return;
    }
    if (!scene.tutorialMode) {
      if (scene.upgrades[7].getLevel() + scene.lps[5].getLevel() >= 10) {
        scene.achievementManager.assessMetric("frozernBurner");
      }
      if (
        Phaser.Math.Between(1, 33) <=
        scene.upgrades[7].getLevel() + scene.lps[5].getLevel()
      ) {
        this.image.play("burnerBurnout");
        this.broken = true;
        return;
      }
    }
    this.counter = duration;
    this.image.play("burnerB");
    this.enabling = true;
  }

  break() {
    this.broken = true;
    this.image.play("burnerJ");
  }
}
