class skillButton extends Phaser.GameObjects.Container {
  constructor(x, y, index) {
    super(scene, x, y);
    this.button = scene.add.sprite(x, y, "skill" + index);
    this.button.setOrigin(0);
    this.button.setInteractive();

    if (!MOBILE) {
      this.button.on("pointerdown", this.click, this);
    } else {
      this.button.on("pointerdown", this.tap, this);
      this.button.on("pointerup", this.untap, this);
    }

    this.index = index;
    this.locked = true;
    if (this.index === 1) {
      this.locked = false;
    }
    this.cooldownCounter = 0;
    this.cooldownLength = 0;
    this.autoCast = false;
    this.activeCooldownCounter = 0;
    this.activeCooldownLength = 0;
    this.cooldownInterval = null;
    this.activeIntervalInterval = null;
    this.cooldownGraphic = scene.add.sprite(x, y, "skillCooldown").setOrigin(0);
    this.activeGraphic = scene.add.sprite(x, y, "skillActive").setOrigin(0);
    this.autocastGraphic = scene.add
      .sprite(x, y, "skillAutocast")
      .setOrigin(0)
      .play("skillAutocast");
    this.cooldownGraphic.visible = false;
    this.activeGraphic.visible = false;
    this.autocastGraphic.visible = false;
    this.active = false;
    this.countdown = scene.add
      .text(32, 28, this.getCounterString())
      .setOrigin(0.5);
    this.useCount = 0;
    this.totalUseCount = 0;
    this.add(this.countdown);
    this.loadStats();

    this.challengeLock = scene.add.sprite(x, y, "skillLock");
    this.challengeLock.setOrigin(0);
    this.challengeLock.visible = false;
    this.challengeLocked = false;

    // Tooltip logic
    let that = this;
    this.button
      .on("pointerover", function () {
        scene.tips.setValues(that.getText());
        if (
          that.cooldownCounter === 0 &&
          that.activeCooldownCounter === 0 &&
          !that.locked
        ) {
          that.button.setFrame(2);
        }
      })
      .on("pointerout", function () {
        scene.tips.clearValues("");
        if (that.index === 10 && that.active == true) {
          that.button.setFrame(2);
        } else if (
          that.cooldownCounter === 0 &&
          that.activeCooldownCounter === 0 &&
          !that.locked
        ) {
          that.button.setFrame(1);
        }
      });
    scene.add.existing(this);
    let key = "keydown-";
    switch (this.index) {
      case 1:
        key += "ONE";
        break;
      case 2:
        key += "TWO";
        break;
      case 3:
        key += "THREE";
        break;
      case 4:
        key += "FOUR";
        break;
      case 5:
        key += "FIVE";
        break;
      case 6:
        key += "SIX";
        break;
      case 7:
        key += "SEVEN";
        break;
      case 8:
        key += "EIGHT";
        break;
      case 9:
        key += "NINE";
        break;
      case 10:
        key += "ZERO";
        break;

      default:
        break;
    }
    scene.input.keyboard.on(key, function () {
      that.click();
    });

    if (this.index !== 9 && MONITIZATION) {
      this.skipCooldown = scene.add
        .sprite(32, 44, "skipCooldown")
        .setInteractive();
      this.skipCooldown
        .on("pointerover", function () {
          scene.tips.setValues({
            title: "Skip Cooldown",
            text: "watch a short ad to skip the cooldown\r\nof the skill",
          });
          this.setFrame(1);
        })
        .on("pointerout", function () {
          scene.tips.clearValues("");
          this.setFrame(0);
        })
        .on("pointerdown", function () {
          scene.musicController.stop();
          scene.adType = "skillCooldown";
          scene.skillCooldownAdIndex = that.index;
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
        });
      this.add(this.skipCooldown);
      this.skipCooldown.visible = false;
    }
  }

  tick() {
    if (this.autoCast) {
      if (
        this.cooldownCounter === 0 &&
        this.activeCooldownCounter === 0 &&
        !this.locked &&
        !this.challengeLocked
      ) {
        this.activate();
      }
    }
  }

  checkLock() {
    if (stats.level >= this.unlockAt) {
      this.locked = false;
      this.setUI();
    }
  }

  checkChallengeLock() {
    if (
      stats.challengeActive &&
      challenges[stats.currentChallenge].disabledSkills[this.index - 1]
    ) {
      this.challengeLocked = true;
      this.challengeLock.visible = true;
      this.countdown.visible = false;
      this.cooldownGraphic.visible = false;
      this.activeGraphic.visible = false;
      if (this.activeCooldownCounter > 0) {
        clearInterval(this.activeIntervalInterval);
        this.activeCooldownCounter = 0;
        if (this.index === 3) {
          scene.matter.world.localWorld.gravity.y = 0.2;
        }
        this.activeGraphic.visible = false;
        this.setCooldown();
        this.active = false;
      }
    } else {
      this.challengeLocked = false;
      this.challengeLock.visible = false;
      this.countdown.visible = true;
    }
  }

