import { Schema, model, Types } from 'mongoose';

const matchSchema = new Schema(
	{
		gameId: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
		status: {
			type: String,
			enum: ['active', 'finished'],
			default: 'active',
		},
		dealerIndex: { type: Number, default: 0 },

		players: [
			{
				userId: { type: Schema.Types.ObjectId, ref: 'User' },
				name: String,
				position: Number,
				team: {
					type: String,
					enum: ['A', 'B', 'None'],
					default: 'None',
				},
				currentScore: { type: Number, default: 0 },
				isOut: { type: Boolean, default: false },
			},
		],

		rounds: [
			{
				roundNumber: Number,
				dealerIndex: Number,
				scores: [
					{
						playerName: String, // Usamos nombre por si es invitado
						pointsAdded: Number,
						details: Schema.Types.Mixed, // Para la flexibilidad de cada juego
					},
				],
				timestamp: { type: Date, default: Date.now },
			},
		],
	},
	{ timestamps: true },
);

export const MatchModel = model('Match', matchSchema);
