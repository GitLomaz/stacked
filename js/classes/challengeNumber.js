class challengeNumber extends Phaser.GameObjects.Container {
  constructor(key) {
    super(scene, 460, 20);
    this.background = scene.add.image(0, 0, "timerBar");
    this.add(this.background);
    this.numbers = [];
    scene.add.existing(this);
    for (let i = 0; i < 5; i++) {
      let sprite = scene.add.sprite(-40 + i * 20, 0, "timerNumbers");
      sprite.setFrame(Phaser.Math.Between(0, 10));
      this.add(sprite);
      this.numbers.push(sprite);
    }
    this.hide();
  }

  hide() {
    this.visible = false;
  }

  show() {
    this.visible = true;
  }

  setString(key, red = false) {
    for (let i = 0; i < key.length; i++) {
      let index = key.charAt(i);
      if (index === ":") {
        index = 10;
      } else {
        index = parseInt(index);
      }
      if (red) {
        index = index + 11;
      }
      this.numbers[i].setFrame(index);
    }
  }
}
