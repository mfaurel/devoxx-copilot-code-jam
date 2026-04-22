import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class StarterScene extends Scene
{
    constructor () { super('StarterScene'); }

    create ()
    {
        const cx = this.cameras.main.centerX;
        const cy = this.cameras.main.centerY;

        this.add.text(cx, cy - 80, 'Choisissez votre rôle', { fontSize: '26px', color: '#ffffff' }).setOrigin(0.5);

        const roles = ['Chef de projets DSI', 'Responsable RH', 'Product Owner'];

        roles.forEach((r, i) => {
            const t = this.add.text(cx, cy - 20 + i * 40, r, { fontSize: '20px', color: '#00ff66' }).setOrigin(0.5).setInteractive();
            t.on('pointerdown', () => {
                // store selection and go to world
                this.registry.set('selectedRole', r);
                this.scene.start('WorldScene', { role: r });
            });
        });

        EventBus.emit('current-scene-ready', this);
    }
}
