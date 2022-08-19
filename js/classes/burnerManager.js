class burnerManager {
  constructor() {
    this.burners = [];
    this.patternCounter = 0;
    this.idleCooldown = 0;
    this.currentPattern = null;
    this.flicker = false;
    for (let i = 0; i < 54; i++) {
      this.burners.push(new Burner(36 + i * 16, 505 - 8));
    }
    this.skillBreak = false;
  }

  break() {
    if (!this.skillBreak)
      _.each(this.burners, function (burner) {
        if (!burner.broken && Phaser.Math.Between(0, 100) > 45) {
          burner.break();
        }
      });
    this.skillBreak = true;
  }

  tick() {
    if (!scene.tutorialMode) {
      if (scene.skills[5].active) {
        this.break();
      } else {
        this.skillBreak = false;
      }
      if (this.currentPattern) {
        this.flicker = false;
        this.patternCounter++;
      } else {
        this.idleCooldown = this.idleCooldown + 20;
        let goal =
          24000 *
          (1 + Math.floor(compound(1, scene.lps[3].getLevel(), 0.1))) *
          (scene.achievementManager.achievements[18].earned ? 1.25 : 1);
        if (this.idleCooldown > goal - 10000 && !this.flicker && !MOBILE) {
          this.flicker = true;
          let anim = "flicker" + Phaser.Math.Between(1, 3);
          scene.bg.play(anim);
        }
        if (this.idleCooldown > goal) {
          this.idleCooldown = 0;
          this.currentPattern = Phaser.Math.Between(1, 5);
        }
      }
    }

    switch (this.currentPattern) {
      case 1: // Accross left to right
        try {
          this.burners[Math.floor(this.patternCounter / 20)].enable(4);
        } catch (error) {
          this.currentPattern = null;
          this.patternCounter = 0;
        }
        break;
      case 2: // All at once
        _.each(this.burners, function (burner) {
          burner.enable(2);
        });
        this.currentPattern = null;
        this.patternCounter = 0;
        break;
      case 3: // Accross right to left
        try {
          this.burners[
            this.burners.length - 1 - Math.floor(this.patternCounter / 20)
          ].enable(4);
        } catch (error) {
          this.currentPattern = null;
          this.patternCounter = 0;
        }
        break;
      case 4: // All at once
        for (let i = 0; i < 54 / 2; i++) {
          this.burners[i].enable(5);
        }
        this.currentPattern = null;
        this.patternCounter = 0;
        break;
      case 5: // All at once
        for (let i = 54 / 2; i < 54; i++) {
          this.burners[i].enable(5);
        }
        this.currentPattern = null;
        this.patternCounter = 0;
        break;
      default:
        break;
    }
  }
}
