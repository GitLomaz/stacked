let config = {
  type: Phaser.AUTO,
  // type: Phaser.CANVAS,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  // scale: {
  //     // mode: Phaser.Scale.FIT,
  //     parent: 'wrapper',
  //     // autoCenter: Phaser.Scale.CENTER_BOTH,
  //     width: GAME_WIDTH,
  //     height: GAME_HEIGHT,
  // },
  backgroundColor: "#252945",
  parent: "wrapper",
  roundPixels: true,
  scene: [menuScene, gameScene, tutorialScene],
  physics: {
    default: "matter",
    matter: {
      // debug: true,
      gravity: {
        y: 0.2,
      },
      setBounds: {
        x: 24,
        y: -1000,
        width: 864,
        height: 1498,
      },
      // enableSleeping: true,
    },
  },
  // scale: {
  //   parent: "wrapper",
  //   mode: Phaser.Scale.FIT,
  //   // width: GAME_WIDTH,
  //   // height: GAME_HEIGHT,
  // },
};

let game = new Phaser.Game(config);
