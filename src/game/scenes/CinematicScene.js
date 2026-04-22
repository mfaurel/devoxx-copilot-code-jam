import { Scene } from 'phaser';

export class CinematicScene extends Scene {
    constructor() { super('CinematicScene'); }

    create() {
        const cam = this.cameras.main;
        this.W = cam.width;
        this.H = cam.height;
        cam.fadeIn(600, 0, 0, 0);

        this.input.keyboard.once('keydown-ESCAPE', () => this._goToIntro());
        this._skipHint();
        this._act1_exterior();
    }

    // ── NAVIGATION ────────────────────────────────────────────────────────

    _goToIntro() {
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('IntroScene'));
    }

    _next(fn, delay) {
        this.time.delayedCall(delay, () => {
            this.cameras.main.fadeOut(450, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.children.removeAll(true);
                this._skipHint();
                this.cameras.main.fadeIn(450, 0, 0, 0);
                fn.call(this);
            });
        });
    }

    _skipHint() {
        this.add.text(this.W - 16, 14, '[ESC] passer', {
            fontSize: '11px', color: '#ffffff55', fontFamily: 'Courier New'
        }).setOrigin(1, 0).setDepth(50);
    }

    // ── CHARACTERS ────────────────────────────────────────────────────────

    _boy(x, y) {
        const c = this.add.container(x, y);
        const g = this.add.graphics();
        const S = 3;
        g.fillStyle(0x5c3317); g.fillRect(-4*S, -15*S, 8*S, 6*S);        // hair
        g.fillStyle(0xffc88a); g.fillRect(-3*S, -9*S,  6*S, 7*S);        // face
        g.fillStyle(0x111111); g.fillRect(-2*S, -7*S,  S, S);             // eye L
                               g.fillRect(   S, -7*S,  S, S);             // eye R
        g.fillStyle(0xcc6655); g.fillRect(  -S, -5*S, 2*S, S);            // mouth
        g.fillStyle(0x2563eb); g.fillRect(-4*S, -2*S,  8*S, 7*S);        // shirt
                               g.fillRect(-6*S, -2*S,  2*S, 5*S);        // arm L
                               g.fillRect( 4*S, -2*S,  2*S, 5*S);        // arm R
        g.fillStyle(0xffc88a); g.fillRect(-6*S,  3*S,  2*S, 2*S);        // hand L
                               g.fillRect( 4*S,  3*S,  2*S, 2*S);        // hand R
        g.fillStyle(0x1e3a8a); g.fillRect(-4*S,  5*S,  3*S, 6*S);        // leg L
                               g.fillRect(   S,  5*S,  3*S, 6*S);        // leg R
        g.fillStyle(0x111111); g.fillRect(-5*S, 11*S,  4*S, 2*S);        // shoe L
                               g.fillRect(   S, 11*S,  4*S, 2*S);        // shoe R
        c.add(g);
        return c;
    }

    _mom(x, y) {
        const c = this.add.container(x, y);
        const g = this.add.graphics();
        const S = 3;
        g.fillStyle(0x8b4513); g.fillRect(-4*S, -17*S, 8*S, 6*S);        // hair top
                               g.fillRect(-5*S, -11*S, 2*S, 9*S);        // strand L
                               g.fillRect( 3*S, -11*S, 2*S, 9*S);        // strand R
        g.fillStyle(0xffc88a); g.fillRect(-3*S, -11*S, 6*S, 7*S);        // face
        g.fillStyle(0x111111); g.fillRect(-2*S,  -9*S, S, S);             // eye L
                               g.fillRect(   S,  -9*S, S, S);             // eye R
        g.fillStyle(0xcc6655); g.fillRect(  -S,  -7*S, 2*S, S);           // mouth
        g.fillStyle(0xe879a0); g.fillRect(-4*S,  -4*S, 8*S, 8*S);        // top
                               g.fillRect(-6*S,  -4*S, 2*S, 5*S);        // arm L
                               g.fillRect( 4*S,  -4*S, 2*S, 5*S);        // arm R
                               g.fillRect(-5*S,   4*S,10*S, 5*S);        // skirt
        g.fillStyle(0xffc88a); g.fillRect(-6*S,    S,  2*S, 2*S);        // hand L
                               g.fillRect( 4*S,    S,  2*S, 2*S);        // hand R
                               g.fillRect(-3*S,   9*S, 2*S, 4*S);        // leg L
                               g.fillRect(   S,   9*S, 2*S, 4*S);        // leg R
        g.fillStyle(0x333333); g.fillRect(-4*S,  13*S, 3*S, 2*S);        // shoe L
                               g.fillRect(   S,  13*S, 3*S, 2*S);        // shoe R
        c.add(g);
        return c;
    }

    // ── HELPERS ───────────────────────────────────────────────────────────

    _sky()   { this.add.rectangle(this.W/2, this.H/2, this.W, this.H, 0x87ceeb); }
    _floor() {
        const { W, H } = this;
        this.add.rectangle(W/2, H*0.82, W, H*0.36, 0x5d8a3c);
        this.add.rectangle(W/2, H*0.72, W, H*0.05, 0xb0b0b0);
    }
    _cloud(x, y) {
        const g = this.add.graphics().fillStyle(0xffffff, 0.9);
        g.fillCircle(x, y, 27); g.fillCircle(x+28, y-10, 37);
        g.fillCircle(x+64, y, 25); g.fillRect(x-4, y, 78, 22);
    }
    _caption(text) {
        const { W, H } = this;
        this.add.rectangle(W/2, H - 30, W, 48, 0x000000, 0.65).setDepth(9);
        this.add.text(W/2, H - 30, text, {
            fontSize: '18px', color: '#fff', fontFamily: 'Courier New'
        }).setOrigin(0.5).setDepth(10);
    }
    _bubble(text, bx, by, tailRight = true) {
        const lines = text.split('\n');
        const bw = Math.max(180, Math.max(...lines.map(l => l.length)) * 11 + 24);
        const bh = lines.length * 26 + 20;
        const g = this.add.graphics().setDepth(20);
        g.fillStyle(0xffffff);
        g.fillRoundedRect(bx - bw/2, by - bh/2, bw, bh, 10);
        g.lineStyle(2, 0x444444);
        g.strokeRoundedRect(bx - bw/2, by - bh/2, bw, bh, 10);
        // tail pointing down toward speaker
        const tx = tailRight ? bx + bw/4 : bx - bw/4;
        const ty = by + bh/2;
        g.fillStyle(0xffffff);
        g.fillTriangle(tx - 8, ty, tx + 8, ty, tx, ty + 18);
        this.add.text(bx, by, text, {
            fontSize: '14px', color: '#222', fontFamily: 'Courier New', align: 'center'
        }).setOrigin(0.5).setDepth(21);
    }
    _bob(container, amount = 5) {
        this.tweens.add({
            targets: container,
            y: { from: container.y, to: container.y - amount },
            duration: 230, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });
    }
    _shelf(x, y) {
        const g = this.add.graphics();
        g.fillStyle(0x8b5e3c);
        [-50, 10, 70].forEach(dy => g.fillRect(x - 65, y + dy, 130, 8));
        g.fillRect(x - 67, y - 58, 8, 140); g.fillRect(x + 59, y - 58, 8, 140);
        const c1 = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0xa29bfe, 0x55efc4];
        c1.forEach((col, i) => { g.fillStyle(col); g.fillRect(x - 60 + i*25, y - 48, 20, 46); });
        const c2 = [0xfd79a8, 0x00b894, 0xfdcb6e, 0x6c5ce7];
        c2.forEach((col, i) => { g.fillStyle(col); g.fillRect(x - 58 + i*32, y + 18, 20, 34); });
    }

    // ── ACT 1 : Extérieur du magasin ──────────────────────────────────────

    _act1_exterior() {
        const { W, H } = this;
        this._sky();
        this._cloud(110, 100); this._cloud(560, 72); this._cloud(850, 125);
        this._floor();

        // Building
        this.add.rectangle(W*0.63, H*0.47, W*0.45, H*0.58, 0xf5e6c8);
        this.add.rectangle(W*0.63, H*0.195, W*0.47, 18, 0xd2691e);
        // Windows
        this.add.rectangle(W*0.50, H*0.39, 88, 98, 0xadd8e6).setStrokeStyle(4, 0x9999bb);
        this.add.rectangle(W*0.70, H*0.39, 88, 98, 0xadd8e6).setStrokeStyle(4, 0x9999bb);
        [0xff6b6b, 0x4ecdc4, 0xffe66d].forEach((col, i) =>
            this.add.rectangle(W*0.50, H*0.355 + i*19, 64, 13, col));
        // Designer cover visible in right window
        this.add.image(W*0.70, H*0.39, 'designer').setDisplaySize(58, 80);
        // Door
        this.add.rectangle(W*0.61, H*0.625, 52, 86, 0x8b5e3c).setStrokeStyle(2, 0x5c3a1e);
        this.add.circle(W*0.638, H*0.625, 4, 0xffd700);
        // Sign
        this.add.rectangle(W*0.63, H*0.225, 215, 42, 0xff4444);
        this.add.text(W*0.63, H*0.225, '🎮  GAME ZONE', {
            fontSize: '17px', color: '#fff', fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5);

        this._caption('Un samedi matin...');

        const boy = this._boy(-70, H*0.69);
        const mom = this._mom(-155, H*0.68);
        this._bob(boy); this._bob(mom, 4);
        this.tweens.add({ targets: mom, x: W*0.33, duration: 2800, ease: 'Linear' });
        this.tweens.add({ targets: boy, x: W*0.57, duration: 2200, ease: 'Linear' });

        this._next(() => this._act2_interior(), 3600);
    }

    // ── ACT 2 : Intérieur — le garçon voit la pochette ───────────────────

    _act2_interior() {
        const { W, H } = this;
        this.add.rectangle(W/2, H/2, W, H, 0xf5e2c0);
        this.add.rectangle(W/2, H*0.88, W, H*0.24, 0xc4a06a);
        [W*0.28, W*0.72].forEach(lx =>
            this.add.rectangle(lx, 28, 110, 18, 0xffffcc).setStrokeStyle(2, 0xdddd88));
        this._shelf(W*0.14, H*0.5);
        this._shelf(W*0.88, H*0.5);

        // Display stand
        this.add.rectangle(W*0.5, H*0.825, 180, 18, 0xd4a855);
        this.add.rectangle(W*0.5, H*0.745, 140, 65, 0xd4a855);
        // Badge
        this.add.rectangle(W*0.5, H*0.255, 130, 32, 0xff3333);
        this.add.text(W*0.5, H*0.255, '✨ NOUVEAU !', {
            fontSize: '14px', color: '#fff', fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5);
        // Cover
        const cover = this.add.image(W*0.5, H*0.49, 'designer').setDisplaySize(128, 170);
        this.tweens.add({ targets: cover, y: H*0.49 - 7, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

        this._caption('Dans le magasin...');

        const boy = this._boy(W*0.78, H*0.74);
        const mom = this._mom(W*0.90, H*0.73);
        this._bob(boy); this._bob(mom, 4);

        this.time.delayedCall(700, () =>
            this.tweens.add({ targets: boy, x: W*0.72, duration: 500 }));

        this._next(() => this._act3_dialog(), 3800);
    }

    // ── ACT 3 : "Maman, je le veux !!" ───────────────────────────────────

    _act3_dialog() {
        const { W, H } = this;
        this.add.rectangle(W/2, H/2, W, H, 0xf5e2c0);
        this.add.rectangle(W/2, H*0.88, W, H*0.24, 0xc4a06a);

        // Small cover on left stand
        this.add.rectangle(W*0.22, H*0.78, 110, 14, 0xd4a855);
        this.add.rectangle(W*0.22, H*0.725, 90, 55, 0xd4a855);
        this.add.image(W*0.22, H*0.515, 'designer').setDisplaySize(78, 105);

        const boy = this._boy(W*0.50, H*0.75);
        const mom = this._mom(W*0.68, H*0.74);
        this._bob(boy); this._bob(mom, 4);

        // Boy bubble
        this.time.delayedCall(400, () =>
            this._bubble('Maman !\nJe le VEUX !!', W*0.46, H*0.55, false));

        // Mom answer + boy jumps for joy
        this.time.delayedCall(2100, () => {
            this.tweens.add({ targets: boy, y: H*0.72, duration: 180, yoyo: true, repeat: 2 });
            this._bubble('...bon,\nd\'accord 😅', W*0.72, H*0.53, true);
        });

        this._next(() => this._act4_home(), 4600);
    }

    // ── ACT 4 : Retour à la maison ────────────────────────────────────────

    _act4_home() {
        const { W, H } = this;
        this._sky();
        this._cloud(170, 88); this._cloud(710, 65);
        this._floor();

        // House
        this.add.rectangle(W*0.63, H*0.525, 320, 290, 0xffe4b5);
        const roof = this.add.graphics().fillStyle(0xc0392b);
        roof.fillTriangle(W*0.63 - 185, H*0.38, W*0.63 + 185, H*0.38, W*0.63, H*0.155);
        // Window
        this.add.rectangle(W*0.54, H*0.455, 72, 72, 0xadd8e6).setStrokeStyle(4, 0x9999bb);
        const wg = this.add.graphics().lineStyle(3, 0x9999bb, 0.9);
        wg.lineBetween(W*0.54,   H*0.419, W*0.54,   H*0.491);
        wg.lineBetween(W*0.504,  H*0.455, W*0.576,  H*0.455);
        // Door
        this.add.rectangle(W*0.72, H*0.638, 55, 88, 0x8b5e3c).setStrokeStyle(2, 0x5c3a1e);
        this.add.circle(W*0.748, H*0.638, 4, 0xffd700);
        this.add.text(W*0.72, H*0.572, '42', {
            fontSize: '13px', color: '#5c3a1e', fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5);

        this._caption('À la maison !');

        const boy = this._boy(W + 60, H*0.69);
        const box = this.add.image(18, -22, 'designer').setDisplaySize(26, 34);
        boy.add(box);
        this._bob(boy, 5);

        this.tweens.add({ targets: boy, x: W*0.68, duration: 2300, ease: 'Linear' });

        this._next(() => this._act5_nes(), 3600);
    }

    // ── ACT 5 : NES → cartouche → TV s'allume ─────────────────────────────

    _act5_nes() {
        const { W, H } = this;
        this.add.rectangle(W/2, H/2, W, H, 0x9b8467);
        this.add.rectangle(W/2, H*0.84, W, H*0.32, 0x7a5c3c);
        this.add.rectangle(W/2, H*0.698, W, 7, 0x6b4a28);

        // TV stand
        this.add.rectangle(W*0.44, H*0.79, 300, 28, 0x5c4a2a);
        // CRT TV
        this.add.rectangle(W*0.44, H*0.525, 270, 230, 0x2a2a2a).setStrokeStyle(7, 0x1a1a1a);
        const screen = this.add.rectangle(W*0.44, H*0.513, 218, 175, 0x050505);
        this.add.rectangle(W*0.35, H*0.663, 12, 22, 0x1a1a1a);
        this.add.rectangle(W*0.53, H*0.663, 12, 22, 0x1a1a1a);

        // NES console
        this.add.rectangle(W*0.44, H*0.716, 210, 48, 0x888888).setStrokeStyle(2, 0x555555);
        this.add.text(W*0.37, H*0.716, 'NES', {
            fontSize: '10px', color: '#333', fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5);
        // Cartridge slot
        this.add.rectangle(W*0.50, H*0.712, 85, 28, 0x444444).setStrokeStyle(1, 0x333333);
        // Power LED (off)
        const led = this.add.graphics();
        led.fillStyle(0x333333); led.fillCircle(W*0.565, H*0.730, 4);

        // Controller on stand
        this.add.rectangle(W*0.72, H*0.79, 88, 48, 0x555555).setStrokeStyle(2, 0x333333);
        const cg = this.add.graphics();
        cg.fillStyle(0x333333);
        cg.fillRect(W*0.687, H*0.782, 8, 22); cg.fillRect(W*0.679, H*0.790, 22, 8);
        cg.fillStyle(0xcc2222);
        cg.fillCircle(W*0.748, H*0.796, 5); cg.fillCircle(W*0.737, H*0.779, 5);

        this._caption('Le grand moment...');

        // Boy enters from right (no bob so y stays constant)
        const boyY = H*0.74;
        const boy  = this._boy(W + 60, boyY);
        const cart = this.add.image(18, -22, 'designer').setDisplaySize(26, 34);
        boy.add(cart);

        this.tweens.add({
            targets: boy, x: W*0.64, duration: 1800, ease: 'Linear',
            onComplete: () => {
                // Standalone cartridge at boy's current world position
                const floatCart = this.add.image(boy.x + 18, boyY - 22, 'designer')
                    .setDisplaySize(26, 34).setDepth(5);
                this.tweens.add({ targets: boy, alpha: 0, duration: 250 });

                // Cartridge slides into NES slot
                this.tweens.add({
                    targets: floatCart,
                    x: W*0.50, y: H*0.712,
                    displayWidth: 62, displayHeight: 46,
                    duration: 900, ease: 'Power2',
                    onComplete: () => {
                        this.tweens.add({
                            targets: floatCart, alpha: 0, y: H*0.73,
                            duration: 280,
                            onComplete: () => {
                                floatCart.destroy();
                                led.clear();
                                led.fillStyle(0xff4400); led.fillCircle(W*0.565, H*0.730, 4);
                                this.time.delayedCall(350, () => this._nesFlicker(screen, W, H));
                            }
                        });
                    }
                });
            }
        });
    }

    _nesFlicker(screen, W, H) {
        let f = 0;
        const tick = () => {
            screen.setFillStyle(f++ % 2 === 0 ? 0x113311 : 0x050505);
            if (f < 7) this.time.delayedCall(110, tick);
            else       this._nesBooted(W, H);
        };
        tick();
    }

    _nesBooted(W, H) {
        // TV screen stays dark green
        this.add.rectangle(W*0.44, H*0.513, 218, 175, 0x001100);

        const title = this.add.text(W*0.44, H*0.486, 'DEVOXXMON', {
            fontSize: '22px', color: '#00ff44', fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);
        const sub = this.add.text(W*0.44, H*0.532, '"Brisez les codes !"', {
            fontSize: '11px', color: '#00cc33', fontFamily: 'Courier New'
        }).setOrigin(0.5).setAlpha(0);
        const press = this.add.text(W*0.44, H*0.572, 'PRESS START', {
            fontSize: '12px', color: '#009922', fontFamily: 'Courier New'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({ targets: title, alpha: 1, duration: 400 });
        this.time.delayedCall(500, () => {
            this.tweens.add({ targets: [sub, press], alpha: 1, duration: 300 });
            this.tweens.add({ targets: press, alpha: { from: 1, to: 0 }, duration: 550, yoyo: true, repeat: -1 });
        });

        this._next(() => this._act6_logo(), 2800);
    }

    // ── ACT 6 : Logo Devoxx Quest → transition vers le jeu ───────────────

    _act6_logo() {
        const { W, H } = this;
        this.add.rectangle(W/2, H/2, W, H, 0x000000);

        const title = this.add.text(W/2, H/2 - 38, 'DEVOXX QUEST', {
            fontSize: '66px', color: '#ffd166', fontFamily: 'Courier New', fontStyle: 'bold',
            stroke: '#f72585', strokeThickness: 5
        }).setOrigin(0.5).setAlpha(0);
        const sub = this.add.text(W/2, H/2 + 48, '"Brisez les codes !"', {
            fontSize: '22px', color: '#4fc3f7', fontFamily: 'Courier New'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({ targets: title, alpha: 1, duration: 800, delay: 200 });
        this.tweens.add({ targets: sub,   alpha: 1, duration: 600, delay: 900 });
        this.tweens.add({
            targets: title,
            scaleX: { from: 1, to: 1.03 }, scaleY: { from: 1, to: 1.03 },
            duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 1200
        });

        this.time.delayedCall(3200, () => this._goToIntro());
    }
}
