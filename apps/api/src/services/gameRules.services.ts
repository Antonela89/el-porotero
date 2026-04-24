import { RoundScoreDetail } from '@el-porotero/shared';

export const processLobaRules = (
	players: any[],
	scores: RoundScoreDetail[],
) => {
	scores.forEach((s) => {
		const player = players.find((p) => p.name === s.playerName);
		if (player) {
			// Aplicar puntos base
			let pointsToApply = s.pointsAdded;

			// Regla especial: Corte con -10
			if (s.details?.isCorteMinus10) {
				pointsToApply -= 10;
			}

			player.score += pointsToApply;

			// Lógica de eliminación (101)
			if (player.score > 101) {
				player.isOut = true;
			}
		}
	});

	// Lógica de "Colarse" (Re-enganche):
	// Si alguien se pasó, pero hay otros vivos, podría re-engancharse
	// con el puntaje del que va más alto (esto se suele disparar por una acción del usuario)
};

export const processMoscaRules = (
	players: any[],
	scores: RoundScoreDetail[],
) => {
	let instantWinner = null;

	scores.forEach((s) => {
		const player = players.find((p) => p.name === s.playerName);
		if (player) {
			const bazas = s.details?.bazas || 0;
			const paso = s.details?.paso || false;

			// Regla de Oro: 5 bazas y los demás 0 = GANA PARTIDO
			if (bazas === 5) {
				const othersHaveZero = scores.every(
					(other) =>
						other.playerName === s.playerName ||
						(other.details?.bazas || 0) === 0,
				);
				if (othersHaveZero) instantWinner = s.playerName;
			}

			// Cálculo de puntos (Mosca arranca en 15 y resta)
			if (paso) {
				if (player.score <= 5) player.score += 1; // Si tiene 5 o menos y pasa, suma 1
			} else {
				if (bazas === 0) {
					player.score += 5; // Penalización por no hacer bazas
				} else {
					player.score -= bazas; // Resta cantidad de bazas
				}
			}

			if (player.score <= 0) player.score = 0; // Victoria normal
		}
	});

	return instantWinner;
};

export const processEscobaRules = (
	players: any[],
	scores: RoundScoreDetail[],
) => {
	// Aquí sumarías los puntos de la mesa + escobas + velos
	// La Escoba es por equipos usualmente, así que sumarías al equipo A o B
};
