import { Scene } from 'phaser';

export class CinematicScene extends Scene {
    constructor() { super('CinematicScene'); }

    create() {
        const cam = this.cameras.main;
        this.W = cam.width;
        this.H = cam.height;
        this._skipping = false;
        cam.fadeIn(600, 0, 0, 0);

        this._skipHandler = () => this._goToIntro();
        this.input.keyboard.on('keydown-ESCAPE', this._skipHandler);
        this._skipHint();
        this._act1_exterior();
    }

    // ── NAVIGATION ────────────────────────────────────────────────────────

    _goToIntro() {
        if (this._skipping) return;
        this._skipping = true;
        this.input.keyboard.off('keydown-ESCAPE', this._skipHandler);
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
        const btn = this.add.text(this.W - 16, 14, 'PASSER  ▶', {
            fontSize: '12px', color: '#ffffff55', fontFamily: 'Courier New'
        }).setOrigin(1, 0).setDepth(50).setInteractive({ useHandCursor: true });
        btn.on('pointerover', () => btn.setColor('#ffffffcc'));
        btn.on('pointerout',  () => btn.setColor('#ffffff55'));
        btn.on('pointerdown', () => this._goToIntro());
    }

    // ── CHARACTERS ────────────────────────────────────────────────────────

    _boy(x, y) {
        const c = this.add.container(x, y);
        const g = this.add.graphics();
        const S = 3;
        g.fillStyle(0x5c3317); g.fillRect(-4*S, -15*S, 8*S, 6*S);
        g.fillStyle(0xffc88a); g.fillRect(-3*S, -9*S,  6*S, 7*S);
        g.fillStyle(0x111111); g.fillRect(-2*S, -7*S,  S, S);
                               g.fillRect(   S, -7*S,  S, S);
        g.fillStyle(0xcc6655); g.fillRect(  -S, -5*S, 2*S, S);
        g.fillStyle(0x2563eb); g.fillRect(-4*S, -2*S,  8*S, 7*S);
                               g.fillRect(-6*S, -2*S,  2*S, 5*S);
                               g.fillRect( 4*S, -2*S,  2*S, 5*S);
        g.fillStyle(0xffc88a); g.fillRect(-6*S,  3*S,  2*S, 2*S);
                               g.fillRect( 4*S,  3*S,  2*S, 2*S);
        g.fillStyle(0x1e3a8a); g.fillRect(-4*S,  5*S,  3*S, 6*S);
                               g.fillRect(   S,  5*S,  3*S, 6*S);
        g.fillStyle(0x111111); g.fillRect(-5*S, 11*S,  4*S, 2*S);
                               g.fillRect(   S, 11*S,  4*S, 2*S);
        c.add(g);
        return c;
    }

    _mom(x, y) {
        const c = this.add.container(x, y);
        const g = this.add.graphics();
        const S = 3;
        g.fillStyle(0x8b4513); g.fillRect(-4*S, -17*S, 8*S, 6*S);
                               g.fillRect(-5*S, -11*S, 2*S, 9*S);
                               g.fillRect( 3*S, -11*S, 2*S, 9*S);
        g.fillStyle(0xffc88a); g.fillRect(-3*S, -11*S, 6*S, 7*S);
        g.fillStyle(0x111111); g.fillRect(-2*S,  -9*S, S, S);
                               g.fillRect(   S,  -9*S, S, S);
        g.fillStyle(0xcc6655); g.fillRect(  -S,  -7*S, 2*S, S);
        g.fillStyle(0xe879a0); g.fillRect(-4*S,  -4*S, 8*S, 8*S);
                               g.fillRect(-6*S,  -4*S, 2*S, 5*S);
                               g.fillRect( 4*S,  -4*S, 2*S, 5*S);
                               g.fillRect(-5*S,   4*S,10*S, 5*S);
        g.fillStyle(0xffc88a); g.fillRect(-6*S,    S,  2*S, 2*S);
                               g.fillRect( 4*S,    S,  2*S, 2*S);
                               g.fillRect(-3*S,   9*S, 2*S, 4*S);
                               g.fillRect(   S,   9*S, 2*S, 4*S);
        g.fillStyle(0x333333); g.fillRect(-4*S,  13*S, 3*S, 2*S);
                               g.fillRect(   S,  13*S, 3*S, 2*S);
        c.add(g);
        return c;
    }

    // ── HELPERS ───────────────────────────────────────────────────────────

    _sky() { this.add.rectangle(this.W/2, this.H/2, this.W, this.H, 0x87ceeb); }

