import { IMatch, IRoundScore } from '@el-porotero/shared';

export const useLobaLogic = (match: IMatch) => {
	// Validar que solo uno haya cerrado (0 o -10)
	const validateRound = (scores: IRoundScore[]) => {
		const closers = scores.filter(
			(s) => s.details?.isCerrar || s.details?.isCorteMinus10,
		);

		return {
			isValid: closers.length === 1,
			error:
				closers.length > 1
					? 'Solo un jugador puede cerrar por ronda'
					: closers.length === 0
						? 'Alguien debe cerrar la ronda'
						: null,
		};
	};

	// Calcular el puntaje para el re-enganche
	// Se busca el puntaje más alto entre los que NO están fuera
	const getReengageScore = () => {
		const activePlayers = match.players.filter((p) => !p.isOut);
		if (activePlayers.length === 0) return 0;
		return Math.max(...activePlayers.map((p) => p.score));
	};

	return { validateRound, getReengageScore };
};