  setState(
    useCount = 0,
    totalUseCount = 0,
    activeCooldownCounter = 0,
    cooldownCounter = 0,
    locked = true,
    autoCast = false
  ) {
    this.totalUseCount = totalUseCount;
    this.useCount = useCount;
    this.locked = locked;
    this.autoCast = autoCast;
    this.autocastGraphic.visible = autoCast;
    if (cooldownCounter > 0) {
      this.setCooldown(cooldownCounter);
    } else if (activeCooldownCounter > 0) {
      this.activate(activeCooldownCounter);
    }
  }

  getText() {
    let ret = {};
    switch (this.index) {
      case 1:
        ret.title = "Faster Spawns";
        ret.text = "Increase Block Spawn Rate by 100%";
        break;
      case 2:
        ret.title = "Clicker";
        ret.text = "Clicks All Cubes";
        break;
      case 3:
        ret.title = "Lunar Gravity";
        ret.text = "Makes Blocks Fall Slower";
        break;
      case 4:
        ret.title = "Increased Value";
        ret.text = "Blocks Are Worth More";
        break;
      case 5:
        ret.title = "Big Blocks";
        ret.text = "Increase Block Size";
        break;
      case 6:
        ret.title = "Misfire";
        ret.text = "Disables 50% of burners";
        break;
      case 7:
        ret.title = "Focused Drops";
        ret.text = "Only Spawn Blocks In The Middle";
        break;
      case 8:
        ret.title = "Profit";
        ret.text = "Increase Value By 5% (Stacks)";
        break;
      case 9:
        ret.title = "Cooldown Reset";
        ret.text = "Resets Cooldown On All Skills";
        break;
      case 10:
        ret.title = "Meta Boost";
        ret.text = "Doubles The Duration Of Next Skill Used";
        break;
      default:
        break;
    }
    if (this.locked) {
      ret.topRightText = "UNLOCK ON ZONE " + this.unlockAt;
    }
    return ret;
  }

  click() {
    soundController.play("click");
    if (scene.shift.isDown) {
      if (scene.tiers[0].bought) {
        this.autoCast = !this.autoCast;
        this.autocastGraphic.visible = this.autoCast;
      }
    } else {
      if (
        this.cooldownCounter === 0 &&
        this.activeCooldownCounter === 0 &&
        !this.locked &&
        !this.challengeLocked
      ) {
        this.activate();
      }
    }
  }

  tap() {
    soundController.play("click");
    this.tapStart = Date.now();
  }

  untap() {
    if (this.tapStart) {
      let now = Date.now();
      let duration = Math.floor(now - this.tapStart);
      console.log(duration);
      if (duration > 250) {
        if (scene.tiers[0].bought) {
          this.autoCast = !this.autoCast;
          this.autocastGraphic.visible = this.autoCast;
        }
        return;
      }
    }
    this.tapStart = null;
    if (
      this.cooldownCounter === 0 &&
      this.activeCooldownCounter === 0 &&
      !this.locked &&
      !this.challengeLocked
    ) {
      this.activate();
    }
  }

  activate(activeCooldownCounterOverride = false) {
    let that = this;
    that.active = true;
    if (this.index === 3) {
      scene.matter.world.localWorld.gravity.y = 0.1;
    }
    if (that.duration > 0) {
      that.activeCooldownCounter = Math.floor(
        activeCooldownCounterOverride
          ? activeCooldownCounterOverride
          : (that.duration +
              scene.pres[2].level * 2 +
              scene.achievementManager.getAchievementModifier(
                "fasterSpawnsUsed"
              ) +
              (scene.tiers[1].bought ? 10 : 0)) *
              (scene.tiers[3].bought ? 1.25 : 1)
      );
      if (scene.skills[9].active) {
        that.activeCooldownCounter = activeCooldownCounterOverride
          ? activeCooldownCounterOverride
          : that.activeCooldownCounter * 2;
        scene.skills[9].setCooldown();
      }
      that.activeCooldownLength = that.activeCooldownCounter;
      that.setUI();
      that.activeGraphic.visible = true;
      that.activeGraphic.play("skillActive");
      that.activeGraphic.anims.timeScale = 1 / that.activeCooldownCounter;
      that.activeIntervalInterval = setInterval(function () {
        that.activeCooldownCounter--;
        if (that.activeCooldownCounter === 0) {
          if (that.index === 3) {
            scene.matter.world.localWorld.gravity.y = 0.25;
          }
          clearInterval(that.activeIntervalInterval);
          that.activeGraphic.visible = false;
          that.setCooldown();
          that.active = false;
        }
        that.setUI();
      }, 1000);
    } else {
      if (this.index === 2) {
        while (popNext());
        this.active = false;
      } else if (this.index === 8) {
        this.active = false;
      } else if (this.index === 9) {
        _.each(scene.skills, function (s) {
          if (s.index !== 9 && s.cooldownCounter > 0) {
            s.cooldownGraphic.visible = false;
            s.cooldownCounter = 0;
            clearInterval(s.cooldownInterval);
            s.setUI();
          }
        });
        this.active = false;
      } else if (this.index === 10) {
        this.active = true;
        this.useCount++;
        this.totalUseCount++;
        this.checkTotalAchievement();
        this.setUI();
        return;
      }
      this.setCooldown();
    }
    this.useCount++;
    this.totalUseCount++;
    if (this.index === 1) {
      scene.achievementManager.assessMetric("fasterSpawnsUsed", this.useCount);
    }
    this.checkTotalAchievement();
  }

