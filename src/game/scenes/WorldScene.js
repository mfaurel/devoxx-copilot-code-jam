import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { ENEMIES } from '../EnemiesData';
import { NPC_DIALOGUES } from '../DialoguesData';
import { PlayerState } from '../PlayerState';
import { DialogSystem } from '../DialogSystem';

const TILE_W = 64;
const TILE_H = 32;
const COLS = 12;
const ROWS = 10;
const ORIGIN_X = 512;
const ORIGIN_Y = 140;

// Convert isometric grid coords to screen coords
function isoToScreen(col, row) {
    return {
        x: ORIGIN_X + (col - row) * (TILE_W / 2),
        y: ORIGIN_Y + (col + row) * (TILE_H / 2)
    };
}

// Map layout: 0 = floor, 1 = wall/obstacle, 2 = stand, 3 = carpet
const MAP = [
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,2,0,0,0,0,0,2,0,0,1],
    [1,0,0,0,3,3,3,0,0,0,0,1],
    [1,0,0,0,3,3,3,0,0,0,0,1],
    [1,0,0,0,3,3,3,0,0,0,0,1],
    [1,0,2,0,0,0,0,0,2,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
];

export class WorldScene extends Scene
{
    constructor () { super('WorldScene'); }

    init (data) {
        this.characterId = data && data.characterId ? data.characterId : 'java';
    }

    preload () {}

    create ()
    {
        this.add.rectangle(512, 384, 1024, 768, 0x1a1a2e);

        this._buildTilemap();
        this._spawnEnemies();
        this._spawnNPCs();
        this._createPlayer();
        this._createHUD();

        this.dialog = new DialogSystem(this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });

        this.input.keyboard.on('keydown-SPACE', () => this._onInteract());
        this.isMoving = false;
        this.moveDelay = 0;
        this.returnFromBattle = this.registry.get('battleResult');

        if (this.returnFromBattle) {
            this.registry.remove('battleResult');
            if (PlayerState.defeatedCount() >= ENEMIES.length) {
                this.time.delayedCall(500, () => this._showVictory());
            } else {
                const ps = PlayerState.get();
                this.time.delayedCall(300, () => {
                    this.dialog.show([{ speaker: 'Système', text: `Victoire ! Ennemis vaincus : ${PlayerState.defeatedCount()}/${ENEMIES.length}` }]);
                });
            }
        }

