function preloader() {
  scene.load.image("upgradeLock", "images/upgradeLock.png");
  scene.load.image("skillLock", "images/skillLock.png");
  scene.load.image("pixel2", "images/pixel2.png");
  scene.load.image("expPlate", "images/expPlate.png");
  scene.load.image("achievementPrompt", "images/achievementPrompt.png");
  scene.load.image("expBar", "images/expBar.png");
  scene.load.image("expBarSplit", "images/expBarSplit.png");
  scene.load.image("expBarFill", "images/expBarFill.png");
  scene.load.image("expBarGlow", "images/expBarGlow.png");
  scene.load.image("expBarGlowSplit", "images/expBarGlowSplit.png");
  scene.load.image("fg", "images/fg.png");
  scene.load.image("splashBg", "images/splashBg.png");
  scene.load.image("fgTutorial", "images/fgTutorial.png");
  scene.load.image("leftWall", "images/leftWall.png");
  scene.load.image("rightWall", "images/rightWall.png");
  scene.load.image("volumeBar", "images/volumeBar.png");
  scene.load.image("volumeGrabber", "images/volumeGrabber.png");
  scene.load.image("volumeFrame", "images/volumeFrame.png");
  scene.load.image("timerBar", "images/timerBar.png");
  scene.load.image("cgLogo", "images/cgLogo.png");
  scene.load.image("rating", "images/rating.png");
  scene.load.spritesheet("skipCooldown", "images/skipCooldown.png", {
    frameWidth: 20,
    frameHeight: 16,
  });
  if (MOBILE) {
    scene.load.spritesheet("start", "images/startMobile.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
  } else {
    scene.load.spritesheet("start", "images/start.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }
  scene.load.spritesheet("volumeSFX", "images/volume.png", {
    frameWidth: 38,
    frameHeight: 32,
  });
  scene.load.spritesheet("timerNumbers", "images/timerNumbers.png", {
    frameWidth: 22,
    frameHeight: 27,
  });
  scene.load.spritesheet("burner", "images/burner_new.png", {
    frameWidth: 16,
    frameHeight: 48,
  });
  scene.load.spritesheet("volumeMusic", "images/volumeMusic.png", {
    frameWidth: 38,
    frameHeight: 32,
  });
  if (!MOBILE) {
    scene.load.spritesheet("bg", "images/bgFrame.png", {
      frameWidth: 1128,
      frameHeight: 615,
    });
  } else {
    scene.load.spritesheet("bg", "images/bg.png", {
      frameWidth: 1128,
      frameHeight: 615,
    });
  }
  scene.load.spritesheet("prestige", "images/prestige.png", {
    frameWidth: 192,
    frameHeight: 32,
  });
  scene.load.spritesheet("stats", "images/stats.png", {
    frameWidth: 192,
    frameHeight: 32,
  });
  scene.load.spritesheet("blankFull", "images/blankFull.png", {
    frameWidth: 192,
    frameHeight: 32,
  });
  scene.load.spritesheet("blank", "images/blank.png", {
    frameWidth: 64,
    frameHeight: 32,
  });
  scene.load.spritesheet("blank2", "images/blank2.png", {
    frameWidth: 64,
    frameHeight: 32,
  });
  scene.load.spritesheet("achievement", "images/achievement.png", {
    frameWidth: 38,
    frameHeight: 32,
  });
  scene.load.spritesheet("blankHalf", "images/blankHalf.png", {
    frameWidth: 96,
    frameHeight: 32,
  });
  scene.load.spritesheet("boss", "images/boss.png", {
    frameWidth: 192,
    frameHeight: 32,
  });
  scene.load.spritesheet("numbers", "images/numbers.png", {
    frameWidth: 48,
    frameHeight: 80,
  });
  scene.load.spritesheet("skipTutorial", "images/skipTutorial.png", {
    frameWidth: 192,
    frameHeight: 48,
  });
  scene.load.spritesheet("mobile", "images/mobile.png", {
    frameWidth: 192,
    frameHeight: 48,
  });
  scene.load.spritesheet("abandon", "images/abandon.png", {
    frameWidth: 192,
    frameHeight: 48,
  });
  scene.load.spritesheet("ad", "images/ad.png", {
    frameWidth: 192,
    frameHeight: 48,
  });

  for (let i = 1; i < 11; i++) {
    scene.load.spritesheet("skill" + i, "images/skill" + i + ".png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }
  for (let i = 1; i < 9; i++) {
    scene.load.spritesheet("button" + i, "images/button" + i + ".png", {
      frameWidth: 192,
      frameHeight: 48,
    });
    scene.load.spritesheet("lp" + i, "images/lp" + i + ".png", {
      frameWidth: 192,
      frameHeight: 48,
    });
  }
  for (let i = 1; i < 7; i++) {
    scene.load.spritesheet("pres" + i, "images/pres" + i + ".png", {
      frameWidth: 192,
      frameHeight: 48,
    });
  }
  for (let i = 1; i < 6; i++) {
    scene.load.spritesheet("menu" + i, "images/menu" + i + ".png", {
      frameWidth: 38,
      frameHeight: 32,
    });
    scene.load.spritesheet("tier" + i, "images/tier" + i + ".png", {
      frameWidth: 64,
      frameHeight: 32,
    });
  }
  for (let i = 1; i < 5; i++) {
    scene.load.spritesheet("mod" + i, "images/mod" + i + ".png", {
      frameWidth: 48,
      frameHeight: 32,
    });
  }

  scene.load.spritesheet("click", "images/click.png", {
    frameWidth: 16,
    frameHeight: 16,
  });

  scene.load.spritesheet("skillActive", "images/skillActive.png", {
    frameWidth: 64,
    frameHeight: 64,
  });

  scene.load.spritesheet("skillAutocast", "images/skillAutocast.png", {
    frameWidth: 64,
    frameHeight: 64,
  });

  scene.load.spritesheet("skillCooldown", "images/skillCooldown.png", {
    frameWidth: 64,
    frameHeight: 64,
  });

  scene.load.spritesheet("checkbox", "images/checkbox.png", {
    frameWidth: 16,
    frameHeight: 16,
  });
}

function createAnimations() {
  scene.anims.create({
    key: "skillAutocast",
    frames: scene.anims.generateFrameNumbers("skillAutocast"),
    frameRate: 20,
    repeat: -1,
  });

  scene.anims.create({
    key: "skillActive",
    frames: scene.anims.generateFrameNumbers("skillActive"),
    duration: 1000,
  });

  scene.anims.create({
    key: "skillCooldown",
    frames: scene.anims.generateFrameNumbers("skillCooldown"),
    duration: 1000,
  });

  scene.anims.create({
    key: "click",
    frames: scene.anims.generateFrameNumbers("click"),
    frameRate: 20,
    repeat: 0,
  });
  if (!MOBILE) {
    scene.anims.create({
      key: "flicker1",
      frames: scene.anims.generateFrameNumbers("bg", {
        frames: [
          0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
          5, 5, 0, 5, 5, 0, 5, 5, 5, 5, 5, 5, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 0,
          0, 5, 0,
        ],
      }),
      frameRate: 8,
      repeat: 0,
    });
    scene.anims.create({
      key: "flicker2",
      frames: scene.anims.generateFrameNumbers("bg", {
        frames: [
          0, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
          7, 7, 0, 7, 7, 0, 7, 7, 7, 7, 7, 7, 0, 0, 0, 7, 7, 7, 0, 0, 0, 0, 0,
          0, 7, 0,
        ],
      }),
      frameRate: 8,
      repeat: 0,
    });
    scene.anims.create({
      key: "flicker3",
      frames: scene.anims.generateFrameNumbers("bg", {
        frames: [
          0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
          3, 3, 0, 3, 3, 0, 3, 3, 3, 3, 3, 3, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0,
          0, 3, 0,
        ],
      }),
      frameRate: 8,
      repeat: 0,
    });
    scene.anims.create({
      key: "onOuter",
      frames: scene.anims.generateFrameNumbers("bg", {
        frames: [
          7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 7, 1, 1, 7, 1, 1, 1, 1, 1, 1, 7, 7, 7, 1, 1, 1, 7, 7, 7, 7, 7,
          7, 1, 7,
        ],
      }),
      frameRate: 8,
      repeat: 0,
    });
  }
  scene.anims.create({
    key: "burnerA",
    frames: scene.anims.generateFrameNumbers("burner", {
      frames: [0, 1, 2, 3, 4, 5],
    }),
    frameRate: 18,
    repeat: -1,
  });
  scene.anims.create({
    key: "burnerB",
    frames: scene.anims.generateFrameNumbers("burner", {
      frames: [
        18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
      ],
    }),
    frameRate: 18,
    repeat: 0,
  });
  scene.anims.create({
    key: "burnerC",
    frames: scene.anims.generateFrameNumbers("burner", {
      frames: [36, 37, 38, 39, 40, 41],
    }),
    frameRate: 18,
    repeat: 0,
  });
  scene.anims.create({
    key: "burnerD",
    frames: scene.anims.generateFrameNumbers("burner", {
      frames: [42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53],
    }),
    frameRate: 18,
    repeat: 0,
  });
  scene.anims.create({
    key: "burnerJ",
    frames: scene.anims.generateFrameNumbers("burner", {
      frames: [54, 55, 56, 57, 58, 59],
    }),
    frameRate: 18,
    repeat: 0,
  });
  scene.anims.create({
    key: "burnerL",
    frames: scene.anims.generateFrameNumbers("burner", {
      frames: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71],
    }),
    frameRate: 18,
    repeat: 0,
  });
  scene.anims.create({
    key: "burnerK",
    frames: scene.anims.generateFrameNumbers("burner", {
      frames: [
        72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
      ],
    }),
    frameRate: 18,
    repeat: 0,
  });
  scene.anims.create({
    key: "burnerBurnout",
    frames: scene.anims.generateFrameNumbers("burner", {
      frames: [
        54, 55, 56, 57, 58, 59, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83,
        84, 85, 86, 87, 88, 89, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83,
        84, 85, 86, 87, 88, 89, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83,
        84, 85, 86, 87, 88, 89, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
      ],
    }),
    frameRate: 18,
    repeat: 0,
  });
  scene.anims.create({
    key: "burnerM",
    frames: scene.anims.generateFrameNumbers("burner", {
      frames: [
        90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105,
        106, 107,
      ],
    }),
    frameRate: 18,
    repeat: 0,
  });
  scene.anims.create({
    key: "burnerN",
    frames: scene.anims.generateFrameNumbers("burner", {
      frames: [
        108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121,
        122, 123, 124, 125,
      ],
    }),
    frameRate: 18,
    repeat: 0,
  });
  scene.anims.create({
    key: "burnerBurnout",
    frames: scene.anims.generateFrameNumbers("burner", {
      frames: [
        54, 55, 56, 57, 58, 59, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83,
        84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100,
        101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114,
        115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 60, 61, 62, 63,
        64, 65, 66, 67, 68, 69, 70, 71,
      ],
    }),
    frameRate: 18,
    repeat: 0,
  });
}

function drawBackground(withGoal = true) {
  scene.bg = scene.add.sprite(
    GAME_WIDTH / 2,
    Math.floor(GAME_HEIGHT / 2),
    "bg"
  );

  let str = "";
  for (let i = 0; i < 60; i++) {
    str += "-";
  }
  scene.goal = scene.add
    .text(456, 30, str, { color: "#009900", fontSize: "24px" })
    .setOrigin(0.5);

  scene.goal.visible = withGoal;

  scene.burners = [];
  scene.burnerManager = new burnerManager();

  scene.leftWall = scene.add.image(
    -25,
    Math.floor(GAME_HEIGHT / 2),
    "leftWall"
  );
  scene.rightWall = scene.add.image(
    889,
    Math.floor(GAME_HEIGHT / 2),
    "rightWall"
  );
  if (withGoal) {
    scene.fg = scene.add.image(
      GAME_WIDTH / 2,
      Math.floor(GAME_HEIGHT / 2),
      "fg"
    );
  } else {
    scene.fg = scene.add.image(
      GAME_WIDTH / 2,
      Math.floor(GAME_HEIGHT / 2),
      "fgTutorial"
    );
  }
  scene.challengeCounter = new challengeNumber();
}

function drawCurrencyBlock() {
  scene.money = scene.add
    .text(920, 65, "Coins: 0", { color: "#ccdde3" })
    .setInteractive()
    .on("pointerover", function () {
      scene.tips.setValues({
        title: "Coins",
        text: "Earned by clicking blocks, with a bomus\r\nif you catch them while falling based \r\nroughly on block size",
      });
    })
    .on("pointerout", function () {
      scene.tips.clearValues();
    });
  scene.lp = scene.add
    .text(920, 85, "Level Points: 0", { color: "#ccdde3" })
    .setInteractive()
    .on("pointerover", function () {
      scene.tips.setValues({
        title: "Level Points",
        text: "Earned by gaining exerience from clicking \r\non blocks and leveling up.",
      });
    })
    .on("pointerout", function () {
      scene.tips.clearValues();
    });
  scene.tokens = scene.add
    .text(920, 105, "coins: 0", { color: "#ccdde3" })
    .setInteractive()
    .on("pointerover", function () {
      scene.tips.setValues({
        title: "Prestige Tokens",
        text: "Earn tokens by prestiging when you've cleared\r\nzone 4, unspent tokens give +25% coin income.",
      });
    })
    .on("pointerout", function () {
      scene.tips.clearValues();
    });
  scene.cp = scene.add
    .text(920, 125, "Chal. Points: 0", { color: "#ccdde3" })
    .setInteractive()
    .on("pointerover", function () {
      scene.tips.setValues({
        title: "Cllenge Points",
        text: "Earned by completing challenges \r\nfor the first time.",
      });
    })
    .on("pointerout", function () {
      scene.tips.clearValues();
    });
}

function drawUpgradesMenus() {
  scene.upgrades = [];
  scene.lps = [];
  for (let i = 1; i < 9; i++) {
    scene.upgrades.push(new upgradeButton(912, 134 + i * 48, i));
    scene.lps.push(new lpButton(912, 134 + i * 48, i));
  }

  scene.pres = [];
  for (let i = 1; i < 7; i++) {
    scene.pres.push(new presButton(912, 134 + i * 48, i));
  }
  scene.prestige = new simpleButton(
    912 + 96,
    520 + 16 + 13,
    "prestige",
    "Prestige"
  );
  scene.prestige.setTitle("Prestige");
  scene.prestige.setText(
    "Jump back to zone 1, but gain \r\nsome tokens to make things quicker."
  );
  scene.prestige.button
    .on(
      "pointerdown",
      function () {
        if (stats.level > 4) {
          soundController.play("click");
          if (scene.prompt) {
            scene.prompt.destroy();
            scene.prompt = null;
          }
          let prompt = new promptYN(prestige, function () {
            soundController.play("click");
            scene.prompt = false;
            prompt.destroy();
          });
          prompt.setTitle("One More Time?");
          prompt.setMessage(
            "Would you like to prestige?\r\n\r\nPrestige will reset level, coins, \r\ncoin upgrades,exp and exp upgrades, \r\nbut reward you with " +
              displayNumber(stats.tokensEarned) +
              " tokens!"
          );
        }
      },
      scene
    )
    .on("pointerover", function () {
      if (stats.level > 4) {
        this.setFrame(2);
      }
    })
    .on("pointerout", function () {
      if (stats.level > 4) {
        this.setFrame(1);
      }
    });

  scene.prestige.setLock(true);
  scene.prestigeText = scene.add.text(912, 474, "", {
    color: "#E0E0E0",
    fontSize: "12px",
  });

  scene.challenge = new simpleButton(
    912 + 96,
    520 + 16 + 13,
    "boss",
    "Play Challenge"
  );

  scene.challenge.button
    .on(
      "pointerdown",
      function () {
        if (stats.level > 49) {
          soundController.play("click");
          if (scene.prompt) {
            scene.prompt.destroy();
            scene.prompt = null;
          }
          let prompt = new promptYN(startChallenge, function () {
            soundController.play("click");
            scene.prompt = false;
            prompt.destroy();
          });
          scene.prompt = prompt;
          prompt.setTitle("Enter Challenge?");
          prompt.setMessage(
            "Would you like to start a challenge?\r\nYou will lose progress on your current\r\nzone, and enter a challenge zone\r\nwith special restrictions.\r\n\r\nNext Challenge Level: " +
              (stats.currentChallenge + 1)
          );
        }
      },
      scene
    )
    .on("pointerover", function () {
      if (stats.level > 4) {
        this.setFrame(2);
      }
    })
    .on("pointerout", function () {
      if (stats.level > 4) {
        this.setFrame(1);
      }
    });

  scene.challenge.setLock(true);
  scene.challengeText = scene.add.text(960, 190, "CHALLENGES", {
    color: "#E0E0E0",
    fontSize: "16px",
  });

  scene.challengeDesc = scene.add.text(
    912,
    210,
    "Fight and defeat ever more\r\ndifficult challenges to earn\r\nPoints to spend unlocking\r\npowerful and permanent\r\nupgrades.",
    {
      color: "#E0E0E0",
      fontSize: "12px",
    }
  );

  scene.challengeStats = scene.add.text(912, 450, "", {
    color: "#E0E0E0",
    fontSize: "12px",
  });

  scene.prestigeUnlock = scene.add.text(
    943,
    493 + 14,
    "\r\nUnlock on zone 5!",
    {
      color: "#E0E0E0",
      fontSize: "12px",
    }
  );

  scene.challengeUnlock = scene.add.text(
    943,
    493 + 14,
    "\r\nUnlock on zone 50!",
    {
      color: "#E0E0E0",
      fontSize: "12px",
    }
  );

  scene.musicSlider = new volumeSlider(1040, 395, false);
  scene.SFXSlider = new volumeSlider(1040, 425);

  // if (!MOBILE) {
  //   scene.export = new simpleButton(960, 550 - 64 + 30, "blankHalf", "Export");
  //   scene.export.setTitle("Export");
  //   scene.export.setText("Save your game to your computer");
  //   scene.export.button.on("pointerup", exportSave, scene);

  //   scene.import = new simpleButton(1056, 550 - 64 + 30, "blankHalf", "Import");
  //   scene.import.setTitle("Import");
  //   scene.import.setText("Import a save game");
  //   scene.import.button.on("pointerup", importSave, scene);
  // }

  scene.like = new simpleButton(960 + 49, 550 - 60, "blankFull", "Follow Us On Twitter");
  scene.like.setTitle("Follow Us On Twitter");
  scene.like.setText("Like the work LomazGames does? why not give\r\nus a follow on twitter, pop over and say 'Hi'!");
  scene.like.button.on(
    "pointerup",
    function () {
      url = "https://www.twitter.com/Lomaz_Games";
      var s = window.open(url, "_blank");

      if (s && s.focus) {
        s.focus();
      } else if (!s) {
        window.location.href = url;
      }
    },
    scene
  );

  scene.more = new simpleButton(
    960 + 49,
    550 - 32,
    "blankFull",
    "Play More Games"
  );
  scene.more.setTitle("Play More Games");
  scene.more.setText("Like what you see? try out another of\r\nour games on Itch!");
  scene.more.button.on(
    "pointerup",
    function () {
      url = "https://lomaz.itch.io/";
      var s = window.open(url, "_blank");

      if (s && s.focus) {
        s.focus();
      } else if (!s) {
        window.location.href = url;
      }
    },
    scene
  );

  scene.discord = new simpleButton(960, 550 - 32 + 30, "blankHalf", "Discord");
  scene.discord.setTitle("Discord");
  scene.discord.setText(
    "Come join the community,\r\nmeet the developer,\r\nor just say 'Hi!'"
  );
  scene.discord.button.on(
    "pointerup",
    function () {
      url = "https://discord.gg/k3kn93J7w4";
      var s = window.open(url, "_blank");

      if (s && s.focus) {
        s.focus();
      } else if (!s) {
        window.location.href = url;
      }
    },
    scene
  );
  scene.patreon = new simpleButton(1056, 550 - 32 + 30, "blankHalf", "Patreon");
  scene.patreon.setTitle("Patreon");
  scene.patreon.setText(
    "Love the game?\r\nConsider showing your love on Patreon!\r\n<3"
  );
  scene.patreon.button.on(
    "pointerup",
    function () {
      url = "https://www.patreon.com/nightscapes";
      var s = window.open(url, "_blank");

      if (s && s.focus) {
        s.focus();
      } else if (!s) {
        window.location.href = url;
      }
    },
    scene
  );
  scene.credits = new simpleButton(960, 550 + 30, "blankHalf", "Credits");
  scene.credits.setTitle("Credits");
  scene.credits.setText(
    "Who made scene game?\r\nWho drew the lovely art?\r\nThese answers and more, a click away"
  );
  scene.credits.button.on(
    "pointerdown",
    function () {
      soundController.play("click");
      if (scene.prompt) {
        scene.prompt.destroy();
        scene.prompt = null;
      }
      let prompt = new promptOK();
      scene.achievementManager.assessMetric("credits");
      prompt.setTitle("Credits");
      prompt.setMessage(
        "Game By .......... Ian Lomas\r\nArt By ............... '279'\r\nMusic By ... Phelippe Afonso\r\nSFX By ........ Miguel Abuel\r\n\r\nSpecial Thanks .. Dave Banks"
      );
      prompt.setButton("Cool!");
    },
    scene
  );
  scene.hardReset = new simpleButton(1056, 550 + 30, "blankHalf", "Hard Reset");
  scene.hardReset.setTitle("Hard Reset");
  scene.hardReset.setText(
    "Game not fun anymore?\r\nDreaming of a simpler time?\r\nClicky clicky!"
  );
  scene.hardReset.button.on(
    "pointerdown",
    function () {
      soundController.play("click");
      if (scene.prompt) {
        scene.prompt.destroy();
        scene.prompt = null;
      }
      let prompt = new promptYN(resetSave, function () {
        soundController.play("click");
        scene.prompt = false;
        prompt.destroy();
      });
      prompt.setTitle("Reset Progress");
      prompt.setMessage(
        "Are you sure you want\r\nto reset everything?\r\nAll progress will be lost!"
      );
    },
    scene
  );
  scene.version = scene.add.text(960, 570 + 30, "Version " + VERSION, {
    color: "#E0E0E0",
    fontSize: "12px",
  });

  scene.skills = [];
  for (let i = 1; i < 11; i++) {
    scene.skills.push(new skillButton(-32 + i * 48, i % 2 == 1 ? 518 : 550, i));
  }

  scene.tiers = [];
  let counter = 0;
  for (let i = 1; i < 4; i++) {
    for (let j = 1; j < 6; j++) {
      counter++;
      scene.tiers.push(new tierButton(848 + i * 64, 250 + j * 32, counter, j));
    }
  }

  // scene.numberFormatsText = scene.add.text(960, 421 + 30, "Number Notation", {
  //   color: "#E0E0E0",
  //   fontSize: "12px",
  // });
  scene.numberFormats = [];
  for (let i = 1; i < 4; i++) {
    let strings = ["", "Basic", "Sci.", "Eng."];

    nf = new simpleButton(881 + i * 64, 453 + 4, "blank2", strings[i]);
    nf.string = strings[i];
    let text = {};
    switch (i) {
      case 1:
        text = {
          title: "Basic Notation",
          text: "Numbers are shown in english format\r\nExample: 300b, 2.88t",
        };
        break;
      case 2:
        text = {
          title: "Scientific Notation",
          text: "Numbers are shown in scientific notation\r\nExample: 3.00e11, 2.88e12",
        };
        break;
      case 3:
        text = {
          title: "Basic Notation",
          text: "Numbers are shown in engineering notation\r\nExample: 300e9, 2.88e12",
        };
        break;
      default:
        break;
    }
    nf.setText(text.text);
    nf.setTitle(text.title);
    nf.button.on("pointerdown", function () {
      soundController.play("click");
      scene.numberFormat = strings[i];
      console.log("aah!!?!");
      scene.money.setText("Coins: " + displayNumber(stats.money));
      scene.tokens.setText("Tokens: " + displayNumber(stats.tokens));
      _.each(scene.upgrades, function (u) {
        u.setCost();
      });
      _.each(scene.lps, function (u) {
        u.setCost();
      });
      _.each(scene.pres, function (u) {
        u.setCost();
      });
      _.each(scene.numberFormats, function (m) {
        m.button.setFrame(1);
        m.button.selected = false;
      });
      this.setFrame(3);
      this.selected = true;
    });
    scene.numberFormats.push(nf);
  }

  scene.menu = [];
  for (let i = 1; i < 6; i++) {
    let men = scene.add
      .sprite(875 + i * 38, 150, "menu" + i)
      .setOrigin(0)
      .setInteractive();
    men.selected = false;
    let text = {};
    switch (i) {
      case 1:
        text = {
          title: "Upgrades",
          text: "Spend coins to increase different aspects\r\nof the current zone, resets every zone.",
        };
        break;
      case 2:
        text = {
          title: "LP Upgrades",
          text: "Spend Level Points to further enhance \r\ngameplay of the current prestige. \r\nResets with prestige.",
        };
        break;
      case 3:
        text = {
          title: "Prestige Upgrades",
          text: "Spend Tokens to permanently increase\r\ngameplay, but don't overspend as tokens\r\nalso offer a passive benifit.",
        };
        break;
      case 4:
        text = {
          title: "Challenges",
          text: "Fight difficult challenges with specific\r\nsets of upgrades and skills locked.",
        };
        break;
      case 5:
        text = {
          title: "Achievements and Menu",
          text: "Check and reset your progress, as well as\r\njoin the Stacked Community!",
        };
        break;
      default:
        break;
    }
    men
      .on("pointerover", function () {
        this.setFrame(2);
        scene.tips.setValues(text);
      })
      .on("pointerout", function () {
        if (!this.selected) {
          this.setFrame(0);
        }
        scene.tips.clearValues();
      })
      .on("pointerdown", function () {
        showMenu(i);
        soundController.play("click");
        _.each(scene.menu, function (m) {
          m.setFrame(0);
          m.selected = false;
        });
        this.setFrame(1);
        this.selected = true;
      });
    scene.menu.push(men);
  }
  scene.menu[0].setFrame(1);
  scene.menu[0].selected = true;

  scene.buyModifier = 0;
  scene.mods = [];
  for (let i = 1; i < 5; i++) {
    let mod = scene.add
      .sprite(864 + i * 48, 566, "mod" + i)
      .setOrigin(0)
      .setInteractive();
    mod.selected = false;
    mod.index = i - 1;

    let text = {};
    switch (i) {
      case 1:
        text = {
          title: "Buy 1",
          text: "Buy one of an upgrade",
        };
        break;
      case 2:
        text = {
          title: "Buy 10",
          text: "Buy ten of an upgrade",
        };
        break;
      case 3:
        text = {
          title: "Buy 25",
          text: "Buy twenty-five of an upgrade",
        };
        break;
      case 4:
        text = {
          title: "Buy Max",
          text: "Buy all you can afford of an upgrade",
        };
        break;
      default:
        break;
    }

    mod
      .on("pointerover", function () {
        this.setFrame(2);
        scene.tips.setValues(text);
      })
      .on("pointerout", function () {
        if (!this.selected) {
          this.setFrame(0);
          scene.tips.clearValues();
        } else {
          this.setFrame(1);
        }
      })
      .on("pointerdown", function () {
        soundController.play("click");
        _.each(scene.mods, function (m) {
          m.setFrame(0);
          m.selected = false;
        });
        this.setFrame(1);
        this.selected = true;
        scene.buyModifier = this.index;
        _.each(scene.upgrades, function (u) {
          u.setCost();
        });
        _.each(scene.lps, function (u) {
          u.setCost();
        });
        _.each(scene.pres, function (u) {
          u.setCost();
        });
      });
    scene.mods.push(mod);
  }
  scene.mods[0].setFrame(1);
  scene.mods[0].selected = true;
}
