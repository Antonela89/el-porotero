import { Request, Response } from 'express';
import { MatchModel } from '@/models/Match.js';
import * as GameRules from '@/services/gameRules.services.js';

export const createMatch = async (req: Request, res: Response) => {
	try {
		const { gameType, players } = req.body;
		const adminId = req.user?.userId;

		const newMatch = new MatchModel({
			gameType,
			players,
			adminId,
			currentDealerIndex: 0, // primero de la lista
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
		if (!match)
			return res.status(404).json({ message: 'Partida no encontrada' });

		match.rounds.push({
			roundNumber: match.rounds.length + 1,
			dealerIndex: match.currentDealerIndex,
			scores,
		});

		let instantWinner = null;

		switch (match.gameType) {
			case 'Loba':
				GameRules.processLobaRules(match.players, scores);
				break;
			case 'Mosca':
				instantWinner = GameRules.processMoscaRules(
					match.players,
					scores,
				);
				break;
			// case 'Escoba': ...
		}

		if (instantWinner) {
			match.status = 'finished';
			match.winner = instantWinner;
		} else {
			// Chequeo de victoria por puntaje (ej: alguien llegó a 0 en Mosca o quedó último en Loba)
			// ... lógica de fin de juego ...
		}

		// Rotar el repartidor (Dealer)
		match.currentDealerIndex =
			(match.currentDealerIndex + 1) % match.players.length;

		await match.save();
		res.json(match);
	} catch (error) {
		res.status(500).json({ message: 'Error al anotar ronda', error });
	}
};
