export const TRUCO_ACTIONS = {
	envido: [
		{ id: 'envido', label: 'Envido', level: 1, q: 2, nq: 1 },
		{ id: 'envido-envido', label: 'Envido-Envido', level: 2, q: 2, nq: 1 },
		{ id: 'real-envido', label: 'Real Envido', level: 3, q: 3, nq: 1 },
		{
			id: 'falta-envido',
			label: 'Falta Envido',
			level: 4,
			q: 'Falta',
			nq: 1,
		},
	],
	truco: [
		{ id: 'truco', label: 'Truco', level: 1, q: 2, nq: 1 },
		{ id: 'retruco', label: 'Retruco', level: 2, q: 3, nq: 2 },
		{ id: 'vale-cuatro', label: 'Vale Cuatro', level: 3, q: 4, nq: 3 },
	],
};
