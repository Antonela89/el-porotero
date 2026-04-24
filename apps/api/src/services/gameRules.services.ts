import { RoundScoreDetail } from '@el-porotero/shared';

// Lógica para juegos de sumar puntos (Loba, Chinchón, etc.)
export const processAccumulativeRules = (
	match: any,
	scores: RoundScoreDetail[],
) => {
	const limit = match.config.limitScore || 101; // Usamos el límite de la config

	scores.forEach((s) => {
		const player = match.players.find((p: any) => p.name === s.playerName);
		if (player && !player.isOut) {
			if (s.details?.isCerrar) {
				player.score += 0;
			} else if (s.details?.isCorteMinus10) {
				player.score -= 10;
			} else {
				player.score += s.pointsAdded;
			}

			// Verificación de eliminación dinámica
			if (player.score >= limit) {
				player.isOut = true;
			}
		}
	});
};

// Lógica para la Mosca (Juego descendente)
export const processMoscaRules = (match: any, scores: RoundScoreDetail[]) => {
	let instantWinner = null;

	const totalBazas = scores.reduce(
		(acc, s) => acc + (s.details?.bazas || 0),
		0,
	);

	if (totalBazas !== 5) {
		throw new Error(
			'La sumatoria de bazas en la Mosca debe ser exactamente 5.',
		);
	}

	const totalPlayers = match.players.length;
	console.log(totalPlayers);

	const sombreroIndex = (match.currentDealerIndex + 1) % match.players.length;
	const sombreroPlayer = match.players[sombreroIndex];

	scores.forEach((s) => {
		const player = match.players.find((p: any) => p.name === s.playerName);
		if (!player) return;

		if (player.name === sombreroPlayer.name) {
			return;
		}

		const bazas = s.details?.bazas || 0;
		const paso = s.details?.paso || false;

		// Regla de Oro: 5 bazas y los demás 0
		if (bazas === 5) {
			const othersHaveZero = scores.every(
				(other) =>
					other.playerName === s.playerName ||
					(other.details?.bazas || 0) === 0,
			);
			if (othersHaveZero) instantWinner = s.playerName;
		}

		// Aplicación de puntos según reglas de la Mosca
		if (paso) {
			// Penalización por pasar con 5 o menos
			if (player.score <= 5) player.score += 1;
		} else {
			if (bazas === 0) {
				player.score += 5; // Castigo por no hacer bazas
			} else {
				player.score -= bazas; // Resta cantidad de bazas (Descendente)
			}
		}

		if (player.score <= 0) player.score = 0;
	});

	return instantWinner;
};

// Lógica para Escoba (Basada en objetivos)
export const processEscobaRules = (match: any, scores: RoundScoreDetail[]) => {
	scores.forEach((s) => {
		const player = match.players.find((p: any) => p.name === s.playerName);
		if (player) {
			// Puntos Base
			let roundTotal = s.pointsAdded;

			// Bonus - al final de la partida
			if (s.details) {
				if (s.details.escobas) roundTotal += s.details.escobas;
				if (s.details.velos) roundTotal += s.details.velos; // 1 punto por cada velo
				if (s.details.hasSetenta) roundTotal += 1;
				if (s.details.hasOros) roundTotal += 1;
				if (s.details.hasCartas) roundTotal += 1;
			}
			if (match.gameType === 'Barsiga' && s.details?.cantos) {
				roundTotal += s.details.cantos;
			}

			player.score += roundTotal;
		}
	});
};

export const processBurakoRules = (match: any, scores: RoundScoreDetail[]) => {
	scores.forEach((s) => {
		const player = match.players.find((p: any) => p.name === s.playerName);
		if (player) {
			let totalRonda = s.pointsAdded; // Suma de los valores de las fichas

			if (s.details) {
				if (s.details.canastasPuras)
					totalRonda += s.details.canastasPuras * 200;
				if (s.details.canastasImpuras)
					totalRonda += s.details.canastasImpuras * 100;
				if (s.details.cierre) totalRonda += 100;

				// Regla del Muerto: si no lo tomó, resta 100
				if (s.details.tomoMuerto === false) {
					totalRonda -= 100;
				}
			}

			player.score += totalRonda;
		}
	});
};
