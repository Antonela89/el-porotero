import { Request, Response } from 'express';
import { MatchModel } from '@/models/Match.js';
import { IUserStats } from '@el-porotero/shared';

export const getGlobalStats = async (req: Request, res: Response) => {
	try {
		const username = (req as any).user.username;

		// Buscamos todas las partidas terminadas donde participó el usuario
		const stats = await MatchModel.aggregate([
			{
				$match: {
					status: 'finished',
					'players.name': username,
				},
			},
			{
				$facet: {
					// Contar totales y victorias
					summary: [
						{
							$group: {
								_id: null,
								totalPlayed: { $sum: 1 },
								totalWins: {
									$sum: {
										$cond: [
											{
												$or: [
													{
														$eq: [
															'$winner',
															username,
														],
													},
													{
														$and: [
															{
																$in: [
																	'$winner',
																	[
																		'Equipo A',
																		'Equipo B',
																	],
																],
															},
															{
																$eq: [
																	{
																		$arrayElemAt:
																			[
																				'$players.team',
																				{
																					$indexOfArray:
																						[
																							'$players.name',
																							username,
																						],
																				},
																			],
																	},
																	{
																		$last: {
																			$split: [
																				'$winner',
																				' ',
																			],
																		},
																	},
																],
															},
														],
													},
												],
											},
											1,
											0,
										],
									},
								},
							},
						},
					],
					// Contar por tipo de juego
					byGame: [
						{ $group: { _id: '$gameType', count: { $sum: 1 } } },
						{ $sort: { count: -1 } },
					],
				},
			},
		]);

		const summary = stats[0].summary[0] || { totalPlayed: 0, totalWins: 0 };
		const favoriteGame = stats[0].byGame[0]?._id || 'Ninguno';

		const responseData: IUserStats = {
			totalPlayed: summary.totalPlayed,
			won: summary.totalWins,
			lost: summary.totalPlayed - summary.totalWins,
			winRate:
				summary.totalPlayed > 0
					? Math.round(
							(summary.totalWins / summary.totalPlayed) * 100,
						)
					: 0,
			favoriteGame: stats[0].byGame[0]?._id || 'Ninguno',
			gameHistory: stats[0].byGame,
		};

		res.json(responseData);
	} catch (error) {
		res.status(500).json({
			message: 'Error al calcular estadísticas',
			error,
		});
	}
};
