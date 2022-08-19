function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function displayNumber(y) {
  try {
    if (y.constructor.name !== "Decimal") {
      if (parseFloat(y) === NaN) {
        return 0;
      } else {
        y = new Decimal(y);
      }
    }

    if (y.e < 9) {
      return y
        .toFixed(0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      let suffixes = [
        "M",
        "B",
        "T",
        "Qd",
        "Qn",
        "Sx",
        "Sp",
        "Oc",
        "N",
        "Dc",
        "UDc",
        "DDc",
        "TDc",
        "QaDc",
        "QiDc",
        "SxDc",
        "SpDc",
        "OcDc",
        "NDc",
        "Vi",
      ];
      let ret = "";
      let str = y.toPrecision(y.e + 1).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      let s0 = str.split(",")[0];
      let s1 = str.split(",")[1].substring(0, 4 - s0.length);
      let e = (str.split(",").length - 1) * 3;
      let notation = scene.numberFormat;
      if (str.split(",").length - 1 - 2 > 13 && notation === "Basic") {
        notation = "Eng.";
      }
      switch (notation) {
        case "Eng.":
          ret = s0 + "." + s1 + "e" + e;
          break;
        case "Sci.":
          ret = y.toPrecision(4).replace("+", "");
          break;
        case "Basic":
        default:
          ret = s0 + "." + s1 + "" + suffixes[str.split(",").length - 1 - 2];
          break;
      }
      return ret;
    }
  } catch (err) {
    return 0;
  }
}

function adjustMoney(diff, add = true) {
  if (add) {
    stats.totalMoney = stats.totalMoney.plus(diff);
    stats.money = stats.money.plus(diff);
    _.each(scene.upgrades, function (u) {
      u.tick();
    });
    if (!scene.tutorialMode) {
      updateTokensEarned();
    }
  } else {
    stats.money = stats.money.minus(diff);
  }
  if (scene.money) {
    scene.money.setText("Coins: " + displayNumber(stats.money));
    _.each(scene.upgrades, function (u) {
      u.setCost();
      u.assessCost();
    });
  }
}

function adjustLP(diff, add = true) {
  if (add) {
    stats.lp = stats.lp + diff;
  } else {
    stats.lp = stats.lp - diff;
  }
  if (scene.lp) {
    scene.lp.setText("Level Points: " + displayNumber(stats.lp));
    _.each(scene.upgrades, function (u) {
      u.assessCost();
    });
    _.each(scene.lps, function (u) {
      u.assessCost();
    });
  }
}

function adjustCP(diff, add = true) {
  if (add) {
    stats.cp = stats.cp + diff;
    if (stats.cp > 10) {
      scene.achievementManager.assessMetric("challenge");
    }
  } else {
    stats.cp = stats.cp - diff;
  }
  if (scene.cp) {
    scene.cp.setText("Chal. Points: " + displayNumber(stats.cp));
    _.each(scene.tiers, function (u) {
      u.assessCost();
    });
  }
  updateChallengeEarnedText();
}

function adjustTokens(diff, add = true) {
  if (add) {
    stats.tokens = stats.tokens.plus(diff);
    stats.displayStats.total.tokensEarned =
      stats.displayStats.total.tokensEarned.plus(diff);
    scene.achievementManager.assessMetric("tokensEarned", diff);
  } else {
    stats.tokens = stats.tokens.minus(diff);
    if (stats.tokens.eq(0)) {
      scene.achievementManager.assessMetric("spendAllTokens", stats.clickLevel);
    }
  }
  if (scene.tokens) {
    scene.tokens.setText("Tokens: " + displayNumber(stats.tokens));
  }
  stats.tokenModifer = Decimal.add(1, stats.tokens.mul(0.25));
  _.each(scene.pres, function (u) {
    u.assessCost();
  });
  updateTokensEarnedText();
}

function promptBackgroundProgress(time, seconds = 0) {
  let width = Math.ceil(((scene.upgrades[1].getLevel() + 1) * 3) / 4);
  let height = Math.ceil(((scene.upgrades[2].getLevel() + 1) * 3) / 4);
  let score = new Decimal(Math.sqrt(width * height * 100)).mul(
    new Decimal(10).pow(stats.level)
  );
  let scoreIncrease = score.mul(seconds);
  if (seconds > 30 && !scene.prompt) {
    let prompt = new promptOK();
    prompt.setTitle("Background Progress");
    prompt.setMessage(
      "You were away for:\r\n" +
        time +
        "\r\n\r\nAnd gained:\r\n" +
        displayNumber(scoreIncrease) +
        " Coins!"
    );
  }
  adjustMoney(scoreIncrease);
}

function updateTokensEarned() {
  stats.tokensEarned = cacluateTokenGain();
  updateTokensEarnedText();
}

function updateTokensEarnedText() {
  scene.prestigeText.setText(
    "Token Modifier: " +
      (stats.tokenModifer || 1) +
      "x\r\nRun Duration: " +
      getDateDiff(stats.displayStats.run.start || new Date(), new Date()) +
      (stats.level >= 5
        ? "\r\nTokens Earned: " + displayNumber(stats.tokensEarned)
        : "")
  );
  if (stats.level < 5) {
    scene.prestigeUnlock.setText("\r\nUnlock on zone 5!");
  } else {
    scene.prestigeUnlock.setText("");
  }
}

function updateChallengeEarnedText() {
  scene.challengeStats.setText(
    "Point Modifier: " +
      (stats.cp + 1) +
      "x\r\nCurrent Challenge: " +
      (stats.currentChallenge + 1) +
      "\r\nHighest Reached: " +
      (stats.displayStats.total.highestChallenge + 1)
  );
  if (stats.level < 50) {
    scene.challengeUnlock.setText("\r\nUnlock on zone 50!");
  } else {
    scene.challengeUnlock.setText("");
  }
}

function loadGame(importSave = false) {
  let offlineTime, seconds;
  let showTutorial = true;

  if (importSave) {
    try {
      save = JSON.parse(atob(importSave.replace("p1u1bh6ra5r3yt8j", "")));
    } catch (error) {
      console.log("invalid save:" + importSave);
      return;
    }
  } else {
    try {
      if (typeof Storage !== "undefined" && localStorage) {
        let attemptLoad = localStorage.getItem("stack-save");
        if (attemptLoad) {
          save = JSON.parse(atob(attemptLoad.replace("p1u1bh6ra5r3yt8j", "")));
          if (!save.version || save.version < 3) {
            save = {};
            let prompt = new promptOK();
            prompt.setTitle("Version Not Supported");
            prompt.setMessage(
              "Hey! I just met you!\r\nand this is crazy!\r\nyour save is old!\r\nso restart maybe?"
            );
          } else {
            console.log("save detected!");
            now = Date.now();
            seconds = Math.floor((now - save.timestamp) / 1000);
            if (seconds > 1296000) {
              scene.achievementManager.assessMetric("offline");
            }
            offlineTime = getDateDiff(now, save.timestamp);
            showTutorial = false;
          }
          if (save.version === 5) {
            let prompt = new promptOK();
            prompt.setTitle("0.1.6?!");
            prompt.setMessage(
              "Very Small Update:\r\n\r\n- Misfire nerfed: now breaks \r\n50% of burners.\r\n- New android version is out!\r\nTake Stacked with you anywhere,\r\nSearch 'Stacked Idle' in the\r\nGoogle Play Store!"
            );
            prompt.text.setAlign();
          }
        } else {
          console.log("no save found!");
          let prompt = new promptOK();
          prompt.setTitle("TESTING TESTING");
          prompt.setMessage(
            "Hey there! Did ya know?\r\nThis game is still heavily\r\nunder construction! stuff is\r\ncurrently set up for testing\r\nso don't expect your save file\r\nto stick around!"
          );
        }
      } else {
        showTutorial = false;
        let prompt = new promptOK();
        prompt.setTitle("No Local Storage");
        prompt.setMessage(
          "Uh oh! it looks like your browser\r\ndoes not support local storage,\r\nbecause of this, we can't save!\r\nYou can still keep your progress\r\nby exporting your data manually!"
        );
      }
    } catch (error) {
      console.log(save);
      console.log("save failed to load:");
      console.log(error);
      save = {};
      return true;
    }
  }

  stats.displayStats = save.displayStats
    ? save.displayStats
    : {
        run: {
          start: new Date(),
          blocksClicked: 0,
          highestZone: 1,
          highestLevel: 1,
          highestChallenge: 0,
        },
        total: {
          start: new Date(),
          blocksClicked: 0,
          highestZone: 1,
          highestLevel: 1,
          highestChallenge: 0,
          fastestPrestige: "N/A",
          totalPrestiges: 0,
          tokensEarned: new Decimal(0),
        },
      };

  stats.displayStats.total.tokensEarned = new Decimal(
    stats.displayStats.total.tokensEarned
  );
  stats.money = new Decimal(save.money || 1000);
  stats.totalMoney = new Decimal(save.totalMoney || 1000);
  stats.tokens = new Decimal(save.tokens || 0);
  stats.level = save.level || 1;
  stats.exp = save.exp || 1;
  stats.promptRating = save.promptRating ? save.promptRating : 0;
  stats.promptMobile = save.hasOwnProperty("promptMobile")
    ? save.promptMobile
    : true;
  stats.currentChallenge = save.currentChallenge || 0;
  scene.numberFormat = save.numberFormat ? save.numberFormat : "Basic";
  scene.SFXSlider.setValue(save.sfxVolume);
  scene.musicSlider.setValue(save.musicVolume);
  stats.clickLevel = save.clickLevel || 1;
  stats.expNext = Math.floor(100 + compound(100, stats.clickLevel, 0.05));
  stats.tokenModifer = Decimal.add(1, stats.tokens.mul(0.25));
  stats.lp = save.lp || 0;
  stats.cp = save.cp || 0;

  if (save.tutorialComplete) {
    showTutorial = false;
    let prompt = new promptOK();
    prompt.setTitle("Tutoral Finished");
    prompt.setMessage(
      "Look at you go!\r\nCompleting the tutorial\r\nand stuff, happy playing!"
    );
  }

  _.each(scene.numberFormats, function (s) {
    if (s.string === scene.numberFormat) {
      s.button.setFrame(3);
    }
  });

  _.each(save.achievements, function (s) {
    scene.achievementManager.setAchievement(s.index, s.earned);
  });

  _.each(save.skills, function (s) {
    if (s.cooldownCounter > 0) {
      s.cooldownCounter = s.cooldownCounter - seconds;
      if (s.cooldownCounter < 0) {
        s.cooldownCounter = 0;
      }
    }
    scene.skills[s.id].setState(
      s.useCount,
      s.totalUseCount,
      s.activeCooldownCounter,
      s.cooldownCounter,
      s.locked,
      s.autoCast
    );
    scene.skills[s.id].checkLock();
  });
  _.each(save.upgrades, function (s) {
    scene.upgrades[s.id].setState(s.level, s.auto);
  });
  _.each(save.lps, function (s) {
    scene.lps[s.id].setState(s.level);
  });
  _.each(save.pres, function (s) {
    scene.pres[s.id].setState(s.level);
  });
  _.each(save.tiers, function (s) {
    scene.tiers[s.id].setState(s.bought);
  });

  scene.zoneNumber.setText(stats.level);
  scene.money.setText("Coins: " + displayNumber(stats.money));
  scene.tokens.setText("Tokens: " + displayNumber(stats.tokens));
  scene.lp.setText("Level Points: " + displayNumber(stats.lp));
  scene.cp.setText("Chal. Points: " + displayNumber(stats.cp));
  scene.expBar.setLevel(stats.clickLevel);
  scene.expBar.setProgress(stats.exp / stats.expNext);
  promptBackgroundProgress(offlineTime, seconds);
  updateTokensEarned();
  return showTutorial;
}

function resetSave() {
  if (typeof Storage !== "undefined" && localStorage) {
    stats.doNotSave = true;
    localStorage.removeItem("stack-save");
    location.reload();
  }
}

function saveGame(dontPrompt = false) {
  if (stats.doNotSave) {
    return;
  }
  save.money = new Decimal(stats.money);
  save.totalMoney = new Decimal(stats.totalMoney);
  save.tokens = new Decimal(stats.tokens);
  save.level = stats.level;
  save.exp = stats.exp;
  save.clickLevel = stats.clickLevel;
  save.lp = stats.lp;
  save.cp = stats.cp;
  save.promptRating = stats.promptRating;
  save.promptMobile = stats.promptMobile;
  save.currentChallenge = stats.currentChallenge;
  save.version = 6;
  save.tutorialComplete = stats.tutorialComplete;
  save.timestamp = Date.now();
  save.displayStats = stats.displayStats;
  save.sfxVolume = scene.SFXSlider ? scene.SFXSlider.value : 0.4;
  save.musicVolume = scene.musicSlider ? scene.musicSlider.value : 0.4;
  save.numberFormat = scene.numberFormat;
  save.achievements = scene.achievementManager.export();
  save.skills = [];
  _.each(scene.skills, function (s, index) {
    save.skills.push({
      id: index,
      useCount: s.useCount,
      totalUseCount: s.totalUseCount,
      activeCooldownCounter: s.activeCooldownCounter,
      cooldownCounter: s.cooldownCounter,
      locked: s.locked,
      autoCast: s.autoCast,
    });
  });
  save.tiers = [];
  _.each(scene.tiers, function (s, index) {
    save.tiers.push({
      id: index,
      bought: s.bought,
    });
  });
  save.upgrades = [];
  _.each(scene.upgrades, function (s, index) {
    save.upgrades.push({ id: index, level: s.level, auto: s.autoBuy });
  });
  save.lps = [];
  _.each(scene.lps, function (s, index) {
    save.lps.push({ id: index, level: s.level });
  });
  save.pres = [];
  _.each(scene.pres, function (s, index) {
    save.pres.push({ id: index, level: s.level });
  });

  if (typeof Storage !== "undefined" && localStorage) {
    localStorage.setItem(
      "stack-save",
      "p1u1bh6ra5r3yt8j" + btoa(JSON.stringify(save))
    );
  } else if (!dontPrompt) {
    // complain local storage isn't on here!
  }
  return "p1u1bh6ra5r3yt8j" + btoa(JSON.stringify(save));
}

function gainExp(exp) {
  exp = exp * (1 + compound(1, scene.lps[7].getLevel(), 0.25));
  exp = exp * (1 + scene.pres[1].level * 0.2);
  exp = exp * (scene.achievementManager.achievements[17].earned ? 1.5 : 1);
  stats.exp += exp;
  if (stats.exp > stats.expNext) {
    stats.exp = 0;
    stats.clickLevel++;
    if (stats.clickLevel > stats.displayStats.total.highestLevel) {
      stats.displayStats.total.highestLevel = stats.clickLevel;
    }
    scene.achievementManager.assessMetric("clickLevel", stats.clickLevel);
    adjustLP((scene.lps[6].getLevel() + 1) * (scene.tiers[9].bought ? 2 : 1));
    stats.expNext = Math.floor(100 + compound(100, stats.clickLevel, 0.05));
  }
  scene.expBar.setLevel(stats.clickLevel);
  scene.expBar.setProgress(stats.exp / stats.expNext);
}

function popNext() {
  if (!scene.blocks.children.entries[0]) {
    return false;
  }
  let block =
    scene.blocks.children.entries[
      Phaser.Math.Between(0, scene.blocks.children.entries.length - 1)
    ];
  block.click(block.body);
  return true;
}

function compound(principal, time, rate) {
  const amount = principal * Math.pow(1 + rate / 1, 1 * time);
  const interest = amount - principal;
  return interest;
}

function adjustSize() {
  let steps =
    scene.upgrades[5].getLevel() +
    (scene.achievementManager.achievements[12].earned ? 1 : 0);
  scene.leftWall.x = 25 + steps * 16;
  scene.rightWall.x = 889 - steps * 16;
  scene.matter.world.setBounds(
    32 + steps * 16,
    -1000,
    864 - steps * 2 * 16,
    1498
    /*
    24 + steps * 16,
    -1000,
    864 - steps * 2 * 16,
    1498
    */
  );
  scene.blocks.children.each(function (b) {
    if (b.x > scene.matter.world.walls.right.position.x) {
      b.payout("click");
    } else if (b.x < scene.matter.world.walls.left.position.x) {
      b.payout("click");
    }
  });
}

function adjustGoal() {
  scene.goal.y =
    30 +
    (scene.upgrades[6].getLevel() +
      (scene.achievementManager.achievements[16].earned ? 1 : 0)) *
      10;
}

function showMenu(index) {
  scene.achievementManager.hideAll();
  scene.prestige.visible = false;
  scene.prestigeText.visible = false;
  scene.prestigeUnlock.visible = false;
  scene.challenge.visible = false;
  scene.challengeText.visible = false;
  scene.challengeStats.visible = false;
  scene.challengeDesc.visible = false;
  scene.challengeUnlock.visible = false;

  scene.musicSlider.visible = false;
  scene.SFXSlider.visible = false;
  // if (!MOBILE) {
  //   scene.import.visible = false;
  //   scene.export.visible = false;
  // }
  // scene.numberFormatsText.visible = false;

  // scene.more.visible = false;

  scene.like.visible = false;
  scene.more.visible = false;
  scene.discord.visible = false;
  scene.patreon.visible = false;
  scene.credits.visible = false;
  scene.hardReset.visible = false;
  scene.version.visible = false;

  scene.money.setStroke();
  scene.lp.setStroke();
  scene.tokens.setStroke();
  scene.cp.setStroke();
  _.each(scene.numberFormats, function (u) {
    u.hide();
  });
  _.each(scene.upgrades, function (u) {
    u.hide();
  });
  _.each(scene.lps, function (u) {
    u.hide();
  });
  _.each(scene.tiers, function (u) {
    u.hide();
  });
  _.each(scene.pres, function (u) {
    u.hide();
  });
  _.each(scene.mods, function (u) {
    u.visible = false;
  });
  if (index === 1) {
    scene.money.setStroke("#ccdde3", 1);
    _.each(scene.upgrades, function (u) {
      u.show();
    });
  } else if (index === 2) {
    scene.lp.setStroke("#ccdde3", 1);
    _.each(scene.lps, function (u) {
      u.show();
    });
  } else if (index === 3) {
    scene.prestige.visible = true;
    if (stats.level > 4) {
      scene.prestige.button.setFrame(1);
    }
    scene.prestigeText.visible = true;
    scene.prestigeUnlock.visible = true;
    scene.tokens.setStroke("#ccdde3", 1);
    _.each(scene.pres, function (u) {
      u.show();
    });
  } else if (index === 4) {
    scene.challenge.visible = true;
    if (stats.level > 49) {
      scene.challenge.button.setFrame(1);
    }
    scene.challengeStats.visible = true;
    scene.challengeText.visible = true;
    scene.challengeDesc.visible = true;
    scene.challengeUnlock.visible = true;
    scene.cp.setStroke("#ccdde3", 1);
    _.each(scene.tiers, function (u) {
      u.show();
    });
    updateChallengeEarnedText();
  } else if (index === 5) {
    scene.achievementManager.showAll();
    scene.musicSlider.visible = true;
    scene.SFXSlider.visible = true;
    // if (!MOBILE) {
    //   scene.import.visible = true;
    //   scene.export.visible = true;
    // }
    scene.like.visible = true;
    scene.more.visible = true;
    scene.discord.visible = true;
    scene.patreon.visible = true;
    scene.credits.visible = true;
    scene.hardReset.visible = true;
    scene.version.visible = true;
    _.each(scene.numberFormats, function (u) {
      u.show();
    });
  }
  if (index < 4) {
    _.each(scene.mods, function (u) {
      u.visible = true;
    });
  }
}

function showMenuTutorial(index) {
  scene.money.setStroke();
  scene.lp.setStroke();
  _.each(scene.upgrades, function (u) {
    u.hide();
  });
  _.each(scene.lps, function (u) {
    u.hide();
  });

  if (index === 1) {
    scene.money.setStroke("#ccdde3", 1);
    _.each(scene.upgrades, function (u) {
      u.show();
    });
  } else if (index === 2) {
    scene.lp.setStroke("#ccdde3", 1);
    _.each(scene.lps, function (u) {
      u.show();
    });
  }
}

function getDateDiff(d1, d2) {
  d1 = new Date(d1);
  d2 = new Date(d2);
  try {
    let diff = Math.abs(d2 - d1);
    diff = Math.floor(diff / 1000);
    let days = 0;
    if (diff > 86400) {
      days = Math.floor(diff / 86400);
    }
    let time = diff % 86400;
    let stamp = new Date(time * 1000).toISOString().substr(11, 8);
    if (days > 0) {
      let brokenStamp = stamp.split(":");
      brokenStamp[0] = parseInt(brokenStamp[0]) + days * 24;
      if (brokenStamp[0] > 9999) {
        return "9999:59:59";
      }
      stamp = brokenStamp.join(":");
    }
    return stamp;
  } catch (error) {
    console.log(error);
    return "00:00:00";
  }
}

function prestige() {
  adjustTokens(cacluateTokenGain());
  stats.money = new Decimal(1000);
  stats.totalMoney = new Decimal(1000);
  stats.level = 1;
  stats.exp = 1;
  stats.clickLevel = 1;

  let runDuration = new Date() - new Date(stats.displayStats.run.start);
  if (stats.displayStats.total.fastestPrestige === "N/A") {
    stats.displayStats.total.fastestPrestige = runDuration;
  } else if (stats.displayStats.total.fastestPrestige > runDuration) {
    stats.displayStats.total.fastestPrestige = runDuration;
  }

  stats.displayStats.run.blocksClicked = 0;
  stats.displayStats.run.start = new Date();
  stats.displayStats.run.highestZone = 1;
  stats.displayStats.run.highestLevel = 1;
  stats.displayStats.run.highestChallenge = 0;
  stats.displayStats.total.totalPrestiges++;

  stats.expNext = Math.floor(100 + compound(100, stats.clickLevel, 0.05));
  stats.lp = scene.achievementManager.getAchievementModifier("clickLevel");

  _.each(save.skills, function (s) {
    scene.skills[s.id].setState(
      0,
      scene.skills[s.id].totalUseCount,
      0,
      0,
      scene.skills[s.id].locked,
      scene.skills[s.id].autoCast
    );
  });
  _.each(save.upgrades, function (s) {
    let autobuy = scene.tiers[10].bought ? s.auto : false;
    scene.upgrades[s.id].setState(0, autobuy);
  });
  _.each(save.lps, function (s) {
    scene.lps[s.id].setState(0);
  });

  scene.zoneNumber.setText(stats.level);
  scene.money.setText("Coins: " + displayNumber(stats.money));
  scene.tokens.setText("Tokens: " + displayNumber(stats.tokens));
  scene.lp.setText("Level Points: " + displayNumber(stats.lp));
  scene.expBar.setLevel(stats.clickLevel);
  scene.expBar.setProgress(stats.exp / stats.expNext);
  scene.blocks.clear(true, true);
  updateTokensEarned();

  scene.prompt.destroy();
  scene.prompt = false;
  _.each(scene.upgrades, function (s) {
    s.tick();
  });
}

function cacluateTokenGain() {
  return Decimal.ceil(
    Decimal.mul(
      Decimal.pow(stats.totalMoney, 0.1) / 6,
      1 + scene.pres[4].level * 0.05
    )
      .plus(
        1 +
          scene.achievementManager.getAchievementModifier("tokensEarned") *
            stats.level
      )
      .plus(scene.achievementManager.achievements[19].earned ? 5 : 0)
      .mul(scene.tiers[14].bought ? 2 : scene.tiers[12].bought ? 1.25 : 1)
  );
}

function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function exportSave() {
  download(Date.now() + "_stacked_save.txt", saveGame(true));
}

function importSave() {
  let importString = prompt("Please paste save string here.", "");
  if (
    importString !== null &&
    importString !== "" &&
    importString.search("p1u1bh6ra5r3yt8j") === 0
  ) {
    while (scene.blocks.children.entries[0]) {
      scene.blocks.children.entries[0].destroy();
    }
    loadGame(importString);
  }
}

function buildChallenge(index) {
  let options = [
    {
      // kinda just a mix of things?
      disabledSkills: [true, true, false, true, true, false, false, false],
      disabledUpgrades: [false, true, true, true, false, false, false, true],
      disabledPoints: [false, true, false, false, false, false, false, false],
      duration: 360,
    },
    {
      // no points stuff allowed at all!
      disabledSkills: [false, true, false, false, false, false, false, false],
      disabledUpgrades: [false, false, false, false, false, false, false, true],
      disabledPoints: [true, true, true, true, true, true, false, false],
      duration: 180,
    },
    {
      // no skills allowed, no profits
      disabledSkills: [true, true, true, true, true, true, true, true],
      disabledUpgrades: [true, false, false, true, false, false, false, true],
      disabledPoints: [true, false, false, false, false, false, false, false],
      duration: 180,
    },
    {
      // very quick, just go as fast as you can
      disabledSkills: [false, false, false, false, false, false, false, false],
      disabledUpgrades: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
      disabledPoints: [false, false, false, false, false, false, false, false],
      duration: 45,
    },
  ];
  challenges[index] = options[Phaser.Math.Between(0, 3)];
  challenges[index].difficulty = 50 + index * 8;
  challenges[index].duration = challenges[index].duration - index * 3;
  if (challenges[index].duration < 30) {
    challenges[index].duration = 30;
  }
}

function startChallenge() {
  stats.challengeActive = true;
  scene.zoneNumber.setText(stats.currentChallenge + 1, true);
  if (!challenges[stats.currentChallenge]) {
    buildChallenge(stats.currentChallenge);
  }
  scene.challengeCounterSeconds = challenges[stats.currentChallenge].duration;
  updateChallengeCounter();
  _.each(scene.upgrades, function (u) {
    u.reset();
    u.checkChallengeLock();
  });
  _.each(scene.lps, function (u) {
    u.checkChallengeLock();
  });
  _.each(scene.skills, function (u) {
    u.checkLock();
    u.checkChallengeLock();
    u.setUI();
  });
  while (scene.blocks.children.entries[0]) {
    scene.blocks.children.entries[0].destroy();
  }
  showMenu(1);
  _.each(scene.menu, function (m) {
    m.setFrame(0);
    m.selected = false;
  });
  scene.menu[0].setFrame(1);
  scene.menu[0].selected = true;

  scene.prompt.destroy();
  scene.prompt = false;
  scene.challengeCounter.show();
  scene.exitChallenge = new simpleButton(
    -100,
    45,
    "abandon",
    "Abandon\r\nChallenge"
  );
  scene.tweens.add({
    targets: scene.exitChallenge,
    x: 80,
    ease: "Linear",
    duration: 800,
  });
  scene.exitChallenge.setTitle("Abandon Challenge");
  scene.exitChallenge.setText("Quit while you're ahead (or behind likely?)");
  scene.exitChallenge.button.on(
    "pointerup",
    function () {
      soundController.play("click");
      let prompt = new promptYN(endChallenge, function () {
        soundController.play("click");
        scene.prompt = false;
        prompt.destroy();
      });
      prompt.setTitle("Are you sure?");
      prompt.setMessage(
        "You'll lose any progress you've made\r\ntoward the current challenge \r\nif you abandon."
      );
    },
    scene
  );
}

function endChallenge() {
  if (scene.prompt) {
    scene.prompt.destroy();
  }
  stats.challengeActive = false;
  scene.challengeCounterSeconds = -1;
  scene.challengeCounter.hide();
  scene.zoneNumber.setText(stats.level);
  _.each(scene.upgrades, function (u) {
    u.reset();
    u.checkChallengeLock();
    u.assessCost();
  });
  _.each(scene.lps, function (u) {
    u.checkChallengeLock();
    u.assessCost();
  });
  _.each(scene.skills, function (u) {
    u.checkLock();
    u.checkChallengeLock();
    u.setUI();
  });
  while (scene.blocks.children.entries[0]) {
    scene.blocks.children.entries[0].destroy();
  }
  scene.exitChallenge.destroy();
  scene.exitChallenge = null;
}

function str_pad_left(string, pad, length) {
  return (new Array(length + 1).join(pad) + string).slice(-length);
}

function updateChallengeCounter() {
  let minutes = Math.floor(scene.challengeCounterSeconds / 60);
  let seconds = scene.challengeCounterSeconds - minutes * 60;
  let time =
    str_pad_left(minutes, "0", 2) + ":" + str_pad_left(seconds, "0", 2);
  scene.challengeCounter.setString(time, scene.challengeCounterSeconds < 30);
}
