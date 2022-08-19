class tierButton extends Phaser.GameObjects.Container {
  constructor(x, y, index, tier) {
    super(scene, x, y);
    this.button = scene.add.sprite(x, y, "tier" + tier);
    this.tier = tier;
    this.index = index;
    this.bought = false;
    this.button.setOrigin(0);
    this.button.setInteractive();
    let that = this;
    this.button
      .on("pointerdown", this.buy, this)
      .on("pointerover", function () {
        if (that.canUpgrade()) {
          this.setFrame(2);
        } else if (that.bought) {
          this.setFrame(2);
        } else {
          this.setFrame(0);
        }
        scene.tips.setValues(that.getText());
      })
      .on("pointerout", function () {
        if (that.canUpgrade()) {
          this.setFrame(1);
        } else if (that.bought) {
          this.setFrame(2);
        } else {
          this.setFrame(0);
        }
        scene.tips.clearValues("");
      });
  }

  getText() {
    let ret = {};
    switch (this.index) {
      case 1:
        ret.title = "Auto Cast";
        if (MOBILE) {
          ret.text =
            "Unlocks ability to turn on Auto Casting\r\non all skills with a long-tap\r\n(250 miliseconds or longer)";
        } else {
          ret.text =
            "Unlocks ability to turn on Auto Casting\r\non all skills with SHIFT-Click";
        }

        break;
      case 2:
        ret.title = "Skill Duration I";
        ret.text = "Increase all skills duration by\r\n10 seconds.";
        break;
      case 3:
        ret.title = "Skill Cooldown I";
        ret.text = "Recduce all skills cooldown by\r\n5 seconds";
        break;
      case 4:
        ret.title = "Skill Duration II";
        ret.text = "Increase all skills duration by 25%";
        break;
      case 5:
        ret.title = "Skill Cooldown II";
        ret.text = "Recduce all skills cooldown by 25%";
        break;
      case 6:
        ret.title = "Click Cap I";
        ret.text = "Increase Click modifier cap by 2x";
        break;
      case 7:
        ret.title = "Click Cap II";
        ret.text = "Increase Click modifier cap by 4x";
        break;
      case 8:
        ret.title = "Mouseover Clicks";
        ret.text = "Click on a brick by hovering over it";
        break;
      case 9:
        ret.title = "Exp Gain";
        ret.text = "Double EXP Gain from clicking blocks";
        break;
      case 10:
        ret.title = "LP Gain";
        ret.text = "Double LP gain from leveling up";
        break;
      case 11:
        ret.title = "Prestige Autobuy";
        ret.text = "Start prestiges with Auto-buy\r\nenabled on upgrades";
        break;
      case 12:
        ret.title = "Burner Payout";
        ret.text = "Double the value of cubes\r\nburned by burners";
        break;
      case 13:
        ret.title = "Tokens I";
        ret.text = "Increase token gain from\r\nprestige by 25%";
        break;
      case 14:
        ret.title = "Max Size";
        ret.text = "Blocks always spawn at their\r\nmaximum possiable size";
        break;
      case 15:
        ret.title = "Tokens II";
        ret.text = "Increase token gain from\r\nprestige by 75%";
        break;
      default:
        break;
    }
    if (!this.bought) {
      ret.topRightText = "Cost: " + this.tier;
    }
    return ret;
  }

  setState(bought) {
    this.bought = bought;
    this.assessCost();
  }

  assessCost() {
    if (this.canUpgrade()) {
      this.button.setFrame(1);
    } else if (this.bought) {
      this.button.setFrame(2);
    } else {
      this.button.setFrame(0);
    }
  }

  canUpgrade() {
    if (this.index !== 1 && this.index !== 6 && this.index !== 11) {
      if (!scene.tiers[this.index - 2].bought) {
        return false;
      }
    }
    return this.tier <= stats.cp && !this.bought;
  }

  buy() {
    if (this.canUpgrade()) {
      soundController.play("click");
      this.bought = true;
      adjustCP(this.tier, false);
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
