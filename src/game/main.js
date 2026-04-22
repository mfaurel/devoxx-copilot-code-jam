import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { IntroScene } from './scenes/IntroScene';
import { StarterScene } from './scenes/StarterScene';
import { MainMenu } from './scenes/MainMenu';
import { WorldScene } from './scenes/WorldScene';
import { BattleScene } from './scenes/BattleScene';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import Phaser from 'phaser';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Boot,
        Preloader,
        IntroScene,
        StarterScene,
        MainMenu,
        WorldScene,
        BattleScene,
        Game,
        GameOver
    ]
};

const StartGame = (parent) => {

    return new Phaser.Game({ ...config, parent });

}

export default StartGame;
