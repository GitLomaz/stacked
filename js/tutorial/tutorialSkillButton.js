class tutorialSkillButton extends Phaser.GameObjects.Container {
  constructor(x, y, index) {
    super(scene, x, y);
    this.button = scene.add.sprite(x, y, "skill" + index);
    this.button.setOrigin(0);
    this.button.setInteractive();
    this.button.on("pointerdown", this.click, this);
    this.index = index;
    this.locked = true;
    if (this.index === 1) {
      this.locked = false;
    }

    this.cooldownCounter = 0;
    this.activeCooldownCounter = 0;
    this.cooldownInterval = null;
    this.activeIntervalInterval = null;
    this.cooldownGraphic = scene.add.sprite(x, y, "skillCooldown").setOrigin(0);
    this.activeGraphic = scene.add.sprite(x, y, "skillActive").setOrigin(0);
    this.cooldownGraphic.visible = false;
    this.activeGraphic.visible = false;
    this.active = false;
    this.countdown = scene.add
      .text(32, 32, this.getCounterString())
      .setOrigin(0.5);
    this.useCount = 0;
    this.totalUseCount = 0;
    this.add(this.countdown);
    this.loadStats();

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
        if (
          that.cooldownCounter === 0 &&
          that.activeCooldownCounter === 0 &&
          !that.locked
        ) {
          that.button.setFrame(1);
        }
      });
    scene.add.existing(this);
  }

  checkLock() {
    if (stats.level >= this.unlockAt) {
      this.locked = false;
      this.setUI();
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
        ret.title = "Chiller";
        ret.text = "Disables 75% of burners";
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
    if (
      this.cooldownCounter === 0 &&
      this.activeCooldownCounter === 0 &&
      !this.locked
    ) {
      this.activate();
    }
  }

  activate(activeCooldownCounterOverride = false) {
    let that = this;
    that.active = true;
    if (that.duration > 0) {
      that.activeCooldownCounter = activeCooldownCounterOverride
        ? activeCooldownCounterOverride
        : that.duration;
      that.setUI();
      that.activeGraphic.visible = true;
      that.activeGraphic.play("skillActive");
      that.activeGraphic.anims.timeScale = 1 / that.activeCooldownCounter;
      that.activeIntervalInterval = setInterval(function () {
        that.activeCooldownCounter--;
        if (that.activeCooldownCounter === 0) {
          clearInterval(that.activeIntervalInterval);
          that.activeGraphic.visible = false;
          that.setCooldown();
          that.active = false;
        }
        that.setUI();
      }, 1000);
    }
    this.useCount++;
    this.totalUseCount++;
  }

  setCooldown(cooldownOverride = false) {
    let that = this;
    that.cooldownCounter = cooldownOverride ? cooldownOverride : that.cooldown;
    this.setUI();
    that.cooldownGraphic.visible = true;
    that.cooldownGraphic.play("skillCooldown");
    that.cooldownGraphic.anims.timeScale = 1 / that.cooldownCounter;
    that.cooldownInterval = setInterval(function () {
      that.cooldownCounter--;
      if (that.cooldownCounter === 0) {
        clearInterval(that.cooldownInterval);
        that.cooldownGraphic.visible = false;
      }
      that.setUI();
    }, 1000);
  }

  getCounterString() {
    let n = this.cooldownCounter;
    return n > 0 ? n : "";
  }

  setUI() {
    if (this.cooldownCounter > 0) {
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
        this.cooldown = 30;
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
