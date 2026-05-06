export const TRUCO_ACTIONS = {
	envido: [
		{ id: 'envido', label: 'Envido', q: 2, nq: 1 },
		{ id: 'envido-envido', label: 'Envido-Envido',  q: 2, nq: 1 },
		{ id: 'real-envido', label: 'Real Envido', q: 3, nq: 1 },
		{
			id: 'falta-envido',
			label: 'Falta Envido',
			q: 'Falta',
			nq: 1,
		},
	],
	truco: [
		{ id: 'truco', label: 'Truco', q: 2, nq: 1 },
		{ id: 'retruco', label: 'Retruco', q: 3, nq: 2 },
		{ id: 'vale-cuatro', label: 'Vale Cuatro', q: 4, nq: 3 },
	],
};
