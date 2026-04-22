import Phaser from 'phaser';
import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class WorldScene extends Scene
{
    constructor () { super('WorldScene'); }

    init (data) {
        this.selectedRole = data && data.role ? data.role : this.registry.get('selectedRole');
    }

    create ()
    {
        this.add.text(10, 10, `Zone d'accueil - rôle: ${this.selectedRole || 'non défini'}`, { fontSize: '16px', color: '#ffffff' });

        // simple player placeholder
        this.player = this.add.rectangle(512, 384, 24, 32, 0xff0000);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown-SPACE', () => {
            this.showDialogue('PNJ: Bienvenue à l\'ANS !');
        });

        EventBus.emit('current-scene-ready', this);
    }

    update ()
    {
        const speed = 2;
        if (this.cursors.left.isDown) this.player.x -= speed;
        else if (this.cursors.right.isDown) this.player.x += speed;
        if (this.cursors.up.isDown) this.player.y -= speed;
        else if (this.cursors.down.isDown) this.player.y += speed;
    }

    showDialogue (text)
    {
        const d = this.add.text(100, 100, text, { fontSize: '16px', color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.5)' });
        this.time.delayedCall(2000, () => d.destroy());
    }
}
