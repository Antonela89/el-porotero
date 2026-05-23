import { useMemo } from 'react';
import { IMatch } from '@el-porotero/shared';

export const useTrucoLogic = (match: IMatch | null) => {
	// Determinar el límite según cantidad de jugadores (Memoizado)
	const limit = useMemo(() => {
		if (!match) return 30;
		const count = match.players.length;
		if (count <= 2) return 18; // 9 y 9
		if (count <= 4) return 24; // 12 y 12
		return 30; // 15 y 15
	}, [match]);

	const halfLimit = limit / 2;

	// Cálculos de puntajes por equipo
	const { totalA, totalB, maxScore } = useMemo(() => {
		if (!match) return { totalA: 0, totalB: 0, maxScore: 0 };

		const a = match.players
			.filter((p) => p.team === 'A')
			.reduce((acc, p) => acc + p.score, 0);

		const b = match.players
			.filter((p) => p.team === 'B')
			.reduce((acc, p) => acc + p.score, 0);

		return { totalA: a, totalB: b, maxScore: Math.max(a, b) };
	}, [match]);

	// Determinar el modo de juego (Redonda vs Punta y Hacha)
	const currentMode = useMemo(() => {
		if (!match || match.players.length !== 6) return 'Redonda';

		const limit = match.config.limitScore;
		const startPh = 6;
		const endPh = limit - 6;

		const isGameInPhRange = maxScore >= startPh && maxScore < endPh;

		if (isGameInPhRange) {
			return match.rounds.length % 2 !== 0 ? 'Punta y Hacha' : 'Redonda';
		}

		return 'Redonda';

	}, [match, maxScore]);

	// Definir parejas para Punta y Hacha (Memoizado)
	// Intercalado 1-3-5 (A) vs 2-4-6 (B) => Indices 0 vs 3, 1 vs 4, 2 vs 5
	const phMatchups = useMemo(() => {
		if (!match || match.players.length < 6) return [];
		return [
			{ p1: match.players[0], p2: match.players[3] },
			{ p1: match.players[1], p2: match.players[4] },
			{ p1: match.players[2], p2: match.players[5] },
		];
	}, [match]);

	const faltaValue = useMemo(() => {
		if (!match) return 1;

		// --- LA REGLA DE ORO DEL PUNTA Y HACHA ---
		if (currentMode === 'Punta y Hacha') {
			return 6; // En P&H la falta siempre vale 6 si es querida
		}

		// En modo Redonda, sigue valiendo lo que falta para ganar
		const limit = match.config.limitScore;
		const leaderScore = Math.max(totalA, totalB);
		return Math.max(1, limit - leaderScore);
	}, [match, currentMode, totalA, totalB]);

	// Helper para el marcador visual (Malas/Buenas)
	const getStatus = (score: number) => {
		if (score <= halfLimit) return { label: 'Malas', val: score };
		return { label: 'Buenas', val: score - halfLimit };
	};

	return {
		limit,
		halfLimit,
		getStatus,
		currentMode,
		totalA,
		totalB,
		phMatchups,
		faltaValue,
	};
};