  setCooldown(cooldownOverride = false) {
    let that = this;
    this.cooldownCounter = Math.floor(
      cooldownOverride
        ? cooldownOverride
        : (that.cooldown -
            scene.pres[3].level -
            (scene.tiers[2].bought ? 5 : 0)) *
            (scene.tiers[4].bought ? 0.75 : 1)
    );
    this.cooldownLength = that.cooldownCounter;
    this.setUI();
    this.cooldownGraphic.visible = true;
    this.cooldownGraphic.play("skillCooldown");
    this.cooldownGraphic.anims.timeScale = 1 / that.cooldownCounter;
    if (this.skipCooldown) {
      if (MONITIZATION === "admob") {
        if (AdMob && AdMob.adQueued) {
          this.skipCooldown.visible = true;
        }
      } else {
        this.skipCooldown.visible = true;
      }
    }
    this.cooldownInterval = setInterval(function () {
      that.cooldownCounter--;
      if (that.cooldownCounter === 0) {
        clearInterval(that.cooldownInterval);
        that.cooldownGraphic.visible = false;
        if (that.skipCooldown) {
          that.skipCooldown.visible = false;
        }
      }
      that.setUI();
    }, 1000);
  }

  setAnimationFrame() {
    if (this.cooldownCounter > 0) {
      this.cooldownGraphic.anims.setProgress(
        1 - this.cooldownCounter / this.cooldownLength
      );
    } else if (this.activeCooldownCounter > 0) {
      this.activeGraphic.anims.setProgress(
        1 - this.activeCooldownCounter / this.activeCooldownLength
      );
    }
  }

  getCounterString() {
    let n = this.cooldownCounter;
    return n > 0 ? n : "";
  }

  setUI() {
    if (this.skipCooldown) {
      this.skipCooldown.visible = false;
    }
    if (this.cooldownCounter > 0) {
      if (this.skipCooldown) {
        if (MONITIZATION === "admob") {
          if (AdMob && AdMob.adQueued) {
            this.skipCooldown.visible = true;
          }
        } else {
          this.skipCooldown.visible = true;
        }
      }
      this.button.setFrame(0);
      this.countdown.setText(this.getCounterString());
    } else if (this.active) {
      this.button.setFrame(2);
      this.countdown.setText(this.getCounterString());
    } else if (this.locked) {
      this.countdown.setText("");
      this.button.setFrame(0);
      // show lock
    } else {
      this.countdown.setText("");
      this.button.setFrame(1);
    }
  }

  checkTotalAchievement() {
    let count = 0;
    _.each(scene.skills, function (s) {
      count = count + s.totalUseCount;
    });
    if (count >= 10000) {
      scene.achievementManager.assessMetric("useSkills");
    }
  }

  loadStats() {
    switch (this.index) {
      case 1: // increase drop rate
        this.duration = 30;
        this.cooldown = 180;
        this.unlockAt = 0;
        break;
      case 2: // click all blocks
        this.duration = 0;
        this.cooldown = 60;
        this.unlockAt = 5;
        break;
      case 3: // decrease gravity
        this.duration = 30;
        this.cooldown = 240;
        this.unlockAt = 10;
        break;
      case 4: // increase value
        this.duration = 15;
        this.cooldown = 300;
        this.unlockAt = 15;
        break;
      case 5: // double block size
        this.duration = 30;
        this.cooldown = 240;
        this.unlockAt = 20;
        break;
      case 6: // freeze burners
        this.duration = 10;
        this.cooldown = 300;
        this.unlockAt = 25;
        break;
      case 7: // focused drops
        this.duration = 30;
        this.cooldown = 300;
        this.unlockAt = 30;
        break;
      case 8: // 5% boost
        this.duration = 0;
        this.cooldown = 900;
        this.unlockAt = 35;
        break;
      case 9: // Reset Cooldowns
        this.duration = 0;
        this.cooldown = 1500;
        this.unlockAt = 40;
        break;
      case 10: // Double Duration
        this.duration = 0;
        this.cooldown = 180;
        this.unlockAt = 50;
        break;
      default:
        break;
    }
    this.setUI();
  }
}
