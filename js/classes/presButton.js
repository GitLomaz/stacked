class presButton extends Phaser.GameObjects.Container {
  constructor(x, y, index) {
    super(scene, x, y);
    this.button = scene.add.sprite(x, y, "pres" + index);
    this.button.setOrigin(0);
    this.button.setInteractive();
    this.button.on("pointerdown", this.buyClick, this);
    this.index = index;
    this.level = 0;

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
        scene.tips.clearValues("");
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
    if (this.index === 1) {
      _.each(scene.upgrades, function (u) {
        u.setAutoVisible(level);
      });
    }
  }

  getText() {
    let ret = {};
    switch (this.index) {
      case 1:
        ret.title = "Auto-Upgrade";
        ret.text = "Allows players to set an auto-upgrades";
        break;
      case 2:
        ret.title = "Increased Exp";
        ret.text = "Increases experence gained from clicks by 20%";
        break;
      case 3:
        ret.title = "Skill Duration";
        ret.text = "Increases skill duration by 2 seconds";
        break;
      case 4:
        ret.title = "Skill Cooldown";
        ret.text = "Decreases skill cooldown by 1 second";
        break;
      case 5:
        ret.title = "Block Drop";
        ret.text = "Increases frequency of blocks by 5%";
        break;
      case 6:
        ret.title = "Currency Blocks";
        ret.text = "Increases chance currency block will spawn \r\nby 1%";
        break;
      default:
        break;
    }
    return ret;
  }

  getMaxLevel() {
    switch (this.index) {
      case 1:
        return 1;
      case 2:
        return false;
      case 3:
        return false;
      case 4:
        return 50;
      case 5:
      case 6:
        return false;
      default:
        break;
    }
  }

  getBaseCost() {
    switch (this.index) {
      case 1:
        return 1;
      case 2:
        return 4;
      case 3:
        return 6;
      case 4:
        return 6;
      case 5:
        return 10;
      case 6:
        return 10;
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
      case 2:
        modifier = 0.25;
        break;
      case 3:
        modifier = 0.3;
        break;
      case 4:
      case 5:
        modifier = 0.75;
        break;
      case 6:
        modifier = 0.5;
        break;
      default:
        break;
    }

    this.displayCost = new Decimal(0);
    let ups = 0;
    for (let i = 0; i < steps && i < max; i++) {
      let step = new Decimal(
        this.getBaseCost() +
          Math.floor(compound(this.getBaseCost(), this.level + i, modifier))
      );
      if (i === 0) {
        this.cost = new Decimal(step);
      }

      if (
        (scene.buyModifier === 3 &&
          Decimal.add(this.displayCost, step).lte(stats.tokens)) ||
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
    return (
      this.displayCost.lte(stats.tokens) && this.getMaxLevel() !== this.level
    );
  }

  reset() {
    this.level = 0;
    this.setCost();
  }

  buy() {
    if (
      this.cost.lte(stats.tokens) &&
      (this.getMaxLevel() !== this.level || !this.getMaxLevel())
    ) {
      adjustTokens(this.cost, false);
      this.level++;
      this.setCost();
      if (this.index === 1) {
        _.each(scene.upgrades, function (u) {
          u.setAutoVisible(true);
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
  }

  show() {
    this.visible = true;
    this.button.visible = true;
  }
}
