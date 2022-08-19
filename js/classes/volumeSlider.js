class volumeSlider extends Phaser.GameObjects.Container {
  constructor(x, y, sfx = true) {
    super(scene, x, y);
    this.icon = scene.add
      .sprite(-105, 0, sfx ? "volumeSFX" : "volumeMusic")
      .setInteractive();
    this.frame = scene.add.image(0, 0, "volumeFrame");
    this.bar = scene.add.image(-80, -2, "volumeBar").setOrigin(0);
    this.grabber = scene.add.image(0, 0, "volumeGrabber").setInteractive();
    scene.input.setDraggable(this.grabber);
    this.add(this.icon);
    this.add(this.frame);
    this.add(this.bar);
    this.add(this.grabber);

    this.text = sfx
      ? {
          title: "SFX Volume Control",
          text: "Adjust the volume of the ingame\r\nsound effects",
        }
      : {
          title: "Music Volume Control",
          text: "Adjust the volume of the ingame\r\nmusic",
        };

    this.sfx = sfx;
    let that = this;
    this.grabber
      .on("drag", function (pointer, dragX, dragY) {
        let posX = dragX;
        if (posX > 40) {
          posX = 40;
        } else if (posX < -80) {
          posX = -80;
        }
        that.setValue((posX + 80) / 120);
      })
      .on("dragend", function () {
        soundController.play("click");
      })
      .on("pointerover", function () {
        scene.tips.setValues(that.text);
      })
      .on("pointerout", function () {
        scene.tips.clearValues();
      });

    this.icon
      .on("pointerover", function () {
        scene.tips.setValues(that.text);
        if (that.value > 0) {
          this.setFrame(3);
        } else {
          this.setFrame(1);
        }
      })
      .on("pointerout", function () {
        scene.tips.clearValues();
        if (that.value > 0) {
          this.setFrame(2);
        } else {
          this.setFrame(0);
        }
      })
      .on("pointerdown", function () {
        if (that.value > 0) {
          that.setValue(0);
          this.setFrame(1);
        } else {
          that.setValue(that.unmutedValue);
          this.setFrame(3);
          soundController.play("click");
        }
      });

    scene.add.existing(this);
    this.value = 0.4;
    this.unmutedValue = 0.4;
    this.setValue();
  }

  getValue() {
    return 0.5;
  }

  setValue(val = this.value) {
    // bar is 120px wide
    this.value = val;
    this.bar.scaleX = this.value;
    this.grabber.x = -80 + 120 * this.value;
    if (this.value === 0) {
      this.icon.setFrame(0);
    } else {
      this.unmutedValue = this.value;
      this.icon.setFrame(2);
    }
    if (!this.sfx && scene.musicController) {
      scene.musicController.setVolume(this.value);
    }
  }
}
