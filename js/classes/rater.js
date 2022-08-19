class rater extends Phaser.GameObjects.Container {
  constructor(expire = false) {
    super(scene, -100, 350);
    this.setSize(196, 48);
    this.setInteractive();
    this.setScrollFactor(0);
    this.bonusActive = false;
    this.showing = false;
    this.end = stats.promptRating ? stats.promptRating : 0;
    let r1 = scene.add.sprite(0, 0, "rating").setFrame(1);
    this.topText = scene.add
      .text(-15, -8, "Rate Us", {
        color: "#ccdde3",
        fontSize: "14px",
      })
      .setOrigin(0.5);

    this.bottomText = scene.add
      .text(-15, 8, "For A Bonus", {
        color: "#ccdde3",
        fontSize: "14px",
      })
      .setOrigin(0.5);
    this.add(r1);
    this.add(this.topText);
    this.add(this.bottomText);
    let that = this;

    this.on("pointerup", function (pointer) {
      if (this.end !== 0) {
        return;
      }
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
          that.activateBonus();
          scene.prompt = false;
          prompt.destroy();
        },
        function () {
          soundController.play("click");
          scene.prompt = false;
          prompt.destroy();
          stats.promptRating = -1;
          that.destroy();
        }
      );
      prompt.setTitle("How About A Rating?");
      prompt.setMessage(
        "Are you enjoying Stacked so far?\r\nWould you like to show your support?\r\nGive us a rating and a review\r\nfor 24 hours of double money"
      );
      prompt.yes.text.setText("Rate!");
      prompt.no.text.setText("Pass!");
    });
    scene.add.existing(this);
    this.setDepth(10);
  }

  tick() {
    console.log(this.bonusActive ? "active!" : "inactive!");
    if (scene.rater.end !== 0 && scene.rater.end * 1000 < new Date()) {
      this.bonusActive = false;
      if (this.showing) {
        this.x = -100;
      }
      return;
    }
    if (this.end !== 0) {
      this.topText.setText(getDateDiff(stats.promptRating * 1000, new Date()));
    }
    if (this.end > 0 && !this.showing) {
      this.prompt();
    }
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
    if (this.end !== 0) {
      this.topText.setText(getDateDiff(stats.promptRating * 1000, new Date()));
      this.bottomText.setText("Double Money");
      this.bonusActive = true;
    }
  }

  activateBonus() {
    this.x = 80;
    this.bonusActive = true;
    this.end = Math.floor(new Date().getTime() / 1000) + 86400;
    stats.promptRating = this.end;
    this.bottomText.setText("Double Money");
  }
}
