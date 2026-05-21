import { Request, Response } from 'express';
import { MatchModel } from '@/models/index.js';
import * as GameRules from '@/services/gameRules.services.js';

// Funciones  Auxiliares
// Función que busca el índice del próximo jugador que no esté "isOut"
const getNextActiveDealerIndex = (
	players: any[],
	currentIndex: number,
): number => {
	let nextIndex = (currentIndex + 1) % players.length;

	// Recorremos la mesa buscando al próximo vivo
	for (let i = 0; i < players.length; i++) {
		if (!players[nextIndex].isOut) {
			return nextIndex;
		}
		// Si el jugador está fuera, probamos con el siguiente
		nextIndex = (nextIndex + 1) % players.length;
	}

	return currentIndex;
};

// Función Universal de Detección de Ganador
const determineWinner = (
	match: any,
): { status: 'active' | 'finished' | 'cancelled'; winner: string | null } => {
	const { gameType, players, config, isTeamGame } = match;
	const limit = config.limitScore;

	if (isTeamGame || gameType === 'Truco') {
		const totalA = players
			.filter((p: any) => p.team === 'A')
			.reduce((acc: number, p: any) => acc + p.score, 0);
		const totalB = players
			.filter((p: any) => p.team === 'B')
			.reduce((acc: number, p: any) => acc + p.score, 0);

		if (totalA >= limit) return { status: 'finished', winner: 'A' };
		if (totalB >= limit) return { status: 'finished', winner: 'B' };
	} else {
		if (config.isDescending) {
			const winner = players.find((p: any) => p.score === 0);
			if (winner) return { status: 'finished', winner: winner.name };
		} else if (['Uno', 'Loba', 'Chinchon'].includes(gameType)) {
			const playersAlive = players.filter((p: any) => !p.isOut);
			if (playersAlive.length === 1)
				return { status: 'finished', winner: playersAlive[0].name };
		} else {
			const winner = players.find((p: any) => p.score >= limit);
			if (winner) return { status: 'finished', winner: winner.name };
		}
	}
	return { status: 'active', winner: null };
};

// Función para recalcular puntajes
const recalculateMatchScores = (match: any) => {
	// Resetear a todos los jugadores al estado inicial
	match.players.forEach((p: any) => {
		p.score = match.config.startingScore;
		p.isOut = false;
		p.reengageCount = 0;
	});

	// Volver a procesar cada ronda guardada en el historial
	match.rounds.forEach((round: any) => {
		round.scores.forEach((roundScore: any) => {
			const player = match.players.find(
				(p: any) => p.name === roundScore.playerName,
			);
			if (player) {
				if (roundScore.details?.isReengage) {
					player.score = roundScore.pointsAdded; // Asignamos el valor que se le dio al volver
					player.reengageCount += 1; // Sumamos el asterisco
					player.isOut = false; // Aseguramos que esté vivo
				} else {
					// Aplicar lógica según el tipo de juego
					if (match.config.isDescending) {
						player.score -= roundScore.pointsAdded;
					} else {
						// En Loba/Chinchón, el pointsAdded ya viene con el -10 si se cortó
						player.score += roundScore.pointsAdded;
					}
				}

				// Verificar si quedó fuera
				if (
					match.config.limitScore &&
					player.score >= match.config.limitScore
				) {
					player.isOut = true;
				}
			}
		});
	});

	// Verificar si hay un ganador final
	const result = determineWinner(match);
	match.status = result.status;
	match.winner = result.winner;
};

// Agregar una ronda a una partida existente
export const addRound = async (req: Request, res: Response) => {
	try {
		const { matchId } = req.params;
		const { scores } = req.body;

		const match = await MatchModel.findById(matchId);
		if (!match) {
			return res.status(404).json({ message: 'Partida no encontrada' });
		}

		let instantWinner: string | null = null;

		switch (match.gameType) {
			case 'Loba':
			case 'Chinchon':
			case 'Uno':
				GameRules.processAccumulativeRules(match as any, scores);
				break;
			case 'Mosca':
				instantWinner = GameRules.processMoscaRules(
					match as any,
					scores,
				);
				break;
			case 'Escoba':
			case 'Barsiga':
				GameRules.processEscobaRules(match as any, scores);
				break;
			case 'Burako':
			case 'Truco':
				GameRules.processTeamRules(match as any, scores);
				break;
		}

		match.rounds.push({
			roundNumber: match.rounds.length + 1,
			dealerIndex: match.currentDealerIndex,
			scores,
			timestamp: new Date(),
		});

		const result = determineWinner(match);
		match.status = result.status;
		match.winner = result.winner as 'active' | 'finished' | 'cancelled';

		// Iteramos con seguridad
		for (const s of scores) {
			const player = match.players.find((p) => p.name === s.playerName);

			if (!player) {
				return res.status(400).json({
					message: `El jugador ${s.playerName} no pertenece a esta mesa.`,
				});
			}
		}

		// Rotar el repartidor (Dealer)
		match.currentDealerIndex = getNextActiveDealerIndex(
			match.players,
			match.currentDealerIndex,
		);
		match.tempCantos = [];

		await match.save();
		res.json(match);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error('ERROR CRÍTICO EN ADDROUND:', error);
			res.status(500).json({
				message: 'Error al anotar ronda',
				error: error.message,
				stack: error.stack, // Opcional para ver dónde falló exacto
			});
		}
	}
};

