class upgradeButton extends Phaser.GameObjects.Container {
  constructor(x, y, index) {
    super(scene, x, y);
    this.button = scene.add.sprite(x, y, "button" + index);
    this.button.setOrigin(0);
    this.button.setInteractive();
    this.button.on("pointerdown", this.buyClick, this);
    this.index = index;
    this.level = 0;
    this.autoBuy = false;
    this.autoBuyUnlocked = false;

    this.challengeLock = scene.add.sprite(x, y, "upgradeLock");
    this.challengeLock.setOrigin(0);
    this.challengeLock.visible = false;

    this.challengeLocked = false;

    this.checkbox = scene.add.sprite(180, 16, "checkbox");
    this.checkbox.setOrigin(0);
    this.checkbox.setInteractive();
    this.checkbox.on(
      "pointerdown",
      function () {
        this.autoBuy = !this.autoBuy;
        this.assessCost();
        this.tick();
      },
      this
    );
    this.checkbox.visible = this.autoBuyUnlocked;
    this.add(this.checkbox);

    // Tooltip logic
    let that = this;
    this.button
      .on("pointerover", function (pointer) {
        if (that.canUpgrade()) {
          that.button.setFrame(2);
        }
        scene.tips.setValues(that.getText());
      })
      .on("pointerout", function (pointer) {
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

  tick() {
    if (this.autoBuy && !scene.zoneClear) {
      while (this.buy());
    }
  }

  checkChallengeLock() {
    if (
      stats.challengeActive &&
      challenges[stats.currentChallenge].disabledUpgrades[this.index - 1]
    ) {
      this.challengeLocked = true;
      this.challengeLock.visible = true;
      this.levelText.visible = false;
      this.levelCount.visible = false;
      this.costText.visible = false;
      this.checkbox.visible = false;
    } else {
      this.challengeLocked = false;
      this.challengeLock.visible = false;
      this.levelText.visible = true;
      this.levelCount.visible = true;
      this.costText.visible = true;
      this.checkbox.visible = this.autoBuyUnlocked;
    }
  }

  getLevel() {
    return this.challengeLocked ? 0 : this.level;
  }

  setState(level, auto = false) {
    this.level = level;
    this.autoBuy = auto;
    this.setCost();
    if (this.index === 6) {
      adjustSize();
    }
    if (this.index === 7) {
      adjustGoal();
    }
  }

  getText() {
    let ret = {};
    switch (this.index) {
      case 1:
        ret.title = "Block Value";
        ret.text = "Increases block value by 15%";
        break;
      case 2:
        ret.title = "Block Width";
        ret.text = "Increases block width by 5%";
        break;
      case 3:
        ret.title = "Block Height";
        ret.text = "Increases block height by 5%";
        break;
      case 4:
        ret.title = "Profitable Burners";
        ret.text = "Increases block value from being burned \r\nby 10%";
        break;
      case 5:
        ret.title = "Block Drop";
        ret.text = "Increases frequency of blocks by 5%";
        break;
      case 6:
        ret.title = "Narrow Walls";
        ret.text = "Moves the walls inward by 1 step";
        break;
      case 7:
        ret.title = "Lower Goals";
        ret.text = "Lowers zone goalpost by 1 step";
        break;
      case 8:
        ret.title = "Broken Burners";
        ret.text = "Increases chance burner will not light by 3%";
        break;
      default:
        break;
    }
    return ret;
  }

  getMaxLevel() {
    switch (this.index) {
      case 1:
        return 50;
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
        return 10;
      case 8:
        return 5;
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
    // need better dec
    let max = this.getMaxLevel();
    let highestLevel = this.level + steps;
    if (highestLevel > max) {
      highestLevel = max;
    }
    this.displayCost = new Decimal(0);
    let ups = 0;
    for (let i = 0; i < steps && i < max; i++) {
      let step = new Decimal(
        compound(
          1000 * this.index + this.index * 500,
          this.level + i + 1,
          0.4
        ) *
          (1 - scene.lps[4].getLevel() * 0.025) *
          scene.achievementManager.getAchievementModifier("upgradeDiscount") *
          (this.index === 3 && scene.achievementManager.achievements[15].earned
            ? 0.8
            : 1)
      ).mul(
        Decimal.pow(
          10,
          (stats.challengeActive
            ? challenges[stats.currentChallenge].difficulty
            : stats.level - 1) * 1.2
        )
      );
      if (i === 0) {
        this.cost = new Decimal(step);
      }

      if (
        (scene.buyModifier === 3 &&
          Decimal.add(this.displayCost, step).lte(stats.money)) ||
        scene.buyModifier !== 3 ||
        i === 0
      ) {
        ups++;
        this.displayCost = Decimal.add(this.displayCost, step);
      } else {
        break;
      }
    }

    this.levelText.setText("Level: " + this.level + (max ? " / " + max : ""));
    this.levelCount.setText(max === this.level ? "" : "+" + ups);
    this.costText.setText(
      "Cost: " + (max === this.level ? "---" : displayNumber(this.displayCost))
    );
    this.assessCost();
  }

  assessCost() {
    if (this.canUpgrade()) {
      this.button.setFrame(1);
      if (this.autoBuy) {
        this.checkbox.setFrame(3);
      } else {
        this.checkbox.setFrame(2);
      }
    } else {
      this.button.setFrame(0);
      if (this.autoBuy) {
        this.checkbox.setFrame(1);
      } else {
        this.checkbox.setFrame(0);
      }
    }
  }

  canUpgrade() {
    if (!this.displayCost) {
      this.setCost();
    }
    return (
      this.displayCost.lte(stats.money) &&
      this.getMaxLevel() !== this.level &&
      !this.challengeLocked
    );
  }

  reset() {
    this.level = 0;
    this.setCost();
  }

  buy() {
    if (this.cost.lte(stats.money) && this.getMaxLevel() !== this.level) {
      adjustMoney(this.cost, false);
      this.level++;
      this.checkAchievements();
      this.setCost();
      if (this.index === 6) {
        adjustSize();
      }
      if (this.index === 7) {
        adjustGoal();
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
    let max = this.getMaxLevel();
    for (let i = 0; i < steps && i < max; i++) {
      this.buy();
    }
  }

  setAutoVisible(visible) {
    this.autoBuyUnlocked = visible;
    this.checkbox.visible = visible;
    if (!visible) {
      this.autoBuy = false;
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

  checkAchievements() {
    this.checkFiveAchievement();
    this.checkMaxAchievement();
    this.checkDummyAchievement();
    this.checkNarrowAchievement();
  }

  checkFiveAchievement() {
    if (this.level !== 5) {
      return;
    }
    let check = true;
    _.each(scene.upgrades, function (u) {
      if (u.level !== 5) {
        check = false;
      }
    });
    if (check) {
      scene.achievementManager.assessMetric("fivePoints");
    }
  }

  checkMaxAchievement() {
    if (this.level !== this.getMaxLevel()) {
      return;
    }
    let check = true;
    _.each(scene.upgrades, function (u) {
      if (u.level !== u.getMaxLevel()) {
        check = false;
      }
    });
    if (check) {
      scene.achievementManager.assessMetric("allMax");
    }
  }

  checkDummyAchievement() {
    if (scene.upgrades[1].getLevel() === 25 && scene.upgrades[2].level === 0) {
      scene.achievementManager.assessMetric("maxWidth");
    }
  }

  checkNarrowAchievement() {
    if (scene.upgrades[5].getLevel() === 10) {
      scene.achievementManager.assessMetric("squeeze");
    }
  }
}