    _floor() {
        const { W, H } = this;
        this.add.rectangle(W/2, H*0.82, W, H*0.36, 0x5d8a3c);
        this.add.rectangle(W/2, H*0.72, W, H*0.05, 0xb0b0b0);
    }

    _cloud(x, y) {
        const c = this.add.container(x, y);
        const g = this.add.graphics().fillStyle(0xffffff, 0.9);
        g.fillCircle(0, 0, 27); g.fillCircle(28, -10, 37);
        g.fillCircle(64, 0, 25); g.fillRect(-4, 0, 78, 22);
        c.add(g);
        const drift = 20 + Math.random() * 30;
        const dur   = 6000 + Math.random() * 4000;
        this.tweens.add({ targets: c, x: x + drift, duration: dur, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        return c;
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

        // Container at bubble center — lets us scale-pop the whole thing
        const container = this.add.container(bx, by).setDepth(20).setScale(0);

        const g = this.add.graphics();
        g.fillStyle(0xffffff);
        g.fillRoundedRect(-bw/2, -bh/2, bw, bh, 10);
        g.lineStyle(2, 0x444444);
        g.strokeRoundedRect(-bw/2, -bh/2, bw, bh, 10);
        const tx = tailRight ? bw/4 : -bw/4;
        const ty = bh/2;
        g.fillStyle(0xffffff);
        g.fillTriangle(tx - 8, ty, tx + 8, ty, tx, ty + 18);

        const txt = this.add.text(0, 0, text, {
            fontSize: '14px', color: '#222', fontFamily: 'Courier New', align: 'center'
        }).setOrigin(0.5);

        container.add([g, txt]);
        this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 220, ease: 'Back.easeOut' });
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

    // Étoiles orbitant autour d'un point
    _orbit(cx, cy, radius, count) {
        for (let i = 0; i < count; i++) {
            const star = this.add.circle(cx, cy, i % 2 === 0 ? 4 : 3, 0xffd166, 1).setDepth(15);
            const angle0 = (i / count) * Math.PI * 2;
            this.time.addEvent({
                delay: 16, repeat: -1,
                callback: () => {
                    const a = angle0 + (this.time.now / 1200);
                    star.setPosition(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
                }
            });
        }
    }

    // Explosion de confettis depuis (x, y)
    _confetti(x, y) {
        const colors = [0xff6b6b, 0xffd166, 0x4ecdc4, 0xa29bfe, 0xfd79a8, 0x00b894];
        for (let i = 0; i < 14; i++) {
            const r = this.add.rectangle(x, y, 6, 10, colors[i % colors.length]).setDepth(25);
            const angle = (i / 14) * Math.PI * 2;
            this.tweens.add({
                targets: r,
                x: x + Math.cos(angle) * 110,
                y: y + Math.sin(angle) * 110 - 70,
                alpha: 0, angle: 360,
                duration: 950, ease: 'Power2', delay: i * 25
            });
        }
    }

    // Éclat d'étoiles depuis (cx, cy)
    _starBurst(cx, cy) {
        const colors = [0xffd166, 0xffffff, 0xff6b6b, 0x4fc3f7, 0xa29bfe, 0xffb347];
        for (let i = 0; i < 18; i++) {
            const star = this.add.circle(cx, cy, i % 3 === 0 ? 6 : 4, colors[i % colors.length])
                .setDepth(30).setAlpha(1);
            const angle = (i / 18) * Math.PI * 2;
            const dist  = 140 + Math.random() * 120;
            this.tweens.add({
                targets: star,
                x: cx + Math.cos(angle) * dist,
                y: cy + Math.sin(angle) * dist,
                alpha: 0, scaleX: 0, scaleY: 0,
                duration: 1300, ease: 'Power2',
                delay: 250 + i * 18
            });
        }
    }

    // ── ACT 1 : Extérieur du magasin ──────────────────────────────────────

    _act1_exterior() {
        const { W, H } = this;
        this._sky();
        // Soleil
        this.add.circle(W*0.88, H*0.12, 40, 0xffd166);
        for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            const ray = this.add.rectangle(
                W*0.88 + Math.cos(a) * 58, H*0.12 + Math.sin(a) * 58,
                22, 4, 0xffd166
            ).setAngle((i / 8) * 360);
            this.tweens.add({ targets: ray, angle: ray.angle + 360, duration: 12000, repeat: -1, ease: 'Linear' });
        }
        // Nuages animés
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

        // Halo glow autour de la cover
        for (let i = 4; i >= 1; i--) {
            const glow = this.add.circle(W*0.5, H*0.49, i * 50, 0xffd166, i * 0.035);
            this.tweens.add({
                targets: glow, alpha: 0,
                duration: 1000 + i * 200, yoyo: true, repeat: -1,
                delay: i * 150, ease: 'Sine.easeInOut'
            });
        }

        // Badge
        this.add.rectangle(W*0.5, H*0.255, 130, 32, 0xff3333);
        this.add.text(W*0.5, H*0.255, '✨ NOUVEAU !', {
            fontSize: '14px', color: '#fff', fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5);

        // Cover (lévitation)
        const cover = this.add.image(W*0.5, H*0.49, 'designer').setDisplaySize(128, 170).setDepth(10);
        this.tweens.add({ targets: cover, y: H*0.49 - 7, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

        // Étoiles orbitantes
        this._orbit(W*0.5, H*0.49, 105, 6);

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

        this.add.rectangle(W*0.22, H*0.78, 110, 14, 0xd4a855);
        this.add.rectangle(W*0.22, H*0.725, 90, 55, 0xd4a855);
        this.add.image(W*0.22, H*0.515, 'designer').setDisplaySize(78, 105);

        const boy = this._boy(W*0.50, H*0.75);
        const mom = this._mom(W*0.68, H*0.74);
        this._bob(boy); this._bob(mom, 4);

        // Bulle du garçon (pop animé)
        this.time.delayedCall(400, () =>
            this._bubble('Maman !\nJe le VEUX !!', W*0.46, H*0.55, false));

        // Réponse de maman + jump + confettis
        this.time.delayedCall(2100, () => {
            this.tweens.add({ targets: boy, y: H*0.72, duration: 180, yoyo: true, repeat: 2 });
            this._bubble('...bon,\nd\'accord 😅', W*0.72, H*0.53, true);
            // Confettis depuis le centre de la scène
            this.time.delayedCall(300, () => this._confetti(W*0.59, H*0.6));
        });

        this._next(() => this._act4_home(), 4600);
    }

    // ── ACT 4 : Retour à la maison ────────────────────────────────────────

    _act4_home() {
        const { W, H } = this;
        this._sky();
        this.add.circle(W*0.88, H*0.12, 40, 0xffd166);
        this._cloud(170, 88); this._cloud(710, 65);
        this._floor();

        // House
        this.add.rectangle(W*0.63, H*0.525, 320, 290, 0xffe4b5);
        const roof = this.add.graphics().fillStyle(0xc0392b);
        roof.fillTriangle(W*0.63 - 185, H*0.38, W*0.63 + 185, H*0.38, W*0.63, H*0.155);
        this.add.rectangle(W*0.54, H*0.455, 72, 72, 0xadd8e6).setStrokeStyle(4, 0x9999bb);
        const wg = this.add.graphics().lineStyle(3, 0x9999bb, 0.9);
        wg.lineBetween(W*0.54, H*0.419, W*0.54, H*0.491);
        wg.lineBetween(W*0.504, H*0.455, W*0.576, H*0.455);
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

    // ── ACT 5 : NES → cartouche → TV s'allume ────────────────────────────

    _act5_nes() {
        const { W, H } = this;
        this.add.rectangle(W/2, H/2, W, H, 0x9b8467);
        this.add.rectangle(W/2, H*0.84, W, H*0.32, 0x7a5c3c);
        this.add.rectangle(W/2, H*0.698, W, 7, 0x6b4a28);

        // TV stand
        this.add.rectangle(W*0.44, H*0.79, 300, 28, 0x5c4a2a);
        // CRT TV
        this.add.rectangle(W*0.44, H*0.525, 270, 230, 0x2a2a2a).setStrokeStyle(7, 0x1a1a1a);
        const screen = this.add.rectangle(W*0.44, H*0.513, 218, 175, 0x050505).setDepth(2);
        this.add.rectangle(W*0.35, H*0.663, 12, 22, 0x1a1a1a);
        this.add.rectangle(W*0.53, H*0.663, 12, 22, 0x1a1a1a);

        // NES console
        this.add.rectangle(W*0.44, H*0.716, 210, 48, 0x888888).setStrokeStyle(2, 0x555555);
        this.add.text(W*0.37, H*0.716, 'NES', {
            fontSize: '10px', color: '#333', fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add.rectangle(W*0.50, H*0.712, 85, 28, 0x444444).setStrokeStyle(1, 0x333333);
        const led = this.add.graphics();
        led.fillStyle(0x333333); led.fillCircle(W*0.565, H*0.730, 4);

        // Controller
        this.add.rectangle(W*0.72, H*0.79, 88, 48, 0x555555).setStrokeStyle(2, 0x333333);
        const cg = this.add.graphics();
        cg.fillStyle(0x333333);
        cg.fillRect(W*0.687, H*0.782, 8, 22); cg.fillRect(W*0.679, H*0.790, 22, 8);
        cg.fillStyle(0xcc2222);
        cg.fillCircle(W*0.748, H*0.796, 5); cg.fillCircle(W*0.737, H*0.779, 5);

        this._caption('Le grand moment...');

        const boyY = H*0.74;
        const boy  = this._boy(W + 60, boyY);
        const cart = this.add.image(18, -22, 'designer').setDisplaySize(26, 34);
        boy.add(cart);

        this.tweens.add({
            targets: boy, x: W*0.64, duration: 1800, ease: 'Linear',
            onComplete: () => {
                const floatCart = this.add.image(boy.x + 18, boyY - 22, 'designer')
                    .setDisplaySize(26, 34).setDepth(5);
                this.tweens.add({ targets: boy, alpha: 0, duration: 250 });

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
                                // LED blink
                                this.tweens.add({ targets: led, alpha: 0.3, duration: 150, yoyo: true, repeat: 3,
                                    onComplete: () => { led.setAlpha(1); }
                                });
                                this.time.delayedCall(500, () => this._nesFlicker(screen, W, H));
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
            if (f < 9) this.time.delayedCall(90, tick);
            else       this._nesBooted(W, H);
        };
        tick();
    }

    _nesBooted(W, H) {
        // Écran allumé — vert sombre
        this.add.rectangle(W*0.44, H*0.513, 218, 175, 0x001100).setDepth(3);

        // Scanlines CRT
        const scanLeft = W*0.44 - 109;
        const scanTop  = H*0.513 - 87;
        const sl = this.add.graphics().setDepth(7);
        for (let sy = 0; sy < 175; sy += 4) {
            sl.fillStyle(0x000000, 0.18);
            sl.fillRect(scanLeft, scanTop + sy, 218, 2);
        }

        // Halo phosphore vert
        const pglow = this.add.rectangle(W*0.44, H*0.513, 240, 195, 0x00ff44, 0).setDepth(4);
        this.tweens.add({ targets: pglow, alpha: 0.06, duration: 500 });

        // Texte sur l'écran
        const title = this.add.text(W*0.44, H*0.486, 'DEVOXXMON', {
            fontSize: '22px', color: '#00ff44', fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0).setDepth(8);
        const sub = this.add.text(W*0.44, H*0.532, '"Brisez les codes !"', {
            fontSize: '11px', color: '#00cc33', fontFamily: 'Courier New'
        }).setOrigin(0.5).setAlpha(0).setDepth(8);
        const press = this.add.text(W*0.44, H*0.572, 'PRESS START', {
            fontSize: '12px', color: '#009922', fontFamily: 'Courier New'
        }).setOrigin(0.5).setAlpha(0).setDepth(8);

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

        // Éclat d'étoiles au centre
        this._starBurst(W/2, H/2);

        const title = this.add.text(W/2, H/2 - 38, 'DEVOXX QUEST', {
            fontSize: '66px', color: '#ffd166', fontFamily: 'Courier New', fontStyle: 'bold',
            stroke: '#f72585', strokeThickness: 5
        }).setOrigin(0.5).setAlpha(0);
        const sub = this.add.text(W/2, H/2 + 48, '"Brisez les codes !"', {
            fontSize: '22px', color: '#4fc3f7', fontFamily: 'Courier New'
        }).setOrigin(0.5).setAlpha(0);

        // Apparition avec rebond
        this.tweens.add({ targets: title, alpha: 1, scaleX: { from: 0.7, to: 1 }, scaleY: { from: 0.7, to: 1 }, duration: 600, delay: 300, ease: 'Back.easeOut' });
        this.tweens.add({ targets: sub,   alpha: 1, duration: 500, delay: 900 });

        // Pulse lent
        this.tweens.add({
            targets: title,
            scaleX: { from: 1, to: 1.04 }, scaleY: { from: 1, to: 1.04 },
            duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 1200
        });

        this.time.delayedCall(3400, () => this._goToIntro());
    }
}
