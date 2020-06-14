import { Scene, Input } from "phaser";
import { Paddle  } from "../elements/paddle";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: true,
  visible: true,
  key: "Game"
}

const { A, D } = Input.Keyboard.KeyCodes;

export class GameLevel extends Scene {

  private bricks: Phaser.Physics.Arcade.StaticGroup;
  private ball: Phaser.Physics.Arcade.Image;
  private paddle: Paddle;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super(sceneConfig);
  }

  public preload() {
    this.load.atlas('assets', 'assets/breakout.png', 'assets/breakout.json');
  }

  public create() {
    this.physics.world.setBoundsCollision(true, true, true, true);

    this.bricks = this.physics.add.staticGroup({
      key: 'assets', frame: [ 'blue1', 'red1', 'green1', 'yellow1', 'silver1', 'purple1' ],
      frameQuantity: 10,
      gridAlign: { width: 10, height: 6, cellWidth: 64, cellHeight: 32, x: 112, y: 100 }
    });

    this.ball = this.physics.add.image(400, 500, 'assets', 'ball1').setCollideWorldBounds(true).setBounce(1);
    this.ball.setData('onPaddle', true);

    this.paddle = new Paddle(this, 400, 550);
    //  this.physics.add.image(400, 550, 'assets', 'paddle1').setImmovable();

    //  Our colliders
    this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);
    //this.physics.add.overlap(this.ball, this.bricks, this.hitBrick, null, this);
    this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);

    //  Input events
    // this.input.on('pointermove', function (pointer) {

    //     //  Keep the paddle within the game
    //     this.paddle.x = Phaser.Math.Clamp(pointer.x, 52, 748);

    //     if (this.ball.getData('onPaddle'))
    //     {
    //         this.ball.x = this.paddle.x;
    //     }

    // }, this);

    this.cursors = this.input.keyboard.addKeys({
      left: A,
      right: D
    });

    this.input.on('pointerup', function (pointer) {

        if (this.ball.getData('onPaddle'))
        {
            this.ball.setVelocity(-75, -300);
            this.ball.setData('onPaddle', false);
        }

    }, this);
  }

  private resetBall() {
    this.ball.setVelocity(0);
    this.ball.setPosition(this.paddle.x, 500);
    this.ball.setData('onPaddle', true);
  }

  private resetLevel() {
    this.resetBall();

    this.bricks.children.each(function (brick: any) {

        brick.enableBody(false, 0, 0, true, true);

    });
  }

  private hitBrick(ball, brick) {
    brick.disableBody(true, true);

    if (this.bricks.countActive() === 0)
    {
        this.resetLevel();
    }
  }

  private hitPaddle(ball, paddle) {
    var diff = 0;

    if (ball.x < paddle.x)
    {
        //  Ball is on the left-hand side of the paddle
        diff = paddle.x - ball.x;
        ball.setVelocityX(-10 * diff);
    }
    else if (ball.x > paddle.x)
    {
        //  Ball is on the right-hand side of the paddle
        diff = ball.x -paddle.x;
        ball.setVelocityX(10 * diff);
    }
    else
    {
        //  Ball is perfectly in the middle
        //  Add a little random X to stop it bouncing straight up!
        ball.setVelocityX(2 + Math.random() * 8);
    }
  }

  update() {
    if (this.cursors.left.isDown) {
      this.paddle.setVelocityX(-1 * 300);
      this.paddle.restraintOnScreen();
    } else if (this.cursors.right.isDown) {
      this.paddle.setVelocityX(300);
      this.paddle.restraintOnScreen();
    } else {
      this.paddle.setVelocityX(0);
    }

    if (this.ball.getData('onPaddle')) {
      this.ball.setPosition(this.paddle.x, this.paddle.y - this.paddle.displayHeight - 3);
    }

    if (this.ball.y > 580)
        {
            this.resetBall();
        }
  }
}