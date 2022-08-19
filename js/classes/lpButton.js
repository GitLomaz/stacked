class lpButton extends Phaser.GameObjects.Container {
  constructor(x, y, index) {
    super(scene, x, y);
    this.button = scene.add.sprite(x, y, "lp" + index);
    this.button.setOrigin(0);
    this.button.setInteractive();
    this.button.on("pointerdown", this.buyClick, this);
    this.index = index;
    this.level = 0;

    this.challengeLock = scene.add.sprite(x, y, "upgradeLock");
    this.challengeLock.setOrigin(0);
    this.challengeLock.visible = false;

    this.challengeLocked = false;

    // Tooltip logic
    let that = this;
    this.button
      .on("pointerover", function () {
        if (that.canUpgrade()) {
          that.button.setFrame(2);
        }
        scene.tips.setValues(that.getText());
      })
      .on("pointerout", function () {
        that.assessCost();
        scene.tips.clearValues();
      });

    this.levelText = scene.add.text(50, 8, "", {
      fontSize: "12px",
      color: "#ccdde3",
    });
    this.levelCount = scene.add
      .text(185, 12, "+1", {
        fontSize: "10px",
        color: "#3887ba",
      })
      .setOrigin(1, 0.5);
    this.costText = scene.add.text(
      50,
      25,
      "Cost: " + displayNumber(this.cost),
      { fontSize: "12px", color: "#ccdde3" }
    );
    this.add(this.levelText);
    this.add(this.costText);
    this.add(this.levelCount);

    scene.add.existing(this);
  }

  setState(level) {
    this.level = level;
    this.setCost();
    if (this.index === 5) {
      _.each(scene.upgrades, function (u) {
        u.setCost();
      });
    }
  }

  checkChallengeLock() {
    if (
      stats.challengeActive &&
      challenges[stats.currentChallenge].disabledPoints[this.index - 1]
    ) {
      this.challengeLocked = true;
      this.challengeLock.visible = true;
      this.levelText.visible = false;
      this.levelCount.visible = false;
      this.costText.visible = false;
    } else {
      this.challengeLocked = false;
      this.challengeLock.visible = false;
      this.levelText.visible = true;
      this.levelCount.visible = true;
      this.costText.visible = true;
    }
  }

  getLevel() {
    return this.challengeLocked ? 0 : this.level;
  }

  getText() {
    let ret = {};
    switch (this.index) {
      case 1:
        ret.title = "Block Value";
        ret.text = "Increases block value by 10%";
        break;
      case 2:
        ret.title = "Block Width";
        ret.text = "Increases block width by 2.5%";
        break;
      case 3:
        ret.title = "Block Height";
        ret.text = "Increases block height by 2.5%";
        break;
      case 4:
        ret.title = "Slow Burners";
        ret.text = "Increases cooldown between burners \r\ntriggering by 10%";
        break;
      case 5:
        ret.title = "Cheap Upgrades";
        ret.text = "Decrease the cost of upgrades by 2.5%";
        break;
      case 6:
        ret.title = "Broken Burners";
        ret.text = "Increases chance burner will not light by 3%";
        break;
      case 7:
        ret.title = "More Level Points";
        ret.text = "Increases the amount of LP gained per \r\nlevel up by 1";
        break;
      case 8:
        ret.title = "More EXP";
        ret.text = "Increases the amount of exp gained per \r\nclick by 25%";
        break;
      default:
        break;
    }
    return ret;
  }

  getMaxLevel() {
    switch (this.index) {
      case 1:
        return false;
      case 2:
        return 25;
      case 3:
        return 25;
      case 4:
        return 15;
      case 5:
        return 10;
      case 6:
        return 10;
      case 7:
        return false;
      case 8:
        return false;
      default:
        break;
    }
  }

  setCost() {
    let steps = 1;
    switch (scene.buyModifier) {
      case 1:
        steps = 10;
        break;
      case 2:
        steps = 25;
        break;
      case 3:
        steps = 1000;
      default:
        break;
    }

    let max = this.getMaxLevel() || 1000000;
    let highestLevel = this.level + steps;
    if (highestLevel > max) {
      highestLevel = max;
    }

    let modifier = 0;
    switch (this.index) {
      case 1:
        modifier = 0.2;
        break;
      case 2:
      case 3:
        modifier = 0.5;
        break;
      case 4:
        modifier = 0.25;
        break;
      case 5:
        modifier = 0.75;
        break;
      case 6:
      case 7:
      case 8:
        modifier = 1;
        break;
      default:
        break;
    }

    this.displayCost = new Decimal(0);
    let ups = 0;
    for (let i = 0; i < steps && i < max; i++) {
      let step = new Decimal(
        1 + Math.floor(compound(1, this.level + i, modifier))
      );
      if (i === 0) {
        this.cost = new Decimal(step);
      }

      if (
        (scene.buyModifier === 3 &&
          Decimal.add(this.displayCost, step).lte(stats.lp)) ||
        scene.buyModifier !== 3 ||
        i === 0
      ) {
        ups++;
        this.displayCost = Decimal.add(this.displayCost, step);
      } else {
        break;
      }
    }

    this.costText.setText(
      "Cost: " + (max === this.level ? "---" : displayNumber(this.displayCost))
    );
    this.levelText.setText(
      "Level: " + this.level + (this.getMaxLevel() ? " / " + max : "")
    );
    this.levelCount.setText(max === this.level ? "" : "+" + ups);
    this.assessCost();
  }

  assessCost() {
    if (this.canUpgrade()) {
      this.button.setFrame(1);
    } else {
      this.button.setFrame(0);
    }
  }

  canUpgrade() {
    return this.displayCost.lte(stats.lp) && this.getMaxLevel() !== this.level;
  }

  reset() {
    this.level = 0;
    this.setCost();
  }

  buy() {
    if (
      this.cost <= stats.lp &&
      (this.getMaxLevel() !== this.level || !this.getMaxLevel())
    ) {
      adjustLP(this.cost, false);
      this.level++;
      this.checkLPAchievement();
      this.setCost();
      if (this.index === 5) {
        _.each(scene.upgrades, function (u) {
          u.setCost();
        });
      }
      return true;
    }
    return false;
  }

  buyClick() {
    let steps = 1;
    switch (scene.buyModifier) {
      case 1:
        steps = 10;
        break;
      case 2:
        steps = 25;
        break;
      case 3:
        steps = 1000;
      default:
        break;
    }
    soundController.play("click");
    let max = this.getMaxLevel() || 10000000;
    for (let i = 0; i < steps && i < max; i++) {
      this.buy();
    }
  }

  hide() {
    this.visible = false;
    this.button.visible = false;
    this.challengeLock.visible = false;
  }

  show() {
    this.visible = true;
    this.button.visible = true;
    this.checkChallengeLock();
  }

  checkLPAchievement() {
    if (scene.lps[6].getLevel() === 10) {
      scene.achievementManager.assessMetric("LPUpgrade");
    }
  }
}
