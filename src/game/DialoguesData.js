export const NPC_DIALOGUES = [
    {
        id: 'npc_organizer',
        name: 'Organisateur Devoxx',
        color: 0x2dc653,
        position: { col: 1, row: 1 },
        lines: [
            'Bienvenue à Devoxx ! Votre badge est actif.',
            'Explorez la zone — des hackers techniques rôdent dans les allées !',
            'Conseil : connaître votre type d\'attaque change tout en combat.'
        ]
    },
    {
        id: 'npc_speaker',
        name: 'Speaker Confirmé',
        color: 0xffd166,
        position: { col: 9, row: 6 },
        lines: [
            'Mon talk sur les microservices a eu 400 personnes !',
            'Un conseil : le Défenseur du Legacy est très résistant.',
            'Utilisez vos attaques de type avantageux — ça fait x2 de dégâts !'
        ]
    },
    {
        id: 'npc_junior',
        name: 'Junior Dev',
        color: 0x06d6a0,
        position: { col: 2, row: 7 },
        lines: [
            'C\'est mon premier Devoxx ! Je suis perdu...',
            'Il y a un stand qui donne des t-shirts si tu gagnes un défi technique !',
            'Les attaques Java battent la Platform Engineering — triangle de types !'
        ]
    },
    {
        id: 'npc_goodie',
        name: 'Stand Goodie',
        color: 0xef476f,
        position: { col: 10, row: 8 },
        lines: [
            'Voici un sticker Kubernetes pour ta victoire !',
            'On a aussi des livres O\'Reilly pour les plus courageux...',
            'Bonne chance contre le Défenseur du Legacy, il est coriace !'
        ]
    }
];