        EventBus.emit('current-scene-ready', this);
    }

    _buildTilemap () {
        const FLOOR_COLOR  = 0x2d6a4f;
        const FLOOR_EDGE   = 0x1b4332;
        const WALL_COLOR   = 0x4a4e69;
        const WALL_EDGE    = 0x22223b;
        const CARPET_COLOR = 0x7209b7;
        const STAND_COLOR  = 0xf72585;

        // Use a SINGLE graphics object for the whole map (120 tiles → 1 draw call)
        const g = this.add.graphics();

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const type = MAP[row][col];
                const { x, y } = isoToScreen(col, row);

                if (type === 1) {
                    const wallH = 18;
                    // Top face
                    g.fillStyle(WALL_COLOR);
                    g.fillPoints([
                        { x, y: y - wallH },
                        { x: x + TILE_W / 2, y: y - wallH + TILE_H / 2 },
                        { x, y: y + TILE_H - wallH },
                        { x: x - TILE_W / 2, y: y - wallH + TILE_H / 2 }
                    ], true);
                    // Left side face
                    g.fillStyle(WALL_EDGE);
                    g.fillPoints([
                        { x: x - TILE_W / 2, y: y - wallH + TILE_H / 2 },
                        { x, y: y + TILE_H - wallH },
                        { x, y: y + TILE_H },
                        { x: x - TILE_W / 2, y: y + TILE_H / 2 }
                    ], true);
                } else {
                    const color = type === 2 ? STAND_COLOR : type === 3 ? CARPET_COLOR : FLOOR_COLOR;
                    const edge  = type === 0 ? FLOOR_EDGE : color;
                    g.fillStyle(color, 1);
                    g.fillPoints([
                        { x, y },
                        { x: x + TILE_W / 2, y: y + TILE_H / 2 },
                        { x, y: y + TILE_H },
                        { x: x - TILE_W / 2, y: y + TILE_H / 2 }
                    ], true);
                    g.lineStyle(1, edge, 0.6);
                    g.strokePoints([
                        { x, y },
                        { x: x + TILE_W / 2, y: y + TILE_H / 2 },
                        { x, y: y + TILE_H },
                        { x: x - TILE_W / 2, y: y + TILE_H / 2 }
                    ], true);
                }
            }
        }
    }

    _spawnEnemies () {
        this.enemySprites = [];
        const ps = PlayerState.get();
        ENEMIES.forEach((enemy, i) => {
            if (PlayerState.isEnemyDefeated(enemy.id)) return;
            const { x, y } = isoToScreen(enemy.position.col, enemy.position.row);
            const g = this.add.graphics();
            this._drawEnemySprite(g, enemy.color);
            g.setPosition(x, y - 16);
            g.setDepth(y);

            // Name label
            const label = this.add.text(x, y - 40, enemy.name, {
                fontSize: '10px', color: '#ff6b6b', fontFamily: 'Courier New',
                stroke: '#000', strokeThickness: 2
            }).setOrigin(0.5).setDepth(y + 1);

            // Bounce animation
            this.tweens.add({
                targets: [g, label],
                y: `-=6`,
                duration: 700,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: i * 200
            });

            this.enemySprites.push({ enemy, sprite: g, label, col: enemy.position.col, row: enemy.position.row });
        });
    }

    _spawnNPCs () {
        this.npcList = [];
        NPC_DIALOGUES.forEach(npc => {
            const { x, y } = isoToScreen(npc.position.col, npc.position.row);
            const g = this.add.graphics();
            this._drawNPCSprite(g, npc.color);
            g.setPosition(x, y - 16);
            g.setDepth(y);

            const label = this.add.text(x, y - 40, npc.name, {
                fontSize: '10px', color: '#a8dadc', fontFamily: 'Courier New',
                stroke: '#000', strokeThickness: 2
            }).setOrigin(0.5).setDepth(y + 1);

            this.npcList.push({ npc, sprite: g, label, col: npc.position.col, row: npc.position.row });
        });
    }

    _createPlayer () {
        this.playerCol = 1;
        this.playerRow = 1;
        const { x, y } = isoToScreen(this.playerCol, this.playerRow);

        this.playerSprite = this.add.graphics();
        this._drawPlayerSprite(this.playerSprite);
        this.playerSprite.setPosition(x, y - 16).setDepth(500);

        // Arrow indicator
        this.playerArrow = this.add.text(x, y - 50, '▼', {
            fontSize: '16px', color: '#ffd166', stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(501);
        this.tweens.add({
            targets: this.playerArrow,
            y: '+=8',
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    _drawPlayerSprite (g) {
        g.clear();
        const char = PlayerState.get();
        // Pick color based on characterId
        const colors = { java: 0xf89820, platform: 0x4a90d9, ia: 0xa855f7 };
        const color = colors[char.characterId] || 0xffd166;
        // Body
        g.fillStyle(color, 1);
        g.fillRect(-10, 0, 20, 22);
        // Head
        g.fillStyle(0xffd166, 1);
        g.fillCircle(0, -8, 10);
        // Eyes
        g.fillStyle(0x080818, 1);
        g.fillCircle(-3, -9, 1.5);
        g.fillCircle(3, -9, 1.5);
        // Badge
        g.fillStyle(0xffffff, 1);
        g.fillRect(-4, 4, 8, 5);
    }

    _drawEnemySprite (g, color) {
        g.clear();
        g.fillStyle(color, 1);
        g.fillRect(-10, 0, 20, 22);
        g.fillStyle(0xffe8d6, 1);
        g.fillCircle(0, -8, 10);
        g.fillStyle(color, 0.8);
        g.fillCircle(-3, -9, 2);
        g.fillCircle(3, -9, 2);
        // Evil eyebrows
        g.lineStyle(2, 0x222222);
        g.lineBetween(-6, -14, -1, -12);
        g.lineBetween(6, -14, 1, -12);
    }

    _drawNPCSprite (g, color) {
        g.clear();
        g.fillStyle(color, 0.9);
        g.fillRect(-9, 0, 18, 20);
        g.fillStyle(0xffd166, 1);
        g.fillCircle(0, -8, 9);
        g.fillStyle(0x080818, 1);
        g.fillCircle(-3, -9, 1.5);
        g.fillCircle(3, -9, 1.5);
    }

    _createHUD () {
        const ps = PlayerState.get();
        this.hudContainer = this.add.container(10, 10).setDepth(200);

        const hudBg = this.add.rectangle(110, 50, 220, 90, 0x0a0a1a, 0.85).setStrokeStyle(1, 0x374151);
        this.hudRoleText = this.add.text(10, 10, ps.role || 'Hero', {
            fontSize: '12px', color: '#ffd166', fontFamily: 'Courier New'
        });
        this.hudLvlText = this.add.text(10, 28, `Niveau ${ps.level}  XP: ${ps.xp}/${ps.level * 50}`, {
            fontSize: '11px', color: '#9ca3af', fontFamily: 'Courier New'
        });

        // HP bar
        this.hudHpLabel = this.add.text(10, 48, `HP: ${ps.hp}/${ps.maxHp}`, {
            fontSize: '11px', color: '#ef4444', fontFamily: 'Courier New'
        });
        this.hudHpBg = this.add.rectangle(120, 63, 150, 10, 0x1f2937);
        this.hudHpFill = this.add.rectangle(
            45 + (ps.hp / ps.maxHp) * 75, 63,
            (ps.hp / ps.maxHp) * 150, 8, 0x22c55e
        );

        // Enemies counter
        this.hudEnemyText = this.add.text(10, 75, `Ennemis vaincus: ${PlayerState.defeatedCount()}/${ENEMIES.length}`, {
            fontSize: '10px', color: '#6b7280', fontFamily: 'Courier New'
        });

        this.hudContainer.add([hudBg, this.hudRoleText, this.hudLvlText, this.hudHpLabel, this.hudHpBg, this.hudHpFill, this.hudEnemyText]);

        // Controls hint
        this.add.text(10, 740, 'WASD/Flèches: déplacer  •  ESPACE: interagir', {
            fontSize: '11px', color: '#374151', fontFamily: 'Courier New'
        }).setDepth(200);
    }

    _updateHUD () {
        const ps = PlayerState.get();
        this.hudLvlText.setText(`Niveau ${ps.level}  XP: ${ps.xp}/${ps.level * 50}`);
        this.hudHpLabel.setText(`HP: ${ps.hp}/${ps.maxHp}`);
        const ratio = ps.hp / ps.maxHp;
        this.hudHpFill.width = Math.max(2, ratio * 150);
        this.hudHpFill.x = 45 + ratio * 75;
        this.hudHpFill.setFillStyle(ratio > 0.5 ? 0x22c55e : ratio > 0.25 ? 0xf59e0b : 0xef4444);
        this.hudEnemyText.setText(`Ennemis vaincus: ${PlayerState.defeatedCount()}/${ENEMIES.length}`);
    }

    _isWalkable (col, row) {
        if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return false;
        return MAP[row][col] !== 1;
    }

    _movePlayer (dc, dr) {
        const newCol = this.playerCol + dc;
        const newRow = this.playerRow + dr;
        if (!this._isWalkable(newCol, newRow)) return;

        this.playerCol = newCol;
        this.playerRow = newRow;
        const { x, y } = isoToScreen(this.playerCol, this.playerRow);

        this.tweens.add({
            targets: [this.playerSprite, this.playerArrow],
            x,
            y: (target) => target === this.playerSprite ? y - 16 : y - 50,
            duration: 120,
            ease: 'Linear',
            onComplete: () => {
                this.playerSprite.setDepth(y);
                this._checkEnemyCollision();
            }
        });
    }

    _checkEnemyCollision () {
        for (let i = 0; i < this.enemySprites.length; i++) {
            const es = this.enemySprites[i];
            if (es.col === this.playerCol && es.row === this.playerRow) {
                this._startBattle(es.enemy, i);
                return;
            }
        }
    }

    _onInteract () {
        if (this.dialog.isOpen) {
            this.dialog.advance();
            return;
        }

        // Check adjacent NPCs
        const adj = [
            [this.playerCol, this.playerRow],
            [this.playerCol + 1, this.playerRow],
            [this.playerCol - 1, this.playerRow],
            [this.playerCol, this.playerRow + 1],
            [this.playerCol, this.playerRow - 1]
        ];

        for (const npcData of this.npcList) {
            for (const [c, r] of adj) {
                if (npcData.col === c && npcData.row === r) {
                    const lines = npcData.npc.lines.map(l => ({ speaker: npcData.npc.name, text: l }));
                    this.dialog.show(lines);
                    return;
                }
            }
        }
    }

    _startBattle (enemy, spriteIndex) {
        // Remove enemy sprite
        const es = this.enemySprites[spriteIndex];
        es.sprite.destroy();
        es.label.destroy();
        this.enemySprites.splice(spriteIndex, 1);

        // Show pre-battle dialogue
        this.dialog.show(
            [{ speaker: enemy.name, text: enemy.dialogBefore }],
            () => {
                const ps = PlayerState.get();
                this.scene.start('BattleScene', {
                    characterId: ps.characterId,
                    enemyId: enemy.id,
                    playerHP: ps.hp,
                    playerMaxHP: ps.maxHp,
                    level: ps.level
                });
            }
        );
    }

    _showVictory () {
        const { width, height } = this.cameras.main;
        const cx = width / 2;
        const cy = height / 2;

        const bg = this.add.rectangle(cx, cy, width, height, 0x080818, 0.85).setDepth(300);
        this.add.text(cx, cy - 60, '🎉 FÉLICITATIONS !', {
            fontSize: '36px', color: '#ffd166', fontFamily: 'Courier New'
        }).setOrigin(0.5).setDepth(301);
        this.add.text(cx, cy, 'Vous avez survécu à Devoxx !', {
            fontSize: '20px', color: '#ffffff', fontFamily: 'Courier New'
        }).setOrigin(0.5).setDepth(301);

        const ps = PlayerState.get();
        this.add.text(cx, cy + 40, `Niveau final : ${ps.level}  |  XP total : ${ps.xp}`, {
            fontSize: '16px', color: '#9ca3af', fontFamily: 'Courier New'
        }).setOrigin(0.5).setDepth(301);

        const btn = this.add.text(cx, cy + 100, '▶ REJOUER', {
            fontSize: '20px', color: '#4fc3f7', fontFamily: 'Courier New'
        }).setOrigin(0.5).setDepth(301).setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => { PlayerState.reset(); this.scene.start('IntroScene'); });
    }

    update (time, delta)
    {
        if (this.dialog.isOpen) return;

        this.moveDelay -= delta;
        if (this.moveDelay > 0) return;

        const left  = this.cursors.left.isDown  || this.wasd.left.isDown;
        const right = this.cursors.right.isDown || this.wasd.right.isDown;
        const up    = this.cursors.up.isDown    || this.wasd.up.isDown;
        const down  = this.cursors.down.isDown  || this.wasd.down.isDown;

        if (left)        { this._movePlayer(-1, 0);  this.moveDelay = 140; }
        else if (right)  { this._movePlayer(1, 0);   this.moveDelay = 140; }
        else if (up)     { this._movePlayer(0, -1);  this.moveDelay = 140; }
        else if (down)   { this._movePlayer(0, 1);   this.moveDelay = 140; }
    }
}

