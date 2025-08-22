import Phaser from "phaser";

export default class Demo extends Phaser.Scene {
  soundStarted!: boolean;

  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.scenePlugin({
      key: "rexuiplugin",
      url: "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
      sceneKey: "rexUI",
    });

    this.load.image(
      "nextPage",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png"
    );

    this.load.image("cowgirl1", "assets/cowgirl1.webp");
    this.load.image("cowgirl2", "assets/cowgirl2.webp");
  }

  async create() {
    this.input.on(
      "pointerdown",
      () => {
        if (!this.soundStarted) {
          this.soundStarted = true;
          new Audio("assets/sounds/tamco09.mp3").play();
        }
        new Audio("assets/sounds/clear_mouse_clicks.wav").play();
      },
      this
    );

    this.cameras.main.setBackgroundColor("transparent");
    this.cameras.main.fadeIn(1000, 255, 255, 255);
    const cowgirl = this.add.image(-100, -30, "cowgirl1").setOrigin(0, 0);

    await textBoxRun({
      self: this,
      name: "SDK",
      content: TEXT1,
    });

    cowgirl.destroy();

    this.cameras.main.fadeIn(1000, 255, 255, 255);

    const cowgirl2 = this.add.image(-100, -30, "cowgirl2").setOrigin(0, 0);

    await textBoxRun({
      self: this,
      name: "SDK",
      content: TEXT2,
    });
  }
}

const TEXT1 = `
안녕하세요 다먕 여러분.

반갑습니다.


역사는 반복되지만, 반복되기에 다시
 좋은일도 생길꺼에요.

자신을 사랑할 줄 아는 사람은 세상을
 사랑합니다.

세상을 사랑하는 사람들은 불의에 대해
  분노할 줄 알고, 저항합니다

우리에게는 수많은 도전을 극복한 저력이
 있습니다.

위기마저도 기회로 만드는 지혜가 있습니다.


그런 지혜와 저력으로 우리에게 닥친 도전을
 극복합니다.
.
`;

const TEXT2 = `
앙떡볶이가 앙볼로 피자로 다시 왔습니다~

앙볼로 피자 많이 사랑해주세요~

`;

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

function textBoxRun({ self, name, content }) {
  return new Promise((resolve, reject) => {
    var textBox = self.rexUI.add
      .textBox({
        x: 300,
        y: 620,
        innerBackground: self.rexUI.add.roundRectangle({
          radius: 20,
          color: COLOR_DARK,
          strokeColor: COLOR_LIGHT,
          strokeWidth: 2,
        }),

        text: self.rexUI.add.BBCodeText(0, 0, "", {
          fixedWidth: 400,
          fixedHeight: 65,

          fontSize: 20,
          wrap: {
            mode: "word",
            width: 500,
          },
        }),

        title: self.rexUI.add.label({
          width: 150,
          background: self.rexUI.add.roundRectangle({
            radius: 10,
            color: COLOR_PRIMARY,
            strokeColor: COLOR_LIGHT,
            strokeWidth: 2,
          }),
          text: self.add.text(0, 0, name, { fontSize: 24 }),
          align: "center",
          space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
            icon: 10,
            text: 10,
          },
        }),

        action: self.add
          .image(0, 0, "nextPage")
          .setTint(COLOR_LIGHT)
          .setVisible(false),

        space: {
          // For innerSizer
          innerLeft: 20,
          innerRight: 20,
          innerTop: 30,
          innerBottom: 20,

          title: -20,
          titleLeft: 30,
          icon: 10,
          text: 10,
        },
      })
      .layout();

    let scene = self;
    textBox
      .setInteractive()
      .on(
        "pointerdown",
        function () {
          let icon = this.getElement("action").setVisible(false);
          this.resetChildVisibleState(icon);
          if (self.isTyping) {
            this.stop(true);
          } else if (!self.isLastPage) {
            this.typeNextPage();
          } else {
            // Next actions
          }
        },
        textBox
      )
      .on(
        "pageend",
        function () {
          new Audio("assets/sounds/keyboard-typing-2.mp3").play();
          if (self.isLastPage) return;
          let icon = this.getElement("action").setVisible(true);
          this.resetChildVisibleState(icon);
          icon.y -= 30;
          let tween = scene.tweens.add({
            targets: icon,
            y: "+=30", // '+=100'
            ease: "Bounce", // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 500,
            repeat: 0, // -1: infinity
            yoyo: false,
          });
        },
        textBox
      )
      .on("complete", function () {
        console.log("all pages typing complete");
        resolve();
      });
    //.on('type', function () {
    //})

    textBox.start(content, 10);
  });
}
