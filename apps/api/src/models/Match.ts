import { Schema, model, Types, Document } from 'mongoose';

// Interfaz del Jugador (Subdocumento)
interface IPlayer {
	name: string;
	userId?: Types.ObjectId;
	team: 'A' | 'B' | 'None';
	score: number; // Asegurate que el nombre coincida con el que usas en el controller
	isOut: boolean;
}

// Interfaz de la partida (Subdocumento)
interface IMatch extends Document {
	gameType: string;
	status: 'active' | 'finished';
	adminId: Types.ObjectId;
	players: Types.DocumentArray<IPlayer & Types.Subdocument>; // Esto habilita los métodos de subdocumentos
	rounds: any[]; // Podés tipar esto más adelante
	currentDealerIndex: number;
	winner: String;
}

const playerSchema = new Schema<IPlayer>({
	name: { type: String, required: true },
	// position: Number,
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
	team: { type: String, enum: ['A', 'B', 'None'], default: 'None' },
	score: { type: Number, default: 0 },
	isOut: { type: Boolean, default: false },
});

const matchSchema = new Schema<IMatch>(
	{
		// gameId: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
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
			enum: ['active', 'finished'],
			default: 'active',
		},
		adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		currentDealerIndex: { type: Number, default: 0 },

		players: [playerSchema]

		// rounds: [
		// 	{
		// 		roundNumber: Number,
		// 		dealerIndex: Number,
		// 		scores: [
		// 			{
		// 				playerName: String, // Usamos nombre por si es invitado
		// 				pointsAdded: Number,
		// 				details: Schema.Types.Mixed, // Para la flexibilidad de cada juego
		// 			},
		// 		],
		// 		timestamp: { type: Date, default: Date.now },
		// 	},
		// ],
	},
	{ timestamps: true },
);

export const MatchModel = model('Match', matchSchema);
