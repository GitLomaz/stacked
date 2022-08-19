class zoneNumber extends Phaser.GameObjects.Container {
  constructor(key) {
    super(scene, 460, 259);
    this.setText(key);
    scene.add.existing(this);
  }

  hide() {
    this.visible = false;
  }

  show() {
    this.visible = true;
  }

  setText(key, challenge = false) {
    key = key + "";
    if (challenge) {
      key = "b-" + key;
    }
    this.removeAll(true);
    this.x = 460 - (key.length - 1) * 24;
    for (let i = 0; i < key.length; i++) {
      let index = key.charAt(i);
      if (index === "-") {
        index = 11;
      } else if (index === "b") {
        index = 10;
      } else {
        index = parseInt(index);
      }
      let diget = scene.add.sprite(i * 48, 0, "numbers");
      if (index < 10) {
        diget.setFrame(index + 12 * Phaser.Math.Between(0, 3));
      } else {
        diget.setFrame(index);
      }
      this.add(diget);
    }
  }
}
