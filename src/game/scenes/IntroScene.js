import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class IntroScene extends Scene
{
    constructor () { super('IntroScene'); }

    create ()
    {
        const cx = this.cameras.main.centerX;
        const cy = this.cameras.main.centerY;

        this.add.text(cx, cy - 60, 'ANS Adventure', { fontSize: '48px', color: '#ffffff' }).setOrigin(0.5);

        const start = this.add.text(cx, cy + 20, 'Commencer', { fontSize: '28px', color: '#ffff00' }).setOrigin(0.5).setInteractive();
        start.on('pointerdown', () => {
            this.scene.start('StarterScene');
        });

        EventBus.emit('current-scene-ready', this);
    }
}
