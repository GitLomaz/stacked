class splashBlock extends Phaser.GameObjects.Container {
  // static counter = 0;

  constructor() {
    let width = Phaser.Math.Between(1, 4);
    let height = Phaser.Math.Between(1, 4);
    super(scene, Phaser.Math.Between(40, GAME_WIDTH - 40), -50);
    let w = Math.ceil(
      (13.5 + 4.5 * width) *
        (scene.lps ? 1 + scene.lps[1].level * 0.05 : 1) *
        (scene.upgrades ? 1 + scene.upgrades[1].level * 0.15 : 1)
    );
    let h = Math.ceil(
      (13.5 + 4.5 * height) *
        (scene.lps ? 1 + scene.lps[2].level * 0.05 : 1) *
        (scene.upgrades ? 1 + scene.upgrades[2].level * 0.15 : 1)
    );
    this.setSize(w, h);
    this.radius = 9;
    this.falling = true;

    let sets = [
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5],
      [4, 5, 6],
      [5, 6, 7],
    ];

    let tints = [
      [0xe279b4, 0xa13567],
      [0xffa878, 0x9f2a31],
      [0xfffcc9, 0xe1ad26],
      [0xfffab0, 0xffa13d],
      [0xd2e269, 0x56a135],
      [0x75dceb, 0x3387ba],
      [0xa7c4e2, 0x4d60c6],
      [0xd3a7ff, 0x7d309c],
    ];

    let tint = tints[sets[4][Phaser.Math.Between(0, 2)]];

    let r3 = scene.add.rectangle(
      0,
      0,
      this.width - 4,
      this.height - 4,
      tint[1],
      0.25
    );

    r3.setStrokeStyle(5, tint[1], 0.35);

    let r2 = scene.add.rectangle(0, 0, this.width - 4, this.height - 4);

    r2.setStrokeStyle(3, tint[1]);

    let r1 = scene.add.rectangle(0, 0, this.width - 4, this.height - 4);

    r1.setStrokeStyle(1, tint[0]);

    this.add(r3);
    this.add(r2);
    this.add(r1);

    scene.add.existing(this);
    this.score = Decimal.sqrt(this.width * this.height * 100);
    scene.matter.add.gameObject(this).setBounce(0);
    this.body.labelText = "block";
    scene.blocks.add(this);
  }

  payout() {
    this.destroy();
  }
}
