function tutorialDrawSkills() {
  scene.skills = [];
  for (let i = 1; i < 11; i++) {
    scene.skills.push(
      new tutorialSkillButton(-32 + i * 48, i % 2 == 1 ? 518 : 550, i)
    );
  }
}

function tutorialDrawUpgrades() {
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
  scene.upgrades = [];
  scene.lps = [];
  for (let i = 1; i < 4; i++) {
    scene.upgrades.push(new tutorialUpgradeButton(912, 134 + i * 48, i));
    scene.lps.push(new tutorialLpButton(912, 134 + i * 48, i));
  }
  _.each(scene.upgrades, function (u) {
    u.setCost();
  });
  _.each(scene.lps, function (u) {
    u.setCost();
  });

  scene.menu = [];
  for (let i = 1; i < 3; i++) {
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
        showMenuTutorial(i);
        // TO DO: Change Menu
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
  showMenuTutorial(1);
}
