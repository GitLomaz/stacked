class expBar extends Phaser.GameObjects.Container {
  constructor(x = 1008, y = 36, split = true) {
    super(scene, x, y);
    this.split = split;
    this.plate = scene.add.image(0, 0, "expPlate");
    this.progress = scene.add.image(-79, -5, "expBarFill").setOrigin(0, 0.5);
    this.back = scene.add.image(0, 0, "expBar" + (split ? "Split" : ""));

    // only used for static stuff
    this.tick = 0;
    this.tickMax = 50;

    this.add(this.plate);
    this.add(this.progress);
    this.add(this.back);

    if (split) {
      this.level = scene.add.text(40, -11, "001", { color: "#ccdde3" });
      this.add(this.level);
    }

    this.glow = scene.add.image(0, 0, "expBarGlow" + (split ? "Split" : ""));
    this.add(this.glow);
    this.plate.setInteractive();
    this.plate
      .on("pointerover", function (pointer) {
        scene.tips.setValues({
          title: "Experience & Levels",
          text: "Earn experience by clicking on blocks\r\nevery level you gain Level Points\r\nthat can be spent on LP upgrades.",
          topRightText: "",
          italics: "",
        });
      })
      .on("pointerout", function (pointer) {
        scene.tips.clearValues();
      });
    scene.add.existing(this);
  }

  setLevel(level) {
    if (this.split) {
      this.level.setText((level + "").padStart(3, "0"));
    }
  }

  setProgress(progress) {
    if (progress < 0.01) {
      progress = 0.01;
    }
    this.progress.scaleX = progress * (this.split ? 1 : 1.6);
    this.glow.alpha = progress;
  }
}
