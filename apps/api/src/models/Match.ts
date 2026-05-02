import { Schema, model, Types, Document } from 'mongoose';
import { IMatchConfig, IRound } from '@el-porotero/shared';

// Interfaz del Jugador (Subdocumento)
interface IPlayer {
	name: string;
	userId?: Types.ObjectId;
	team: 'A' | 'B' | 'None';
	score: number; // Asegurate que el nombre coincida con el que usas en el controller
	isOut: boolean;
}

export interface ITempCanto {
	playerName: string;
	points: number;
}

// Interfaz de la partida (Subdocumento)
interface IMatch extends Document {
	gameType:
		| 'Loba'
		| 'Truco'
		| 'Chinchon'
		| 'Escoba'
		| 'Barsiga'
		| 'Mosca'
		| 'Burako';
	status: 'active' | 'finished' | 'cancelled';
	adminId: Types.ObjectId;
	players: Types.DocumentArray<IPlayer & Types.Subdocument>; // Esto habilita los métodos de subdocumentos
	rounds: IRound[];
	config: IMatchConfig;
	currentDealerIndex: number;
	winner?: string;
	isTeamGame: boolean;
	tempCantos: ITempCanto[];
}

// --- Esquema de Jugador ---
const playerSchema = new Schema<IPlayer>({
	name: { type: String, required: true },
	// position: Number,
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
	team: { type: String, enum: ['A', 'B', 'None'], default: 'None' },
	score: { type: Number, default: 0 },
	isOut: { type: Boolean, default: false },
});

// --- Esquema de Ronda ---
const roundSchema = new Schema<IRound>({
	roundNumber: Number,
	dealerIndex: Number,
	scores: [
		{
			playerName: String,
			pointsAdded: Number,
			details: Schema.Types.Mixed,
		},
	],
	timestamp: { type: Date, default: Date.now },
});

// --- Esquema de Juego ---
const matchSchema = new Schema<IMatch>(
	{
		gameType: {
			type: String,
			enum: [
				'Loba',
				'Truco',
				'Chinchon',
				'Escoba',
				'Barsiga',
				'Mosca',
				'Burako',
			],
			required: true,
		},
		status: {
			type: String,
			enum: ['active', 'finished', 'cancelled'],
			default: 'active',
		},
		adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		currentDealerIndex: { type: Number, default: 0 },
		isTeamGame: { type: Boolean, default: false },

		config: {
			limitScore: Number,
			startingScore: { type: Number, default: 0 },
			isDescending: { type: Boolean, default: false },
		},

		players: [playerSchema],

		rounds: { type: [roundSchema], default: [] },
		winner: { type: String, default: null },
		tempCantos: {
			type: [
				{
					playerName: String,
					points: Number,
				},
			],
			default: [],
		},
	},
	{ timestamps: true },
);

export const MatchModel = model('Match', matchSchema);
