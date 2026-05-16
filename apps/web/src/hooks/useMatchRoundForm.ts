import { useState, useCallback } from 'react';
import {
	IMatch,
	IRoundScore,
	IRoundDetails,
	IPlayer,
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
				const next = [...prev];
				const { pointsAdded, ...details } = payload;

				if ('pointsAdded' in payload)
					next[index].pointsAdded = pointsAdded as number;

				next[index].details = { ...next[index].details, ...details };

				// Recalculo automático de velos si aplica
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

	const handleTeamUpdate = useCallback(
		(teamId: string, payload: Partial<IRoundDetails>) => {
			const key = Object.keys(payload)[0] as keyof IRoundDetails;
			const value = payload[key];

			setScores((prev) => {
				let next = [...prev];
				const EXCLUSIVE_KEYS = [
					'hasOros',
					'hasCartas',
					'hasSetenta',
					'hasVeloAs',
					'hasVelo7',
					'hasVelo12',
					'isCerrar',
				];

				if (EXCLUSIVE_KEYS.includes(key) && value === true) {
					next = next.map((s) => ({
						...s,
						details: { ...s.details, [key]: false },
					}));
					return next.map((s) => {
						const p = match.players.find(
							(player) => player.name === s.playerName,
						);
						if (p?.team === teamId)
							return {
								...s,
								details: { ...s.details, [key]: true },
							};
						return s;
					});
				}

				return next.map((s) => {
					const p = match.players.find(
						(player) => player.name === s.playerName,
					);
					if (p?.team === teamId)
						return { ...s, details: { ...s.details, ...payload } };
					return s;
				});
			});
		},
		[match.players],
	);

	// --- VALIDACIONES (Dentro de la función) ---
	const isFormValid = (() => {
		const anyoneClosed = scores.some(
			(s: IRoundScore) =>
				s.details?.isCerrar || s.details?.isCorteMinus10,
		);
		switch (match.gameType) {
			case 'Mosca':
				return validateRound(scores).isValid;
			case 'Loba':
			case 'Chinchon':
				return (
					scores.filter(
						(s: IRoundScore) =>
							s.details?.isCerrar || s.details?.isCorteMinus10,
					).length === 1 &&
					scores.every(
						(s: IRoundScore) =>
							s.details?.isCerrar ||
							s.details?.isCorteMinus10 ||
							s.pointsAdded > 0 ||
							match.players.find(
								(p: IPlayer) => p.name === s.playerName,
							)?.isOut,
					)
				);
			case 'Burako':
				return anyoneClosed;
			case 'Escoba':
			case 'Barsiga':
				return ['hasVeloAs', 'hasVelo7', 'hasVelo12'].every((k) =>
					scores.some(
						(s: IRoundScore) => s.details[k as keyof IRoundDetails],
					),
				);
			default:
				return true;
		}
	})();

	return {
		scores,
		updateScore,
		isFormValid,
		sombreroIndex,
		handleTeamUpdate,
	};
};