export const reengagePlayer = async (req: Request, res: Response) => {
	try {
		const { matchId } = req.params;
		const { playerName } = req.body;

		const match = await MatchModel.findById(matchId);
		if (!match)
			return res.status(404).json({ message: 'Partida no encontrada' });

		// Encontrar el puntaje más alto entre los que están activos
		const activePlayers = match.players.filter((p) => !p.isOut);
		const maxScore =
			activePlayers.length > 0
				? Math.max(...activePlayers.map((p) => p.score))
				: match.config.startingScore;

		// Actualizar al jugador
		const player = match.players.find((p) => p.name === playerName);
		if (player) {
			player.score = maxScore;
			player.isOut = false;
			player.reengageCount = (player.reengageCount || 0) + 1;

			// Marcar la ÚLTIMA ronda para que el asterisco aparezca ahí
			if (match.rounds.length > 0) {
				const lastRound = match.rounds[match.rounds.length - 1];
				const playerRoundScore = lastRound.scores.find(
					(s: any) => s.playerName === playerName,
				);
				if (playerRoundScore) {
					playerRoundScore.details = {
						...playerRoundScore.details,
						isReengage: true,
					};
				}
			}
		}

		await match.save();
		res.json(match);
	} catch (error) {
		res.status(500).json({ message: 'Error al re-enganchar' });
	}
};

// Editar una ronda existente (corregir puntos ingresados)
export const updateRound = async (req: Request, res: Response) => {
	try {
		const roundNumberStr = req.params.roundNumber as string;
		const { matchId } = req.params;
		const { scores: newScores } = req.body; // Los nuevos puntos corregidos

		const match = await MatchModel.findById(matchId);
		if (!match)
			return res.status(404).json({ message: 'Partida no encontrada' });

		// Encontrar la ronda a editar
		const roundIndex = match.rounds.findIndex(
			(r) => r.roundNumber === parseInt(roundNumberStr, 10),
		);
		if (roundIndex === -1)
			return res.status(404).json({ message: 'Ronda no encontrada' });

		// Actualizar los datos de esa ronda
		match.rounds[roundIndex].scores = newScores;

		// RE-CALCULAR TODO DESDE CERO
		recalculateMatchScores(match);

		await match.save();
		res.json({
			message: 'Ronda actualizada y puntajes recalculados',
			match,
		});
	} catch (error: any) {
		res.status(500).json({
			message: 'Error al actualizar la ronda',
			error: error.message,
		});
	}
};

// Eliminar una ronda específica de la partida
export const deleteRound = async (req: Request, res: Response) => {
	try {
		const { matchId } = req.params;
		const roundNumberStr = req.params.roundNumber as string;
		const roundToDelete = parseInt(roundNumberStr, 10);
		const match = await MatchModel.findById(matchId);

		if (!match)
			return res.status(404).json({ message: 'Partida no encontrada' });

		// determinar si es ultima ronda
		const isLastRound = match.rounds.length === roundToDelete;

		// si lo es, volver el dealer a la posición anterior
		if (isLastRound) {
			const lastRoundData = match.rounds[match.rounds.length - 1];

			match.currentDealerIndex = lastRoundData.dealerIndex;
		}

		// Quitar la ronda del array
		match.rounds = match.rounds.filter(
			(r) => r.roundNumber !== roundToDelete,
		);

		match.rounds.forEach((r, i) => (r.roundNumber = i + 1));

		// RE-CALCULAR TODO DESDE CERO
		recalculateMatchScores(match);

		await match.save();
		res.json(match);
	} catch (error) {
		res.status(500).json({ message: 'Error al borrar ronda' });
	}
};

export const addCanto = async (req: Request, res: Response) => {
	try {
		const { matchId } = req.params;
		const { playerName, points } = req.body;

		const match = await MatchModel.findById(matchId);
		if (!match)
			return res.status(404).json({ message: 'Partida no encontrada' });

		match.tempCantos.push({ playerName, points });

		await match.save();
		res.json(match);
	} catch (error) {
		res.status(500).json({ message: 'Error al registrar canto' });
	}
};
