import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class BattleScene extends Scene
{
    constructor () { super('BattleScene'); }

    init (data)
    {
        this.playerHP = data && data.playerHP ? data.playerHP : 20;
        this.enemyHP = data && data.enemyHP ? data.enemyHP : 10;
    }

    create ()
    {
        this.add.text(100, 80, 'Combat', { fontSize: '28px', color: '#ffffff' });

        this.playerText = this.add.text(100, 130, `Joueur PV: ${this.playerHP}`, { fontSize: '20px', color: '#ffffff' });
        this.enemyText = this.add.text(100, 160, `Ennemi PV: ${this.enemyHP}`, { fontSize: '20px', color: '#ffffff' });

        this.input.keyboard.on('keydown-SPACE', () => {
            this.playerAttack();
        });

        EventBus.emit('current-scene-ready', this);
    }

    playerAttack ()
    {
        const dmg = 5;
        this.enemyHP -= dmg;
        this.enemyText.setText(`Ennemi PV: ${this.enemyHP}`);

        if (this.enemyHP <= 0)
        {
            this.add.text(100, 220, 'Victoire!', { fontSize: '20px', color: '#00ff00' });
            this.time.delayedCall(800, () => this.scene.start('WorldScene'));
            return;
        }

        // enemy turn
        const edmg = 3;
        this.playerHP -= edmg;
        this.playerText.setText(`Joueur PV: ${this.playerHP}`);

        if (this.playerHP <= 0)
        {
            this.add.text(100, 220, 'Défaite...', { fontSize: '20px', color: '#ff3333' });
            this.time.delayedCall(800, () => this.scene.start('IntroScene'));
        }
    }
}
