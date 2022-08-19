class mobile extends Phaser.GameObjects.Container {
  constructor() {
    super(scene, -100, 350);
    this.setSize(196, 48);
    this.setInteractive();
    this.setScrollFactor(0);
    this.showing = false;
    let r1 = scene.add.sprite(0, 0, "mobile").setFrame(1);
    this.topText = scene.add
      .text(-15, -8, "Want Stacked", {
        color: "#ccdde3",
        fontSize: "14px",
      })
      .setOrigin(0.5);

    this.bottomText = scene.add
      .text(-15, 8, "On Mobile?", {
        color: "#ccdde3",
        fontSize: "14px",
      })
      .setOrigin(0.5);
    this.add(r1);
    this.add(this.topText);
    this.add(this.bottomText);
    let that = this;

    this.on("pointerup", function (pointer) {
      let prompt = new promptYN(
        function () {
          let url =
            "https://play.google.com/store/apps/details?id=io.nightscapes.androidapp";
          var s = window.open(url, "_blank");
          if (s && s.focus) {
            s.focus();
          } else if (!s) {
            window.location.href = url;
          }
          stats.promptMobile = false;
          scene.prompt = false;
          that.destroy();
          prompt.destroy();
        },
        function () {
          soundController.play("click");
          scene.prompt = false;
          prompt.destroy();
          stats.promptMobile = false;
          that.destroy();
        }
      );
      prompt.setTitle("Want Stacked on Mobile?");
      prompt.setMessage(
        "Enjoy Stacked? Want to take\r\nit everywhere you go? \r\nHave an android phone?\r\nCheck us out in the Play Store!"
      );
      prompt.yes.text.setText("Sure!");
      prompt.no.text.setText("Pass!");
    });
    scene.add.existing(this);
    this.setDepth(10);
  }

  prompt() {
    this.showing = true;
    let that = this;
    scene.tweens.add({
      targets: that,
      x: 80,
      ease: "Linear",
      duration: 800,
    });
  }
}
