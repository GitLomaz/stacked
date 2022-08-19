class soundControllerObj {
  constructor() {
    this.soundFiles = ["click", "zoneClear", "achievement"];
    this.sounds = [];
  }

  loadSounds() {
    _.each(this.soundFiles, function (s) {
      scene.load.audio(s, ["sounds/effects/" + s + ".mp3"]);
    });
  }

  addSounds() {
    let that = this;
    _.each(this.soundFiles, function (s) {
      that.sounds[s] = scene.sound.add(s);
    });
  }

  play(sound) {
    if (scene.SFXSlider && scene.SFXSlider.value > 0)
      this.sounds[sound].play({ volume: scene.SFXSlider.value });
  }
}
