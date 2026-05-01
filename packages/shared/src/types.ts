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

export interface IRoundDetails {
	isCorteMinus10?: boolean;
	isCerrar?: boolean;
	isReengage?: boolean;
	bazas?: number;
	paso?: boolean;
	escobas?: number;
	velos?: number;
	hasVeloAs?: boolean;
	hasVelo7?: boolean;
	hasVelo12?: boolean;
	hasOros?: boolean;
	hasSetenta?: boolean;
	hasCartas?: boolean;
	cantos?: number;
	canastasPuras?: number; // 200 pts c/u
	canastasImpuras?: number; // 100 pts c/u
	tomoMuerto?: boolean; // Si no lo tomó, restar 100
}

// --- Detalles de Juegos ---
export interface RoundScoreDetail {
	playerName: string;
	pointsAdded: number;
	details?: {
		// Loba/Chinchón
		isCorteMinus10?: boolean;
		isCerrar: boolean;

		// Mosca
		bazas?: number;
		paso?: boolean; // Mosca

		// Escoba/ Barsiga
		escobas?: number;
		velos?: number;
		hasVeloAs?: boolean;
		hasVelo7?: boolean;
		hasVelo12?: boolean;
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

// Configuración inicial de la partida
export interface IMatchConfig {
	limitScore: number; // 100 o 101 para Loba
	startingScore: number; // 0 para la mayoría, 15 para Mosca
	isDescending: boolean; // true para Mosca (resta), false para el resto
}

export interface IPlayer {
	_id?: string; // En el front es opcional y es string
	name: string;
	score: number;
	team: 'A' | 'B' | 'None';
	isOut: boolean;
}

export interface ITeamScore {
	teamName: 'A' | 'B';
	score: number;
}

export interface IMatch {
	_id?: string;
	gameType: string;
	status: 'active' | 'finished' | 'cancelled';
	players: IPlayer[];
	winner?: string;
	createdAt?: string | Date;
	updatedAt?: string | Date;
	config: IMatchConfig;
	currentDealerIndex: number;
	rounds: IRound[];
	isTeamGame: boolean;
	teamScores?: ITeamScore[];
}
