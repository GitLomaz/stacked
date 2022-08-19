class Block extends Phaser.GameObjects.Container {
  // static counter = 0;

  constructor(width = 1, height = 1) {
    if (scene.skills[4].active) {
      width = width * 2;
      height = height * 2;
    }
    let x = Phaser.Math.Between(
      (scene.skills[6].active ? 380 : 40 + scene.upgrades[5].getLevel() * 16) +
        width * 5,
      (scene.skills[6].active ? 550 : 870 - scene.upgrades[5].getLevel() * 16) -
        width * 5
    );
    super(scene, x, -200);
    let w = Math.ceil(
      (13.5 + 4.5 * width) * (1 + scene.lps[1].getLevel() * 0.025)
    );
    let h = Math.ceil(
      (13.5 + 4.5 * height) * (1 + scene.lps[2].getLevel() * 0.025)
    );
    w = w % 2 ? w : w + 1;
    h = h % 2 ? h : h + 1;
    this.setSize(w, h);
    this.radius = (9 + (width < height ? width * 9 : height * 9)) / 1.5;

    let sets = [
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5],
      [4, 5, 6],
      [5, 6, 7],
      [6, 7, 0],
      [3, 5, 6],
      [3, 6, 7],
      [1, 3, 4],
      [2, 3, 5],
      [7, 0, 1],
      [0, 1, 3],
    ];

    let tints = [
      [0xe279b4, 0xa13567],
      [0xffa878, 0x9f2a31],
      [0xfffcc9, 0xe1ad26],
      [0xfffab0, 0xffa13d],
      [0xd2e269, 0x56a135],
      [0x75dceb, 0x3387ba],
      [0xa7c4e2, 0x4d60c6],
      [0xd3a7ff, 0x7d309c],
    ];

    let tint = tints[sets[(stats.level - 1) % 8][Phaser.Math.Between(0, 2)]];

    let r3 = scene.add.rectangle(
      0,
      0,
      this.width - 4,
      this.height - 4,
      tint[1],
      0.25
    );

    r3.setStrokeStyle(5, tint[1], 0.35);

    let r2 = scene.add.rectangle(0, 0, this.width - 4, this.height - 4);

    r2.setStrokeStyle(3, tint[1]);

    let r1 = scene.add.rectangle(0, 0, this.width - 4, this.height - 4);

    r1.setStrokeStyle(1, tint[0]);

    this.add(r3);
    this.add(r2);
    this.add(r1);

    this.grounded = false;

    scene.add.existing(this);
    this.score = Decimal.sqrt(width * height * 1000)
      .mul(Decimal.pow(10, stats.level))
      .mul(stats.tokenModifer)
      .mul(stats.cp + 1);

    if (Phaser.Math.Between(0, 4000) < 100 + scene.pres[5].level * 5) {
      this.icon = scene.add.text(0, 0, "$", {
        fontSize: "14px",
        color: "#" + tint[0].toString(16),
        align: "center",
      });
      this.icon.setOrigin(0.5);
      this.add(this.icon);
      this.score = this.score.mul(15);
    }
    scene.matter.add.gameObject(this).setBounce(0).setInteractive();
    this.body.labelText = "block";

    if (MOBILE || true) {
      this.hitbox = scene.add
        .rectangle(0, 0, this.width + 15, this.height + 15, tint[1], 0)
        .setInteractive();
      this.hitbox.parent = this;
      this.add(this.hitbox);
      this.hitbox.on("pointerdown", this.click);
      this.hitbox.on("pointerover", function (pointer) {
        if (scene.tiers && scene.tiers[7].bought) {
          this.parent.click(pointer);
        }
      });
    } else {
      this.on("pointerdown", this.click);
      this.on("pointerover", function (pointer) {
        if (scene.tiers && scene.tiers[7].bought) {
          this.click(pointer);
        }
      });
    }
    scene.blocks.add(this);
  }

  payout(type, destroy = true) {
    let upgradeBonus = 1 + compound(1, scene.upgrades[0].getLevel(), 0.15);
    let skillBonus = 1 + compound(1, scene.skills[7].useCount, 0.05);
    let lpBonus = 1 + compound(1, scene.lps[0].getLevel(), 0.1);
    let adBonus = 1 + (scene.manager && scene.manager.points ? 0.5 : 0);
    let ratingBonus = 1 + (scene.rater && scene.rater.bonusActive ? 1 : 0);
    let totalBonus =
      upgradeBonus * skillBonus * lpBonus * adBonus * ratingBonus;
    switch (type) {
      case "click":
        adjustMoney(
          this.score
            .mul(totalBonus)
            .mul(fallingBonus)
            .mul(scene.skills[3].active ? 2 : 1)
        );
        break;
      case "burn":
        adjustMoney(
          this.score
            .mul(totalBonus)
            .mul(0.5 + scene.upgrades[3].getLevel() / 20)
            .mul(scene.skills[3].active ? 2 : 1)
            .mul(scene.tiers[11].bought ? 2 : 1)
        );
        break;
      default:
        break;
    }
    if (destroy) {
      this.off();
      this.removeAll(true);
      this.destroy();
    }
  }

  ground() {
    if (!this.grounded) {
      this.grounded = true;
    }
  }

  click(pointer) {
    let that = this;
    if (that.parent) {
      that = that.parent;
    }
    let c = scene.add.sprite(pointer.position.x, pointer.position.y, "click");
    if (!scene.zoneClear) {
      stats.displayStats.run.blocksClicked++;
      stats.displayStats.total.blocksClicked++;
      scene.achievementManager.assessMetric(
        "blocksClicked",
        stats.displayStats.total.blocksClicked
      );
    }
    if (!that.grounded && !scene.zoneClear) {
      gainExp(
        scene.achievementManager.getAchievementModifier("blocksClicked") *
          (scene.tiers[8].bought ? 2 : 1)
      );
      fallingBonus = fallingBonus + 0.5;
      let cap = 4;
      if (scene.tiers[6].bought) {
        cap = 10;
      } else if (scene.tiers[5].bought) {
        cap = 6;
      }
      if (fallingBonus > cap) {
        fallingBonus = cap;
      }
      c.tint = 0x00cc00;
      let mod = scene.add.text(
        pointer.position.x - 10,
        pointer.position.y - 20,
        fallingBonus + "x!",
        {
          fontSize: "12px",
          color: "#00cc00",
        }
      );
      scene.tweens.add({
        targets: mod,
        y: pointer.position.y - 120,
        alpha: 0,
        duration: 1200,
        ease: "Cubic.easeIn",
        onComplete: function () {
          this.targets[0].destroy();
        },
      });
    } else {
      if (!scene.zoneClear) {
        gainExp(scene.tiers[8].bought ? 2 : 1);
      }
      fallingBonus = 1;
    }
    c.play("click");
    c.on(
      "animationcomplete",
      function () {
        c.destroy();
      },
      c
    );
    that.payout("click");
  }
}
