import { IRoundScore } from '@el-porotero/shared';

/**
 * Lógica para juegos de sumar puntos: Loba, Chinchón y UNO.
 * Se basan en alcanzar un límite para quedar fuera (o terminar).
 */
export const processAccumulativeRules = (match: any, scores: IRoundScore[]) => {
	const limit = match.config.limitScore;

	scores.forEach((s) => {
		const player = match.players.find((p: any) => p.name === s.playerName);
		if (!player) return;

		// --- LÓGICA DE RE-ENGANCHE ---
		if (s.details?.isReengage) {
			player.score += s.pointsAdded;
			player.isOut = false; // Lo devolvemos al juego
			player.reengageCount = (player.reengageCount || 0) + 1;
			s.pointsAdded = player.score;
			return; // Saltamos el resto del proceso para este jugador
		}

		if (!player.isOut) {
			// Determinamos los puntos reales de esta ronda para el historial
			if (s.details?.isCerrar) {
				s.pointsAdded = 0;
			} else if (s.details?.isCorteMinus10) {
				s.pointsAdded = -10;
			}
			// Si no es cierre ni corte, usamos el valor nominal que vino del input

			player.score += s.pointsAdded;

			// Verificación de eliminación (Solo si el juego tiene límite de derrota)
			if (limit && player.score >= limit) {
				player.isOut = true;
			}
		}
	});
};

/**
 * Lógica para la Mosca (Juego descendente)
 * Objetivo: Llegar a 0. Reglas de penalización por bazas o paso.
 */
export const processMoscaRules = (match: any, scores: IRoundScore[]) => {
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
	// El sombrero es el jugador en (dealer + 1)
	const sombreroIndex = (match.currentDealerIndex + 1) % match.players.length;
	const sombreroPlayer = match.players[sombreroIndex];

	scores.forEach((s, index) => {
		const player = match.players.find((p: any) => p.name === s.playerName);
		if (!player || player.name === sombreroPlayer.name) {
			s.pointsAdded = 0; // Sombrero no suma
			return;
		}

		const bazas = s.details?.bazas || 0;
		const paso = s.details?.paso || false;
		let roundPoints = 0;

		if (paso) {
			// Penalización por pasar con 5 o menos
			roundPoints = player.score <= 5 ? 1 : 0;
		} else {
			// Penalización por no hacer bazas habiendo jugado
			roundPoints = bazas === 0 ? 5 : -bazas;
		}

		s.pointsAdded = roundPoints;
		player.score += roundPoints;

		if (player.score <= 0) player.score = 0;

		// Victoria instantánea: 5 bazas y nadie pasó
		if (bazas === 5 && !anyPass) {
			instantWinner = s.playerName;
			player.score = 0;
		}
	});

	return instantWinner;
};

/**
 * Lógica para Escoba y Bársiga
 * Basada en objetivos de mesa y cantos.
 */
export const processEscobaRules = (match: any, scores: IRoundScore[]) => {
	scores.forEach((s) => {
		const player = match.players.find((p: any) => p.name === s.playerName);
		if (!player) return;

		let roundTotal = 0;
		const d = s.details || {};

		// Puntos de mesa y Velos (1 cada uno)
		if (d.hasOros) roundTotal += 1;
		if (d.hasCartas) roundTotal += 1;
		if (d.hasSetenta) roundTotal += 1;
		if (d.hasVeloAs) roundTotal += 1;
		if (d.hasVelo7) roundTotal += 1;
		if (d.hasVelo12) roundTotal += 1;

		// Escobas (valor nominal)
		if (d.escobas) roundTotal += Number(d.escobas);

		// Cantos (Solo Bársiga)
		if (match.gameType === 'Barsiga' && d.cantos) {
			roundTotal += Number(d.cantos);
		}

		s.pointsAdded = roundTotal;
		player.score += roundTotal;
	});
};

/**
 * Lógica para Burako
 * Procesa canastas, batida y muerto.
 */
export const processBurakoRules = (match: any, scores: IRoundScore[]) => {
	scores.forEach((s) => {
		const player = match.players.find((p: any) => p.name === s.playerName);
		if (!player) return;

		if (player) {
			let fichas = s.details?.fichas ?? s.pointsAdded ?? 0; // Puntos de fichas
			let totalRonda = fichas;

			if (s.details) {
				totalRonda += (s.details.canastasPuras || 0) * 200;
				totalRonda += (s.details.canastasImpuras || 0) * 100;
				if (s.details.isCerrar) totalRonda += 100;

				const isFirstInTeam =
					match.players.find((p: any) => p.team === player.team)
						.name === player.name;

				if (!match.isTeamGame || isFirstInTeam) {
					if (s.details.tomoMuerto === false) totalRonda -= 100;
					if (s.details.tomoMuerto === true) totalRonda += 100; 
				}
			}

			s.pointsAdded = totalRonda;
			player.score += totalRonda;
		}
	});
};

/**
 * Orquestador para juegos por equipos (Truco, Burako)
 */
export const processTeamRules = (match: any, scores: IRoundScore[]) => {
	if (match.gameType === 'Burako') {
		processBurakoRules(match, scores);
		return;
	}

	// Para el Truco (puntos netos por jugador que luego se suman por equipo en el controlador)
	scores.forEach((s) => {
		const player = match.players.find((p: any) => p.name === s.playerName);
		if (player) {
			player.score += s.pointsAdded;
		}
	});
};
