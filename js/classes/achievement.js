class achievement extends Phaser.GameObjects.Container {
  constructor(x, y, index) {
    super(scene, x, y);
    this.button = scene.add.sprite(x, y, "achievement");
    this.button.setOrigin(0);
    this.button.setInteractive();
    this.index = index;
    this.level = 0;
    this.hidden = false;
    this.earned = false;
    this.initalize();

    // Tooltip logic
    let that = this;
    this.button
      .on("pointerover", function () {
        let desc = that.description;
        if (that.earned) {
          that.button.setFrame(2);
        }
        if (that.hidden && !that.earned) {
          desc = "???";
        }
        scene.tips.setValues({
          title: that.title,
          text: desc,
          topRightText: that.earned,
          italics: that.reward,
        });
      })
      .on("pointerout", function () {
        scene.tips.clearValues();
        if (that.earned) {
          that.button.setFrame(1);
        }
      });
  }

  initalize() {
    if (this.index === 1) {
      this.analCode = "click";
      this.title = "Click";
      this.description = "Click a Block";
      this.reward = "Falling blocks now give 5x exp";
    } else if (this.index === 2) {
      this.analCode = "clicker";
      this.title = "Clicker";
      this.description = "Click 100 Blocks";
      this.reward = "Falling blocks now give 6x exp";
    } else if (this.index === 3) {
      this.analCode = "clickerer";
      this.title = "Clickerer";
      this.description = "Click 1,000 blocks";
      this.reward = "Falling blocks now give 8x exp";
    } else if (this.index === 4) {
      this.analCode = "clickist";
      this.title = "Clickist";
      this.description = "Click 10,000 blocks";
      this.reward = "Falling blocks now give 10x exp";
    } else if (this.index === 5) {
      this.analCode = "clickerist";
      this.title = "Clickerist";
      this.description = "Click 100,000 blocks";
      this.reward = "Falling blocks now give 12x exp";
    } else if (this.index === 6) {
      this.analCode = "novice";
      this.title = "Novice";
      this.description = "Reach Click Level 5";
      this.reward = "Start ascensions with 1 extra LP";
    } else if (this.index === 7) {
      this.analCode = "adept";
      this.title = "Adept";
      this.description = "Reach Click Level 25";
      this.reward = "Start ascensions with 4 extra LP";
    } else if (this.index === 8) {
      this.analCode = "expert";
      this.title = "Expert";
      this.description = "Reach Click Level 100";
      this.reward = "Start ascensions with 10 extra LP";
    } else if (this.index === 9) {
      this.analCode = "tokencollector";
      this.title = "Token Collector";
      this.description = "Earn 25 tokens in a single run";
      this.reward = "Earn +1 token per zone cleared";
    } else if (this.index === 10) {
      this.analCode = "tokenhoarder";
      this.title = "Token Hoarder";
      this.description = "Earn 500 tokens in a single run";
      this.reward = "Earn +2 token per zone cleared";
    } else if (this.index === 11) {
      this.analCode = "comingdownfast";
      this.title = "Coming Down Fast";
      this.description = "Use Faster Spawns 10 Times in one Ascension";
      this.reward = "Increase all skill durations by 5 seconds";
    } else if (this.index === 12) {
      this.analCode = "rainingblocks";
      this.title = "it's Raining Blocks";
      this.description = "Use Faster Spawns 100 Times in one Ascension";
      this.reward = "Increase all skill durations by 15 seconds";
    } else if (this.index === 13) {
      this.analCode = "forgotaboutthat";
      this.title = "I Forgot About That Button";
      this.description = "Clear a zone without moving the walls";
      this.reward = "Narrows the walls 1 step";
      this.titleDisplay = "I Forgot About\r\nThat Button";
    } else if (this.index === 14) {
      this.analCode = "bitofeverything";
      this.title = "A bit Of Everything";
      this.description = "Have exactly 5 points in every upgrade";
      this.reward = "Upgrades are 5% cheaper";
      this.titleDisplay = "A bit of\r\nEverything";
    } else if (this.index === 15) {
      this.analCode = "lotofeverything";
      this.title = "A LOT Of everything";
      this.description = "Max every upgrade";
      this.reward = "Upgrades are 25% cheaper";
      this.titleDisplay = "A LOT of\r\nEverything";
    } else if (this.index === 16) {
      this.analCode = "dummythick";
      this.title = "Dummy Thick";
      this.description =
        "Upgrade Block Width to 25 without \r\nupgrading Block Height";
      this.reward = "Block Height is 20% cheaper";
    } else if (this.index === 17) {
      this.analCode = "squeezed";
      this.title = "Squeezed";
      this.description = "Have a Narrow walls upgrade of 10";
      this.reward = "Bring down the roof by 1 step";
    } else if (this.index === 18) {
      this.analCode = "moarpoints";
      this.title = "Moar Points!";
      this.description = "Upgrade More Level points to 10";
      this.reward = "Earn 50% more exp from blocks";
    } else if (this.index === 19) {
      this.analCode = "freezerburns";
      this.title = "Freezer Burns";
      this.description = "Achieve a 50% chance of burners \r\nfailing to light";
      this.reward = "25% increased burner cooldown";
    } else if (this.index === 20) {
      this.analCode = "mistakes";
      this.title = "Mistakes were Made!";
      this.description = "Spend all of your tokens after ascending";
      this.reward = "Earn +5 tokens each ascension";
      this.titleDisplay = "Mistakes\r\nWere Made!";
    } else if (this.index === 21) {
      this.analCode = "skillcrazy";
      this.title = "Skill Crazy";
      this.description = "Use 10,000 skills in one prestige";
      this.reward = "";
      this.hidden = true;
    } else if (this.index === 22) {
      this.analCode = "nothingbuttime";
      this.title = "Nothing But Time";
      this.description = "Clear a level without increasing block sizes";
      this.reward = "";
      this.hidden = true;
    } else if (this.index === 23) {
      this.analCode = "irememberthis";
      this.title = "Hey! I Remember This";
      this.description = "Be offline for more than 15 days";
      this.reward = "";
      this.hidden = true;
      this.titleDisplay = "Hey!\r\nI Remember This";
    } else if (this.index === 24) {
      this.analCode = "credits";
      this.title = "Credit Where Credit Due";
      this.titleDisplay = "Credit Where\r\nCredit Due";
      this.description = "Open game credits";
      this.reward = "";
      this.hidden = true;
    } else if (this.index === 25) {
      this.analCode = "wheretonow";
      this.title = "Where To Now?";
      this.description = "Unlock All Challenge Upgrades";
      this.reward = "";
      this.hidden = true;
    }
  }

  attemptAward() {
    if (!this.earned) {
      this.button.setFrame(1);
      this.earned = "Earned: " + new Date().toISOString().substring(0, 10);
      if (MONITIZATION === "crazygames" && crazysdk) {
        crazysdk.happytime();
      }
      if (GAObject) {
        GAObject.submitEvent("achievement:" + this.analCode, 1);
      }
      return this.titleDisplay ? this.titleDisplay : this.title;
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

  setUI() {
    if (this.earned) {
      this.button.setFrame(1);
    }
  }
}
