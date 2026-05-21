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
export const getScoreStatus = (remaining: number, isLoseOnLimit: boolean) => {
	// Si el límite es para perder (Loba/Uno), el peligro es cuando queda poco (0-20)
	// Si el límite es para ganar (Truco/Escoba), la emoción es cuando falta poco (0-10)
	const threshold = isLoseOnLimit ? 20 : 10;
	const isCritical = remaining <= threshold && remaining > 0;

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
	};
};
