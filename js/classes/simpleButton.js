class simpleButton extends Phaser.GameObjects.Container {
  constructor(x, y, key, text) {
    super(scene, x, y);
    this.button = scene.add.sprite(0, 0, key);
    this.button.setOrigin(0.5);
    this.button.setInteractive();
    // this.button.on("pointerdown", this.buyClick, this);
    this.locked = false;
    this.title = " ";
    this.words = " ";

    // Tooltip logic
    let that = this;
    this.button
      .on("pointerover", function () {
        if (!that.locked) {
          that.button.setFrame(2);
        }
        scene.tips.setValues({
          title: that.title,
          text: that.words,
        });
      })
      .on("pointerout", function () {
        if (!that.locked) {
          that.button.setFrame(1);
        }
        if (that.button.selected) {
          that.button.setFrame(3);
        }
        scene.tips.clearValues();
      })
      .setFrame(1);

    this.text = scene.add
      .text(0, 0, text, {
        fontSize: "12px",
        color: "#ccdde3",
        align: "center",
      })
      .setOrigin(0.5);
    this.add(this.button);
    this.add(this.text);
    scene.add.existing(this);
  }

  hide() {
    this.visible = false;
    this.button.visible = false;
  }

  show() {
    this.visible = true;
    this.button.visible = true;
  }

  setTitle(title = "") {
    this.title = title;
  }

  setText(text = "") {
    this.words = text;
  }

  setLock(state) {
    if (state) {
      this.locked = true;
      this.button.setFrame(0);
    } else {
      this.locked = false;
      this.button.setFrame(1);
    }
  }
}
