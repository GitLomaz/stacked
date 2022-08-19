class tooltip extends Phaser.GameObjects.Container {
  constructor(x = 538, y = 544) {
    super(scene, x, y);
    this.setSize(340, 65);
    this.title = scene.add.text(4, -14, "", {
      color: "#E0E0E0",
      fontSize: "14px",
    });
    this.text = scene.add.text(8, 0, "", {
      color: "#E0E0E0",
      fontSize: "12px",
    });
    this.italics = scene.add
      .text(8, 28, "", {
        color: "#E0E0E0",
        fontSize: "12px",
      })
      .setFontStyle("italic");
    this.topRightText = scene.add
      .text(335, -14, "", {
        color: "#E0E0E0",
        fontSize: "10px",
      })
      .setOrigin(1, 0);
    this.add(this.title);
    this.add(this.text);
    this.add(this.topRightText);
    this.add(this.italics);
    scene.add.existing(this);
  }

  setValues(obj) {
    if (obj.title) {
      this.text.y = 0;
      this.title.setText(obj.title);
    } else {
      this.text.y = -20;
      this.title.setText("");
    }
    this.text.setText(obj.text ? obj.text : "");
    this.italics.setText(obj.italics ? obj.italics : "");
    this.topRightText.setText(obj.topRightText ? obj.topRightText : "");
  }

  clearValues() {
    this.title.setText("");
    this.text.setText("");
    this.topRightText.setText("");
    this.italics.setText("");
  }
}
