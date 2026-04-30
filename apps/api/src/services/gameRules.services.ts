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

	const anyPass = scores.some((s) => s.details?.paso);
	const sombreroIndex = (match.currentDealerIndex + 1) % match.players.length;
	const sombreroPlayer = match.players[sombreroIndex];

	scores.forEach((s) => {
		const player = match.players.find((p: any) => p.name === s.playerName);
		if (!player || player.name === sombreroPlayer.name) return;

		const bazas = s.details?.bazas || 0;
		const paso = s.details?.paso || false;

		let roundPoints = paso
			? player.score <= 5
				? 1
				: 0
			: bazas === 0
				? 5
				: -bazas;

		s.pointsAdded = roundPoints;
		player.score += roundPoints;

		if (player.score <= 0) player.score = 0;

		// Regla de Oro: 5 bazas y los demás 0
		if (bazas === 5 && !anyPass) {
			instantWinner = s.playerName;
			player.score = 0;
		}
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

			s.pointsAdded = totalRonda;
			player.score += totalRonda;
		}
	});
};

// Lógica para procesar puntos de equipo (Truco, Burako, etc.)
export const processTeamRules = (match: any, scores: RoundScoreDetail[]) => {
	// procesar las reglas específicas de cada juego (Burako o Truco)
	if (match.gameType === 'Burako') {
		processBurakoRules(match, scores);
		return; // processBurakoRules ya actualiza los scores individuales
	}

	// Si es un juego de equipo genérico (como Truco o Burako ya procesado),
	// nos aseguramos de que el total del equipo sea consistente.
	const teams = ['A', 'B'];

	teams.forEach((teamId) => {
		// Obtener los nombres de los jugadores de este equipo
		const teamPlayersNames = match.players
			.filter((p: any) => p.team === teamId)
			.map((p: any) => p.name);

		// Sumar cuánto hizo el equipo en esta ronda
		const teamRoundTotal = scores
			.filter((s) => teamPlayersNames.includes(s.playerName))
			.reduce((acc, s) => acc + (s.pointsAdded || 0), 0);

		// Opcional: Podrías guardar este total en un campo match.teamScores
		// o simplemente dejar que la UI lo sume al leer los jugadores.
	});
};
