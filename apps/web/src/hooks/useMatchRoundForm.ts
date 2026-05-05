import { useState, useCallback } from 'react';
import { IMatch, IRoundScore, IRoundDetails } from '@el-porotero/shared';
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
				const key = Object.keys(restPayload)[0] as keyof IRoundDetails;
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

				if (
					key &&
					EXCLUSIVE_KEYS.includes(key) &&
					restPayload[key] === true
				) {
					next = next.map((s) => ({
						...s,
						details: { ...s.details, [key]: false },
					}));
					next[index] = {
						...next[index],
						details: {
							...next[index].details,
							[key]: true,
						},
					};

					if (['Loba', 'Chinchon'].includes(match.gameType)) {
						if (key === 'isCerrar') next[index].pointsAdded = 0;
						if (key === 'isCorteMinus10')
							next[index].pointsAdded = -10;
					}
				} else {
					// Actualización normal
					next[index] = {
						...next[index],
						details: { ...next[index].details, ...restPayload },
					};
				}

				if (
					key &&
					['isCerrar', 'isCorteMinus10'].includes(key) &&
					restPayload[key] === false
				) {
					next[index].pointsAdded = 0;
				}

				if ('pointsAdded' in payload)
					next[index].pointsAdded = pointsAdded as number;

				// Recalculo automático de la cantidad de velos
				if (['Escoba', 'Barsiga'].includes(match.gameType)) {
					next = next.map((s) => ({
						...s,
						details: {
							...s.details,
							velos:
								(s.details.hasVeloAs ? 1 : 0) +
								(s.details.hasVelo7 ? 1 : 0) +
								(s.details.hasVelo12 ? 1 : 0),
						},
					}));
				}
				return next;
			});
		},
		[match.gameType],
	);

	const handleTeamUpdate = (
		teamId: string,
		payload: Partial<IRoundDetails>,
	) => {
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
				// 1. Limpiamos el punto de TODA la mesa
				next = next.map((s) => ({
					...s,
					details: { ...s.details, [key]: false },
				}));
				// 2. Se lo aplicamos a todos los del bando
				return next.map((s) => {
					const p = match.players.find(
						(player) => player.name === s.playerName,
					);
					if (p?.team === teamId)
						return { ...s, details: { ...s.details, [key]: true } };
					return s;
				});
			}

			// Si no es exclusivo, solo actualizamos al equipo
			return next.map((s) => {
				const p = match.players.find(
					(player) => player.name === s.playerName,
				);
				if (p?.team === teamId)
					return { ...s, details: { ...s.details, ...payload } };
				return s;
			});
		});
	};

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

	return { scores, updateScore, isFormValid, sombreroIndex, handleTeamUpdate };
};
