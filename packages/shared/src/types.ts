// --- Interfaces ---
// Jugador
export interface IPlayer {
	_id?: string; // En el front es opcional y es string
	name: string;
	score: number;
	team: 'A' | 'B' | 'None';
	isOut: boolean;
}

// Configuración inicial de la partida
export interface IMatchConfig {
	limitScore: number; // 100 o 101 para Loba
	startingScore: number; // 0 para la mayoría, 15 para Mosca
	isDescending: boolean; // true para Mosca (resta), false para el resto
}

// Equipo
export interface ITeamScore {
	teamName: 'A' | 'B';
	score: number;
}

// Juego
export interface IMatch {
	_id?: string;
	gameType:
		| 'Loba'
		| 'Truco'
		| 'Chinchon'
		| 'Escoba'
		| 'Barsiga'
		| 'Mosca'
		| 'Burako'
		| 'Uno';
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

// --- Detalles de Juegos ---
export interface IRoundDetails {
	// Loba / Chinchón
	isCerrar?: boolean;
	isCorteMinus10?: boolean;
	isReengage?: boolean; // Para el asterisco y la lógica de re-entrada

	// Mosca
	bazas?: number;
	paso?: boolean;

	// Escoba / Bársiga
	escobas?: number;
	velos?: number; // El número total calculado (1, 2, 3)
	hasVeloAs?: boolean; // Checkbox individual
	hasVelo7?: boolean; // Checkbox individual
	hasVelo12?: boolean; // Checkbox individual
	hasOros?: boolean;
	hasSetenta?: boolean;
	hasCartas?: boolean;
	cantos?: number; // Puntos extra de Bársiga

	// Burako
	canastasPuras?: number;
	canastasImpuras?: number;
	tomoMuerto?: boolean;
}

// Puntaje individual de los jugadores
export interface IRoundScore {
	playerName: string;
	pointsAdded: number;
	details: IRoundDetails; // Bazas, escobas, etc.
}

// Puntaje de la ronda
export interface IRound {
	roundNumber: number;
	dealerIndex: number;
	scores: IRoundScore[];
	timestamp: Date;
}
