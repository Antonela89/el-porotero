import { Request, Response } from 'express';
import { MatchModel } from '@/models/Match.js';

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

		const nextRoundNumber = match.rounds.length + 1;
		match.rounds.push({
			roundNumber: nextRoundNumber,
			dealerIndex: match.currentDealerIndex,
			scores,
		});

		scores.forEach((s: any) => {
			const player = match.players.find((p) => p.name === s.playerName);
			if (player) {
				player.score += s.pointsAdded;

				// Ejemplo Loba: Si llega a 101 queda fuera (simplificado)
				if (match.gameType === 'Loba' && player.score > 101) {
					player.isOut = true;
				}
			}
		});

		// Rotar el repartidor (Dealer)
		match.currentDealerIndex =
			(match.currentDealerIndex + 1) % match.players.length;

		await match.save();
		res.json(match);
	} catch (error) {
		res.status(500).json({ message: 'Error al anotar ronda', error });
	}
};
