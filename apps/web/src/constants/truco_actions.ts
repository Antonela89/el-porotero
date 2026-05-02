export const TRUCO_ACTIONS = {
    envido: [
        { label: 'Envido', q: 2, nq: 1 },
        { label: 'Envido-Envido', q: 4, nq: 2 },
        { label: 'Real Envido', q: 3, nq: 1 },
        { label: 'Falta Envido', q: 'Falta', nq: 1 }, // 'Falta' se calculará en el hook
    ],
    truco: [
        { label: 'Truco', q: 2, nq: 1 },
        { label: 'Retruco', q: 3, nq: 2 },
        { label: 'Vale Cuatro', q: 4, nq: 3 },
    ],
    flor: [
        { label: 'Flor', q: 3, nq: 1 },
        { label: 'Contra-Flor', q: 6, nq: 3 },
    ]
};