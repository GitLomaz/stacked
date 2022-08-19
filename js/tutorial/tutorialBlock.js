class TutorialBlock extends Phaser.GameObjects.Container {
  // static counter = 0;

  constructor(width = 5, height = 5) {
    super(scene, Phaser.Math.Between(300, 600), -50);
    let w = Math.ceil(
      (13.5 + 4.5 * width) *
        (scene.lps ? 1 + scene.lps[1].level * 0.05 : 1) *
        (scene.upgrades ? 1 + scene.upgrades[1].level * 0.15 : 1)
    );
    let h = Math.ceil(
      (13.5 + 4.5 * height) *
        (scene.lps ? 1 + scene.lps[2].level * 0.05 : 1) *
        (scene.upgrades ? 1 + scene.upgrades[2].level * 0.15 : 1)
    );
    this.setSize(w, h);
    this.radius = 9;
    this.falling = true;

    let sets = [
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5],
      [4, 5, 6],
      [5, 6, 7],
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

    let tint = tints[sets[4][Phaser.Math.Between(0, 2)]];

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

    scene.add.existing(this);
    this.score = Decimal.sqrt(this.width * this.height * 100);
    scene.matter.add.gameObject(this).setBounce(0).setInteractive();
    this.body.labelText = "block";
    this.on("pointerdown", this.click);
    scene.blocks.add(this);
  }

  payout(type, destroy = true) {
    let upgradeBonus =
      1 + (scene.upgrades ? compound(1, scene.upgrades[0].level, 0.15) : 0);
    let lpBonus = 1 + (scene.lps ? compound(1, scene.lps[0].level, 0.1) : 0);
    let totalBonus = upgradeBonus * lpBonus;
    switch (type) {
      case "click":
        adjustMoney(this.score.mul(totalBonus));
        break;
      case "burn":
        adjustMoney(this.score.mul(totalBonus / 2));
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

  click(pointer) {
    let c = scene.add.sprite(pointer.position.x, pointer.position.y, "click");
    if (!scene.zoneClear) {
      stats.displayStats.run.blocksClicked++;
      stats.displayStats.total.blocksClicked++;
      scene.achievementManager.assessMetric(
        "blocksClicked",
        stats.displayStats.total.blocksClicked
      );
    }
    if (this.falling && !scene.zoneClear) {
      this.updateProgressBar(4);
      fallingBonus = fallingBonus + 0.5;
      if (fallingBonus > 4) {
        fallingBonus = 4;
      }
      if (scene.tutorialStage !== 0) {
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
      }
    } else {
      if (!scene.zoneClear) {
        this.updateProgressBar(1);
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
    this.payout("click");
  }

  updateProgressBar(amount) {
    scene.tutorialBar.tick = scene.tutorialBar.tick + amount;
    if (scene.tutorialBar.tick > scene.tutorialBar.tickMax) {
      scene.tutorialStage++;
      scene.tutorialBar.tick = 0;
      scene.tutorial.setDialog(scene.tutorialStage);
    }
    if (scene.tutorialStage > 0) {
      this.gainExp(amount);
    }
    scene.tutorialBar.setProgress(
      scene.tutorialBar.tick / scene.tutorialBar.tickMax
    );
  }

  gainExp(exp) {
    stats.exp += exp;
    if (stats.exp > stats.expNext) {
      stats.exp = 0;
      stats.clickLevel++;
      if (stats.clickLevel > stats.displayStats.total.highestLevel) {
        stats.displayStats.total.highestLevel = stats.clickLevel;
      }
      stats.lp = stats.lp + 1;
      if (scene.lp) {
        scene.lp.setText("Level Points: " + displayNumber(stats.lp));
        _.each(scene.lps, function (u) {
          u.assessCost();
        });
      }
      stats.expNext = Math.floor(25 + compound(25, stats.clickLevel, 0.05));
    }
    scene.expBar.setLevel(stats.clickLevel);
    scene.expBar.setProgress(stats.exp / stats.expNext);
  }
}
