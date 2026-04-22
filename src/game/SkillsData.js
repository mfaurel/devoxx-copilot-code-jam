// Type advantage multipliers: attacker type → defender type → multiplier
const TYPE_CHART = {
    java:     { java: 1.0, platform: 1.5, ia: 0.5, recruiter: 1.0, buzzword: 1.0, legacy: 2.0 },
    platform: { java: 0.5, platform: 1.0, ia: 1.5, recruiter: 1.2, buzzword: 1.0, legacy: 1.0 },
    ia:       { java: 1.5, platform: 0.5, ia: 1.0, recruiter: 0.8, buzzword: 2.0, legacy: 1.5 }
};

export function getTypeMultiplier(attackerType, defenderType) {
    return TYPE_CHART[attackerType]?.[defenderType] ?? 1.0;
}

export const SKILLS = {
    // Java Dev skills
    virtual_threads: {
        id: 'virtual_threads',
        name: 'Virtual Threads',
        type: 'java',
        damage: 12,
        description: 'Haute cadence — brise la résistance des ennemis bloquants',
        emoji: '☕'
    },
    sealed_classes: {
        id: 'sealed_classes',
        name: 'Sealed Classes',
        type: 'java',
        damage: 8,
        shield: true,
        description: 'Invulnérabilité temporaire (+5 défense ce tour)',
        emoji: '🔒'
    },
    pattern_matching: {
        id: 'pattern_matching',
        name: 'Pattern Matching',
        type: 'java',
        damage: 15,
        description: 'Attaque multiple — touche les faiblesses structurelles',
        emoji: '🎯'
    },

    // Platform Engineer skills
    kubernetes_rolling: {
        id: 'kubernetes_rolling',
        name: 'K8s Rolling Update',
        type: 'platform',
        damage: 10,
        heal: 5,
        description: 'Régénération progressive : inflige des dégâts ET récupère 5 HP',
        emoji: '⚙️'
    },
    opentelemetry_trace: {
        id: 'opentelemetry_trace',
        name: 'OpenTelemetry Trace',
        type: 'platform',
        damage: 8,
        expose: true,
        description: 'Révèle les faiblesses cachées (+20% dégâts prochain tour)',
        emoji: '🔭'
    },
    gitops_push: {
        id: 'gitops_push',
        name: 'GitOps Push Force',
        type: 'platform',
        damage: 18,
        description: 'Attaque dévastatrice — force le déploiement en prod',
        emoji: '🚀'
    },

    // IA Engineer skills
    rag_pipeline: {
        id: 'rag_pipeline',
        name: 'RAG Pipeline',
        type: 'ia',
        damage: 14,
        expose: true,
        description: 'Recherche la vulnérabilité exacte — +20% dégâts suivants',
        emoji: '🤖'
    },
    fine_tune: {
        id: 'fine_tune',
        name: 'Fine-tune Ciblé',
        type: 'ia',
        damage: 10,
        boost: true,
        description: 'Augmente les dégâts de 30% pour les 2 prochaines attaques',
        emoji: '🎛️'
    },
    prompt_injection: {
        id: 'prompt_injection',
        name: 'Prompt Injection',
        type: 'ia',
        damage: 20,
        description: 'Retourne une attaque ennemie contre lui-même — dégâts massifs',
        emoji: '💉'
    }
};
