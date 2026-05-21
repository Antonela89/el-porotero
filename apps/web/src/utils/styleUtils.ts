import { GameType } from '@el-porotero/shared';

export type GameColorID =
	| 'loba'
	| 'truco'
	| 'chinchon'
	| 'mosca'
	| 'escoba'
	| 'barsiga'
	| 'burako'
	| 'uno';

export const GAME_COLORS: Record<GameType, GameColorID> = {
	Loba: 'loba',
	Truco: 'truco',
	Chinchon: 'chinchon',
	Mosca: 'mosca',
	Escoba: 'escoba',
	Barsiga: 'barsiga',
	Burako: 'burako',
	Uno: 'uno',
};

/**
 * Retorna la variable CSS lista para usar en style={{ color: ... }}
 */
export const getGameColorVar = (type: GameType): string => {
	const colorId = GAME_COLORS[type] || 'loba';
	return `var(--color-${colorId.toLowerCase()})`;
};

/**
 * Retorna estilos consistentes para Equipo A (Indigo) y B (Rose)
 */
export const getTeamStyle = (team: 'A' | 'B') => {
	const isA = team === 'A';
	return {
		text: isA ? 'text-indigo-400' : 'text-rose-400',
		border: isA ? 'border-indigo-400/30' : 'border-rose-400/30',
		bg: isA ? 'bg-indigo-500/5' : 'bg-rose-500/5',
		raw: isA ? 'var(--color-secondary)' : '#fb7185',
	};
};

/**
 * Determina si el puntaje es crítico basado en el tipo de juego
 */
export const getScoreStatus = (
	remaining: number,
	isLoseOnLimit: boolean,
	gameType: string,
) => {
	// umbrales por juego
	const thresholds: Record<string, number> = {
		Burako: 300,
		Uno: 50,
		Loba: 20,
		Chinchon: 20,
		Truco: 10,
		Escoba: 5,
		Mosca: 5,
		Barsiga: 10,
	};
	const threshold = thresholds[gameType] || 10;
	const isCritical = remaining <= threshold && remaining > 0;

	const color = isLoseOnLimit
		? 'var(--color-warning)'
		: 'var(--color-success)';

	return {
		isCritical,
		colorClass: isCritical
			? isLoseOnLimit
				? 'text-orange-500'
				: 'text-emerald-400'
			: 'text-text-muted',
		hexColor: isCritical
			? isLoseOnLimit
				? 'var(--color-warning)'
				: 'var(--color-success)'
			: 'var(--color-primary)',
		glowStyle: isCritical
			? {
					borderColor: color,
					boxShadow: `0 0 20px ${color}44`, 
					borderWidth: '2px',
				}
			: {
					borderColor: 'rgba(255,255,255,0.05)',
					boxShadow: 'none',
					borderWidth: '1px',
				},
	};
};
