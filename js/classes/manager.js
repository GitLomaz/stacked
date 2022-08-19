class manager extends Phaser.GameObjects.Container {
  constructor() {
    super(scene, -100, 150);
    this.setSize(196, 48);
    this.setInteractive();
    this.setScrollFactor(0);
    this.bonuses = ["+50% Money", "+50% Blocks"];
    this.bonus = Phaser.Math.Between(0, 1);
    this.transition = false;
    this.bonusActive = false;
    this.cooldown = 60 * 30;
    this.cooldownType = "noad";
    this.points = false;
    this.spawn = false;
    this.end = null;
    this.playingAd = false;

    let r1 = scene.add.sprite(0, 0, "ad").setFrame(1);
    this.topText = scene.add
      .text(-5, -8, "Top Text", {
        color: "#ccdde3",
        fontSize: "14px",
      })
      .setOrigin(0.5);

    this.bottomText = scene.add
      .text(-5, 8, "bottom Text", {
        color: "#ccdde3",
        fontSize: "14px",
      })
      .setOrigin(0.5);
    this.add(r1);
    this.add(this.topText);
    this.add(this.bottomText);

    this.on("pointerup", function (pointer) {
      if (!this.bonusActive && !this.transition) {
        scene.musicController.stop();
        scene.adType = "slideout";
        if (MONITIZATION === "cpmstar") {
          displayRewardedVideo();
        } else if (MONITIZATION === "crazygames") {
          if (crazysdk) {
            crazysdk.requestAd("rewarded");
          }
        } else if (MONITIZATION === "admob") {
          if (AdMob && AdMob.adQueued) {
            AdMob.showRewardVideoAd();
          }
        }
      }
    });
    scene.add.existing(this);
    this.setDepth(10);
  }

  tick() {
    if (
      this.playingAd ||
      (MONITIZATION === "admob" && !AdMob.adQueued) ||
      !MONITIZATION
    ) {
      return;
    }
    if (this.cooldown === 0 && !this.bonusActive) {
      switch (this.cooldownType) {
        case "noad":
          this.prompt();
          this.cooldown = 60 * 30;
          break;
        case "ad":
          this.hide();
          this.cooldown = 60 * 90;
          break;
        default:
          break;
      }
    } else if (!this.bonusActive) {
      this.cooldown--;
    } else {
      let now = Math.floor(new Date().getTime() / 1000);
      let remaining = this.end - now;
      this.bottomText.setText(remaining + "s Remaining");
      if (remaining < 0) {
        this.bottomText.setText("0s Remaining");
        this.doublePoints = false;
        this.doubleSpawn = false;
        this.noDespawn = false;
        this.bonusActive = false;
        this.cooldownType = "noad";
        this.cooldown = 60 * 120;
        this.hide();
      }
    }
  }

  prompt() {
    let that = this;
    this.bonus = Phaser.Math.Between(0, 1);
    this.transition = true;
    this.topText.setText(this.bonuses[this.bonus]);
    this.bottomText.setText("Watch Ad");
    scene.tweens.add({
      targets: that,
      x: 80,
      ease: "Linear",
      duration: 800,
      onComplete: function () {
        that.cooldownType = "ad";
        that.transition = false;
      },
    });
  }

  hide() {
    let that = this;
    this.transition = true;
    scene.tweens.add({
      targets: that,
      x: -100,
      ease: "Linear",
      duration: 800,
      onComplete: function () {
        that.cooldownType = "noad";
        that.cooldown = 60 * 120;
        that.transition = false;
      },
    });
  }

  completeAd() {
    this.playingAd = false;
    scene.musicController.play();
    if (scene.adType === "slideout") {
      if (GAObject) {
        GAObject.submitEvent("ad:slideout", 1);
      }
      this.activateBonus();
    } else if ((scene.adType = "skillCooldown")) {
      if (GAObject) {
        GAObject.submitEvent("ad:skill:" + scene.skillCooldownAdIndex, 1);
      }
      let skill = scene.skills[scene.skillCooldownAdIndex - 1];
      clearInterval(skill.cooldownInterval);
      skill.cooldownGraphic.visible = false;
      skill.skipCooldown.visible = false;
      skill.cooldownCounter = 0;
      skill.setUI();
      scene.skillCooldownAdIndex = null;
    }
    scene.adType = false;
  }

  activateBonus() {
    this.x = 80;
    this.bonusActive = true;
    this.end = Math.floor(new Date().getTime() / 1000) + 180;
    this.bottomText.setText(180 + "s Remaining");
    switch (this.bonus) {
      case 0:
        this.points = true;
        break;
      case 1:
        this.spawn = true;
        break;
      default:
        break;
    }
  }
}
