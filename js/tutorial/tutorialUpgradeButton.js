class tutorialUpgradeButton extends Phaser.GameObjects.Container {
  constructor(x, y, index) {
    super(scene, x, y);
    this.button = scene.add.sprite(x, y, "button" + index);
    this.button.setOrigin(0);
    this.button.setInteractive();
    this.button.on("pointerdown", this.buy, this);
    this.index = index;
    this.level = 0;
    this.autoBuy = false;

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
      default:
        break;
    }
    return ret;
  }

  tick() {}

  setCost() {
    // need better dec
    this.cost = new Decimal(350 * ((this.level + 1) / 2) * (this.index * 2));
    let max = 10;
    this.costText.setText(
      "Cost: " + (max === this.level ? "---" : displayNumber(this.cost))
    );
    this.levelText.setText("Level: " + this.level + (max ? " / " + max : ""));
    this.assessCost();
  }

  assessCost() {
    if (this.cost.lte(stats.money) && 10 !== this.level) {
      this.button.setFrame(1);
    } else {
      this.button.setFrame(0);
    }
  }

  canUpgrade() {
    return this.cost.lte(stats.money) && 10 !== this.level;
  }

  reset() {
    this.level = 0;
    this.setCost();
  }

  buy() {
    if (this.cost.lte(stats.money) && 10 !== this.level) {
      adjustMoney(this.cost, false);
      this.level++;
      this.setCost();
      if (this.index === 6) {
        adjustSize();
      }
      if (this.index === 7) {
        adjustGoal();
      }
      _.each(scene.upgrades, function (u) {
        u.assessCost();
      });
      return true;
    }
    return false;
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
