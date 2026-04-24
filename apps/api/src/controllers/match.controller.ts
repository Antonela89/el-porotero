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
