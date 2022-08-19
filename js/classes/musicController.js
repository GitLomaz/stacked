class musicController {
  constructor() {
    this.soundFiles = ["music"];
    this.sounds = [];
  }

  loadSounds() {
    _.each(this.soundFiles, function (s) {
      scene.load.audio(s, ["sounds/music/" + s + ".mp3"]);
    });
  }

  addSounds() {
    let that = this;
    _.each(this.soundFiles, function (s) {
      that.sounds[s] = scene.sound.add(s);
    });
  }

  play(sound = "music") {
    if (scene.musicSlider && !this.sounds[sound].isPlaying)
      this.sounds[sound].play({ volume: scene.musicSlider.value, loop: true });
  }

  setVolume(vol) {
    try {
      this.sounds["music"].setVolume(vol);
    } catch (error) {}
  }

  stop() {
    this.sounds["music"].stop();
  }
}
