export const CHARACTERS = {
    java: {
        id: 'java',
        name: '☕ Java Dev',
        subtitle: 'Développeur Senior Expérimenté',
        description: 'Solide, fiable, connait Java de la version 8 à 21. Lent à adopter les trends mais inarrêtable en combat technique.',
        color: 0xf89820,
        type: 'java',
        stats: {
            hp: 30,
            maxHp: 30,
            technique: 9,
            scalabilite: 6,
            creativite: 4,
            charisme: 7
        },
        skills: ['virtual_threads', 'sealed_classes', 'pattern_matching'],
        weakness: 'ia',
        strength: 'platform'
    },
    platform: {
        id: 'platform',
        name: '⚙️ Platform Engineer',
        subtitle: 'SRE / DevOps Pragmatique',
        description: 'Maître de l\'infra et des pipelines CI/CD. Préfère un terminal à une salle de conf, mais détruit tout ce qui ne scale pas.',
        color: 0x4a90d9,
        type: 'platform',
        stats: {
            hp: 35,
            maxHp: 35,
            technique: 7,
            scalabilite: 9,
            creativite: 5,
            charisme: 4
        },
        skills: ['kubernetes_rolling', 'opentelemetry_trace', 'gitops_push'],
        weakness: 'java',
        strength: 'ia'
    },
    ia: {
        id: 'ia',
        name: '🤖 IA Engineer',
        subtitle: 'Développeur à la Frontière du ML',
        description: 'Passionné de LLMs, RAG et fine-tuning. Créatif et innovant mais parfois victime de ses propres hallucinations.',
        color: 0xa855f7,
        type: 'ia',
        stats: {
            hp: 25,
            maxHp: 25,
            technique: 6,
            scalabilite: 5,
            creativite: 9,
            charisme: 8
        },
        skills: ['rag_pipeline', 'fine_tune', 'prompt_injection'],
        weakness: 'platform',
        strength: 'java'
    }
};

export const CHARACTER_LIST = Object.values(CHARACTERS);
