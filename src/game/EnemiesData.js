export const ENEMIES = [
    {
        id: 'chasseur_tetes',
        name: 'Chasseur de Têtes',
        subtitle: 'Armé de cartes de visite et d\'un pitch LinkedIn',
        type: 'recruiter',
        color: 0xff6b35,
        hp: 18,
        maxHp: 18,
        xpReward: 30,
        attacks: [
            { name: 'Connexion LinkedIn Forcée', damage: 4, description: 'Vous paralyse avec une demande de connexion urgente' },
            { name: 'Mission en Régie Avantageuse', damage: 3, description: 'Réduit votre créativité avec une offre alléchante' },
            { name: 'Pile de Cartes de Visite', damage: 5, description: 'Attaque physique brutale à coups de cartons' }
        ],
        dialogBefore: 'Bonjour ! J\'ai une super opportunité pour vous ! Vous cherchez une mission ? Top salaire, locaux sympas...',
        dialogAfter: 'Je... je repasserai avec une meilleure offre...',
        position: { col: 3, row: 4 }
    },
    {
        id: 'vendeur_buzzwords',
        name: 'Vendeur de Buzzwords',
        subtitle: 'Solution AI-powered, cloud-native, blockchain-enabled, quantum-ready',
        type: 'buzzword',
        color: 0xf72585,
        hp: 28,
        maxHp: 28,
        xpReward: 50,
        attacks: [
            { name: 'Slide Deck de 80 Pages', damage: 6, description: 'Confusion massive avec un diaporama sans fin' },
            { name: 'ROI Inventé', damage: 4, description: 'Réduit votre confiance avec des chiffres fantaisistes' },
            { name: 'Acronyme Incompréhensible', damage: 5, description: 'SAAS-PAAS-IAAS-XAAS vous assomme' }
        ],
        dialogBefore: 'Notre solution révolutionnaire utilise l\'IA générative blockchain pour synergiser vos KPIs avec le cloud edge native !',
        dialogAfter: 'Notre démo fonctionnait ce matin, je vous assure...',
        position: { col: 8, row: 3 }
    },
    {
        id: 'defenseur_legacy',
        name: 'Défenseur du Legacy',
        subtitle: 'Java 8 c\'est largement suffisant pour tout',
        type: 'legacy',
        color: 0x6b705c,
        hp: 40,
        maxHp: 40,
        xpReward: 80,
        attacks: [
            { name: 'ClassNotFoundException', damage: 8, description: 'Bug aléatoire qui apparaît sans raison apparente' },
            { name: 'Refus du Merge Request', damage: 6, description: 'Bloque votre progression pendant ce tour' },
            { name: 'XML de Configuration', damage: 9, description: 'Noie vous dans 500 lignes de XML inutile' }
        ],
        dialogBefore: 'Les lambdas ? Inutiles ! Les records ? Du luxe ! Java 8 a tout ce qu\'il faut. On a toujours fait comme ça !',
        dialogAfter: 'D\'accord... peut-être que Java 21 a quelques améliorations...',
        position: { col: 5, row: 7 }
    }
];
