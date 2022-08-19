class promptOK extends Phaser.GameObjects.Container {
  constructor(
    x = Math.floor(GAME_WIDTH / 2 - 90),
    y = Math.floor(GAME_HEIGHT / 2 - 90)
  ) {
    super(scene, x, y);
    scene.prompt = this;
    this.setSize(300, 204);

    this.add(scene.add.rectangle(0, 0, this.width, this.height, 0x699fb0));
    let border = scene.add.rectangle(0, 0, this.width - 4, this.height - 4);
    border.setStrokeStyle(2, 0xccdde3);
    this.add(border);
    this.add(
      scene.add.rectangle(0, 0, this.width - 8, this.height - 8, 0x000, 0.9)
    );

    this.button = new simpleButton(0, 70, "blank", "Okay");
    this.button.button.on("pointerdown", this.click, this);

    this.title = scene.add.text(0, -70, "TITLE", {
      fontSize: "18px",
      color: "#ccdde3",
      align: "center",
    });
    this.title.setOrigin(0.5);
    this.add(this.title);

    this.text = scene.add.text(0, 0, "CONTENT", {
      fontSize: "14px",
      color: "#ccdde3",
      align: "center",
    });
    this.text.setOrigin(0.5);
    this.add(this.text);
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
    soundController.play("click");
    scene.prompt = false;
    this.destroy();
  }

  setMessage(text) {
    this.text.setText(text);
  }

  setTitle(text) {
    this.title.setText(text);
  }

  setButton(text) {
    this.button.setText(text);
  }
}
