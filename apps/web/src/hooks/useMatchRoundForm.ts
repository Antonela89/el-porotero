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

	// FUNCIÓN DE LIMPIEZA INICIAL
	const getInitialScores = useCallback((): IRoundScore[] => {
		if (isEditMode && roundToEdit) {
			const roundData = match.rounds.find(
				(r) => r.roundNumber === roundToEdit,
			);
			return roundData
				? JSON.parse(JSON.stringify(roundData.scores))
				: [];
		}

		// MODO NUEVA RONDA: Recuperamos los cantos de la mesa
		return match.players.map((p) => {
			const playerTempCanto = match.tempCantos?.find(
				(c) => c.playerName === p.name,
			);

			return {
				playerName: p.name,
				pointsAdded: 0,
				details: {
					bazas: 0,
					paso: false,
					isCerrar: false,
					isCorteMinus10: false,
					tomoMuerto: false,
					escobas: 0,
					hasOros: false,
					hasCartas: false,
					hasSetenta: false,
					hasVeloAs: false,
					hasVelo7: false,
					hasVelo12: false,
					cantos: playerTempCanto ? playerTempCanto.points : 0,
				},
			};
		});
	}, [match, isEditMode, roundToEdit]);

	const [scores, setScores] = useState<IRoundScore[]>(getInitialScores);

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

	const updateScoreWithExclusivity = useCallback(
		(index: number, payload: Partial<IRoundScore & IRoundDetails>) => {
			const keys = Object.keys(payload) as (keyof IRoundDetails)[];
			const key = keys[0];
			const value = payload[key];

			const EXCLUSIVE_KEYS: (keyof IRoundDetails)[] = [
				'hasOros',
				'hasCartas',
				'hasSetenta',
				'hasVeloAs',
				'hasVelo7',
				'hasVelo12',
			];

			setScores((prev) => {
				const next = prev.map((s) => ({
					...s,
					details: { ...s.details },
				}));

				// Si es un punto exclusivo y lo estamos activando (true)
				if (EXCLUSIVE_KEYS.includes(key) && value === true) {
					// Limpiamos ese punto de TODOS los jugadores
					next.forEach((s, i) => {
						if (i !== index) {
							const d = s.details as Record<string, unknown>;

							EXCLUSIVE_KEYS.forEach((k) => {
								d[k as string] = false;
							});
						}
					});
				}

				// Aplicamos el cambio al jugador/equipo actual
				// Si es juego por equipos, se lo aplicamos a todo el bando
				const currentPlayer = match.players[index];
				next.forEach((s, i) => {
					if (
						match.isTeamGame &&
						match.players[i].team === currentPlayer.team &&
						currentPlayer.team !== 'None'
					) {
						s.details = { ...s.details, ...payload };
					} else if (i === index) {
						s.details = { ...s.details, ...payload };
					}
				});

				return next;
			});
		},
		[match.players, match.isTeamGame],
	);

	const handleTeamUpdate = useCallback(
		(teamId: string, payload: Partial<IRoundDetails>) => {
			const key = Object.keys(payload)[0] as keyof IRoundDetails;
			const value = payload[key];

			setScores((prev) => {
				const next = prev.map((s) => ({
					...s,
					details: { ...s.details },
				}));

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
					next.forEach((s) => {
						// Usamos el casteo unknown para que TS no chille con las props numéricas
						(s.details as Record<string, unknown>)[key as string] =
							false;
					});
				}

				return next.map((s) => {
					const p = match.players.find(
						(player) => player.name === s.playerName,
					);

					if (p?.team === teamId) {
						return {
							...s,
							details: { ...s.details, ...payload },
						};
					}
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
						(s: IRoundScore) =>
							s.details[k as keyof IRoundDetails] === true,
					),
				);
			default:
				return true;
		}
	})();

	return {
		scores,
		updateScore,
		updateScoreWithExclusivity,
		isFormValid,
		sombreroIndex,
		handleTeamUpdate,
	};
};
