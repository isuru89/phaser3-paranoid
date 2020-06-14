import { Scene } from "phaser";

export class Paddle extends Phaser.Physics.Arcade.Image {

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 'assets', 'paddle1');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDisplaySize(150, 16);
    this.setImmovable(true).setBounce(1);
  }


  public restraintOnScreen() {
    this.x = Phaser.Math.Clamp(this.x,
      this.displayWidth / 2 + 10,
      this.scene.game.canvas.width - this.displayWidth / 2 - 10)
  }

}