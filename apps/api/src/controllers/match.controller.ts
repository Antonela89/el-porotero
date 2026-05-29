import { Request, Response } from 'express';
import { MatchModel } from '@/models/index.js';
import { IMatchConfig } from '@el-porotero/shared';

// Crear un juego nuevo
export const createMatch = async (req: Request, res: Response) => {
	try {
		const { gameType, players, limitScore, isTeamGame } = req.body;
		const adminId = (req as any).user?.userId;

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
			const totalPlayer = players.length;
			if (totalPlayer === 2) config.limitScore = 18;
			if (totalPlayer === 4) config.limitScore = 24;
			if (totalPlayer === 6) config.limitScore = 30;
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
			isTeamGame: isTeamGame,
			currentDealerIndex: 0,
		});

		await newMatch.save();
		res.status(201).json(newMatch);
	} catch (error) {
		res.status(500).json({ message: 'Error al crear partida', error });
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

// Obtener el detalle de un juego específico
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

// Actualizar el estado de un juego (ej: marcar como finalizada o asignar ganador)
export const updateMatch = async (req: Request, res: Response) => {
	try {
		const { matchId } = req.params;
		const { players, status, winner } = req.body;

		const match = await MatchModel.findById(matchId);
		if (!match)
			return res.status(404).json({ message: 'Partida no encontrada' });

		// Si cambiaron los nombres de los jugadores, actualizar
		// las referencias en el historial de rondas para no romper la tabla.
		if (players) {
			match.players.forEach((oldPlayer, index) => {
				const newName = players[index]?.name;
				if (newName && oldPlayer.name !== newName) {
					// Actualizar el nombre en cada ronda del historial
					match.rounds.forEach((round) => {
						round.scores.forEach((s) => {
							if (s.playerName === oldPlayer.name) {
								s.playerName = newName;
							}
						});
					});
					oldPlayer.name = newName;
				}
			});
		}

		if (status) match.status = status;
		if (winner) match.winner = winner;

		await match.save();
		res.json(match);
	} catch (error) {
		res.status(500).json({
			message: 'Error al actualizar la partida',
			error,
		});
	}
};

// Eliminar un Juego
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
