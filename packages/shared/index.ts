import { z } from 'zod';

// --- Interfaces ---
export interface IRoundScore {
	playerName: string;
	pointsAdded: number;
	details?: any; // Bazas, escobas, etc.
}

export interface IRound {
	roundNumber: number;
	dealerIndex: number;
	scores: IRoundScore[];
	timestamp: Date;
}

// Configuración inicial de la partida
export interface IMatchConfig {
	limitScore?: number; // 100 o 101 para Loba
	startingScore: number; // 0 para la mayoría, 15 para Mosca
	isDescending: boolean; // true para Mosca (resta), false para el resto
}

// --- Esquemas ---
// --- USUARIO ---
export const UserZodSchema = z.object({
	username: z.string().min(3, 'Mínimo 3 caracteres'),
	email: z.email('Email inválido'),
	password: z.string().min(6, 'Mínimo 6 caracteres'),
	avatar: z.string().optional(),
});

export type UserDTO = z.infer<typeof UserZodSchema>;

// --- JUEGO (Configuración) ---
export const GameZodSchema = z.object({
	name: z.string(),
	category: z.enum(['Cartas', 'Dados', 'Otros']),
	minPlayers: z.number().min(2),
	maxPoints: z.number().optional(), // Depende de cada juego
});

// --- PARTIDA (Match) ---
export const MatchPlayerSchema = z.object({
	userId: z.string().optional(), //} Para invitados invitados
	name: z.string(),
	position: z.number(),
	team: z.enum(['A', 'B', 'None']).default('None'),
	currentScore: z.number().default(0),
	isOut: z.boolean().default(false),
});

export const RoundSchema = z.object({
	roundNumber: z.number(),
	dealerIndex: z.number(),
	scores: z.array(
		z.object({
			playerId: z.string(),
			points: z.number(),
			details: z.any(), // Aquí se guardan datos especificos de los juegos. ( Mosca, Escoba)
		}),
	),
});

export const MatchZodSchema = z.object({
	gameId: z.string(),
	players: z.array(MatchPlayerSchema),
	status: z.enum(['active', 'finished']).default('active'),
	dealerIndex: z.number().default(0),
});

// --- Detalles de Juegos ---
export interface RoundScoreDetail {
	playerName: string;
	pointsAdded: number;
	details?: {
		// Loba/Chinchón
		isCorteMinus10?: boolean;

		// Mosca
		bazas?: number;
		paso?: boolean; // Mosca

		// Escoba/ Barsiga
		escobas?: number;
		velos?: number;
		hasOros?: boolean;
		hasSetenta?: boolean;
		hasCartas?: boolean;
		cantos?: number;

		// Burako
		canastasPuras?: number; // 200 pts c/u
		canastasImpuras?: number; // 100 pts c/u
		tomoMuerto?: boolean; // Si no lo tomó, restar 100
		cierre?: boolean;
	};
}

// --- LOGIN ---
export const LoginZodSchema = z.object({
	email: z.email('Email inválido'),
	password: z.string().min(1, 'La contraseña es requerida'),
});

export type LoginDTO = z.infer<typeof LoginZodSchema>;
