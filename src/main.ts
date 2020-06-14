import * as Phaser from "phaser";
import Scenes from "./scenes";

const gameConfigs: Phaser.Types.Core.GameConfig = {
  title: 'Paranoid',
  type: Phaser.AUTO,

  width: 800,
  height: 600,

  scene: Scenes,

  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },

  parent: 'game',
  backgroundColor: '#000000'
};

export const game: Phaser.Game = new Phaser.Game(gameConfigs);

window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});