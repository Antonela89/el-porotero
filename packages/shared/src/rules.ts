// packages/shared/rules.ts
import { IRoundScore, IRoundDetails } from './types.js';

export const EXCLUSIVE_KEYS: (keyof IRoundDetails)[] = [
	'hasOros',
	'hasCartas',
	'hasSetenta',
	'hasVeloAs',
	'hasVelo7',
	'hasVelo12',
	'isCerrar',
	'isCorteMinus10',
];

/**
 * Aplica la lógica de exclusividad: si un jugador activa un punto único,
 * se le quita automáticamente a los demás.
 */
export const applyExclusivity = (
	scores: IRoundScore[],
	targetIndex: number,
	key: keyof IRoundDetails,
	newValue: boolean,
): IRoundScore[] => {
	return scores.map((s, idx) => {
		const isTarget = idx === targetIndex;
		const currentDetails = s.details || {};

		return {
			...s,
			details: {
				...currentDetails,
				// Si es el jugador que clickeó, actualizamos el valor
				// Si es otro y el valor es true, se lo ponemos en false
				[key]: isTarget
					? newValue
					: newValue
						? false
						: currentDetails[key],
			},
		};
	});
};
