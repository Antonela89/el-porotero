import { useState, useCallback } from 'react';
import {
	IMatch,
	IRoundScore,
	IRoundDetails,
	applyExclusivity,
} from '@el-porotero/shared';
import { useMoscaLogic } from './useMoscaLogic';

export const useMatchRoundForm = (
	match: IMatch,
	roundToEdit?: number | null,
) => {
	const isEditMode = !!roundToEdit;
	const { validateRound, sombreroIndex } = useMoscaLogic(match);

	const [scores, setScores] = useState<IRoundScore[]>(() => {
		if (isEditMode) {
			const roundData = match.rounds.find(
				(r) => r.roundNumber === roundToEdit,
			);
			return roundData
				? JSON.parse(JSON.stringify(roundData.scores))
				: [];
		}
		return match.players.map((p) => ({
			playerName: p.name,
			pointsAdded: 0,
			details: {
				bazas: 0,
				paso: false,
				isCerrar: false,
				isCorteMinus10: false,
				tomoMuerto: true,
			},
		}));
	});

	const updateScore = useCallback(
		(index: number, payload: Partial<IRoundScore & IRoundDetails>) => {
			setScores((prev) => {
				let next = [...prev];
				const { pointsAdded, ...restPayload } = payload;
				const EXCLUSIVE_KEYS = [
					'isCerrar',
					'isCorteMinus10',
					'hizoBatida',
					'hasOros',
					'hasCartas',
					'hasSetenta',
					'hasVeloAs',
					'hasVelo7',
					'hasVelo12',
				];

				const keyFound = Object.keys(restPayload).find((k) =>
					EXCLUSIVE_KEYS.includes(k),
				) as keyof IRoundDetails | undefined;

				if (keyFound && restPayload[keyFound] === true) {
					next = applyExclusivity(next, index, keyFound, true);
					if (['Loba', 'Chinchon'].includes(match.gameType)) {
						if (keyFound === 'isCerrar')
							next[index].pointsAdded = 0;
						if (keyFound === 'isCorteMinus10')
							next[index].pointsAdded = -10;
					}
				} else {
					next[index] = {
						...next[index],
						details: { ...next[index].details, ...restPayload },
					};
					if (
						keyFound &&
						['isCerrar', 'isCorteMinus10'].includes(keyFound)
					)
						next[index].pointsAdded = 0;
				}

				if ('pointsAdded' in payload)
					next[index].pointsAdded = pointsAdded as number;

				// Recalculo de Velos
				if (['Escoba', 'Barsiga'].includes(match.gameType)) {
					const d = next[index].details;
					next[index].details.velos =
						(d.hasVeloAs ? 1 : 0) +
						(d.hasVelo7 ? 1 : 0) +
						(d.hasVelo12 ? 1 : 0);
				}
				return next;
			});
		},
		[match.gameType],
	);

	// Validaciones
	const isFormValid = (() => {
		const anyoneClosed = scores.some(
			(s) => s.details?.isCerrar || s.details?.isCorteMinus10,
		);
		switch (match.gameType) {
			case 'Mosca':
				return validateRound(scores).isValid;
			case 'Loba':
			case 'Chinchon':
				return (
					scores.filter(
						(s) => s.details?.isCerrar || s.details?.isCorteMinus10,
					).length === 1 &&
					scores.every(
						(s) =>
							s.details?.isCerrar ||
							s.details?.isCorteMinus10 ||
							s.pointsAdded > 0 ||
							match.players.find((p) => p.name === s.playerName)
								?.isOut,
					)
				);
			case 'Burako':
				return anyoneClosed;
			case 'Escoba':
			case 'Barsiga':
				return ['hasVeloAs', 'hasVelo7', 'hasVelo12'].every(
					(k) =>
						scores.filter(
							(s) => s.details[k as keyof IRoundDetails],
						).length === 1,
				);
			default:
				return true;
		}
	})();

	return { scores, updateScore, isFormValid, sombreroIndex };
};
