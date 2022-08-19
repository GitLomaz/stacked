class promptStats extends Phaser.GameObjects.Container {
  constructor(
    x = Math.floor(GAME_WIDTH / 2 - 90),
    y = Math.floor(GAME_HEIGHT / 2 - 90)
  ) {
    super(scene, x, y);
    scene.prompt = this;
    this.setSize(500, 300);

    this.add(scene.add.rectangle(0, 0, this.width, this.height, 0x699fb0));
    let border = scene.add.rectangle(0, 0, this.width - 4, this.height - 4);
    border.setStrokeStyle(2, 0xccdde3);
    this.add(border);
    this.add(
      scene.add.rectangle(0, 0, this.width - 8, this.height - 8, 0x000, 0.9)
    );

    this.button = new simpleButton(0, 120, "blank", "Close");
    this.button.button.on("pointerdown", this.click, this);

    this.title = scene.add.text(0, -120, "Game Stats", {
      fontSize: "18px",
      color: "#ccdde3",
      align: "center",
    });
    this.title.setOrigin(0.5);
    this.add(this.title);

    this.subOne = scene.add.text(-160, -90, "Metric", {
      fontSize: "16px",
      color: "#ccdde3",
    });
    this.subOne.setOrigin(0.5);
    this.add(this.subOne);

    this.subTwo = scene.add.text(0, -90, "Current Prestige", {
      fontSize: "16px",
      color: "#ccdde3",
    });
    this.subTwo.setOrigin(0.5);
    this.add(this.subTwo);

    this.subThree = scene.add.text(150, -90, "All Time", {
      fontSize: "16px",
      color: "#ccdde3",
    });
    this.subThree.setOrigin(0.5);
    this.add(this.subThree);

    this.columnOne = scene.add.text(
      -170,
      -70,
      "Time Played\r\nBlocks Clicked\r\nHighest Zone\r\nHighest Click Level\r\nHighest Challenge\r\nSkills Used\r\nFavorite Skill\r\nFastest Prestige\r\nTotal Prestiges\r\nTokens Earned",
      {
        fontSize: "12px",
        color: "#ccdde3",
        align: "right",
        lineSpacing: 4,
      }
    );
    this.columnOne.setOrigin(0.5, 0);
    this.add(this.columnOne);

    this.columnTwo = scene.add.text(0, -70, this.buildCurrent(), {
      fontSize: "12px",
      color: "#ccdde3",
      align: "center",
      lineSpacing: 4,
    });
    this.columnTwo.setOrigin(0.5, 0);
    this.add(this.columnTwo);

    this.columnThree = scene.add.text(150, -70, this.buildAllTime(), {
      fontSize: "12px",
      color: "#ccdde3",
      align: "center",
      lineSpacing: 4,
    });
    this.columnThree.setOrigin(0.5, 0);
    this.add(this.columnThree);

    let that = this;
    this.updateTimer = setInterval(function () {
      that.columnTwo.setText(that.buildCurrent());
      that.columnThree.setText(that.buildAllTime());
    }, 200);

    this.add(this.button);
    scene.add.existing(this);
    this.setDepth(10);
  }

  hide() {
    this.visible = false;
    this.button.visible = false;
  }

  show() {
    this.visible = true;
    this.button.visible = true;
  }

  click() {
    clearInterval(this.updateTimer);
    soundController.play("click");
    scene.prompt = false;
    this.destroy();
  }

  buildCurrent() {
    let arr = [];
    arr.push(getDateDiff(stats.displayStats.run.start, new Date()));
    arr.push(displayNumber(stats.displayStats.run.blocksClicked));
    arr.push(displayNumber(stats.level));
    arr.push(displayNumber(stats.clickLevel));
    arr.push(displayNumber(stats.currentChallenge));
    let totalSkills = 0;
    let bestSkill = { name: "N/A", count: 0 };
    _.each(scene.skills, function (s) {
      totalSkills = totalSkills + s.useCount;
      if (s.useCount > bestSkill.count) {
        bestSkill = { name: s.getText().title, count: s.useCount };
      }
    });
    arr.push(displayNumber(totalSkills));
    arr.push(bestSkill.name);
    return arr.join("\r\n");
  }

  buildAllTime() {
    let arr = [];
    arr.push(getDateDiff(stats.displayStats.total.start, new Date()));
    arr.push(displayNumber(stats.displayStats.total.blocksClicked));
    arr.push(displayNumber(stats.displayStats.total.highestZone));
    arr.push(displayNumber(stats.displayStats.total.highestLevel));
    arr.push(displayNumber(stats.displayStats.total.highestChallenge));
    let totalSkills = 0;
    let bestSkill = { name: "N/A", count: 0 };
    _.each(scene.skills, function (s) {
      totalSkills = totalSkills + s.totalUseCount;
      if (s.totalUseCount > bestSkill.count) {
        bestSkill = { name: s.getText().title, count: s.totalUseCount };
      }
    });
    arr.push(displayNumber(totalSkills));
    arr.push(bestSkill.name);
    if (stats.displayStats.total.fastestPrestige !== "N/A") {
      arr.push(getDateDiff(0, stats.displayStats.total.fastestPrestige));
    } else {
      arr.push("N/A");
    }
    arr.push(displayNumber(stats.displayStats.total.totalPrestiges));
    arr.push(displayNumber(stats.displayStats.total.tokensEarned));
    return arr.join("\r\n");
  }
}
