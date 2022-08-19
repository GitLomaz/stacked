class achievementManager extends Phaser.GameObjects.Container {
  constructor() {
    super(scene, -100, 100);
    // fully out: 80
    // fully in: -100
    this.bg = scene.add.image(0, 0, "achievementPrompt");
    this.title = scene.add
      .text(-10, 0, "", {
        color: "#E0E0E0",
        fontSize: "14px",
      })
      .setOrigin(0.5);
    this.add(this.bg);
    this.add(this.title);
    this.achievements = [];
    this.awardQueue = [];
    this.displaying = false;
    let counter = 1;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        this.achievements.push(
          new achievement(913 + j * 38, 182 + i * 32, counter)
        );
        counter++;
      }
    }
    this.stats = new simpleButton(
      912 + 96,
      320 + 16 + 23,
      "stats",
      "Game Stats"
    );
    this.stats.button.on(
      "pointerdown",
      function () {
        new promptStats();
      },
      this
    );
    this.hideAll();
    scene.add.existing(this);
  }

  tick() {
    if (this.awardQueue.length > 0 && !this.displaying) {
      soundController.play("achievement");
      this.displaying = this.awardQueue.shift();
      this.title.setText(this.displaying);
      let that = this;
      scene.tweens.add({
        targets: that,
        x: 80,
        ease: "Linear",
        duration: 800,
        onComplete: function () {
          scene.tweens.add({
            targets: that,
            x: 80,
            ease: "Linear",
            duration: 4000,
            onComplete: function () {
              scene.tweens.add({
                targets: that,
                x: -100,
                ease: "Linear",
                duration: 800,
                onComplete: function () {
                  that.displaying = false;
                },
              });
            },
          });
        },
      });
    }
  }

  getAchievementModifier(metric) {
    switch (metric) {
      case "blocksClicked":
        if (this.achievements[4].earned) {
          return 12;
        } else if (this.achievements[3].earned) {
          return 10;
        } else if (this.achievements[2].earned) {
          return 8;
        } else if (this.achievements[1].earned) {
          return 6;
        } else {
          return 5;
        }
      case "clickLevel":
        if (this.achievements[7].earned) {
          return 15;
        } else if (this.achievements[6].earned) {
          return 5;
        } else if (this.achievements[5].earned) {
          return 1;
        } else {
          return 0;
        }
      case "tokensEarned":
        if (this.achievements[9].earned) {
          return 2;
        } else if (this.achievements[8].earned) {
          return 1;
        } else {
          return 0;
        }
      case "fasterSpawnsUsed":
        if (this.achievements[11].earned) {
          return 15;
        } else if (this.achievements[10].earned) {
          return 5;
        } else {
          return 0;
        }
      case "upgradeDiscount":
        if (this.achievements[14].earned) {
          return 0.75;
        } else if (this.achievements[13].earned) {
          return 0.95;
        } else {
          return 1;
        }
      case "maxWidth":
        if (this.achievements[14].earned) {
          return 0.75;
        } else if (this.achievements[13].earned) {
          return 0.95;
        } else {
          return 1;
        }
        return 1;
      // case "allMax":
      //   award = this.achievements[14].attemptAward();
      //   return 1
      // case "maxWidth":
      //   award = this.achievements[15].attemptAward();
      //   return 1
      // case "squeeze":
      //   award = this.achievements[16].attemptAward();
      //     return 1
      // case "LPUpgrade":
      //   award = this.achievements[17].attemptAward();
      //   return 1
      // case "frozernBurner":
      //   award = this.achievements[18].attemptAward();
      //   return 1
      // case "spendAllTokens":
      //   award = this.achievements[19].attemptAward();
      //   return 1
      default:
        console.log("Achievement Not Found!");
    }
  }

  assessMetric(metric, value = 1) {
    let award = false;
    switch (metric) {
      case "blocksClicked":
        if (value >= 100 && !this.achievements[1].earned) {
          award = this.achievements[1].attemptAward();
        } else if (value >= 1000 && !this.achievements[2].earned) {
          award = this.achievements[2].attemptAward();
        } else if (value >= 10000 && !this.achievements[3].earned) {
          award = this.achievements[3].attemptAward();
        } else if (value >= 100000 && !this.achievements[4].earned) {
          award = this.achievements[4].attemptAward();
        } else {
          award = this.achievements[0].attemptAward();
        }
        if (award) {
          this.awardQueue.push(award);
        }
        break;
      case "clickLevel":
        if (value >= 5 && !this.achievements[5].earned) {
          award = this.achievements[5].attemptAward();
        } else if (value >= 25 && !this.achievements[6].earned) {
          award = this.achievements[6].attemptAward();
        } else if (value >= 100 && !this.achievements[7].earned) {
          award = this.achievements[7].attemptAward();
        }
        if (award) {
          this.awardQueue.push(award);
        }
        break;
      case "tokensEarned":
        if (value >= 25 && !this.achievements[8].earned) {
          award = this.achievements[8].attemptAward();
        } else if (value >= 500 && !this.achievements[9].earned) {
          award = this.achievements[9].attemptAward();
        }
        if (award) {
          this.awardQueue.push(award);
        }
        break;
      case "fasterSpawnsUsed":
        if (value >= 10 && !this.achievements[10].earned) {
          award = this.achievements[10].attemptAward();
        } else if (value >= 100 && !this.achievements[11].earned) {
          award = this.achievements[11].attemptAward();
        }
        if (award) {
          this.awardQueue.push(award);
        }
        break;
      case "zoneClearNoWalls":
        award = this.achievements[12].attemptAward();
        if (award) {
          this.awardQueue.push(award);
        }
        break;
      case "fivePoints":
        award = this.achievements[13].attemptAward();
        if (award) {
          this.awardQueue.push(award);
          _.each(scene.upgrades, function (u) {
            u.setCost();
          });
        }
        break;
      case "allMax":
        award = this.achievements[14].attemptAward();
        if (award) {
          this.awardQueue.push(award);
          _.each(scene.upgrades, function (u) {
            u.setCost();
          });
        }
        break;
      case "maxWidth":
        award = this.achievements[15].attemptAward();
        if (award) {
          this.awardQueue.push(award);
          _.each(scene.upgrades, function (u) {
            u.setCost();
          });
        }
        break;
      case "squeeze":
        award = this.achievements[16].attemptAward();
        if (award) {
          this.awardQueue.push(award);
        }
        break;
      case "LPUpgrade":
        award = this.achievements[17].attemptAward();
        if (award) {
          this.awardQueue.push(award);
        }
        break;
      case "frozernBurner":
        award = this.achievements[18].attemptAward();
        if (award) {
          this.awardQueue.push(award);
        }
        break;
      case "spendAllTokens":
        award = this.achievements[19].attemptAward();
        if (award) {
          this.awardQueue.push(award);
        }
        break;
      case "useSkills":
        award = this.achievements[20].attemptAward();
        if (award) {
          this.awardQueue.push(award);
        }
        break;
      case "noSize":
        award = this.achievements[21].attemptAward();
        if (award) {
          this.awardQueue.push(award);
        }
        break;
      case "offline":
        award = this.achievements[22].attemptAward();
        if (award) {
          this.awardQueue.push(award);
        }
        break;
      case "credits":
        award = this.achievements[23].attemptAward();
        if (award) {
          this.awardQueue.push(award);
        }
        break;
      case "challenge":
        award = this.achievements[24].attemptAward();
        if (award) {
          this.awardQueue.push(award);
        }
        break;
    }
  }

  export() {
    let ret = [];
    _.each(this.achievements, function (a) {
      if (a.earned) {
        ret.push({ index: a.index, earned: a.earned });
      }
    });
    return ret;
  }

  hideAll() {
    this.stats.hide();
    _.each(this.achievements, function (a) {
      a.hide();
    });
  }

  showAll() {
    this.stats.show();
    _.each(this.achievements, function (a) {
      a.show();
    });
  }

  setAchievement(index, earned) {
    this.achievements[index - 1].earned = earned;
    this.achievements[index - 1].setUI();
  }
}
