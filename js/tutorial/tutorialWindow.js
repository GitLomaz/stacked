class tutorialWindow extends Phaser.GameObjects.Container {
  constructor(
    x = Math.floor(GAME_WIDTH / 2 - 90 + 310),
    y = Math.floor(GAME_HEIGHT / 2)
  ) {
    super(scene, x, y);
    scene.prompt = this;
    this.setSize(240, 270);

    this.add(scene.add.rectangle(0, 0, this.width, this.height, 0x699fb0));
    let border = scene.add.rectangle(0, 0, this.width - 4, this.height - 4);
    border.setStrokeStyle(2, 0xccdde3);
    this.add(border);
    this.add(
      scene.add.rectangle(0, 0, this.width - 8, this.height - 8, 0x000, 0.9)
    );

    this.title = scene.add.text(0, -110, "TITLE", {
      fontSize: "16px",
      color: "#ccdde3",
    });
    this.title.setOrigin(0.5);
    this.add(this.title);

    this.text = scene.add.text(-110, -95, "CONTENT", {
      fontSize: "12px",
      color: "#ccdde3",
    });
    this.add(this.text);
    scene.add.existing(this);
    this.setDepth(10);
    this.setDialog();
  }

  setDialog(stage = 0) {
    let str = "";
    switch (stage) {
      case 0:
        this.title.setText("Tutorial");
        str +=
          " Welcome to Stacked, A Clicker\r\nwith physics! Lets start off\r\nwith experience, exp is gained\r\nby clicking on blocks..\r\nif a block is still falling it\r\ngives more exp then one \r\nat rest.\r\n\r\n";
        str +=
          " Click enough blocks to fill\r\nthe exp bar to the right.\r\n\r\n";
        str +=
          " Keep an eye on the burners,\r\nthey will periodiclly burn up\r\nany un-clicked cubes yeilding\r\nno experience.\r\n\r\n";
        this.text.setText(str);
        break;
      case 1:
        if (!MOBILE) {
          scene.bg.play("onOuter");
        }

        scene.tutorialBar.x = 150;
        scene.tutorialBar.y = 560;
        scene.fg.setTexture("fg");
        tutorialDrawUpgrades();
        scene.expBar = new expBar();
        scene.expBar.setProgress(0);
        stats.expNext = 25;
        scene.money.setStroke("#ccdde3", 1);
        this.title.setText("Upgrades");
        str +=
          " Clicking boxes also gives\r\nmoney! Money can be used to \r\nbuy upgrades that do various \r\nthings like increasing the \r\nsize and value of blocks.\r\nBurnt blocks only yeild 50%\r\ncoins a clicked one would.\r\nNOTE: These reset every zone!\r\n\r\n";
        str +=
          " As you gain exp and level up\r\nyou will gain LP (Level Points)\r\nthat can be spent similarly\r\nto money on various things.\r\nNOTE: These last all \r\nprestige!\r\n\r\n";
        this.text.setText(str);
        break;
      case 2:
        if (!MOBILE) {
          scene.bg.play("flicker2");
        }
        tutorialDrawSkills();
        scene.goal.visible = true;
        scene.tutorialBar.tickMax = 100000000000;
        scene.tutorialBar.x = 150;
        scene.tutorialBar.y = -560;
        this.title.setText("Skills");
        str +=
          " Skills are another tool\r\nyou have to speed things up!\r\nClick on one to activate it.\r\nMore skills will be unlocked\r\nas you progress through\r\nthe zones.\r\n\r\n";
        str +=
          " To clear a zone the goal\r\nis to build a stack of blocks\r\nhigh enough to reach the \r\ngreen goal line at the top.\r\nOnce it's reached, the\r\nthe zone is cleared!!\r\n\r\n";
        this.text.setText(str);
      default:
        break;
    }
  }
}
