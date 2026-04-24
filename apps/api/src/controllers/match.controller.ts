import { Request, Response } from 'express';
import { MatchModel } from '@/models/Match.js';
import * as GameRules from '@/services/gameRules.services.js';
import { IMatchConfig } from '@el-porotero/shared';

export const createMatch = async (req: Request, res: Response) => {
	try {
		const { gameType, players, limitScore } = req.body;
		const adminId = req.user?.userId;

		// Lógica de configuración por defecto según el juego
		let config: IMatchConfig = {
			startingScore: 0,
			isDescending: false,
			limitScore,
		};

		if (gameType === 'Mosca') {
			config.startingScore = 15;
			config.isDescending = true;
		} else if (gameType === 'Truco') {
			config.limitScore = 30;
		} else if (gameType === 'Loba') {
			config.limitScore = limitScore || 100; // El usuario elige 100 o 101
		} else if (gameType === 'Escoba') {
			config.limitScore = 15;
		} else if (gameType === 'Barsiga') {
			config.limitScore = 61;
		} else if (gameType === 'Burako') {
			const hasTeams = players.some((p: any) => p.team !== 'None');
			config.limitScore = hasTeams ? 5000 : 3000;
		}

		const initialPlayers = players.map((p: any) => ({
			...p,
			score: config.startingScore,
			isOut: false,
		}));

		const newMatch = new MatchModel({
			gameType,
			adminId,
			config,
			players: initialPlayers,
			currentDealerIndex: 0,
		});

		await newMatch.save();
		res.status(201).json(newMatch);
	} catch (error) {
		res.status(500).json({ message: 'Error al crear partida', error });
	}
};

export const addRound = async (req: Request, res: Response) => {
	try {
		const { matchId } = req.params;
		const { scores } = req.body;

		const match = await MatchModel.findById(matchId);
		if (!match) {
			return res.status(404).json({ message: 'Partida no encontrada' });
		}

		// Iteramos con seguridad
		for (const s of scores) {
			const player = match.players.find((p) => p.name === s.playerName);

			if (!player) {
				return res.status(400).json({
					message: `El jugador ${s.playerName} no pertenece a esta mesa.`,
				});
			}
		}

		match.rounds.push({
			roundNumber: match.rounds.length + 1,
			dealerIndex: match.currentDealerIndex,
			scores,
			timestamp: new Date(),
		});

		let instantWinner = null;

		switch (match.gameType) {
			case 'Loba':
			case 'Chinchon':
				GameRules.processAccumulativeRules(match, scores);
				break;
			case 'Mosca':
				instantWinner = GameRules.processMoscaRules(match, scores);
				break;
			case 'Escoba':
			case 'Barsiga':
				GameRules.processEscobaRules(match, scores);
				break;
			case 'Burako':
				GameRules.processBurakoRules(match, scores);
				break;
		}

		// Lógica genérica de fin de juego por puntaje
		if (!instantWinner) {
			if (match.config.isDescending) {
				// Si es descendente (Mosca), gana el primero que llega a 0
				const winnerPlayer = match.players.find((p) => p.score === 0);
				if (winnerPlayer) instantWinner = winnerPlayer.name;
			} else if (match.gameType === 'Loba') {
				// Si es Loba, gana el último que queda vivo (isOut: false)
				const playersAlive = match.players.filter((p) => !p.isOut);
				if (playersAlive.length === 1)
					instantWinner = playersAlive[0].name;
			} else if (match.config.limitScore) {
				const winnerPlayer = match.players.find(
					(p) => p.score >= match.config.limitScore!,
				);
				if (winnerPlayer) {
					instantWinner = winnerPlayer.name;
				}
			}
		}

		if (instantWinner) {
			match.status = 'finished';
			match.winner = instantWinner;
		} else {
			// Verificación de victoria normal
			if (match.config.isDescending) {
				const winnerPlayer = match.players.find((p) => p.score === 0);
				if (winnerPlayer) {
					match.status = 'finished';
					match.winner = winnerPlayer.name;
				}
			} else {
				// En juegos como Loba, gana el que tiene menos puntos cuando los demás perdieron
				const playersAlive = match.players.filter((p) => !p.isOut);
				if (playersAlive.length === 1) {
					match.status = 'finished';
					match.winner = playersAlive[0].name;
				}
			}
		}

		// Rotar el repartidor (Dealer)
		match.currentDealerIndex =
			(match.currentDealerIndex + 1) % match.players.length;

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

		// RECALCULAR PUNTAJES TOTALES
		// Reseteamos a todos al puntaje inicial de la config
		match.players.forEach((p) => {
			p.score = match.config.startingScore;
			p.isOut = false;
		});

		// Sumamos (o restamos) todas las rondas de nuevo
		match.rounds.forEach((round) => {
			round.scores.forEach((s) => {
				const player = match.players.find(
					(p) => p.name === s.playerName,
				);
				if (player) {
					if (match.config.isDescending) {
						player.score -= s.pointsAdded;
					} else {
						player.score += s.pointsAdded;
						// Bonus de corte si existía en esa ronda
						if (s.details?.isCorteMinus10) player.score -= 10;
					}

					// Verificar eliminación (Loba)
					if (
						match.config.limitScore &&
						player.score >= match.config.limitScore
					) {
						player.isOut = true;
					}
				}
			});
		});

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

// Obtener todas las partidas del usuario logueado
export const getUserMatches = async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user.userId;

		// Buscamos partidas donde el usuario sea el admin O esté en la lista de jugadores
		// Usamos .sort({ createdAt: -1 }) para que las más nuevas aparezcan primero
		const matches = await MatchModel.find({
			$or: [{ adminId: userId }, { 'players.userId': userId }],
		}).sort({ createdAt: -1 });

		res.json(matches);
	} catch (error) {
		res.status(500).json({
			message: 'Error al obtener el historial',
			error,
		});
	}
};

// Obtener el detalle de una partida específica
export const getMatchById = async (req: Request, res: Response) => {
	try {
		const { matchId } = req.params;
		const match = await MatchModel.findById(matchId).populate(
			'adminId',
			'username',
		);

		if (!match) {
			return res.status(404).json({ message: 'Partida no encontrada' });
		}

		res.json(match);
	} catch (error) {
		res.status(500).json({ message: 'Error al obtener la partida', error });
	}
};

export const updateMatchStatus = async (req: Request, res: Response) => {
	try {
		const { matchId } = req.params;
		const { status, winner } = req.body;

		const match = await MatchModel.findByIdAndUpdate(
			matchId,
			{ status, winner },
			{ new: true },
		);

		res.json(match);
	} catch (error) {
		res.status(500).json({ message: 'Error al actualizar partida', error });
	}
};

// Eliminar una partida (Punto 4 del TP: DELETE)
export const deleteMatch = async (req: Request, res: Response) => {
	try {
		const { matchId } = req.params;
		const userId = (req as any).user.userId;

		// Solo el admin de la partida debería poder borrarla
		const match = await MatchModel.findOneAndDelete({
			_id: matchId,
			adminId: userId,
		});

		if (!match) {
			return res.status(404).json({
				message:
					'Partida no encontrada o no tenés permisos para borrarla',
			});
		}

		res.json({ message: 'Partida eliminada correctamente' });
	} catch (error) {
		res.status(500).json({
			message: 'Error al eliminar la partida',
			error,
		});
	}
};
