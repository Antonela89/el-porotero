import { IMatch, IRoundScore } from '@el-porotero/shared';

export const useMoscaLogic = (match: IMatch) => {
	// Identificar al Sombrero
	// Regla: Si son 5, el sombrero es el jugador a la derecha del repartidor (dealerIndex + 1)
	const getSombreroIndex = () => {
		if (match.players.length < 5) return -1;
		return (match.currentDealerIndex + 1) % match.players.length;
	};

	const sombreroIndex = getSombreroIndex();

	// Validar la Ronda
	const validateRound = (currentScores: IRoundScore[]) => {
		// Filtrar al sombrero porque no juega
		const activeScores = currentScores.filter(
			(_, idx) => idx !== sombreroIndex,
		);

		const totalBazas = activeScores.reduce(
			(acc, s) => acc + (s.details.bazas || 0),
			0,
		);
		const someOnePassed = activeScores.some((s) => s.details.paso);

		// Regla de Oro: La suma de bazas debe ser 5
		const isBazasCountValid = totalBazas === 5;

		return {
			isValid: isBazasCountValid,
			totalBazas,
			someOnePassed,
		};
	};

	// Chequear Ganador Instantáneo (Muerte Súbita)
	// 5 bazas para uno, 0 para el resto Y NADIE PASÓ
	const checkInstantWinner = (currentScores: IRoundScore[]) => {
		const activeScores = currentScores.filter(
			(_, idx) => idx !== sombreroIndex,
		);

		const winnerCandidate = activeScores.find((s) => s.details.bazas === 5);
		const anyPass = activeScores.some((s) => s.details.paso);

		if (winnerCandidate && !anyPass) {
			// Si hay uno con 5 y nadie pasó, los demás por lógica tienen 0 (ya validado en el total de 5)
			return winnerCandidate.playerName;
		}

		return null;
	};

	return {
		sombreroIndex,
		sombreroPlayerName:
			sombreroIndex !== -1 ? match.players[sombreroIndex].name : null,
		validateRound,
		checkInstantWinner,
	};
};
