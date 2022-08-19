let gameScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function gameScene() {
    Phaser.Scene.call(this, {
      key: "gameScene",
    });
  },

  preload: function () {
    scene = this;
    scene.musicController = new musicController();
    // scene.musicController.loadSounds();
    preloader();
  },

  create: function () {
    soundController.addSounds();
    scene.sound.pauseOnBlur = false;
    createAnimations();
    drawBackground();
    drawCurrencyBlock();
    drawUpgradesMenus();
    this.manager = new manager();
    this.zoneClear = false;
    this.counter = 0;
    this.heartbeat = 0;
    this.blocks = this.add.group();
    this.expBar = new expBar();
    this.zoneNumber = new zoneNumber();
    this.achievementManager = new achievementManager();

    this.challengeCowndownInterval = setInterval(function () {
      if (stats.challengeActive) {
        scene.challengeCounter.show();
        scene.challengeCounterSeconds--;
        updateChallengeCounter();
        if (scene.challengeCounterSeconds < 0) {
          endChallenge();
          let prompt = new promptOK();
          prompt.setTitle("Challenge Failed");
          prompt.setMessage("You've run out of time!\r\nTry again Later!");
        }
      } else {
        scene.challengeCounter.hide();
      }
    }, 1000);

    this.input.keyboard.addCapture(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.shift = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT
    );

    this.matter.world.on("collisionstart", function (event, bodyA, bodyB) {
      _.each(event.pairs, function (pair) {
        try {
          if (
            pair.bodyA.gameObject.grounded &&
            !pair.bodyB.gameObject.grounded
          ) {
            pair.bodyB.gameObject.ground();
          }
          if (
            pair.bodyB.gameObject.grounded &&
            !pair.bodyA.gameObject.grounded
          ) {
            pair.bodyA.gameObject.ground();
          }
        } catch (error) {}
      });
    });

    this.matter.world.on("collisionactive", function (event, bodyA, bodyB) {
      _.each(event.pairs, function (pair) {
        try {
          if (
            pair.bodyA.labelText === "burner" &&
            pair.bodyA.gameObject.image.anims.currentAnim.key === "burnerC"
          ) {
            pair.bodyA.gameObject.burn();
            pair.bodyB.gameObject.payout("burn");
          } else if (
            pair.bodyB.labelText === "burner" &&
            pair.bodyB.gameObject.image.anims.currentAnim.key === "burnerC"
          ) {
            pair.bodyB.gameObject.burn();
            pair.bodyA.gameObject.payout("burn");
          }
        } catch (error) {}
      });
    });

    this.tips = new tooltip();

    if (loadGame()) {
      this.scene.start("tutorialScene");
      return;
    }
    showMenu(1);
    _.each(this.skills, function (s) {
      s.loadStats();
    });
    _.each(this.upgrades, function (u) {
      u.setCost();
    });
    _.each(this.lps, function (u) {
      u.setCost();
    });
    _.each(this.pres, function (u) {
      u.setCost();
    });

    if (MOBILE) {
      this.rater = new rater();
    } else {
      this.mobile = new mobile();
    }

    let songLoader = this.load.audio("music", ["sounds/music/music.mp3"]);
    songLoader.on("filecomplete", () => {
      scene.musicController.addSounds();
      scene.musicController.play();
    });
    songLoader.start();
  },

  update: function () {
    this.achievementManager.tick();
    this.burnerManager.tick();
    this.manager.tick();
    _.each(this.skills, function (s) {
      s.tick();
    });
    if (MOBILE) {
      this.rater.tick();
    }
    this.counter++;
    this.heartbeat++;
    if (this.heartbeat % 10 === 0) {
      updateTokensEarnedText();
    }
    let droprate = 80 - scene.upgrades[4].getLevel() * 2;
    if (this.skills[0].active) {
      droprate = droprate / 2;
    }
    if (this.manager && this.manager.spawn) {
      droprate = droprate / 1.5;
    }
    if (this.counter > droprate && !this.zoneClear) {
      saveGame();
      this.counter = 0;
      this.blocks.children.each(function (b) {
        if (b.x > scene.matter.world.walls.right.position.x) {
          b.payout("click");
        } else if (b.x < scene.matter.world.walls.left.position.x) {
          b.payout("click");
        }
        if (
          b.body &&
          b.y - b.radius < 40 + scene.upgrades[6].getLevel() * 10 &&
          b.body.velocity.x < 0.1 &&
          b.body.velocity.y < 0.1 &&
          b.grounded
        ) {
          scene.zoneClear = true;
          if (scene.upgrades[5].getLevel() === 0) {
            scene.achievementManager.assessMetric("zoneClearNoWalls");
          }
          if (
            scene.upgrades[1].getLevel() === 0 &&
            scene.upgrades[2].getLevel() === 0
          ) {
            scene.achievementManager.assessMetric("noSize");
          }
        }
      });
      if (scene.tiers[13].bought) {
        new Block(
          this.upgrades[1].getLevel() + 1,
          this.upgrades[2].getLevel() + 1
        );
      } else {
        new Block(
          Phaser.Math.Between(
            Math.ceil(((this.upgrades[1].getLevel() + 1) * 3) / 4),
            this.upgrades[1].getLevel() + 1
          ),
          Phaser.Math.Between(
            Math.ceil(((this.upgrades[2].getLevel() + 1) * 3) / 4),
            this.upgrades[2].getLevel() + 1
          )
        );
      }
    }
    if (this.zoneClear) {
      this.zoneClear = popNext();
      if (!this.zoneClear) {
        if (stats.challengeActive) {
          stats.currentChallenge++;
          if (!challenges[stats.currentChallenge]) {
            buildChallenge(stats.currentChallenge);
          }
          scene.challengeCounterSeconds =
            challenges[stats.currentChallenge].duration;
          updateChallengeCounter();
          scene.zoneNumber.setText(stats.currentChallenge + 1, true);
          if (
            stats.displayStats.total.highestChallenge < stats.currentChallenge
          ) {
            stats.displayStats.total.highestChallenge = stats.currentChallenge;
            if (GAObject) {
              GAObject.submitEvent("challengecomplete", stats.currentChallenge);
            }
            let earn = Math.ceil(stats.currentChallenge / 5);
            adjustCP(earn);
            let prompt = new promptOK();
            prompt.setTitle("Challenge Complete");
            prompt.setMessage(
              "This is your first time \r\ncompleting challenge " +
                stats.currentChallenge +
                "! \r\nyou earned " +
                earn +
                " Challenge Points!"
            );
          }
        } else {
          stats.level++;
          if (MOBILE) {
            if (stats.promptRating === 0) {
              scene.rater.prompt();
            }
          } else {
            if (stats.promptMobile) {
              scene.mobile.prompt();
            }
          }
          if (stats.level > stats.displayStats.total.highestZone) {
            if (GAObject) {
              GAObject.submitEvent("zonecomplete", stats.level);
            }
            stats.displayStats.total.highestZone = stats.level;
          }
          if (stats.level > 4) {
            scene.prestige.button.setFrame(1);
          }
          if (stats.level > 49) {
            scene.challenge.button.setFrame(1);
          }
          scene.zoneNumber.setText(stats.level);
        }
        soundController.play("zoneClear");
        _.each(this.upgrades, function (u) {
          u.reset();
          u.checkChallengeLock();
          u.assessCost();
        });
        _.each(this.skills, function (u) {
          u.checkLock();
          u.checkChallengeLock();
          u.setUI();
        });
        _.each(scene.lps, function (u) {
          u.checkChallengeLock();
          u.assessCost();
        });
        adjustSize();
        adjustGoal();
        saveGame();
        _.each(this.upgrades, function (u) {
          u.tick();
        });
      }
    }
  },
});
